import 
{ 
    hostURL, 
    getRedeemModeListAPI, 
    createRedeemModeAPI, 
    deleteRedeemModeAPI, 
    updateRedeemModeAPI, 
    getRedeemModeDetailsAPI,
    getRedeemRequestAPI, 
    getRedeemReqDetailsAPI,
    approveRedeemRequestAPI,
    rejectRedeemRequestAPI,
} from '../app.config';
import {encryptData, decryptData} from '../utilities/encryptDecryptData'
import moment from 'moment'

var axios = require('axios');

//Function to get redeem mode list
export function getRedeemModeList(token) {

    var setting = {
        method: 'post',
        url: hostURL + getRedeemModeListAPI,
        data: {
            "platform": "web",
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
        type: 'GET_REDEEM_MODES',
        payload: response
    }
}

//Function to create new redeem mode list
export function createNewRedeemMode(values, token) {

    var ArrOptions=[];

    if(values.options !== undefined){
        values.options.forEach(element => {
            ArrOptions.push(element.optionName)
        })
    }
    
    var requestData = {
        "mode": values.modeName,
        "options": ArrOptions
    }

    var setting = {
        method: 'post',
        url: hostURL + createRedeemModeAPI,
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
        type: 'CREATE_REDEEM_MODE',
        payload: response
    }
}

export function clearCreateRedeemModeResponse() {
    return {
        type: 'CREATE_REDEEM_MODE',
        payload: undefined
    }
}

//Function to delete redeem mode by mode id
export function deleteRedeemMode(modeId, token) {

    var requestData = {
        "id": modeId
    }
    
    var setting = {
        method: 'post',
        url: hostURL + deleteRedeemModeAPI,
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
        type: 'DELETE_REDEEM_MODE',
        payload: response
    }
}

export function clearDeleteRedeemModeResponse() {
    return {
        type: 'DELETE_REDEEM_MODE',
        payload: undefined
    }
}

//Function to update redeem mode details
export function updateRedeemMode(values, token) {

    var ArrOptions=[];
    if(values.options !== undefined){
        values.options.forEach(element => {
            ArrOptions.push(element.optionName)
        })
    }

    var requestData = {
        "id":values.modeId,
        "mode": values.modeName,
        "options": ArrOptions,
        "status":values.status,
    }
    
    var setting = {
        method: 'post',
        url: hostURL + updateRedeemModeAPI,
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
        type: 'UPDATE_REDEEM_MODE',
        payload: response
    }
}

export function clearUpdateRedeemDetailsResponse() {
    return {
        type: 'UPDATE_REDEEM_MODE',
        payload: undefined
    }
}

//Function to get redeem mode details
export function getRedeemModeDetails(modeId, token) {
    var requestData = {
        "id" : modeId,
    }
    
    var setting = {
        method: 'post',
        url: hostURL + getRedeemModeDetailsAPI,
        data: {
            "platform":"web",
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
                    "modeId": responseDetails.modeId,
                    "modeName": responseDetails.mode,
                    "status": (responseDetails.status).toString(),
                    "options": 
                    responseDetails.modeOptions.map((option)=>(
                    {
                        "optionName":option.name,
                    }
                    ))
                }
            }
            return output;
        })

        .catch(response => response = {
            success: 500,
            message: "Your submission could not be completed. Please Try Again!",
            data: ""
        }
        );

    return {
        type: 'GET_REDEEM_MODE_DETAILS',
        payload: response
    }
}

export function clearGetRedeemModeDetailResponse() {
    return {
        type: 'GET_REDEEM_MODE_DETAILS',
        payload: undefined
    }
}

/******************************************************************************************/

//Function to get redemption requests
export function getRedeemRequestList(name, status, mode, fromDate, toDate ,token) {
    var requestData = {
        "name": name,
        "status": status,
        "amount": "",
        "mode": mode,
        "fromDate": (fromDate !== "") ? moment(fromDate).format('DD-MM-YYYY') : undefined,
        "toDate": (toDate !== "") ? moment(toDate).format('DD-MM-YYYY') : undefined,
    }
    
    var setting = {
        method: 'post',
        url: hostURL + getRedeemRequestAPI,
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
        type: 'GET_REDEEM_REQUESTS',
        payload: response
    }
}

//Function to get redemption request details
export function getRedeemRequestDetails(redeemId ,token) {
    var requestData = {
        "id": redeemId,
    }
    
    var setting = {
        method: 'post',
        url: hostURL + getRedeemReqDetailsAPI,
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
        type: 'GET_REDEEM_REQUEST_DETAILS',
        payload: response
    }
}

//Function to Update redemption request
export function approveRedeemRequest(redeemId, values ,token) {
    var requestData = {
        "id": redeemId.toString(),
        "amount": values.amount,
        "redeemModeId": values.modeName,
        "note": values.note
    }
    
    var setting = {
        method: 'post',
        url: hostURL + approveRedeemRequestAPI,
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
        type: 'APPROVE_REDEEM_REQUEST',
        payload: response
    }
}

export function clearApproveRedeemResponse() {
    return {
        type: 'APPROVE_REDEEM_REQUEST',
        payload: undefined
    }
}

//Function to Reject redemption request
export function rejectRedeemRequest(redeemId, values, token) {
    var requestData = {
        "id": redeemId.toString(),
        "note": values.note,
    }
    
    var setting = {
        method: 'post',
        url: hostURL + rejectRedeemRequestAPI,
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
        type: 'REJECT_REDEEM_REQUEST',
        payload: response
    }
}

export function clearRejectRedeemResponse() {
    return {
        type: 'REJECT_REDEEM_REQUEST',
        payload: undefined
    }
}