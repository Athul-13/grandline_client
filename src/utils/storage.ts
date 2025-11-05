import CryptoJS from 'crypto-js';

/**
 * Encryption key for localStorage data
 */
const ENCRYPTION_KEY =
  import.meta.env.VITE_ENCRYPTION_KEY || 'grandline-app-secret-key-2024';

/**
 * Encrypts data before storing in localStorage
 */
export const encryptData = (data: string): string => {
  try {
    return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return data;
  }
};

/**
 * Decrypts data retrieved from localStorage
 */
export const decryptData = (encrypted: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    // If decryption fails, bytes.toString() returns empty string
    if (!decrypted) {
      throw new Error('Decryption failed - invalid data');
    }
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Securely stores data in localStorage with encryption
 */
export const setEncryptedItem = <T>(key: string, data: T): void => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = encryptData(jsonString);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    throw error;
  }
};

/**
 * Securely retrieves and decrypts data from localStorage
 */
export const getEncryptedItem = <T>(key: string): T | null => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) {
      return null;
    }

    const decrypted = decryptData(encrypted);
    return JSON.parse(decrypted) as T;
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    localStorage.removeItem(key);
    return null;
  }
};

/**
 * Removes encrypted item from localStorage
 */
export const removeEncryptedItem = (key: string): void => {
  localStorage.removeItem(key);
};

