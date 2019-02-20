import { hostURL, addNewDealAPI, getDealsFilterAPI, deleteDealAPI, getDealDetailsAPI, updateDealAPI, getCitiesAPI } from '../app.config';
import moment from 'moment'
import {normalizedNumber} from '../utilities/validation'
import {encryptData, decryptData} from '../utilities/encryptDecryptData'

var axios = require('axios');

//Function to add new deal to processing system
export function addNewDeal(values, latitude, longitude, token) {
    var requestData = {
        "merchantId": values.merchantId, 
        "startDate": values.fromDate === undefined ? undefined : moment(values.fromDate).format('YYYY-MM-DD'),
        "endDate": values.toDate === undefined ? undefined : moment(values.toDate).format('YYYY-MM-DD'),
        "cashBonus": (values.cashBonus === undefined || values.cashBonus === null || values.cashBonus === '') ? undefined : (values.cashBonus).replace(normalizedNumber,''),
        "location": values.location,
        "status": values.status,
        "shortDescription": "Deal New",
        "longDescription": "New Deal",
        "latitude":latitude,
        "longitude":longitude,
        "storeLocation": values.storeLocation,
    }

    var setting = {
        method: 'post',
        url: hostURL + addNewDealAPI,
        data: {
            "platform": "web", 
	        "requestData":encryptData(requestData)
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
        type: 'ADD_DEAL',
        payload: response
    }
}

//Function to fetch list of all Deals based on various filter option.
export function getDealsListWithFilter(name, inactive, statePrefix, fromDate, toDate, token) {
    var requestData = {
        "merchantName" : name === undefined ? "" : name,
        "status" : inactive === undefined ? "" : inactive,
        "location": statePrefix === undefined ? "" : statePrefix,
        "fromDate" : fromDate === undefined ? "" : fromDate,
        "toDate" : toDate === undefined ? "" : toDate,
        "pageNumber" : "0",
        "pageSize" : "0"
    }

    var setting = {
        method: 'post',
        url: hostURL + getDealsFilterAPI,
        data: {
            "platform": 'Web',
	        "requestData":encryptData(requestData)
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
        type: 'GET_DEALS',
        payload: response
    }
}

//Function to delete deal for selected Id
export function deleteDeal(dealId,token) {
    var requestData = {
        "id" : dealId,
    }

    var setting = {
        method: 'post',
        url: hostURL + deleteDealAPI,
        data: {
            "platform": 'Web',
	        "requestData":encryptData(requestData)
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
        type: 'DELETE_DEAL',
        payload: response
    }
}

//Function to get deal details
export function getDealDetails(dealId,token) {
    var requestData = {
        "id" : dealId,
    }

    var setting = {
        method: 'post',
        url: hostURL + getDealDetailsAPI,
        data: {
            "platform": 'Web',
	        "requestData":encryptData(requestData)
	    },
        headers: {
            'content-type': 'application/json',
            'auth' : token
        }
    }

    var response = axios(setting).then(
        response => 
        {
            response.data.responseData = decryptData(response.data.responseData)
            var responseDetails = response.data.responseData
            var output ={
                "message": response.data.message,
                "status":response.data.status,
                "responseData":{
                    "merchantId": responseDetails.merchantId,
                    "id": responseDetails.id,
                    "entityName": responseDetails.entityName,
                    "shortDescription": responseDetails.shortDescription,
                    "longDescription": responseDetails.longDescription,
                    "startDate": (responseDetails.startDate !== null ) ? moment(responseDetails.startDate).format('YYYY-MM-DD') : undefined ,
                    "endDate": (responseDetails.endDate !== null ) ? moment(responseDetails.endDate).format('YYYY-MM-DD') : undefined ,
                    "status": (responseDetails.status).toString(),
                    "location":responseDetails.location, 
                    "cashBonus":(responseDetails.cashBonus).toString(),
                    "storeLocation":responseDetails.storeLocation   
                }
            }

            return output;
        }
        )

        .catch(response => response = {
            success: 500,
            message: "Your submission could not be completed. Please Try Again!",
            data: ""
        }
        );

    return {
        type: 'GET_DEAL_DETAILS',
        payload: response
    }
}


//Function to update deal details
export function updateDeal(values,token) {
    var requestData = {
        "id":values.id,
        "shortDescription": "",
        "longDescription": "",
        "startDate": values.startDate === undefined ? undefined : moment(values.startDate).format('YYYY-MM-DD'),
        "endDate": values.endDate === undefined ? undefined : moment(values.endDate).format('YYYY-MM-DD'),
        "cashBonus": (values.cashBonus === undefined || values.cashBonus === null || values.cashBonus === '') ? undefined : (values.cashBonus).replace(normalizedNumber,''),
        "location": values.location,
        "status" : values.status,
    }

    var setting = {
        method: 'post',
        url: hostURL + updateDealAPI,
        data: {
            "platform": 'Web',
	        "requestData":encryptData(requestData)
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
        type: 'UPDATE_DEAL',
        payload: response
    }
}


//Function to get cities list from nouvo server
export function getCitiesList(token) {

    var setting = {
        method: 'post',
        url: hostURL + getCitiesAPI,
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

