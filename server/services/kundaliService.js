import { Kundali } from '../models/index.js';
import mongoose from 'mongoose';

/**
 * Kundali Service - MongoDB operations for kundalis
 */
export class KundaliService {
  /**
   * Get all kundalis with pagination and filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Kundalis with pagination info
   */
  static async getAllKundalis(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        userId = null,
        isPublic = null,
        search = ''
      } = options;

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Build query
      const query = {};
      
      if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error('Invalid user ID format');
        }
        query.userId = userId;
      }
      
      if (isPublic !== null) {
        query.isPublic = isPublic;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { placeOfBirth: { $regex: search, $options: 'i' } }
        ];
      }

      const [kundalis, total] = await Promise.all([
        Kundali.find(query)
          .populate('userId', 'name email')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        Kundali.countDocuments(query)
      ]);

      return {
        kundalis,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalKundalis: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Error fetching kundalis: ${error.message}`);
    }
  }

  /**
   * Get kundali by ID
   * @param {string} id - Kundali ID
   * @returns {Promise<Object|null>} Kundali object or null
   */
  static async getKundaliById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid kundali ID format');
      }

      const kundali = await Kundali.findById(id)
        .populate('userId', 'name email')
        .populate('consultations.astrologerId', 'name email');
      
      return kundali;
    } catch (error) {
      throw new Error(`Error fetching kundali: ${error.message}`);
    }
  }

  /**
   * Get kundalis by user ID
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of kundalis
   */
  static async getKundalisByUserId(userId, options = {}) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID format');
      }

      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const kundalis = await Kundali.find({ userId })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      return kundalis;
    } catch (error) {
      throw new Error(`Error fetching user kundalis: ${error.message}`);
    }
  }

  /**
   * Create a new kundali
   * @param {Object} kundaliData - Kundali data
   * @returns {Promise<Object>} Created kundali
   */
  static async createKundali(kundaliData) {
    try {
      // Validate user ID
      if (!mongoose.Types.ObjectId.isValid(kundaliData.userId)) {
        throw new Error('Invalid user ID format');
      }

      const kundali = new Kundali(kundaliData);
      await kundali.save();
      
      // Populate user data before returning
      await kundali.populate('userId', 'name email');
      
      return kundali;
    } catch (error) {
      throw new Error(`Error creating kundali: ${error.message}`);
    }
  }

  /**
   * Update kundali
   * @param {string} id - Kundali ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated kundali or null
   */
  static async updateKundali(id, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid kundali ID format');
      }

      const kundali = await Kundali.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('userId', 'name email');

      return kundali;
    } catch (error) {
      throw new Error(`Error updating kundali: ${error.message}`);
    }
  }

  /**
   * Delete kundali
   * @param {string} id - Kundali ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteKundali(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid kundali ID format');
      }

      const result = await Kundali.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Error deleting kundali: ${error.message}`);
    }
  }

  /**
   * Add consultation to kundali
   * @param {string} kundaliId - Kundali ID
   * @param {Object} consultationData - Consultation data
   * @returns {Promise<Object|null>} Updated kundali or null
   */
  static async addConsultation(kundaliId, consultationData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(kundaliId)) {
        throw new Error('Invalid kundali ID format');
      }

      const kundali = await Kundali.findByIdAndUpdate(
        kundaliId,
        { 
          $push: { consultations: consultationData },
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      ).populate('userId', 'name email')
       .populate('consultations.astrologerId', 'name email');

      return kundali;
    } catch (error) {
      throw new Error(`Error adding consultation: ${error.message}`);
    }
  }

  /**
   * Get public kundalis
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of public kundalis
   */
  static async getPublicKundalis(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const kundalis = await Kundali.find({ isPublic: true })
        .populate('userId', 'name')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      return kundalis;
    } catch (error) {
      throw new Error(`Error fetching public kundalis: ${error.message}`);
    }
  }

  /**
   * Search kundalis by various criteria
   * @param {Object} searchCriteria - Search criteria
   * @returns {Promise<Array>} Array of matching kundalis
   */
  static async searchKundalis(searchCriteria) {
    try {
      const {
        name,
        placeOfBirth,
        dateOfBirth,
        zodiacSign,
        moonSign,
        tags,
        userId
      } = searchCriteria;

      const query = {};

      if (name) {
        query.name = { $regex: name, $options: 'i' };
      }

      if (placeOfBirth) {
        query.placeOfBirth = { $regex: placeOfBirth, $options: 'i' };
      }

      if (dateOfBirth) {
        const date = new Date(dateOfBirth);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        query.dateOfBirth = { $gte: date, $lt: nextDay };
      }

      if (tags && tags.length > 0) {
        query.tags = { $in: tags };
      }

      if (userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error('Invalid user ID format');
        }
        query.userId = userId;
      }

      let kundalis = await Kundali.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });

      // Filter by zodiac sign (Sun sign) if specified
      if (zodiacSign) {
        kundalis = kundalis.filter(kundali => {
          const sunPlanet = kundali.planets.find(planet => planet.name === 'Sun');
          return sunPlanet && sunPlanet.sign === zodiacSign;
        });
      }

      // Filter by moon sign if specified
      if (moonSign) {
        kundalis = kundalis.filter(kundali => {
          const moonPlanet = kundali.planets.find(planet => planet.name === 'Moon');
          return moonPlanet && moonPlanet.sign === moonSign;
        });
      }

      return kundalis;
    } catch (error) {
      throw new Error(`Error searching kundalis: ${error.message}`);
    }
  }

  /**
   * Get kundali statistics
   * @returns {Promise<Object>} Kundali statistics
   */
  static async getKundaliStats() {
    try {
      const [
        totalKundalis,
        publicKundalis,
        kundalisThisMonth,
        topPlaces
      ] = await Promise.all([
        Kundali.countDocuments(),
        Kundali.countDocuments({ isPublic: true }),
        Kundali.countDocuments({
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }),
        Kundali.aggregate([
          { $group: { _id: '$placeOfBirth', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ])
      ]);

      return {
        totalKundalis,
        publicKundalis,
        privateKundalis: totalKundalis - publicKundalis,
        kundalisThisMonth,
        topPlaces: topPlaces.map(place => ({
          place: place._id,
          count: place.count
        }))
      };
    } catch (error) {
      throw new Error(`Error fetching kundali statistics: ${error.message}`);
    }
  }
}
