import mongoose from 'mongoose';

const planetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sign: {
    type: String,
    required: true
  },
  house: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  degree: {
    type: Number,
    required: true,
    min: 0,
    max: 360
  },
  nakshatra: {
    type: String,
    required: true
  },
  nakshatraPada: {
    type: Number,
    min: 1,
    max: 4
  },
  isRetrograde: {
    type: Boolean,
    default: false
  },
  signLord: {
    type: String,
    required: true
  }
}, { _id: false });

const houseSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  sign: {
    type: String,
    required: true
  },
  signLord: {
    type: String,
    required: true
  },
  degree: {
    type: Number,
    required: true,
    min: 0,
    max: 360
  },
  planets: [{
    type: String
  }]
}, { _id: false });

const ascendantSchema = new mongoose.Schema({
  sign: {
    type: String,
    required: true
  },
  degree: {
    type: Number,
    required: true,
    min: 0,
    max: 360
  },
  signLord: {
    type: String,
    required: true
  },
  nakshatra: {
    type: String,
    required: true
  }
}, { _id: false });

const doshaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  present: {
    type: Boolean,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  description: {
    type: String
  },
  remedies: [{
    type: String
  }]
}, { _id: false });

const dashaSchema = new mongoose.Schema({
  planet: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  duration: {
    years: Number,
    months: Number,
    days: Number
  },
  subPeriods: [{
    planet: String,
    startDate: Date,
    endDate: Date,
    duration: {
      years: Number,
      months: Number,
      days: Number
    }
  }]
}, { _id: false });

const kundaliSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
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
    required: [true, 'Time of birth is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
  },
  placeOfBirth: {
    type: String,
    required: [true, 'Place of birth is required'],
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  ascendant: {
    type: ascendantSchema,
    required: true
  },
  planets: {
    type: [planetSchema],
    required: true,
    validate: {
      validator: function(planets) {
        return planets.length >= 9; // At least 9 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
      },
      message: 'At least 9 planets are required'
    }
  },
  houses: {
    type: [houseSchema],
    required: true,
    validate: {
      validator: function(houses) {
        return houses.length === 12; // Exactly 12 houses
      },
      message: 'Exactly 12 houses are required'
    }
  },
  doshas: {
    type: [doshaSchema],
    default: []
  },
  dashaPeriods: {
    type: [dashaSchema],
    default: []
  },
  chartType: {
    type: String,
    enum: ['north', 'south', 'east', 'bengali'],
    default: 'north'
  },
  ayanamsa: {
    type: String,
    enum: ['lahiri', 'raman', 'krishnamurti'],
    default: 'lahiri'
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
  },
  consultations: [{
    astrologerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    },
    notes: String,
    predictions: String,
    remedies: [String]
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for age at time of chart creation
kundaliSchema.virtual('ageAtCreation').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for zodiac sign (based on Sun's position)
kundaliSchema.virtual('zodiacSign').get(function() {
  const sunPlanet = this.planets.find(planet => planet.name === 'Sun');
  return sunPlanet ? sunPlanet.sign : null;
});

// Virtual for moon sign
kundaliSchema.virtual('moonSign').get(function() {
  const moonPlanet = this.planets.find(planet => planet.name === 'Moon');
  return moonPlanet ? moonPlanet.sign : null;
});

// Indexes for better query performance
kundaliSchema.index({ userId: 1, createdAt: -1 });
kundaliSchema.index({ dateOfBirth: 1 });
kundaliSchema.index({ placeOfBirth: 1 });
kundaliSchema.index({ isPublic: 1 });
kundaliSchema.index({ tags: 1 });

// Static method to find by user
kundaliSchema.statics.findByUser = function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method to find public charts
kundaliSchema.statics.findPublic = function() {
  return this.find({ isPublic: true }).populate('userId', 'name');
};

// Instance method to check if user owns this kundali
kundaliSchema.methods.isOwnedBy = function(userId) {
  return this.userId.toString() === userId.toString();
};

const Kundali = mongoose.model('Kundali', kundaliSchema);

export default Kundali;
