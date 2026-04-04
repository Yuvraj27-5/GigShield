const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../utils/db');
const { protect } = require('../middleware/auth');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// POST /api/auth/send-otp
router.post('/send-otp', (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile || mobile.length !== 10) return res.status(400).json({ success: false, message: 'Valid 10-digit mobile required' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    db.otps.deleteMany({ mobile });
    db.otps.insert({ mobile, otp, expiresAt, used: false });
    console.log(`  📱 OTP for ${mobile}: ${otp}`);
    res.json({ success: true, message: 'OTP sent (check server console for demo)', otp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', (req, res) => {
  try {
    const { mobile, otp, name } = req.body;
    const record = db.otps.findOne({ mobile, otp, used: false });
    if (!record || new Date(record.expiresAt) < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    db.otps.updateOne({ _id: record._id }, { used: true });

    let user = db.users.findOne({ mobile });
    if (!user) {
      user = db.users.insert({ mobile, name: name || 'Gig Worker', isVerified: true, role: 'worker', kycStatus: 'pending', totalEarnings: 0, totalPayouts: 0 });
    }
    res.json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, mobile: user.mobile, role: user.role, kycStatus: user.kycStatus } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.users.findOne({ email, role: 'admin' });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    res.json({ success: true, token: generateToken(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, (req, res) => {
  const user = db.users.findById(req.user._id || req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { password, ...safeUser } = user;
  if (safeUser.activePolicy) {
    const policy = db.policies.findById(safeUser.activePolicy);
    safeUser.activePolicy = policy || safeUser.activePolicy;
  }
  res.json({ success: true, user: safeUser });
});

// PUT /api/auth/kyc
router.put('/kyc', protect, (req, res) => {
  try {
    const { aadhaarLast4, upiId, city, platform, name } = req.body;
    const id = req.user._id || req.user.id;
    const user = db.users.findByIdAndUpdate(id, { aadhaarLast4, upiId, city, platform, name: name || req.user.name, kycStatus: 'verified' }, { new: true });
    const { password, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
