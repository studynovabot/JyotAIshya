// Simple in-memory storage for kundali data
// This is a temporary solution until we implement proper database integration
// Note: This will reset on each serverless function cold start

let kundaliStorage = new Map();

/**
 * Store kundali data
 * @param {string} id - Kundali ID
 * @param {Object} data - Kundali data
 */
function storeKundali(id, data) {
  kundaliStorage.set(id, {
    ...data,
    id,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  console.log(`📦 Stored kundali with ID: ${id}`);
}

/**
 * Retrieve kundali data
 * @param {string} id - Kundali ID
 * @returns {Object|null} - Kundali data or null if not found
 */
function getKundali(id) {
  const data = kundaliStorage.get(id);
  console.log(`🔍 Retrieved kundali with ID: ${id}, found: ${!!data}`);
  return data || null;
}

/**
 * Update kundali data
 * @param {string} id - Kundali ID
 * @param {Object} updateData - Data to update
 * @returns {Object|null} - Updated kundali data or null if not found
 */
function updateKundali(id, updateData) {
  const existing = kundaliStorage.get(id);
  if (!existing) {
    console.log(`❌ Kundali with ID ${id} not found for update`);
    return null;
  }

  const updated = {
    ...existing,
    ...updateData,
    id,
    updatedAt: new Date()
  };

  kundaliStorage.set(id, updated);
  console.log(`✏️ Updated kundali with ID: ${id}`);
  return updated;
}

/**
 * Delete kundali data
 * @param {string} id - Kundali ID
 * @returns {boolean} - True if deleted, false if not found
 */
function deleteKundali(id) {
  const deleted = kundaliStorage.delete(id);
  console.log(`🗑️ Deleted kundali with ID: ${id}, success: ${deleted}`);
  return deleted;
}

/**
 * Get all kundali IDs (for debugging)
 * @returns {Array} - Array of all kundali IDs
 */
function getAllKundaliIds() {
  return Array.from(kundaliStorage.keys());
}

/**
 * Get storage stats (for debugging)
 * @returns {Object} - Storage statistics
 */
function getStorageStats() {
  return {
    totalKundalis: kundaliStorage.size,
    ids: getAllKundaliIds()
  };
}

module.exports = {
  storeKundali,
  getKundali,
  updateKundali,
  deleteKundali,
  getAllKundaliIds,
  getStorageStats
};
