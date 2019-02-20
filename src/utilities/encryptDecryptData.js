import {secretKeyDataEncryption} from '../app.config'

const CryptoJS = require('crypto-js')

// method to encrypt data(password)
export function encryptData(plainText) {
    var data = JSON.stringify(plainText);
    var encrypted = CryptoJS.AES.encrypt(data,secretKeyDataEncryption);
    var encryptedText = encrypted.toString();
    return encryptedText;
}

// method to decrypt data
export function decryptData(encryptedText) {
    var encrypted = CryptoJS.AES.decrypt(encryptedText, secretKeyDataEncryption);
    var plainText = encrypted.toString(CryptoJS.enc.Utf8);
    if (plainText === "")
        return undefined;
    else {
        var data = JSON.parse(plainText);
        return data;
    }
}