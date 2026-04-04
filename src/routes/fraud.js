const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/fraud/cases
router.get('/cases', protect, adminOnly, (req, res) => {
  try {
    const cases = db.fraudcases.find({}, { sort: ['createdAt', -1], limit: 50 });
    const enriched = cases.map(c => {
      const worker = c.worker ? db.users.findById(c.worker) : null;
      const payout = c.payout ? db.payouts.findById(c.payout) : null;
      return {
        ...c,
        worker: worker ? { _id: worker._id, name: worker.name, mobile: worker.mobile, city: worker.city } : null,
        payout: payout ? { _id: payout._id, amount: payout.amount, txnId: payout.txnId, triggerType: payout.triggerType } : null
      };
    });
    res.json({ success: true, cases: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/fraud/:id/resolve
router.put('/:id/resolve', protect, adminOnly, (req, res) => {
  try {
    const { status, resolution } = req.body;
    const adminId = req.user._id || req.user.id;
    const fraud = db.fraudcases.findByIdAndUpdate(req.params.id, {
      status, resolution, resolvedBy: adminId, resolvedAt: new Date().toISOString()
    }, { new: true });
    res.json({ success: true, fraud });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
