import cv2
import base64
import time
import math
import socketio
import numpy as np
import mediapipe as mp
import pyautogui

pyautogui.FAILSAFE = False # Disable for VM environments, enable for real use
screen_w, screen_h = pyautogui.size()
smoothening = 5
plocX, plocY = 0, 0
clocX, clocY = 0, 0
last_click_time = 0
last_right_click_time = 0
is_dragging = False
was_pinched = False
is_pinching_started = False
pinch_start_time = 0
prev_two_hand_dist = 0
camera_active = True

custom_rules = {
    'thumbs_up': 'volumeup',
    'thumbs_down': 'volumedown',
    'pinky_up': 'playpause',
    'rock_sign': 'nexttrack'
}
last_action_time = {}

# MediaPipe setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5
)
mp_drawing = mp.solutions.drawing_utils

# Initialize Socket.io client
sio = socketio.Client()

@sio.event
def connect():
    print("Connected to Node.js backend!")

@sio.event
def disconnect():
    print("Disconnected from backend.")

@sio.event
def new_gesture_rules(data):
    global custom_rules
    print("Received new custom rules:", data)
    custom_rules = data

@sio.event
def toggle_camera_engine(state):
    global camera_active
    print("Camera toggle received:", state)
    camera_active = state

def get_distance(p1, p2, img_w, img_h):
    x1, y1 = int(p1.x * img_w), int(p1.y * img_h)
    x2, y2 = int(p2.x * img_w), int(p2.y * img_h)
    return math.hypot(x2 - x1, y2 - y1)

def main():
    try:
        sio.connect('http://localhost:5000')
    except Exception as e:
        print(f"Failed to connect to backend: {e}")
        return

    # Initialize Webcam
    cap = cv2.VideoCapture(0)
    use_synthetic = False
    
    if not cap.isOpened():
        print("Warning: Could not open webcam. Using synthetic video stream instead.")
        use_synthetic = True

    start_time = time.time()

    try:
        while True:
            global camera_active
            if not camera_active:
                if cap is not None and cap.isOpened():
                    cap.release()
                    cap = None
                time.sleep(0.5)
                # Emit empty payload to clear UI
                sio.emit('ai_data_stream', {
                    'frame': None,
                    'gestures': [],
                    'latency': '0ms'
                })
                continue
                
            if cap is None:
                cap = cv2.VideoCapture(0)
                if not cap.isOpened():
                    use_synthetic = True

            if use_synthetic:
                # Generate synthetic stream (a moving circle)
                img = np.zeros((480, 640, 3), dtype=np.uint8)
                t = time.time()
                cx = int(320 + math.sin(t * 2) * 150)
                cy = int(240 + math.cos(t * 2) * 100)
                cv2.circle(img, (cx, cy), 50, (235, 99, 37), -1) # Blueish orange
                cv2.putText(img, "SYNTHETIC AI STREAM", (180, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
                simulated_gestures = [] # No hand in synthetic stream
            else:
                success, img = cap.read()
                if not success:
                    print("Warning: Dropped frame or webcam failed. Switching to synthetic stream.")
                    use_synthetic = True
                    continue
                
                # Flip image for selfie view
                img = cv2.flip(img, 1)
                h, w, c = img.shape
                
                # Convert to RGB for MediaPipe
                img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                results = hands.process(img_rgb)
                
                simulated_gestures = []
                
                if results.multi_hand_landmarks:
                    hands_data = []
                    
                    if len(results.multi_hand_landmarks) == 2:
                        simulated_gestures.append("two_hands")
                        
                    for hand_idx, hand_landmarks in enumerate(results.multi_hand_landmarks):
                        global plocX, plocY, clocX, clocY, last_click_time, last_right_click_time, is_dragging, was_pinched, is_pinching_started, pinch_start_time
                        # Draw landmarks on frame
                        mp_drawing.draw_landmarks(img, hand_landmarks, mp_hands.HAND_CONNECTIONS)
                        lmList = hand_landmarks.landmark
                        
                        thumb_tip, index_tip, middle_tip = lmList[4], lmList[8], lmList[12]
                        ring_tip, pinky_tip = lmList[16], lmList[20]
                        index_pip, middle_pip = lmList[6], lmList[10]
                        ring_pip, pinky_pip = lmList[14], lmList[18]
                        wrist, middle_mcp = lmList[0], lmList[9]
                        
                        hand_size = get_distance(wrist, middle_mcp, w, h)
                        if hand_size == 0: hand_size = 1
                        
                        pinch_dist = get_distance(thumb_tip, index_tip, w, h)
                        right_pinch_dist = get_distance(thumb_tip, middle_tip, w, h)
                        pinch_ratio = pinch_dist / hand_size
                        right_pinch_ratio = right_pinch_dist / hand_size
                        
                        is_index_up = index_tip.y < index_pip.y
                        is_middle_up = middle_tip.y < middle_pip.y
                        is_ring_up = ring_tip.y < ring_pip.y
                        is_pinky_up = pinky_tip.y < pinky_pip.y
                        is_thumb_up = thumb_tip.y < lmList[3].y
                        
                        is_pinching = pinch_ratio < 0.4
                        
                        hands_data.append({
                            'is_pinching': is_pinching,
                            'index_tip': index_tip,
                        })
                        
                        # Only Hand 0 controls the cursor to prevent jumping
                        if hand_idx == 0:
                            is_thumbs_up = is_thumb_up and not is_index_up and not is_middle_up and not is_ring_up and not is_pinky_up
                            is_thumbs_down = (thumb_tip.y > lmList[2].y) and not is_index_up and not is_middle_up and not is_ring_up and not is_pinky_up and not is_thumb_up
                            is_pinky_only_up = is_pinky_up and not is_index_up and not is_middle_up and not is_ring_up and not is_thumb_up
                            is_rock_sign = is_index_up and is_pinky_up and not is_middle_up and not is_ring_up and not is_thumb_up

                            def execute_custom_action(gesture_name):
                                global last_action_time, custom_rules
                                action = custom_rules.get(gesture_name, 'none')
                                if action != 'none':
                                    t = time.time()
                                    if t - last_action_time.get(action, 0) > 1.0: 
                                        try:
                                            pyautogui.press(action)
                                            last_action_time[action] = t
                                            simulated_gestures.append(gesture_name)
                                        except Exception:
                                            pass

                            if is_thumbs_up: execute_custom_action('thumbs_up')
                            if is_thumbs_down: execute_custom_action('thumbs_down')
                            if is_pinky_only_up: execute_custom_action('pinky_up')
                            if is_rock_sign: execute_custom_action('rock_sign')
                            
                            # Movement tracks the Palm Center (middle_mcp) instead of index_tip
                            # Movement mode is active as long as hand is not a perfectly closed fist
                            is_movement_mode = not (not is_index_up and not is_middle_up and not is_ring_up and not is_pinky_up)
                            if is_movement_mode:
                                x3 = np.interp(middle_mcp.x, [0, 1], [0, screen_w])
                                y3 = np.interp(middle_mcp.y, [0, 1], [0, screen_h])
                                clocX = plocX + (x3 - plocX) / smoothening
                                clocY = plocY + (y3 - plocY) / smoothening
                                if abs(clocX - plocX) > 3 or abs(clocY - plocY) > 3:
                                    try: pyautogui.moveTo(screen_w - clocX, clocY)
                                    except Exception: pass
                                    plocX, plocY = clocX, clocY

                            # Vision Pro Timer Logic for Pinch
                            if is_pinching:
                                simulated_gestures.append("pinch")
                                if not is_pinching_started:
                                    is_pinching_started = True
                                    pinch_start_time = time.time()
                                else:
                                    if time.time() - pinch_start_time > 0.3 and not is_dragging:
                                        simulated_gestures.append("drag")
                                        try:
                                            pyautogui.mouseDown()
                                            is_dragging = True
                                        except Exception: pass
                                if is_dragging:
                                    simulated_gestures.append("drag")
                            else:
                                if is_pinching_started:
                                    # If released under 0.3s, it's a click
                                    if time.time() - pinch_start_time <= 0.3:
                                        try: pyautogui.click()
                                        except Exception: pass
                                    # If was dragging, release the drag
                                    if is_dragging:
                                        try:
                                            pyautogui.mouseUp()
                                            is_dragging = False
                                        except Exception: pass
                                    is_pinching_started = False
                                        
                            if right_pinch_ratio < 0.4 and not is_pinching:
                                simulated_gestures.append("pinch")
                                if time.time() - last_right_click_time > 0.5:
                                    try:
                                        pyautogui.click(button='right')
                                        last_right_click_time = time.time()
                                    except Exception: pass
                                
                            if is_index_up and is_middle_up and not is_ring_up and not is_pinky_up:
                                simulated_gestures.append("swipe")
                                try: pyautogui.scroll(50)
                                except: pass
                                
                                
                            if is_index_up and is_middle_up and is_ring_up and not is_pinky_up:
                                simulated_gestures.append("keyboard")

                    # Two-Hand Zoom Logic
                    global prev_two_hand_dist
                    if len(hands_data) == 2:
                        h1, h2 = hands_data[0], hands_data[1]
                        if h1['is_pinching'] and h2['is_pinching']:
                            current_dist = get_distance(h1['index_tip'], h2['index_tip'], w, h)
                            if prev_two_hand_dist != 0:
                                diff = current_dist - prev_two_hand_dist
                                if diff > 15: # Hands pulling apart -> Zoom In
                                    try: pyautogui.hotkey('ctrl', '+')
                                    except: pass
                                    prev_two_hand_dist = current_dist
                                elif diff < -15: # Hands pushing together -> Zoom Out
                                    try: pyautogui.hotkey('ctrl', '-')
                                    except: pass
                                    prev_two_hand_dist = current_dist
                            else:
                                prev_two_hand_dist = current_dist
                        else:
                            prev_two_hand_dist = 0
                    else:
                        prev_two_hand_dist = 0

            # Compress image to JPEG to send over websocket
            img_small = cv2.resize(img, (640, 480))
            _, buffer = cv2.imencode('.jpg', img_small, [cv2.IMWRITE_JPEG_QUALITY, 60])
            frame_base64 = base64.b64encode(buffer).decode('utf-8')

            # Prepare data payload
            payload = {
                'frame': f"data:image/jpeg;base64,{frame_base64}",
                'gestures': simulated_gestures,
                'latency': f"{int((time.time() - start_time) * 1000 % 30)}ms", # simulated latency
            }

            # Emit to backend
            sio.emit('ai_data_stream', payload)

            # Cap frame rate slightly to avoid overwhelming the socket (approx 30fps)
            time.sleep(0.03)

    except KeyboardInterrupt:
        print("Stopping AI engine...")
    finally:
        if not use_synthetic:
            cap.release()
        sio.disconnect()

if __name__ == '__main__':
    main()
