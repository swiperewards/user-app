import { hostURL, dashboardAPI } from '../app.config';
import { decryptData} from '../utilities/encryptDecryptData'

var axios = require('axios');
var randomColor = require('randomcolor');

//Function to get analytics details 
export function getDashboardDetails(token) {

    var setting = {
        method: 'post',
        url: hostURL + dashboardAPI,
        data: {
            "platform": "web", 
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
                    "openTicketsCount": responseDetails.openTicketsCount,
                    "openRedeemRequestsCount": responseDetails.openRedeemRequestsCount,
                    "totalMerchantsCount": responseDetails.totalMerchantsCount,
                    "activeDealsCount": responseDetails.activeDealsCount, 
                    "tickets": getFormattedData(responseDetails.tickets), 
                    "redeemRequests": getFormattedData(responseDetails.redeemRequests), 
                    "totalRegisteredUsersCount": responseDetails.totalRegisteredUsersCount,
                    "totalDealsCount": responseDetails.totalDealsCount,
                    "transactionsInActivePool": responseDetails.transactionsInActivePool,
                    "totalPoolAmount": responseDetails.totalPoolAmount,
                }
            }

            return output;
        }
        )

        .catch(response => response = {
            success: 500,
            message: "Your submission could not be completed. Please Try Again!",
            responseData: undefined
        }
        );

    return {
        type: 'GET_DASHBOARD_DETAILS',
        payload: response
    }
}

function getFormattedData(dataArray) {

    var arrLabels=[];
    var arrData=[];
    var arrBackgroundColor=[];
    var arrHoverBackground=[];

    if(dataArray !== undefined){
        dataArray.forEach(element => {
            arrLabels.push(element.name)
            arrData.push(element.count)
        })

        var color = randomColor({
            count: dataArray.length,
            luminosity: 'bright',
            alpha: 0.7,
            hue: 'random'
        });

        arrBackgroundColor = color
        arrHoverBackground = color
    }

    var dataSet = {};
    dataSet.data = arrData;
    dataSet.backgroundColor = arrBackgroundColor;
    dataSet.hoverBackgroundColor = arrHoverBackground;

    return ({
        "labels": arrLabels,
        "datasets":[dataSet]
    })

}