require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const app = express();

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth',      require('./src/routes/auth'));
app.use('/api/policy',    require('./src/routes/policy'));
app.use('/api/triggers',  require('./src/routes/triggers'));
app.use('/api/payout',    require('./src/routes/payout'));
app.use('/api/analytics', require('./src/routes/analytics'));
app.use('/api/fraud',     require('./src/routes/fraud'));
app.use('/api/admin',     require('./src/routes/admin'));

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║         🛡️  GigShield Server Running          ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Local:   http://localhost:${PORT}               ║`);
  console.log(`║  Mode:    ${process.env.NODE_ENV || 'development'}                     ║`);
  console.log('║  DB:      In-Memory + data/db.json           ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('\n  Run "npm run seed" to populate demo data\n');
});
