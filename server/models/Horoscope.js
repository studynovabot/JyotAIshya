import mongoose from 'mongoose';

const horoscopeSchema = new mongoose.Schema({
  sign: {
    type: String,
    required: [true, 'Zodiac sign is required'],
    enum: [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ],
    index: true
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    index: true
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'daily',
    index: true
  },
  content: {
    general: {
      type: String,
      required: true,
      maxlength: [1000, 'General content cannot exceed 1000 characters']
    },
    love: {
      type: String,
      maxlength: [500, 'Love content cannot exceed 500 characters']
    },
    career: {
      type: String,
      maxlength: [500, 'Career content cannot exceed 500 characters']
    },
    health: {
      type: String,
      maxlength: [500, 'Health content cannot exceed 500 characters']
    },
    finance: {
      type: String,
      maxlength: [500, 'Finance content cannot exceed 500 characters']
    },
    family: {
      type: String,
      maxlength: [500, 'Family content cannot exceed 500 characters']
    }
  },
  ratings: {
    overall: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    love: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    career: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    health: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    },
    finance: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    }
  },
  luckyNumbers: [{
    type: Number,
    min: 1,
    max: 100
  }],
  luckyColors: [{
    type: String,
    trim: true
  }],
  luckyGems: [{
    type: String,
    trim: true
  }],
  planetaryPositions: [{
    planet: {
      type: String,
      required: true
    },
    sign: {
      type: String,
      required: true
    },
    degree: {
      type: Number,
      min: 0,
      max: 360
    },
    influence: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
      default: 'neutral'
    }
  }],
  remedies: [{
    type: {
      type: String,
      enum: ['mantra', 'gemstone', 'charity', 'ritual', 'lifestyle'],
      required: true
    },
    description: {
      type: String,
      required: true,
      maxlength: [200, 'Remedy description cannot exceed 200 characters']
    },
    duration: {
      type: String // e.g., "7 days", "1 month", "ongoing"
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'sa'],
    default: 'en'
  },
  source: {
    type: String,
    enum: ['ai_generated', 'astrologer', 'traditional'],
    default: 'ai_generated'
  },
  astrologerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted date
horoscopeSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for average rating
horoscopeSchema.virtual('averageRating').get(function() {
  const ratings = this.ratings;
  const total = ratings.overall + ratings.love + ratings.career + ratings.health + ratings.finance;
  return Math.round((total / 5) * 10) / 10;
});

// Compound indexes for better query performance
horoscopeSchema.index({ sign: 1, date: -1, type: 1 });
horoscopeSchema.index({ date: -1, isActive: 1 });
horoscopeSchema.index({ type: 1, date: -1 });
horoscopeSchema.index({ astrologerId: 1, date: -1 });

// Static method to find current horoscope for a sign
horoscopeSchema.statics.findCurrent = function(sign, type = 'daily') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.findOne({
    sign,
    type,
    date: { $gte: today },
    isActive: true
  }).sort({ date: 1 });
};

// Static method to find horoscopes by date range
horoscopeSchema.statics.findByDateRange = function(startDate, endDate, type = 'daily') {
  return this.find({
    date: { $gte: startDate, $lte: endDate },
    type,
    isActive: true
  }).sort({ sign: 1, date: -1 });
};

// Static method to find popular horoscopes
horoscopeSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ views: -1, likes: -1 })
    .limit(limit);
};

// Instance method to increment views
horoscopeSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to increment likes
horoscopeSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Instance method to increment shares
horoscopeSchema.methods.incrementShares = function() {
  this.shares += 1;
  return this.save();
};

// Pre-save middleware to ensure date is set correctly based on type
horoscopeSchema.pre('save', function(next) {
  if (this.isNew && !this.date) {
    const now = new Date();
    
    switch (this.type) {
      case 'daily':
        this.date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        // Set to start of current week (Sunday)
        const dayOfWeek = now.getDay();
        this.date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
        break;
      case 'monthly':
        // Set to start of current month
        this.date = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        // Set to start of current year
        this.date = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        this.date = now;
    }
  }
  next();
});

const Horoscope = mongoose.model('Horoscope', horoscopeSchema);

export default Horoscope;
