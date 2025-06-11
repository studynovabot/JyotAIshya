import * as astroCalculations from '../utils/astroCalculationsNew.js';

/**
 * Service for compatibility calculations
 */
export class CompatibilityService {
  /**
   * Calculate compatibility between two people
   * @param {Object} person1 - First person's birth details
   * @param {Object} person2 - Second person's birth details
   * @param {string} matchType - Type of compatibility matching (default: 'ashtakoot')
   * @returns {Promise<Object>} Compatibility results
   */
  static async calculateCompatibility(person1, person2, matchType = 'ashtakoot') {
    try {
      console.log('Calculating compatibility with params:', { person1, person2, matchType });
      
      // Generate birth charts for both individuals
      const kundali1 = await astroCalculations.calculateKundali(
        person1.name || 'Person 1',
        person1.dateOfBirth,
        person1.timeOfBirth,
        person1.placeOfBirth,
        person1.latitude,
        person1.longitude,
        person1.timezone
      );
      
      const kundali2 = await astroCalculations.calculateKundali(
        person2.name || 'Person 2',
        person2.dateOfBirth,
        person2.timeOfBirth,
        person2.placeOfBirth,
        person2.latitude,
        person2.longitude,
        person2.timezone
      );
      
      // Calculate compatibility
      const compatibility = astroCalculations.calculateCompatibility(kundali1, kundali2);
      
      return {
        person1: {
          name: person1.name || 'Person 1',
          birthDetails: {
            dateOfBirth: person1.dateOfBirth,
            timeOfBirth: person1.timeOfBirth,
            placeOfBirth: person1.placeOfBirth
          },
          moonSign: kundali1.planets.find(p => p.id === astroCalculations.PLANETS.MOON)?.sign || 'Unknown',
          ascendant: kundali1.ascendant?.sign || 'Unknown'
        },
        person2: {
          name: person2.name || 'Person 2',
          birthDetails: {
            dateOfBirth: person2.dateOfBirth,
            timeOfBirth: person2.timeOfBirth,
            placeOfBirth: person2.placeOfBirth
          },
          moonSign: kundali2.planets.find(p => p.id === astroCalculations.PLANETS.MOON)?.sign || 'Unknown',
          ascendant: kundali2.ascendant?.sign || 'Unknown'
        },
        compatibility: compatibility
      };
    } catch (error) {
      console.error('Error calculating compatibility:', error);
      throw new Error('Failed to calculate compatibility: ' + error.message);
    }
  }
}