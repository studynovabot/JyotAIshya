import mongoose from 'mongoose';

// Simplified Kundali model that matches our calculation output
const kundaliSimpleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Allow anonymous kundalis
    index: true,
    default: null
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  timeOfBirth: {
    type: String,
    required: [true, 'Time of birth is required']
  },
  placeOfBirth: {
    type: String,
    required: [true, 'Place of birth is required'],
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  // Store the complete calculation output as flexible objects
  ascendant: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  planets: {
    type: [mongoose.Schema.Types.Mixed],
    required: true
  },
  houses: {
    type: [mongoose.Schema.Types.Mixed],
    required: false,
    default: []
  },
  doshas: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  dashaPeriods: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ayanamsa: {
    type: String,
    default: 'lahiri'
  },
  calculationInfo: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
kundaliSimpleSchema.index({ userId: 1, createdAt: -1 });
kundaliSimpleSchema.index({ dateOfBirth: 1 });
kundaliSimpleSchema.index({ placeOfBirth: 1 });
kundaliSimpleSchema.index({ isPublic: 1 });
kundaliSimpleSchema.index({ tags: 1 });

// Static method to find by user
kundaliSimpleSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method to find public charts
kundaliSimpleSchema.statics.findPublic = function() {
  return this.find({ isPublic: true }).populate('userId', 'name');
};

// Instance method to check if user owns this kundali
kundaliSimpleSchema.methods.isOwnedBy = function(userId) {
  if (!this.userId || !userId) return false;
  return this.userId.toString() === userId.toString();
};

const KundaliSimple = mongoose.model('KundaliSimple', kundaliSimpleSchema);

export default KundaliSimple;
