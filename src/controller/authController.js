const users = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class userController { 
  
  async adduser(req, res, next) {
    const { name, email, password, role, birthday, numberphone, address, avt } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new users({
            name,
            email,
            password: hashedPassword,
            role,
            birthday,
            numberphone,
            address,
            avt,
            certificates: [],
            enrollments: []
        });

        await newUser.save();
        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
              process.env.JWT_Access_Key,
            { expiresIn: '350d' }
        );
       
        const userInfo = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            birthday: newUser.birthday,
            numberphone: newUser.numberphone,
            address: newUser.address,
            avt: newUser.avt,
            certificates: newUser.certificates,
            createdAt: newUser.createdAt,
            enrollments: newUser.enrollments
        };

        // Return token and user information
        return res.status(201).json({ token, user: userInfo, message: 'User registered successfully' });

    } catch (error) {
        console.error('Sign-up error:', error);
        res.status(500).json({ message: 'Server error' });
    }
  }

  async  login(req, res) {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await users.findOne({ email }).populate('certificates').populate('enrollments');
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Validate the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_Access_Key,
            { expiresIn: '350d' }
        );


        
        // Exclude the password before sending user information
        const userInfo = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            birthday: user.birthday,
            numberphone: user.numberphone,
            address: user.address,
            avt: "avt.jpg",
            certificates: user.certificates,
            createdAt: user.createdAt,
            enrollments: user.enrollments
        };

        // Return token and user information
        return res.status(200).json({ token, user: userInfo, message: 'Login successful' });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }}
}

module.exports = new userController();
