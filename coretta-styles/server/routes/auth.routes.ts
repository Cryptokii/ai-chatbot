import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { auth } from '../middleware/auth.middleware.js';

const router = express.Router();

// Register (for regular users only)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    console.log('Received registration request:', { email, name }); // Debug log
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Force role to be 'user' for regular registration
    const user = new User({ email, password, name, role: 'user' });
    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET!);
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error); // Debug log
    res.status(400).json({ message: 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is trying to access admin login but is not an admin
    if (req.body.isAdmin && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET!);
    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: 'Error logging in' });
  }
});

// Admin registration (only accessible through backend)
router.post('/register-admin', async (req, res) => {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    const { email, password, name, secretKey } = req.body;

    // Verify admin secret key
    if (!adminSecret || secretKey !== adminSecret) {
      return res.status(403).json({ message: 'Invalid admin secret key' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const admin = new User({
      email,
      password,
      name,
      role: 'admin'
    });

    await admin.save();
    res.status(201).json({ message: 'Admin account created successfully' });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(400).json({ message: 'Error registering admin' });
  }
});

// Request password reset
router.post('/reset-password-request', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // TODO: Send email with reset token
    res.json({ message: 'Password reset instructions sent to email' });
  } catch (error) {
    res.status(400).json({ message: 'Error requesting password reset' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: 'Error resetting password' });
  }
});

// Get current user
router.get('/me', auth, async (req: any, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

export const authRoutes = router; 