import 
{ 
    hostURL, 
    validateUserAPI, 
    registerUserAPI, 
    resendMailAPI, 
    activateAccountAPI, 
    userProfileAPI, 
    forgotPasswordAPI, 
    setPasswordAPI,
    updateUserProfileAPI, 
    userLogoutAPI,
} from '../app.config';

import {encryptData, decryptData} from '../utilities/encryptDecryptData'

var axios = require('axios');

//To Validate and authenticate user for login
export function validateUser(values) {

    var requestData = {
        "emailId": values.username,
        "password": values.password
    }

    var setting = {
        method: 'post',
        url: hostURL + validateUserAPI,
        data: {
            "platform": 'Web',
	        "requestData":encryptData(requestData) 
	    },
        headers: {
            'content-type': 'application/json'
        }
    }

    var response = axios(setting).then(

        response => {
            response.data.responseData = decryptData(response.data.responseData)
            response.data.rememberme = values.rememberMe === undefined ? false : values.rememberMe
            return response.data;
        }
    )
        .catch(response => response = {
            success: 500,
            message: "Your submission could not be completed. Please Try Again!",
            data: ""
        }
        );

    return {
        type: 'VALIDATE_USER',
        payload: response
    }
}

export function clearValidateUserResponse() {
    return {
        type: 'VALIDATE_USER',
        payload: undefined
    }
}


//To register merchant for dashboard access
export function registerUser(values) {

    var requestData = {
        "fullName": values.fullName,
        "emailId": values.emailId,
        "password": values.password,
        "roleId":3
    }

    var setting = {
        method: 'post',
        url: hostURL + registerUserAPI,
        data: {
            "platform": 'Web',
	        "requestData":encryptData(requestData)
	    },
        headers: {
            'content-type': 'application/json'
        }
    }

    var response = axios(setting).then(
        response => {
            response.data.responseData = decryptData(response.data.responseData)
            return response.data
        }
    )
        .catch(response => response = {
            success: 500,
            message: "Your submission could not be completed. Please Try Again!",
            data: ""
        }
        );

    return {
        type: 'REGISTER_USER',
        payload: response
    }
}

export function clearRegisterUserState() {
    return {
        type: 'REGISTER_USER',
        payload: undefined
    }
}

//Function to resend verification mail for user activation
export function resendVerificationMail(emailId) {

    var requestData = {
        "emailId": emailId,
    }

    var setting = {
        method: 'post',
        url: hostURL + resendMailAPI,
        data: {
            "platform": 'Web',
	        "requestData":encryptData(requestData)
	    },
        headers: {
            'content-type': 'application/json'
        }
    }

    var response = axios(setting).then(
        response => {
            response.data.responseData = decryptData(response.data.responseData)
            return response.data
        }
    )
        .catch(response => response = {
            success: 500,
            message: "Your submission could not be completed. Please Try Again!",
            data: ""
        }
        );

    return {
        type: 'RESEND_EMAIL',
        payload: response
    }
}

export function clearResendMailResponse() {
    return {
        type: 'RESEND_EMAIL',
        payload: undefined
    }
}

//Function to Activate user account
export function activateUserAccount(token) {

    var requestData = {
        "activateToken": token
    }

    var setting = {
        method: 'post',
        url: hostURL + activateAccountAPI,
        data: {
            "platform": 'Web',
	        "requestData":encryptData(requestData)
	    },
        headers: {
            'content-type': 'application/json',
        }
    }

    var response = axios(setting).then(
        response => {
            response.data.responseData = decryptData(response.data.responseData)
            return response.data
        }
    )
        .catch(response => response = {
            success: 500,
            message: "Your submission could not be completed. Please Try Again!",
            data: ""
        }
        );

    return {
        type: 'ACTIVATE_USER',
        payload: response
    }
}

//Function to fetch user details
export function getUserProfile(token) {

    var setting = {
        method: 'post',
        url: hostURL + userProfileAPI,
        data: {
            "platform": 'Web',
	    },
        headers: {
            'content-type': 'application/json',
            'auth' : token
        }
    }

    var response = axios(setting).then(
        response => {
            response.data.responseData = decryptData(response.data.responseData)
            return response.data
        }
    )
        .catch(response => response = {
            success: 500,
            message: "Your submission could not be completed. Please Try Again!",
            data: ""
        }
        );

    return {
        type: 'GET_USERPROFILE',
        payload: response
    }
}

//Function to send mail for forgot password feature
export function forgotPassword(emailId) {

    var requestData = {
		"emailId": emailId,
    }

    var setting = {
        method: 'post',
        url: hostURL + forgotPasswordAPI,
        data: {
            "platform": 'Web',
	        "requestData":encryptData(requestData)
	    },
        headers: {
            'content-type': 'application/json'
        }
    }

    var response = axios(setting).then(
        response => {
            response.data.responseData = decryptData(response.data.responseData)
            return response.data
        }
    )
        .catch(response => response = {
            success: 500,
            message: "Your submission could not be completed. Please Try Again!",
            data: ""
        }
        );

    return {
        type: 'FORGOT_PASSWORD',
        payload: response
    }
}

//Function to send mail for forgot password feature
export function resetPassword(password, token) {

    var requestData = {
        "resetToken": token,
        "password": password,
    }

    var setting = {
        method: 'post',
        url: hostURL + setPasswordAPI,
        data: {
            "platform": 'Web',
	        "requestData":encryptData(requestData)
	    },
        headers: {
            'content-type': 'application/json'
        }
    }

    var response = axios(setting).then(
        response => {
            response.data.responseData = decryptData(response.data.responseData)
            return response.data
        }
    )
        .catch(response => response = {
            success: 500,
            message: "Your submission could not be completed. Please Try Again!",
            data: ""
        }
        );

    return {
        type: 'SET_PASSWORD',
        payload: response
    }
}

export function clearsetPasswordResponse() {
    return {
        type: 'SET_PASSWORD',
        payload: undefined
    }
}

export const AuthError = ()=>{
    return {
        type:'AUTH_ERROR',
        payload:true
    }
}

//To clear local storage and return empty object
export function logout() {
    localStorage.clear();
    return {
        type: 'LOGOUT',
        payload: undefined
    }
}

//Function to update user profile
export function updateUserProfile(values, token) {

    var requestData = {
        "fullName": values.fullName,
        "password": values.newPassword
    }

    var setting = {
        method: 'post',
        url: hostURL + updateUserProfileAPI,
        data: {
            "platform": 'Web',
            "requestData": encryptData(requestData)
	    },
        headers: {
            'content-type': 'application/json',
            'auth' : token
        }
    }

    var response = axios(setting).then(
        response => {
            response.data.responseData = decryptData(response.data.responseData)
            return response.data
        }
    )
        .catch(response => response = {
            success: 500,
            message: "Your submission could not be completed. Please Try Again!",
            data: ""
        }
        );

    return {
        type: 'UPDATE_USER_PROFILE',
        payload: response
    }
}

export function clearUpdateProfileResponse() {
    return {
        type: 'UPDATE_USER_PROFILE',
        payload: undefined
    }
}

//Function to logout user which will expires token
export function userLogout(token) {

    var setting = {
        method: 'post',
        url: hostURL + userLogoutAPI,
        data: {
            "platform": 'Web',
	    },
        headers: {
            'content-type': 'application/json',
            'auth' : token
        }
    }

    var response = axios(setting).then(
        response => {
            response.data.responseData = decryptData(response.data.responseData)
            return response.data
        }
    )

        .catch(response => response = {
            success: 500,
            message: "Your submission could not be completed. Please Try Again!",
            data: ""
        }
        );

    return {
        type: 'GET_CITIES',
        payload: response
    }
}

