import { secretKey } from '../app.config';

const CryptoJS = require("crypto-js");

export const LoadState = () => {
    try {
        const bytes  = CryptoJS.AES.decrypt(localStorage.getItem('state') ? localStorage.getItem('state').toString() : "", secretKey);
        const serializedState =  JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        if (serializedState === null) {
            return undefined;
        }
        return serializedState;
    }
    catch (err) {
        console.log('Error while Load state' + err)
        return undefined;
    }
}

export const SaveState = (state) => {

    try {
        const serializedState = JSON.stringify(state);
        var ciphertext = CryptoJS.AES.encrypt(serializedState, secretKey);
        localStorage.setItem('state', ciphertext);
    }
    catch (err) {
        console.log('Error while saving state' + err)
        //todo: Logs
    }
}



