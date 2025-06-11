const astroCalculations = require('../utils/astroCalculationsNew.js');

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
        latitude: providedLat,
        longitude: providedLng,
        timezone: providedTz
      } = params;

      // Parse date and time
      const [year, month, day] = dateOfBirth.split('-').map(Number);
      const [hour, minute] = timeOfBirth.split(':').map(Number);

      // Get coordinates if not provided
      let latitude, longitude, timezone;
      if (providedLat && providedLng) {
        latitude = providedLat;
        longitude = providedLng;
        timezone = providedTz || 5.5; // Default to IST if not provided
      } else {
        // Get coordinates from place name
        const coordinates = await astroCalculations.getGeoCoordinates(placeOfBirth);
        latitude = coordinates.lat;
        longitude = coordinates.lng;
        timezone = coordinates.timezone;
      }

      // Calculate Julian Day
      const julianDay = astroCalculations.calculateJulianDay(year, month, day, hour, minute, timezone);

      // Calculate Ayanamsa (precession correction)
      const ayanamsa = astroCalculations.calculateAyanamsa(julianDay);

      // Calculate Ascendant (Lagna)
      const ascendantLongitude = astroCalculations.calculateAscendant(julianDay, latitude, longitude);
      const ascendantSidereal = (ascendantLongitude - ayanamsa + 360) % 360;
      const ascendantRashi = Math.floor(ascendantSidereal / 30);
      const ascendantDegree = ascendantSidereal % 30;

      // Calculate planetary positions
      const planets = [];
      for (let i = 0; i <= 8; i++) { // Sun to Ketu
        const planetLongitude = astroCalculations.calculatePlanetPosition(i, julianDay);
        const siderealLongitude = (planetLongitude - ayanamsa + 360) % 360;
        const rashi = Math.floor(siderealLongitude / 30);
        const degree = siderealLongitude % 30;
        const nakshatra = Math.floor(siderealLongitude * 27 / 360);
        const isRetrograde = astroCalculations.isPlanetRetrograde(i, julianDay);

        planets.push({
          id: i,
          name: astroCalculations.PLANET_NAMES[i],
          longitude: siderealLongitude,
          rashi: rashi,
          rashiName: astroCalculations.RASHIS[rashi],
          nakshatra: nakshatra,
          nakshatraName: astroCalculations.NAKSHATRAS[nakshatra],
          degree: degree,
          isRetrograde: isRetrograde
        });
      }

      // Calculate houses
      const houses = [];
      for (let i = 1; i <= 12; i++) {
        const houseCusp = (ascendantSidereal + (i - 1) * 30) % 360;
        const houseRashi = Math.floor(houseCusp / 30);
        
        houses.push({
          number: i,
          sign: astroCalculations.RASHIS[houseRashi].english,
          signLord: astroCalculations.RASHIS[houseRashi].lord,
          degree: houseCusp % 30
        });
      }

      // Return the birth chart data
      return {
        name: name,
        dateOfBirth: dateOfBirth,
        timeOfBirth: timeOfBirth,
        placeOfBirth: placeOfBirth,
        coordinates: {
          latitude: latitude,
          longitude: longitude
        },
        ascendant: {
          longitude: ascendantSidereal,
          rashi: ascendantRashi,
          rashiName: astroCalculations.RASHIS[ascendantRashi],
          degree: ascendantDegree
        },
        planets: planets,
        houses: houses
      };
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
      const birthChart = await this.generateBirthChart(params);
      
      // Implement dosha checking logic here
      // For now, return a placeholder
      return {
        mangalDosha: false,
        kaalSarpaDosha: false,
        pitruDosha: false,
        // Add more doshas as needed
        message: "Dosha analysis is a placeholder. Actual implementation pending."
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
      const birthChart = await this.generateBirthChart(params);
      
      // Implement dasha calculation logic here
      // For now, return a placeholder
      return {
        currentDasha: {
          planet: "Moon",
          startDate: "2020-01-01",
          endDate: "2030-01-01"
        },
        dashaPeriods: [
          {
            planet: "Moon",
            startDate: "2020-01-01",
            endDate: "2030-01-01",
            antardasha: []
          }
        ],
        message: "Dasha calculation is a placeholder. Actual implementation pending."
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

module.exports = { AstroService };