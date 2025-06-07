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

// File paths for different data types
const usersFilePath = path.join(dataDir, 'users.json');
const kundalisFilePath = path.join(dataDir, 'kundalis.json');

// Initialize data files if they don't exist
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2));
}

if (!fs.existsSync(kundalisFilePath)) {
  fs.writeFileSync(kundalisFilePath, JSON.stringify([], null, 2));
}

/**
 * Read data from a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Array|Object} Data from the file
 */
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error);
    return [];
  }
};

/**
 * Write data to a JSON file
 * @param {string} filePath - Path to the JSON file
 * @param {Array|Object} data - Data to write
 * @returns {boolean} Success status
 */
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error);
    return false;
  }
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// User-related functions

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
  
  // Check if user with this email already exists
  if (getUserByEmail(userData.email)) {
    throw new Error('User with this email already exists');
  }
  
  const newUser = {
    id: generateId(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  writeData(usersFilePath, users);
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Object|null} Updated user or null if not found
 */
export const updateUser = (id, userData) => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Don't allow changing the ID
  delete userData.id;
  
  const updatedUser = {
    ...users[index],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  users[index] = updatedUser;
  writeData(usersFilePath, users);
  
  // Return user without password
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean} Success status
 */
export const deleteUser = (id) => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (filteredUsers.length === users.length) {
    return false;
  }
  
  return writeData(usersFilePath, filteredUsers);
};

// Kundali-related functions

/**
 * Get all kundalis
 * @returns {Array} Array of kundalis
 */
export const getKundalis = () => {
  return readData(kundalisFilePath);
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
 * Get kundali by ID
 * @param {string} id - Kundali ID
 * @returns {Object|null} Kundali object or null if not found
 */
export const getKundaliById = (id) => {
  const kundalis = getKundalis();
  return kundalis.find(kundali => kundali.id === id) || null;
};

/**
 * Save kundali
 * @param {Object} kundaliData - Kundali data
 * @returns {Object} Saved kundali
 */
export const saveKundali = (kundaliData) => {
  const kundalis = getKundalis();
  
  const newKundali = {
    id: generateId(),
    ...kundaliData,
    createdAt: new Date().toISOString()
  };
  
  kundalis.push(newKundali);
  writeData(kundalisFilePath, kundalis);
  
  return newKundali;
};

/**
 * Update kundali
 * @param {string} id - Kundali ID
 * @param {Object} kundaliData - Kundali data to update
 * @returns {Object|null} Updated kundali or null if not found
 */
export const updateKundali = (id, kundaliData) => {
  const kundalis = getKundalis();
  const index = kundalis.findIndex(kundali => kundali.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Don't allow changing the ID
  delete kundaliData.id;
  
  const updatedKundali = {
    ...kundalis[index],
    ...kundaliData,
    updatedAt: new Date().toISOString()
  };
  
  kundalis[index] = updatedKundali;
  writeData(kundalisFilePath, kundalis);
  
  return updatedKundali;
};

/**
 * Delete kundali
 * @param {string} id - Kundali ID
 * @returns {boolean} Success status
 */
export const deleteKundali = (id) => {
  const kundalis = getKundalis();
  const filteredKundalis = kundalis.filter(kundali => kundali.id !== id);
  
  if (filteredKundalis.length === kundalis.length) {
    return false;
  }
  
  return writeData(kundalisFilePath, filteredKundalis);
};import fs from 'fs';
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

// File paths for different data types
const usersFilePath = path.join(dataDir, 'users.json');
const kundalisFilePath = path.join(dataDir, 'kundalis.json');

// Initialize data files if they don't exist
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2));
}

if (!fs.existsSync(kundalisFilePath)) {
  fs.writeFileSync(kundalisFilePath, JSON.stringify([], null, 2));
}

/**
 * Read data from a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Array|Object} Data from the file
 */
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error);
    return [];
  }
};

/**
 * Write data to a JSON file
 * @param {string} filePath - Path to the JSON file
 * @param {Array|Object} data - Data to write
 * @returns {boolean} Success status
 */
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error);
    return false;
  }
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// User-related functions

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
  
  // Check if user with this email already exists
  if (getUserByEmail(userData.email)) {
    throw new Error('User with this email already exists');
  }
  
  const newUser = {
    id: generateId(),
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  writeData(usersFilePath, users);
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * Update user
 * @param {string} id - User ID
 * @param {Object} userData - User data to update
 * @returns {Object|null} Updated user or null if not found
 */
export const updateUser = (id, userData) => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Don't allow changing the ID
  delete userData.id;
  
  const updatedUser = {
    ...users[index],
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  users[index] = updatedUser;
  writeData(usersFilePath, users);
  
  // Return user without password
  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean} Success status
 */
export const deleteUser = (id) => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (filteredUsers.length === users.length) {
    return false;
  }
  
  return writeData(usersFilePath, filteredUsers);
};

// Kundali-related functions

/**
 * Get all kundalis
 * @returns {Array} Array of kundalis
 */
export const getKundalis = () => {
  return readData(kundalisFilePath);
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
 * Get kundali by ID
 * @param {string} id - Kundali ID
 * @returns {Object|null} Kundali object or null if not found
 */
export const getKundaliById = (id) => {
  const kundalis = getKundalis();
  return kundalis.find(kundali => kundali.id === id) || null;
};

/**
 * Save kundali
 * @param {Object} kundaliData - Kundali data
 * @returns {Object} Saved kundali
 */
export const saveKundali = (kundaliData) => {
  const kundalis = getKundalis();
  
  const newKundali = {
    id: generateId(),
    ...kundaliData,
    createdAt: new Date().toISOString()
  };
  
  kundalis.push(newKundali);
  writeData(kundalisFilePath, kundalis);
  
  return newKundali;
};

/**
 * Update kundali
 * @param {string} id - Kundali ID
 * @param {Object} kundaliData - Kundali data to update
 * @returns {Object|null} Updated kundali or null if not found
 */
export const updateKundali = (id, kundaliData) => {
  const kundalis = getKundalis();
  const index = kundalis.findIndex(kundali => kundali.id === id);
  
  if (index === -1) {
    return null;
  }
  
  // Don't allow changing the ID
  delete kundaliData.id;
  
  const updatedKundali = {
    ...kundalis[index],
    ...kundaliData,
    updatedAt: new Date().toISOString()
  };
  
  kundalis[index] = updatedKundali;
  writeData(kundalisFilePath, kundalis);
  
  return updatedKundali;
};

/**
 * Delete kundali
 * @param {string} id - Kundali ID
 * @returns {boolean} Success status
 */
export const deleteKundali = (id) => {
  const kundalis = getKundalis();
  const filteredKundalis = kundalis.filter(kundali => kundali.id !== id);
  
  if (filteredKundalis.length === kundalis.length) {
    return false;
  }
  
  return writeData(kundalisFilePath, filteredKundalis);
};