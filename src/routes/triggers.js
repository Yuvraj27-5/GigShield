const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const { protect } = require('../middleware/auth');

const TRIGGER_THRESHOLDS = {
  rain:   { value: 20,  unit: 'mm/hr',  label: 'Heavy Rainfall' },
  heat:   { value: 40,  unit: '°C',     label: 'Extreme Heat' },
  aqi:    { value: 300, unit: 'AQI',    label: 'Hazardous Air Quality' },
  bandh:  { value: 1,   unit: 'event',  label: 'Bandh/Strike' },
  flood:  { value: 1,   unit: 'event',  label: 'Flood Warning' },
  curfew: { value: 1,   unit: 'event',  label: 'Curfew' }
};

// GET /api/triggers/active
router.get('/active', (req, res) => {
  try {
    const triggers = db.triggers.find({ status: 'active' }, { sort: ['detectedAt', -1], limit: 20 });
    res.json({ success: true, triggers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/triggers/all
router.get('/all', (req, res) => {
  try {
    const triggers = db.triggers.find({}, { sort: ['detectedAt', -1], limit: 50 });
    res.json({ success: true, triggers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/triggers/simulate
router.get('/simulate', protect, (req, res) => {
  try {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'];
    const types = ['rain', 'heat', 'aqi'];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const threshold = TRIGGER_THRESHOLDS[type];

    const simulatedValues = {
      rain: Math.floor(22 + Math.random() * 40),
      heat: Math.floor(41 + Math.random() * 8),
      aqi:  Math.floor(305 + Math.random() * 200)
    };

    const value = simulatedValues[type];
    const severity = value > threshold.value * 1.5 ? 'extreme' : value > threshold.value * 1.2 ? 'severe' : 'moderate';

    const trigger = db.triggers.insert({
      type, city, value,
      threshold: threshold.value,
      severity,
      description: `${threshold.label} detected in ${city}: ${value} ${threshold.unit}`,
      validatedSources: ['IMD', 'OpenWeather', 'CPCB'],
      affectedWorkers: Math.floor(50 + Math.random() * 500),
      totalPayout: Math.floor(5000 + Math.random() * 50000),
      status: 'active',
      detectedAt: new Date().toISOString()
    });

    res.json({ success: true, trigger, message: `Trigger simulated: ${type} in ${city}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
