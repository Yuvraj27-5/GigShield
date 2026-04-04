const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect } = require('../middleware/auth');

const TIERS = {
  basic:    { weeklyPremium: 49,  maxWeeklyPayout: 500,  triggers: ['rain', 'bandh'] },
  standard: { weeklyPremium: 99,  maxWeeklyPayout: 1000, triggers: ['rain', 'heat', 'aqi', 'bandh'] },
  premium:  { weeklyPremium: 149, maxWeeklyPayout: 1500, triggers: ['rain', 'heat', 'aqi', 'bandh', 'flood', 'curfew'] }
};

// GET /api/policy/tiers
router.get('/tiers', (req, res) => {
  res.json({ success: true, tiers: TIERS });
});

// POST /api/policy/subscribe
router.post('/subscribe', protect, (req, res) => {
  try {
    const { tier } = req.body;
    const tierConfig = TIERS[tier];
    if (!tierConfig) return res.status(400).json({ success: false, message: 'Invalid tier' });

    const id = req.user._id || req.user.id;
    const user = db.users.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.kycStatus !== 'verified') return res.status(400).json({ success: false, message: 'KYC verification required' });

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    const policy = db.policies.insert({
      worker: user._id,
      tier,
      weeklyPremium: tierConfig.weeklyPremium,
      maxWeeklyPayout: tierConfig.maxWeeklyPayout,
      triggers: tierConfig.triggers,
      city: user.city || 'Mumbai',
      status: 'active',
      endDate: endDate.toISOString(),
      totalPremiumPaid: 0,
      totalPayoutReceived: 0,
      claimsCount: 0
    });

    db.users.updateById(user._id, { activePolicy: policy._id });
    res.json({ success: true, policy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/policy/my
router.get('/my', protect, (req, res) => {
  try {
    const id = req.user._id || req.user.id;
    const policies = db.policies
      .find({ worker: id }, { sort: ['createdAt', -1] });
    res.json({ success: true, policies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
module.exports.TIERS = TIERS;
