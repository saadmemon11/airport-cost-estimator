const mongoose = require('mongoose');

const subItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  unit: { type: String, default: 'unit' },
  quantity: { type: Number, default: 1, min: 0 },
  unitCost: { type: Number, default: 0, min: 0 },
  totalCost: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'in-progress', 'completed', 'on-hold'], default: 'pending' }
}, { timestamps: true });

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: {
    type: String,
    enum: ['infrastructure', 'terminal', 'airside', 'landside', 'utilities', 'technology', 'safety', 'commercial', 'administration', 'other'],
    default: 'other'
  },
  color: { type: String, default: '#3B82F6' },
  icon: { type: String, default: 'construction' },
  subItems: [subItemSchema],
  contingencyPercent: { type: Number, default: 10, min: 0, max: 100 },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['planning', 'design', 'procurement', 'construction', 'completed', 'on-hold'], default: 'planning' }
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  country: { type: String, default: '' },
  projectCode: { type: String, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currency: { type: String, default: 'USD' },
  startDate: { type: Date },
  estimatedCompletionDate: { type: Date },
  airportType: {
    type: String,
    enum: ['international', 'domestic', 'regional', 'private', 'cargo', 'military', 'heliport'],
    default: 'international'
  },
  runwayCount: { type: Number, default: 1 },
  expectedPassengersPerYear: { type: Number, default: 0 },
  departments: [departmentSchema],
  globalContingency: { type: Number, default: 10 },
  status: {
    type: String,
    enum: ['draft', 'planning', 'design', 'approval', 'construction', 'completed', 'cancelled'],
    default: 'draft'
  },
  isPublic: { type: Boolean, default: false },
  tags: [String]
}, { timestamps: true });

// Auto-generate project code
projectSchema.pre('save', async function(next) {
  if (!this.projectCode) {
    const count = await mongoose.model('Project').countDocuments();
    this.projectCode = `ARP-${String(count + 1).padStart(4, '0')}-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model('Project', projectSchema);
