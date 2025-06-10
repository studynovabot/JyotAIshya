const KundaliSimple = require('../models/KundaliSimple.js');
const mongoose = require('mongoose');

/**
 * Kundali Service for Simple Model - MongoDB operations for kundalis
 */
class KundaliSimpleService {
  /**
   * Create a new kundali
   * @param {Object} kundaliData - Kundali data
   * @returns {Promise<Object>} Created kundali
   */
  static async createKundali(kundaliData) {
    try {
      // Validate user ID if provided
      if (kundaliData.userId && !mongoose.Types.ObjectId.isValid(kundaliData.userId)) {
        throw new Error('Invalid user ID format');
      }

      const kundali = new KundaliSimple(kundaliData);
      await kundali.save();
      
      // Populate user data if userId exists
      if (kundali.userId) {
        await kundali.populate('userId', 'name email');
      }
      
      return kundali;
    } catch (error) {
      throw new Error(`Error creating kundali: ${error.message}`);
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

      const kundali = await KundaliSimple.findById(id)
        .populate('userId', 'name email');
      
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

      const kundalis = await KundaliSimple.find({ userId })
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'name email');

      return kundalis;
    } catch (error) {
      throw new Error(`Error fetching user kundalis: ${error.message}`);
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

      const kundali = await KundaliSimple.findByIdAndUpdate(
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

      const result = await KundaliSimple.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Error deleting kundali: ${error.message}`);
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

      const kundalis = await KundaliSimple.find({ isPublic: true })
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
        tags,
        userId,
        isPublic
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

      if (isPublic !== undefined) {
        query.isPublic = isPublic;
      }

      const kundalis = await KundaliSimple.find(query)
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });

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
        KundaliSimple.countDocuments(),
        KundaliSimple.countDocuments({ isPublic: true }),
        KundaliSimple.countDocuments({
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }),
        KundaliSimple.aggregate([
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

module.exports = { KundaliSimpleService };
