const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/workers
router.get('/workers', protect, adminOnly, (req, res) => {
  try {
    const workers = db.users.find({ role: 'worker' }, { sort: ['createdAt', -1], limit: 50 });
    const enriched = workers.map(w => {
      const { password, ...safe } = w;
      if (safe.activePolicy) {
        safe.activePolicy = db.policies.findById(safe.activePolicy) || safe.activePolicy;
      }
      return safe;
    });
    res.json({ success: true, workers: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/admin/payouts
router.get('/payouts', protect, adminOnly, (req, res) => {
  try {
    const payouts = db.payouts.find({}, { sort: ['createdAt', -1], limit: 50 });
    const enriched = payouts.map(p => {
      const worker = p.worker ? db.users.findById(p.worker) : null;
      return {
        ...p,
        worker: worker ? { _id: worker._id, name: worker.name, mobile: worker.mobile, city: worker.city } : null
      };
    });
    res.json({ success: true, payouts: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/admin/trigger
router.post('/trigger', protect, adminOnly, (req, res) => {
  try {
    const trigger = db.triggers.insert({ ...req.body, detectedAt: new Date().toISOString() });
    res.json({ success: true, trigger });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
