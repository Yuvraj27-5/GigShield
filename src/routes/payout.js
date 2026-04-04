const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect } = require('../middleware/auth');

function calculateFraudScore(user, payout) {
  let score = 0;
  const flags = [];
  if (user.totalPayouts > 10) { score += 20; flags.push('High claim frequency'); }
  const hour = new Date().getHours();
  if (hour < 4 || hour > 23) { score += 15; flags.push('Off-hours activity'); }
  if (payout.amount > 1200) { score += 25; flags.push('High payout amount'); }
  score += Math.floor(Math.random() * 10);
  return { score: Math.min(score, 100), flags };
}

function makeTxnId() {
  return 'GS' + Date.now() + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// POST /api/payout/initiate
router.post('/initiate', protect, (req, res) => {
  try {
    const { triggerId, amount } = req.body;
    const id = req.user._id || req.user.id;
    const user = db.users.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.activePolicy) return res.status(400).json({ success: false, message: 'No active policy found' });
    if (!user.upiId) return res.status(400).json({ success: false, message: 'UPI ID required' });

    const policy = db.policies.findById(user.activePolicy);
    if (!policy) return res.status(400).json({ success: false, message: 'Policy not found' });

    const claimAmount = Math.min(amount || policy.maxWeeklyPayout, policy.maxWeeklyPayout);
    const { score, flags } = calculateFraudScore(user, { amount: claimAmount });

    const payout = db.payouts.insert({
      worker: user._id,
      policy: policy._id,
      trigger: triggerId || null,
      amount: claimAmount,
      upiId: user.upiId,
      txnId: makeTxnId(),
      status: score > 60 ? 'failed' : 'processing',
      triggerType: req.body.triggerType || 'rain',
      city: user.city,
      fraudScore: score
    });

    if (score > 60) {
      db.fraudcases.insert({
        worker: user._id,
        payout: payout._id,
        fraudScore: score,
        flags,
        behavioralScore: 0,
        networkScore: 0,
        temporalScore: 0,
        documentScore: 0,
        status: 'flagged'
      });
      return res.status(400).json({ success: false, message: 'Payout flagged for fraud review', fraudScore: score });
    }

    // Simulate async processing → completed after 2s
    setTimeout(() => {
      db.payouts.updateById(payout._id, { status: 'completed', processedAt: new Date().toISOString() });
      db.users.findByIdAndUpdate(user._id, { $inc: { totalPayouts: 1, totalEarnings: claimAmount } });
      db.policies.findByIdAndUpdate(policy._id, { $inc: { claimsCount: 1, totalPayoutReceived: claimAmount } });
    }, 2000);

    res.json({ success: true, payout, message: 'Payout processing — funds arrive in 2–4 hours' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/payout/history
router.get('/history', protect, (req, res) => {
  try {
    const id = req.user._id || req.user.id;
    const payouts = db.payouts.find({ worker: id }, { sort: ['createdAt', -1], limit: 20 });
    res.json({ success: true, payouts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
