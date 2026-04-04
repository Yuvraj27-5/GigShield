const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect } = require('../middleware/auth');

// GET /api/analytics/dashboard
router.get('/dashboard', protect, (req, res) => {
  try {
    const id = req.user._id || req.user.id;
    const user = db.users.findById(id);
    const payouts = db.payouts.find({ worker: id });
    const totalReceived = payouts.filter(p => p.status === 'completed').reduce((a, b) => a + b.amount, 0);

    const city = user.city || 'Mumbai';
    const activeTriggers = db.triggers.countDocuments({ status: 'active', city });

    let activePolicy = null;
    if (user.activePolicy) {
      activePolicy = db.policies.findById(user.activePolicy);
    }

    const forecast = Array.from({ length: 7 }, (_, i) => ({
      day: new Date(Date.now() + i * 86400000).toLocaleDateString('en-IN', { weekday: 'short' }),
      riskScore: Math.floor(20 + Math.random() * 70),
      triggerProbability: Math.floor(10 + Math.random() * 80),
      expectedPayout: Math.floor(Math.random() * 500)
    }));

    res.json({
      success: true,
      stats: {
        totalReceived,
        claimsCount: payouts.length,
        activePolicy,
        activeTriggers,
        savingsVsPremium: totalReceived - (activePolicy?.totalPremiumPaid || 0)
      },
      forecast
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/analytics/admin
router.get('/admin', protect, (req, res) => {
  try {
    const totalWorkers = db.users.countDocuments({ role: 'worker' });
    const activePolicies = db.policies.countDocuments({ status: 'active' });
    const fraudCases = db.fraudcases.countDocuments({ status: 'flagged' });
    const recentTriggers = db.triggers.find({ status: 'active' }, { sort: ['detectedAt', -1], limit: 5 });

    const allPayouts = db.payouts.find({});
    const totalPayouts = allPayouts.reduce((a, b) => a + b.amount, 0);
    const totalClaims = allPayouts.length;

    // City-wise aggregation
    const cityMap = {};
    db.policies.find({}).forEach(p => {
      const c = p.city || 'Unknown';
      if (!cityMap[c]) cityMap[c] = { _id: c, count: 0, revenue: 0 };
      cityMap[c].count++;
      cityMap[c].revenue += p.weeklyPremium || 0;
    });
    const cityWise = Object.values(cityMap);

    // Daily payouts last 7 days
    const since = new Date(Date.now() - 7 * 86400000);
    const dailyMap = {};
    db.payouts.find({ status: 'completed' }).filter(p => new Date(p.createdAt) >= since).forEach(p => {
      const day = (p.createdAt || '').slice(0, 10);
      if (!dailyMap[day]) dailyMap[day] = { _id: day, total: 0, count: 0 };
      dailyMap[day].total += p.amount;
      dailyMap[day].count++;
    });
    const dailyPayouts = Object.values(dailyMap).sort((a, b) => a._id.localeCompare(b._id));

    res.json({
      success: true,
      overview: { totalWorkers, activePolicies, totalPayouts, totalClaims, fraudCases, recentTriggers },
      cityWise,
      dailyPayouts
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
