import { hostURL, addMerchantAPI, deleteMerchantAPI, getMerchantsFilterAPI, getMerchantDetailAPI, updateMerchantDetailAPI } from '../app.config';
import {normalizedPhone, normalizedNumber} from '../utilities/validation'
import {encryptData, decryptData} from '../utilities/encryptDecryptData'
import moment from 'moment'

var axios = require('axios');

//Function to add new merchant to processing system
export function addNewMerchant(values, registeredEmail, merchantLogo, token) {

    var acceptanceDateTime = moment().format('YYYYMMDDHHMM')
    var requestData = {
        "new": values.isCreditCardYes ? "0" : "1",
        "established": (values.businessPeriod === undefined || values.businessPeriod === null || values.businessPeriod === "") ? undefined : (values.businessPeriod).replace(normalizedPhone,''),
        "annualCCSales": (values.ccSale === undefined || values.ccSale === null || values.ccSale === '') ? undefined : (values.ccSale).replace(normalizedNumber,''),
        "mcc": values.mccNumber,
        "dba": values.dba,
        "status": "1",
        "entityType": values.businessType,
        "entityName": values.businessName === undefined ? (values.owners[0].ownerFirstName + ' ' + values.owners[0].ownerLastName) : values.businessName,
        "entityEnvironment":values.merchantType,
        "entityAddress1": values.businessAddress,
        "entityAddress2":values.businessAddress2,
        "entityCity": values.businessCity,
        "entityState": values.businessStateName,
        "entityZip": (values.businessZip === undefined || values.businessZip === null || values.businessZip === '') ? undefined : (values.businessZip).replace(normalizedPhone,''),
        "entityCountry": "USA",
        "entityPhone": (values.businessPhone === undefined || values.businessPhone === null || values.businessPhone === '') ? undefined : (values.businessPhone).replace(normalizedPhone,''),
        "entityCustomerPhone":(values.servicePhone === undefined || values.servicePhone === null || values.servicePhone === '') ? undefined : (values.servicePhone).replace(normalizedPhone,''),
        "entityFax": (values.businessFax === undefined || values.businessFax === null || values.businessFax === '') ? undefined : (values.businessFax).replace(normalizedPhone,''),
        "entityEmail": values.businessEmail,
        "entityEin": (values.taxId === undefined || values.taxId === null || values.taxId === '') ? undefined : (values.taxId).replace(normalizedPhone,''),
        "entityPublic": values.publicCompany,
        "entityWebsite": values.businessWebsite,
        "registeredWithNouvo": registeredEmail !== undefined ? true : false,
        "registeredEmail": registeredEmail !== undefined ? registeredEmail : undefined,
        "image":merchantLogo,
        "entityaccounts": [{
            "primary": "1",
            "accountMethod": values.bankAccountType,
            "accountNumber": values.accountNumber,
            "accountRouting": values.routeNumber
        }],

        "entityTcAcceptDate": acceptanceDateTime,
        "entityTcAcceptIp":values.ipAddress,

        "members": 
            values.owners.map((owner,index)=>(
            {
                "title": owner.ownerBusinessTitle,
                "first": owner.ownerFirstName,
                "last": owner.ownerLastName,
                "dob": (owner.ownerDob === undefined || owner.ownerDob === null || owner.ownerDob === '') ? undefined : (owner.ownerDob).replace(normalizedPhone,''),
                "ownership": values.businessType !== "0" ? (parseFloat(owner.ownership)) * 100 : (parseFloat("100")) * 100,
                "email":owner.ownerEmail,
                "ssn":(owner.ownerSsn === undefined || owner.ownerSsn === null || owner.ownerSsn === '') ? undefined : (owner.ownerSsn).replace(normalizedPhone,''),
                "address1":owner.ownerAddress,
                "address2":owner.ownerAddress2,
                "city":owner.ownerCity,	
                "state":owner.ownerState,
                "zip":(owner.ownerZip === undefined || owner.ownerZip === null || owner.ownerZip === '') ? undefined : (owner.ownerZip).replace(normalizedPhone,''),
                "country":"USA",
                "timezone":"est",
                "dl":owner.ownerDrivingLicense,
                "dlstate":owner.ownerDlState,
                "primary":index === 0 ? "1" : "0",
                "phone":(owner.ownerPhone === undefined || owner.ownerPhone === null || owner.ownerPhone === '') ? undefined : (owner.ownerPhone).replace(normalizedPhone,''),
            }
            ))
    }
    
    var setting = {
        method: 'post',
        url: hostURL + addMerchantAPI,
        data: {
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
        type: 'ONBOARD_MERCHANT',
        payload: response
    }
}

export function ClearMerchantState() {
    return {
        type: 'ONBOARD_MERCHANT',
        payload: undefined
    }
}

export function clearMerchantUpdateState() {
    return {
        type: 'UPDATE_MERCHANTDETAILS',
        payload: undefined
    }
}


//Function to delete merchant from splash payment system
export function deleteMerchant(merchantId, inactive, token) {
    var requestData = {
        "merchantId" : merchantId,
        "inactive" : inactive === true ? "1" : "0"
    }
    
    var setting = {
        method: 'post',
        url: hostURL + deleteMerchantAPI,
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
        type: 'DELETE_MERCHANT',
        payload: response
    }
}

//Function to fetch list of all merchants from splash payment system
export function getMerchantListWithFilter(userId ,name, inactive, statePrefix, token) {
    var requestData = {
        "userId" : userId !== undefined ? userId.toString() : userId,
        "nameFilter" : name === undefined ? "" : name,
        "inactiveFilter" : inactive === undefined ? "" : inactive,
        "stateFilter": statePrefix === undefined ? "" : statePrefix
    }
    
    var setting = {
        method: 'post',
        url: hostURL + getMerchantsFilterAPI,
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
        type: 'GET_MERCHANTS',
        payload: response
    }
}

//Function to get merchant details from splash payment system
export function getMerchantDetailsAPI(merchantId,token) {
    var requestData = {
        "merchantId" : merchantId,
    }

    var setting = {
        method: 'post',
        url: hostURL + getMerchantDetailAPI,
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
                    "businessType": responseDetails.type_v,
                    "isPublicCompany": responseDetails.public_v,
                    "businessName": responseDetails.name_v,
                    "dba": responseDetails.dba_v,
                    "taxId": responseDetails.ein_v,
                    "servicePhone": responseDetails.customerPhone_v,
                    "businessPeriod":(responseDetails.established_v !== null) ?  moment(responseDetails.established_v).format('YYYY-MM-DD') : undefined ,  
                    "businessWebsite": responseDetails.website_v,
                    "isCreditCardYes": responseDetails.new_v === "1" ? false: true,
                    "ccSale":responseDetails.annualCCSales_v,    
                    "businessPhone": responseDetails.phone_v,   
                    "businessFax": responseDetails.fax_v,
                    "businessAddress":responseDetails.address1_v,
                    "businessAddress2":responseDetails.address2_v,
                    "businessCity":responseDetails.city_v,
                    "businessZip":responseDetails.zip_v,
                    "businessEmail":responseDetails.email_v,
                    "businessStateName":responseDetails.state_v,
                    "boardingStatus":responseDetails.status_v === "0" ? responseDetails.status_v : "2",
                    "mccNumber":responseDetails.mcc_v,
                    "merchantType":responseDetails.environment_v,
                    "acceptanceDate":(responseDetails.tcAcceptDate_v !== null ) ? moment((responseDetails.tcAcceptDate_v).substring(0,8)).format('YYYY-MM-DD') : undefined ,
                    "ipAddress":responseDetails.tcAcceptIp_v,
                    "acceptanceTime":(responseDetails.tcAcceptDate_v !== null ) ?  moment((responseDetails.tcAcceptDate_v).substring(9,12)).format('HH:MM') : undefined,
                    "bankAccountType":responseDetails.accounts.account_v.method.toString(),
                    "routeNumber":responseDetails.accounts.account_v.routing,
                    "accountNumber":responseDetails.accounts.account_v.number,
                    "entityId": responseDetails.entityId_v,
                    "accountId": responseDetails.accounts.id,
                    "merchantId":responseDetails.id,
                    "termsCheckedYes":responseDetails.status_v === "0" ? false : true,
                    "merchantLogo":responseDetails.logoUrl === undefined ? "" : responseDetails.logoUrl,
                    "members": 
                    responseDetails.members.map((owner)=>(
                    {
                        "memberId":owner.id,
                        "merchantId":owner.merchant_v,
                        "ownerBusinessTitle": owner.title_v,
                        "ownerFirstName": owner.first_v,
                        "ownerLastName": owner.last_v,
                        "ownerDob": owner.dob_v === undefined ? undefined : moment((owner.dob_v).replace(normalizedPhone,'')).format('YYYY-MM-DD'),
                        "ownership": (owner.ownership_v/100).toString(),
                        "ownerEmail":owner.email_v,
                        "ownerSsn":owner.ssn_v === undefined ? undefined : (owner.ssn_v).replace(normalizedPhone,''),
                        "ownerAddress":owner.address1_v,
                        "ownerAddress2":owner.address2_v,
                        "ownerCity":owner.city_v,	
                        "ownerState":owner.state_v,
                        "ownerZip":owner.zip_v === undefined ? undefined : (owner.zip_v).replace(normalizedPhone,''),
                        "ownerDrivingLicense":owner.dl_v,
                        "ownerDlState":owner.dlstate_v,
                        "primary":owner.primary_v,
                        "ownerPhone":owner.phone_v === undefined ? undefined : (owner.phone_v).replace(normalizedPhone,''),
                    }
                    ))
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
        type: 'GET_MERCHANT_DETAILS',
        payload: response
    }
}

//Function to update merchant details to processing system
export function updateMerchantDetails(values, screenType, merchantLogo, token) {

    var acceptanceDateTime = moment().format('YYYYMMDDHHMM')
    var requestData = {
        "merchantId": values.merchantId,
        "isLogoUpdated": (merchantLogo !== "") ? "1" : "0",
        "image": merchantLogo,
        "accountData": {
            "accountId": values.accountId,
            "account": {
                "method": values.bankAccountType,
                "number": values.accountNumber,
                "routing": values.routeNumber
            },
            "isRecordUpdated":screenType === "bankAccount" ? "1" : "0"
        },
        "memberData":
            values.owners !== undefined 
            ?
                (
                    values.owners.map((owner)=>(
                        {
                            "merchant":owner.merchantId,
                            "memberId":owner.memberId,
                            "title": owner.ownerBusinessTitle,
                            "first": owner.ownerFirstName,
                            "last": owner.ownerLastName,
                            "dob": (owner.ownerDob === undefined ? undefined : (owner.ownerDob).replace(normalizedPhone,'')),
                            "ownership": (parseFloat(owner.ownership)) * 100,
                            "email":owner.ownerEmail,
                            "ssn":(owner.ownerSsn === undefined ? undefined : (owner.ownerSsn).replace(normalizedPhone,'')),
                            "address1":owner.ownerAddress,
                            "address2":owner.ownerAddress2,
                            "city":owner.ownerCity,	
                            "state":owner.ownerState,
                            "zip":(owner.ownerZip === undefined ? undefined : (owner.ownerZip).replace(normalizedPhone,'')),
                            "country":"USA",
                            "timezone":"est",
                            "dl":owner.ownerDrivingLicense,
                            "dlstate":owner.ownerDlState,
                            "phone":(owner.ownerPhone === undefined ? undefined : (owner.ownerPhone).replace(normalizedPhone,'')),
                            "isRecordUpdated":screenType === "memberDetails" ? "1" : "0",
                            "isNewRecord":  "0"
                        }
                    )
                )
            )
            :
            (
                [{
                    "isRecordUpdated":screenType === "memberDetails" ? "1" : "0",
                    "isNewRecord":  "0"
                }]
            ),
        "merchantData": {
            "merchantId":values.merchantId,
            "new": values.isCreditCardYes ? "0" : "1",
            "established": (values.businessPeriod === undefined || values.businessPeriod === "" ? undefined : (values.businessPeriod).replace(normalizedPhone,'')), 
            "annualCCSales": (values.isCreditCardYes === false ? "0" : (values.ccSale === undefined ? undefined : (values.ccSale).replace(normalizedNumber,''))),
            "dba":values.dba,
            "mcc":values.mccNumber,
            "environment":values.merchantType,
            "status":values.boardingStatus === "2" ? undefined : values.boardingStatus,
            "isRecordUpdated": screenType === "businessDetails" ? "1" : "0"
        },
        "entityData": {
            "entityId": values.entityId,
            "type": values.businessType,
            "name": values.businessName === undefined ? (values.owners[0].ownerFirstName + ' ' + values.owners[0].ownerLastName) : values.businessName,
            "address1": values.businessAddress,
            "address2": values.businessAddress2,
            "city": values.businessCity,
            "state": values.businessStateName,
            "zip": values.businessZip === undefined ? undefined : (values.businessZip).replace(normalizedPhone,''),
            "phone": values.businessPhone === undefined ? undefined : (values.businessPhone).replace(normalizedPhone,''),
            "fax":  values.businessFax === undefined || values.businessFax === null ? undefined : (values.businessFax).replace(normalizedPhone,''),
            "email": values.businessEmail,
            "website": values.businessWebsite,
            "ein": values.taxId === undefined ? undefined : (values.taxId).replace(normalizedPhone,''),
            "public": values.publicCompany,
            "customerPhone": values.servicePhone === undefined || values.servicePhone === null ? undefined : (values.servicePhone).replace(normalizedPhone,''),
            "tcAcceptDate": acceptanceDateTime,
            "tcAcceptIp": values.ipAddress,
            "merchantType":values.merchantType,
            "isRecordUpdated":screenType === "businessDetails" ? "1" : "0",
        }
    }

    var setting = {
        method: 'post',
        url: hostURL + updateMerchantDetailAPI,
        data: {
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
        type: 'UPDATE_MERCHANTDETAILS',
        payload: response
    }
}