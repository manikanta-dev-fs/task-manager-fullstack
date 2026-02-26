const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

const getEncryptionKey = () => {
  const { ENCRYPTION_KEY } = process.env;

  if (!ENCRYPTION_KEY || Buffer.byteLength(ENCRYPTION_KEY, 'utf8') !== 32) {
    throw new Error('Invalid encryption key configuration');
  }

  return Buffer.from(ENCRYPTION_KEY, 'utf8');
};

const encrypt = (text) => {
  try {
    if (text === undefined || text === null || text === '') {
      return '';
    }

    const value = String(text);
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv);

    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
  } catch (error) {
    throw new Error('Failed to encrypt description');
  }
};

const decrypt = (encryptedText) => {
  try {
    if (encryptedText === undefined || encryptedText === null || encryptedText === '') {
      return '';
    }

    const value = String(encryptedText);
    const parts = value.split(':');

    if (parts.length !== 2) {
      return value;
    }

    const [ivHex, encryptedData] = parts;

    const isValidIv = ivHex.length === IV_LENGTH * 2 && /^[0-9a-fA-F]+$/.test(ivHex);
    const isValidEncryptedData = encryptedData.length > 0 && /^[0-9a-fA-F]+$/.test(encryptedData);

    if (!isValidIv || !isValidEncryptedData) {
      return value;
    }

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    return String(encryptedText || '');
  }
};

module.exports = {
  encrypt,
  decrypt,
};
