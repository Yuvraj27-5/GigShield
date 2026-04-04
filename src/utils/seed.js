require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const db = require('./db');

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'];
const platforms = ['Swiggy', 'Zomato', 'Dunzo', 'Other'];
const workerNames = ['Ravi Kumar', 'Suresh Yadav', 'Amit Singh', 'Priya Sharma', 'Mohammed Ali', 'Deepak Verma', 'Sunita Devi', 'Kiran Patil', 'Arjun Nair', 'Pooja Gupta'];

const TIERS = {
  basic:    { weeklyPremium: 49,  maxWeeklyPayout: 500,  triggers: ['rain', 'bandh'] },
  standard: { weeklyPremium: 99,  maxWeeklyPayout: 1000, triggers: ['rain', 'heat', 'aqi', 'bandh'] },
  premium:  { weeklyPremium: 149, maxWeeklyPayout: 1500, triggers: ['rain', 'heat', 'aqi', 'bandh', 'flood', 'curfew'] }
};

async function seed() {
  try {
    console.log('\n🌱 Seeding GigShield (in-memory/file DB)...\n');

    // Clear all
    db.users.deleteMany({});
    db.policies.deleteMany({});
    db.payouts.deleteMany({});
    db.triggers.deleteMany({});
    db.fraudcases.deleteMany({});
    db.otps.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Admin user
    const adminPass = await bcrypt.hash('GigAdmin@2024', 10);
    const admin = db.users.insert({
      name: 'GigShield Admin',
      mobile: '9000000000',
      email: 'admin@gigshield.in',
      password: adminPass,
      role: 'admin',
      isVerified: true,
      kycStatus: 'verified',
      city: 'Mumbai',
      totalEarnings: 0,
      totalPayouts: 0
    });
    console.log('👤 Admin created: admin@gigshield.in / GigAdmin@2024');

    // Workers + policies
    const tierKeys = ['basic', 'standard', 'premium'];
    const workers = [];
    for (let i = 0; i < 10; i++) {
      const tier = tierKeys[i % 3];
      const tierConfig = TIERS[tier];
      const city = cities[i % cities.length];

      const worker = db.users.insert({
        name: workerNames[i],
        mobile: `98765${String(i).padStart(5, '0')}`,
        isVerified: true,
        kycStatus: 'verified',
        upiId: `worker${i}@upi`,
        city,
        platform: platforms[i % platforms.length],
        role: 'worker',
        totalEarnings: Math.floor(5000 + Math.random() * 20000),
        totalPayouts: Math.floor(1 + Math.random() * 8)
      });

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const policy = db.policies.insert({
        worker: worker._id,
        tier,
        weeklyPremium: tierConfig.weeklyPremium,
        maxWeeklyPayout: tierConfig.maxWeeklyPayout,
        triggers: tierConfig.triggers,
        city,
        status: 'active',
        endDate: endDate.toISOString(),
        totalPremiumPaid: tierConfig.weeklyPremium * 4,
        totalPayoutReceived: Math.floor(Math.random() * tierConfig.maxWeeklyPayout * 2),
        claimsCount: Math.floor(Math.random() * 5)
      });

      db.users.updateById(worker._id, { activePolicy: policy._id });
      workers.push(db.users.findById(worker._id));
    }
    console.log(`👷 Created ${workers.length} demo workers`);

    // Triggers
    const triggerData = [
      { type: 'rain',  city: 'Mumbai',    severity: 'extreme',  value: 45,  threshold: 20,  description: 'Extremely heavy rainfall in Mumbai — Colaba, Andheri flooded',    affectedWorkers: 1240, totalPayout: 186000, status: 'active' },
      { type: 'heat',  city: 'Delhi',     severity: 'severe',   value: 43,  threshold: 40,  description: 'Severe heatwave alert in Delhi — feels like 50°C',                affectedWorkers: 870,  totalPayout: 98000,  status: 'active' },
      { type: 'aqi',   city: 'Delhi',     severity: 'extreme',  value: 412, threshold: 300, description: 'Hazardous AQI levels — outdoor work dangerous',                   affectedWorkers: 640,  totalPayout: 72000,  status: 'active' },
      { type: 'bandh', city: 'Bangalore', severity: 'moderate', value: 1,   threshold: 1,   description: 'Karnataka Bandh — roads blocked across city',                     affectedWorkers: 320,  totalPayout: 38400,  status: 'resolved' },
      { type: 'flood', city: 'Chennai',   severity: 'severe',   value: 1,   threshold: 1,   description: 'Flash flood warning issued by Tamil Nadu govt',                   affectedWorkers: 510,  totalPayout: 61200,  status: 'active' },
    ];
    const triggers = triggerData.map(t =>
      db.triggers.insert({ ...t, validatedSources: ['IMD', 'OpenWeather', 'NDMA'], detectedAt: new Date().toISOString() })
    );
    console.log(`⚡ Created ${triggers.length} triggers`);

    // Payouts
    const statuses = ['completed', 'completed', 'completed', 'processing', 'failed'];
    const payouts = [];
    for (let i = 0; i < 15; i++) {
      const worker = workers[i % workers.length];
      const policy = db.policies.findOne({ worker: worker._id });
      const status = statuses[i % statuses.length];
      const payout = db.payouts.insert({
        worker: worker._id,
        policy: policy._id,
        trigger: triggers[i % triggers.length]._id,
        amount: Math.floor(200 + Math.random() * 1200),
        upiId: worker.upiId,
        txnId: 'GS' + Date.now() + i + Math.random().toString(36).substr(2, 4).toUpperCase(),
        status,
        triggerType: triggers[i % triggers.length].type,
        city: worker.city,
        fraudScore: Math.floor(Math.random() * 30),
        processedAt: status === 'completed' ? new Date().toISOString() : null
      });
      payouts.push(payout);
    }
    console.log(`💰 Created ${payouts.length} payout records`);

    // Fraud cases
    db.fraudcases.insert({
      worker: workers[2]._id,
      payout: payouts[2]._id,
      fraudScore: 72,
      flags: ['High claim frequency', 'Multiple claims same day', 'GPS location mismatch'],
      behavioralScore: 35, networkScore: 20, temporalScore: 17, documentScore: 0,
      status: 'investigating'
    });
    db.fraudcases.insert({
      worker: workers[5]._id,
      payout: payouts[5]._id,
      fraudScore: 85,
      flags: ['Duplicate UPI linked to 3 accounts', 'Aadhaar verification failed'],
      behavioralScore: 40, networkScore: 30, temporalScore: 15, documentScore: 0,
      status: 'flagged'
    });
    console.log('🚨 Created 2 fraud cases');

    console.log('\n✅ Seeding complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Demo Login Credentials');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Admin:  admin@gigshield.in');
    console.log('          Password: GigAdmin@2024');
    console.log('  Worker: Any mobile e.g. 9876500000');
    console.log('          OTP will appear in terminal');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
