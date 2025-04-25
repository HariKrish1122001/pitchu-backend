const CryptoJS = require("crypto-js");
require("dotenv").config();
// const passphrase = process.env.SECRET_KEY;

// if (!passphrase) {
//   throw new Error("SECRET_KEY is missing in environment variables");
// }

const encryptData = (data) => {
  try {
    if (!data) {
      throw new Error("No data provided for encryption");
    }
    return CryptoJS.AES.encrypt(JSON.stringify(data), process.env.SECRET_KEY).toString();
  } catch (error) {
   
      throw new Error("errr encryption",data);
    
  }
 
};

const decryptData = (encryptedData) => {
  try {
    if (!encryptedData && process.env.SECRET_KEY) {
    return   console.log("No encrypted data provided for decryption");
    }
    
    const bytes = CryptoJS.AES.decrypt(encryptedData, process.env.SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  
    if (!decryptedText) {
      return   console.log("Decryption failed. Invalid data or wrong key.");
    }
    
    return JSON.parse(decryptedText);
  } catch (error) {
    console.error("Decryption error:", error.message, "Data:", encryptedData);
    throw new Error("Decryption failed.");
  }
};

module.exports = { encryptData, decryptData };
