// Shared storage module for kundali data
// This provides a simple way to share data between serverless functions

// Global storage map
global.kundaliStorage = global.kundaliStorage || new Map();

/**
 * Store kundali data
 * @param {string} id - Kundali ID
 * @param {Object} data - Kundali data
 */
function storeKundali(id, data) {
  global.kundaliStorage.set(id, {
    ...data,
    id,
    storedAt: new Date(),
    lastAccessed: new Date()
  });
  console.log(`📦 Stored kundali with ID: ${id}`);
  console.log(`📊 Total kundalis in storage: ${global.kundaliStorage.size}`);
}

/**
 * Retrieve kundali data
 * @param {string} id - Kundali ID
 * @returns {Object|null} - Kundali data or null if not found
 */
function getKundali(id) {
  const data = global.kundaliStorage.get(id);
  if (data) {
    // Update last accessed time
    data.lastAccessed = new Date();
    global.kundaliStorage.set(id, data);
    console.log(`🔍 Retrieved kundali with ID: ${id}`);
  } else {
    console.log(`❌ Kundali with ID ${id} not found`);
    console.log(`📊 Available IDs: ${Array.from(global.kundaliStorage.keys()).join(', ')}`);
  }
  return data || null;
}

/**
 * Update kundali data
 * @param {string} id - Kundali ID
 * @param {Object} updateData - Data to update
 * @returns {Object|null} - Updated kundali data or null if not found
 */
function updateKundali(id, updateData) {
  const existing = global.kundaliStorage.get(id);
  if (!existing) {
    console.log(`❌ Kundali with ID ${id} not found for update`);
    return null;
  }

  const updated = {
    ...existing,
    ...updateData,
    id,
    updatedAt: new Date(),
    lastAccessed: new Date()
  };

  global.kundaliStorage.set(id, updated);
  console.log(`✏️ Updated kundali with ID: ${id}`);
  return updated;
}

/**
 * Delete kundali data
 * @param {string} id - Kundali ID
 * @returns {boolean} - True if deleted, false if not found
 */
function deleteKundali(id) {
  const deleted = global.kundaliStorage.delete(id);
  console.log(`🗑️ Deleted kundali with ID: ${id}, success: ${deleted}`);
  return deleted;
}

/**
 * Get all kundali IDs
 * @returns {Array} - Array of all kundali IDs
 */
function getAllKundaliIds() {
  return Array.from(global.kundaliStorage.keys());
}

/**
 * Get storage stats
 * @returns {Object} - Storage statistics
 */
function getStorageStats() {
  return {
    totalKundalis: global.kundaliStorage.size,
    ids: getAllKundaliIds(),
    lastUpdated: new Date()
  };
}

/**
 * Clean up old kundalis (older than 24 hours)
 */
function cleanupOldKundalis() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  let cleaned = 0;
  
  for (const [id, data] of global.kundaliStorage.entries()) {
    if (data.lastAccessed < oneDayAgo) {
      global.kundaliStorage.delete(id);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned up ${cleaned} old kundalis`);
  }
  
  return cleaned;
}

module.exports = {
  storeKundali,
  getKundali,
  updateKundali,
  deleteKundali,
  getAllKundaliIds,
  getStorageStats,
  cleanupOldKundalis
};
