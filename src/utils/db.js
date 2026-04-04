/**
 * GigShield — In-Memory Database (replaces MongoDB/Mongoose)
 * Stores data in memory + persists to data/db.json on disk.
 * Auto-loads from disk on startup. Zero external DB required.
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// In-memory store
let store = {
  users: [],
  policies: [],
  payouts: [],
  triggers: [],
  fraudcases: [],
  otps: []
};

// ─── Persistence ────────────────────────────────────────────
function save() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2));
  } catch (e) {
    // silently continue — data still lives in memory
  }
}

function load() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      store = { ...store, ...parsed };
    }
  } catch (e) {
    // start fresh
  }
}

load();

// ─── Collection class ────────────────────────────────────────
class Collection {
  constructor(name) {
    this.name = name;
    if (!store[name]) store[name] = [];
  }

  get _data() { return store[this.name]; }

  _match(doc, query) {
    for (const [key, val] of Object.entries(query)) {
      if (key === '_id') {
        if (doc._id !== val) return false;
        continue;
      }
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        // Operators
        if ('$gt' in val && !(doc[key] > val.$gt)) return false;
        if ('$gte' in val && !(doc[key] >= val.$gte)) return false;
        if ('$lt' in val && !(doc[key] < val.$lt)) return false;
        if ('$lte' in val && !(doc[key] <= val.$lte)) return false;
        if ('$ne' in val && doc[key] === val.$ne) return false;
        if ('$in' in val && !val.$in.includes(doc[key])) return false;
      } else {
        if (doc[key] !== val) return false;
      }
    }
    return true;
  }

  _clone(doc) { return JSON.parse(JSON.stringify(doc)); }

  // Simulate populate (resolve _id refs to full objects)
  _populate(doc, fields) {
    if (!fields) return doc;
    const result = this._clone(doc);
    for (const field of fields) {
      const refId = result[field.path];
      if (!refId) continue;
      const refCol = store[field.collection];
      if (!refCol) continue;
      const found = refCol.find(d => d._id === refId);
      if (found) {
        let ref = this._clone(found);
        if (field.select) {
          const allowed = field.select.split(' ').filter(s => !s.startsWith('-'));
          const excluded = field.select.split(' ').filter(s => s.startsWith('-')).map(s => s.slice(1));
          if (allowed.length) ref = Object.fromEntries(Object.entries(ref).filter(([k]) => allowed.includes(k) || k === '_id'));
          if (excluded.length) excluded.forEach(k => delete ref[k]);
        }
        result[field.path] = ref;
      }
    }
    return result;
  }

  insert(doc) {
    const now = new Date().toISOString();
    const newDoc = {
      _id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      ...doc
    };
    store[this.name].push(newDoc);
    save();
    return this._clone(newDoc);
  }

  insertMany(docs) {
    return docs.map(d => this.insert(d));
  }

  find(query = {}, opts = {}) {
    let results = store[this.name]
      .filter(doc => this._match(doc, query))
      .map(doc => this._clone(doc));

    // sort
    if (opts.sort) {
      const [key, dir] = opts.sort;
      results.sort((a, b) => {
        const av = a[key], bv = b[key];
        if (av < bv) return -1 * dir;
        if (av > bv) return 1 * dir;
        return 0;
      });
    }

    // limit
    if (opts.limit) results = results.slice(0, opts.limit);

    // populate
    if (opts.populate) {
      results = results.map(doc => this._populate(doc, opts.populate));
    }

    return results;
  }

  findOne(query = {}, opts = {}) {
    const results = this.find(query, opts);
    return results[0] || null;
  }

  findById(id, opts = {}) {
    return this.findOne({ _id: id }, opts);
  }

  updateOne(query, update, opts = {}) {
    const idx = store[this.name].findIndex(doc => this._match(doc, query));
    if (idx === -1) return null;
    this._applyUpdate(idx, update);
    save();
    if (opts.new !== false) return this._clone(store[this.name][idx]);
    return null;
  }

  findByIdAndUpdate(id, update, opts = {}) {
    return this.updateOne({ _id: id }, update, opts);
  }

  _applyUpdate(idx, update) {
    const doc = store[this.name][idx];
    if ('$set' in update) Object.assign(doc, update.$set);
    if ('$inc' in update) {
      for (const [k, v] of Object.entries(update.$inc)) {
        doc[k] = (doc[k] || 0) + v;
      }
    }
    if ('$push' in update) {
      for (const [k, v] of Object.entries(update.$push)) {
        if (!Array.isArray(doc[k])) doc[k] = [];
        doc[k].push(v);
      }
    }
    // plain update (not operator-based)
    const plain = Object.fromEntries(Object.entries(update).filter(([k]) => !k.startsWith('$')));
    Object.assign(doc, plain);
    doc.updatedAt = new Date().toISOString();
  }

  updateById(id, update) {
    return this.updateOne({ _id: id }, update, { new: true });
  }

  deleteMany(query = {}) {
    const before = store[this.name].length;
    store[this.name] = store[this.name].filter(doc => !this._match(doc, query));
    save();
    return { deletedCount: before - store[this.name].length };
  }

  countDocuments(query = {}) {
    return store[this.name].filter(doc => this._match(doc, query)).length;
  }

  // Simple aggregation (only what the app uses)
  aggregate(pipeline) {
    let results = store[this.name].map(doc => this._clone(doc));

    for (const stage of pipeline) {
      if (stage.$match) {
        results = results.filter(doc => this._match(doc, stage.$match));
      }
      if (stage.$group) {
        const { _id: groupKey, ...accumulators } = stage.$group;
        const groups = {};
        for (const doc of results) {
          // resolve group key (e.g. '$city')
          let key = groupKey;
          if (typeof groupKey === 'string' && groupKey.startsWith('$')) {
            key = doc[groupKey.slice(1)] ?? '__null__';
          } else if (groupKey === null) {
            key = '__all__';
          } else if (typeof groupKey === 'object') {
            // e.g. { $dateToString: { ... } } — simplify to date string
            key = (doc.createdAt || '').slice(0, 10);
          }

          if (!groups[key]) {
            groups[key] = { _id: key === '__all__' ? null : key };
            for (const [field, expr] of Object.entries(accumulators)) {
              if (expr.$sum !== undefined) groups[key][field] = 0;
              if (expr.$count !== undefined) groups[key][field] = 0;
              if (expr.$avg !== undefined) { groups[key][field] = 0; groups[key]['__count_' + field] = 0; }
            }
          }

          for (const [field, expr] of Object.entries(accumulators)) {
            if (expr.$sum !== undefined) {
              const val = typeof expr.$sum === 'number' ? expr.$sum :
                expr.$sum.startsWith('$') ? (doc[expr.$sum.slice(1)] || 0) : 0;
              groups[key][field] += val;
            }
            if (expr.$count !== undefined) groups[key][field]++;
          }
        }
        results = Object.values(groups);
      }
      if (stage.$sort) {
        const [sortKey, sortDir] = Object.entries(stage.$sort)[0];
        results.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return -1 * sortDir;
          if (a[sortKey] > b[sortKey]) return 1 * sortDir;
          return 0;
        });
      }
      if (stage.$limit) {
        results = results.slice(0, stage.$limit);
      }
    }
    return results;
  }
}

// ─── Collections ─────────────────────────────────────────────
const db = {
  users: new Collection('users'),
  policies: new Collection('policies'),
  payouts: new Collection('payouts'),
  triggers: new Collection('triggers'),
  fraudcases: new Collection('fraudcases'),
  otps: new Collection('otps'),
  save
};

module.exports = db;
