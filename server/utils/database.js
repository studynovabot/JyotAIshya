import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// File paths
const usersFilePath = path.join(dataDir, 'users.json');
const kundalisFilePath = path.join(dataDir, 'kundalis.json');
const horoscopesFilePath = path.join(dataDir, 'horoscopes.json');

/**
 * Read data from a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Array|Object} Data from the file
 */
const readData = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
};

/**
 * Write data to a JSON file
 * @param {string} filePath - Path to the JSON file
 * @param {Array|Object} data - Data to write
 * @returns {boolean} Whether the write was successful
 */
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing to file ${filePath}:`, error);
    return false;
  }
};

/**
 * Get all users
 * @returns {Array} Array of users
 */
export const getUsers = () => {
  return readData(usersFilePath);
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Object|null} User object or null if not found
 */
export const getUserById = (id) => {
  const users = getUsers();
  return users.find(user => user.id === id) || null;
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Object|null} User object or null if not found
 */
export const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Object} Created user
 */
export const createUser = (userData) => {
  const users = getUsers();
  
  // Generate ID
  const id = Date.now().toString();
  
  // Create user
  const user = {
    id,
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  // Add to users
  users.push(user);
  
  // Save users
  writeData(usersFilePath, users);
  
  return user;
};

/**
 * Update a user
 * @param {string} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Object|null} Updated user or null if not found
 */
export const updateUser = (id, userData) => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return null;
  }
  
  // Update user
  const updatedUser = {
    ...users[userIndex],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  // Replace user
  users[userIndex] = updatedUser;
  
  // Save users
  writeData(usersFilePath, users);
  
  return updatedUser;
};

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {boolean} Whether the user was deleted
 */
export const deleteUser = (id) => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (filteredUsers.length === users.length) {
    return false;
  }
  
  return writeData(usersFilePath, filteredUsers);
};

/**
 * Get all kundalis
 * @returns {Array} Array of kundalis
 */
export const getKundalis = () => {
  return readData(kundalisFilePath);
};

/**
 * Get kundali by ID
 * @param {string} id - Kundali ID
 * @returns {Object|null} Kundali object or null if not found
 */
export const getKundaliById = (id) => {
  const kundalis = getKundalis();
  return kundalis.find(kundali => kundali.id === id) || null;
};

/**
 * Get kundalis by user ID
 * @param {string} userId - User ID
 * @returns {Array} Array of kundalis
 */
export const getKundalisByUserId = (userId) => {
  const kundalis = getKundalis();
  return kundalis.filter(kundali => kundali.userId === userId);
};

/**
 * Create a new kundali
 * @param {Object} kundaliData - Kundali data
 * @returns {Object} Created kundali
 */
export const createKundali = (kundaliData) => {
  const kundalis = getKundalis();
  
  // Generate ID
  const id = Date.now().toString();
  
  // Create kundali
  const kundali = {
    id,
    ...kundaliData,
    createdAt: new Date().toISOString()
  };
  
  // Add to kundalis
  kundalis.push(kundali);
  
  // Save kundalis
  writeData(kundalisFilePath, kundalis);
  
  return kundali;
};

/**
 * Update a kundali
 * @param {string} id - Kundali ID
 * @param {Object} kundaliData - Kundali data to update
 * @returns {Object|null} Updated kundali or null if not found
 */
export const updateKundali = (id, kundaliData) => {
  const kundalis = getKundalis();
  const kundaliIndex = kundalis.findIndex(kundali => kundali.id === id);
  
  if (kundaliIndex === -1) {
    return null;
  }
  
  // Update kundali
  const updatedKundali = {
    ...kundalis[kundaliIndex],
    ...kundaliData,
    updatedAt: new Date().toISOString()
  };
  
  // Replace kundali
  kundalis[kundaliIndex] = updatedKundali;
  
  // Save kundalis
  writeData(kundalisFilePath, kundalis);
  
  return updatedKundali;
};

/**
 * Delete a kundali
 * @param {string} id - Kundali ID
 * @returns {boolean} Whether the kundali was deleted
 */
export const deleteKundali = (id) => {
  const kundalis = getKundalis();
  const filteredKundalis = kundalis.filter(kundali => kundali.id !== id);
  
  if (filteredKundalis.length === kundalis.length) {
    return false;
  }
  
  return writeData(kundalisFilePath, filteredKundalis);
};