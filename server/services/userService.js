import { User } from '../models/index.js';
import mongoose from 'mongoose';

/**
 * User Service - MongoDB operations for users
 */
export class UserService {
  /**
   * Get all users with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Users with pagination info
   */
  static async getAllUsers(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        search = '',
        isActive = null
      } = options;

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Build query
      const query = {};
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }
      
      if (isActive !== null) {
        query.isActive = isActive;
      }

      const [users, total] = await Promise.all([
        User.find(query)
          .select('-password')
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit)),
        User.countDocuments(query)
      ]);

      return {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  static async getUserById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      const user = await User.findById(id).select('-password');
      return user;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null
   */
  static async getUserByEmail(email) {
    try {
      const user = await User.findByEmail(email);
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  static async createUser(userData) {
    try {
      const user = new User(userData);
      await user.save();
      
      // Return user without password
      const userObject = user.toObject();
      delete userObject.password;
      
      return userObject;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('User with this email already exists');
      }
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated user or null
   */
  static async updateUser(id, updateData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      // Remove sensitive fields from update data
      const { password, ...safeUpdateData } = updateData;

      const user = await User.findByIdAndUpdate(
        id,
        { ...safeUpdateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select('-password');

      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('Email already exists');
      }
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  /**
   * Update user password
   * @param {string} id - User ID
   * @param {string} newPassword - New password
   * @returns {Promise<boolean>} Success status
   */
  static async updatePassword(id, newPassword) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      const user = await User.findById(id);
      if (!user) {
        throw new Error('User not found');
      }

      user.password = newPassword;
      await user.save();

      return true;
    } catch (error) {
      throw new Error(`Error updating password: ${error.message}`);
    }
  }

  /**
   * Delete user (soft delete)
   * @param {string} id - User ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteUser(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      const user = await User.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );

      return !!user;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  /**
   * Permanently delete user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} Success status
   */
  static async permanentlyDeleteUser(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new Error(`Error permanently deleting user: ${error.message}`);
    }
  }

  /**
   * Update user last login
   * @param {string} id - User ID
   * @returns {Promise<boolean>} Success status
   */
  static async updateLastLogin(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid user ID format');
      }

      await User.findByIdAndUpdate(id, { lastLogin: new Date() });
      return true;
    } catch (error) {
      throw new Error(`Error updating last login: ${error.message}`);
    }
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} User statistics
   */
  static async getUserStats() {
    try {
      const [
        totalUsers,
        activeUsers,
        newUsersThisMonth,
        premiumUsers
      ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isActive: true }),
        User.countDocuments({
          createdAt: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }),
        User.countDocuments({ 'subscription.plan': { $in: ['basic', 'premium'] } })
      ]);

      return {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        newUsersThisMonth,
        premiumUsers,
        freeUsers: totalUsers - premiumUsers
      };
    } catch (error) {
      throw new Error(`Error fetching user statistics: ${error.message}`);
    }
  }
}
