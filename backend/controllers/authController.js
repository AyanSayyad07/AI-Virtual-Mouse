// In-memory mock database for prototyping
const users = [];

exports.register = (req, res) => {
  const { name, email, password, profilePicture } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email' });
  }

  // In a real production application, ALWAYS hash the password before saving (e.g., using bcrypt)
  const newUser = { id: Date.now().toString(), name, email, password, profilePicture: profilePicture || null }; 
  users.push(newUser);

  res.status(201).json({ 
    message: 'User registered successfully', 
    user: { id: newUser.id, name: newUser.name, email: newUser.email, profilePicture: newUser.profilePicture } 
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // In a real application, you would generate and return a JWT here
  res.status(200).json({ 
    message: 'Login successful', 
    user: { id: user.id, name: user.name, email: user.email, profilePicture: user.profilePicture } 
  });
};
