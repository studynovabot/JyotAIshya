import * as astroCalculations from '../utils/astroCalculationsNew.js';

/**
 * Service for astrological calculations
 */
class AstroService {
  /**
   * Generate a birth chart
   * @param {Object} params - Birth details
   * @param {string} params.dateOfBirth - Date of birth (YYYY-MM-DD)
   * @param {string} params.timeOfBirth - Time of birth (HH:MM)
   * @param {string} params.placeOfBirth - Place of birth
   * @param {string} params.name - Name of the person
   * @param {number} params.latitude - Latitude (optional)
   * @param {number} params.longitude - Longitude (optional)
   * @param {number} params.timezone - Timezone offset (optional)
   * @returns {Promise<Object>} Birth chart data
   */
  static async generateBirthChart(params) {
    try {
      console.log('Generating birth chart with params:', params);
      
      const { 
        dateOfBirth, 
        timeOfBirth, 
        placeOfBirth,
        name,
        latitude,
        longitude,
        timezone
      } = params;

      // Call the generateBirthChart function from astroCalculations
      const birthChart = await astroCalculations.generateBirthChart(
        name,
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
        latitude,
        longitude,
        timezone
      );

      return birthChart;
    } catch (error) {
      console.error('Error generating birth chart:', error);
      throw new Error('Failed to generate birth chart: ' + error.message);
    }
  }

  /**
   * Check for doshas (astrological afflictions)
   * @param {Object} params - Birth details
   * @returns {Promise<Object>} Dosha analysis
   */
  static async checkDoshas(params) {
    try {
      const { 
        dateOfBirth, 
        timeOfBirth, 
        placeOfBirth,
        name,
        latitude,
        longitude,
        timezone
      } = params;

      // First generate the birth chart
      const birthChart = await astroCalculations.generateBirthChart(
        name || "Anonymous",
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
        latitude,
        longitude,
        timezone
      );
      
      // Check for Mangal Dosha
      const mangalDosha = astroCalculations.checkMangalDosha(birthChart);
      
      // Check for Kaal Sarpa Dosha
      const kaalSarpaDosha = astroCalculations.checkKaalSarpaDosha(birthChart);
      
      return {
        birthChart: birthChart,
        mangalDosha: mangalDosha,
        kaalSarpaDosha: kaalSarpaDosha,
        // Add more doshas as needed
      };
    } catch (error) {
      console.error('Error checking doshas:', error);
      throw new Error('Failed to check doshas: ' + error.message);
    }
  }

  /**
   * Calculate dasha periods
   * @param {Object} params - Birth details
   * @returns {Promise<Object>} Dasha periods
   */
  static async calculateDashaPeriods(params) {
    try {
      const { 
        dateOfBirth, 
        timeOfBirth, 
        placeOfBirth,
        name,
        latitude,
        longitude,
        timezone,
        kundaliId
      } = params;

      // First generate the birth chart
      const birthChart = await astroCalculations.generateBirthChart(
        name || "Anonymous",
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
        latitude,
        longitude,
        timezone
      );
      
      // Calculate dasha periods
      const dashaPeriods = astroCalculations.calculateDasha(birthChart);
      
      return {
        birthChart: birthChart,
        ...dashaPeriods
      };
    } catch (error) {
      console.error('Error calculating dasha periods:', error);
      throw new Error('Failed to calculate dasha periods: ' + error.message);
    }
  }

  /**
   * Perform general astrological calculation
   * @param {Object} params - Calculation parameters
   * @returns {Promise<Object>} Calculation results
   */
  static async performCalculation(params) {
    try {
      const { calculationType } = params;
      
      switch (calculationType) {
        case 'birthChart':
          return await this.generateBirthChart(params);
        case 'dosha':
          return await this.checkDoshas(params);
        case 'dasha':
          return await this.calculateDashaPeriods(params);
        default:
          throw new Error(`Unknown calculation type: ${calculationType}`);
      }
    } catch (error) {
      console.error('Error performing calculation:', error);
      throw new Error('Failed to perform calculation: ' + error.message);
    }
  }

  /**
   * Validate input data
   * @param {Object} params - Input parameters
   * @returns {Promise<Object>} Validation results
   */
  static async validateInput(params) {
    try {
      const { dateOfBirth, timeOfBirth, placeOfBirth } = params;
      
      const errors = [];
      
      // Validate date
      if (!dateOfBirth) {
        errors.push('Date of birth is required');
      } else {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateOfBirth)) {
          errors.push('Date of birth must be in YYYY-MM-DD format');
        }
      }
      
      // Validate time
      if (!timeOfBirth) {
        errors.push('Time of birth is required');
      } else {
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(timeOfBirth)) {
          errors.push('Time of birth must be in HH:MM format');
        }
      }
      
      // Validate place
      if (!placeOfBirth) {
        errors.push('Place of birth is required');
      }
      
      return {
        isValid: errors.length === 0,
        errors: errors
      };
    } catch (error) {
      console.error('Error validating input:', error);
      throw new Error('Failed to validate input: ' + error.message);
    }
  }

  /**
   * Get coordinates for a place
   * @param {string} place - Place name
   * @returns {Promise<Object>} Coordinates
   */
  static async getCoordinates(place) {
    try {
      return await astroCalculations.getGeoCoordinates(place);
    } catch (error) {
      console.error('Error getting coordinates:', error);
      throw new Error('Failed to get coordinates: ' + error.message);
    }
  }
}

export { AstroService };