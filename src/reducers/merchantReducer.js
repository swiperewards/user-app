export default function (state = {}, action) {
    switch (action.type) {
        case 'ONBOARD_MERCHANT':
            return {
                data: action.payload
            }
        case 'GET_MERCHANTS':
            return{
                merchantList: action.payload
            }  
        case 'DELETE_MERCHANT':
            return{
                deleteMerchant: action.payload
            }     
        case 'GET_MERCHANT_DETAILS':
            return{
                ...state, merchantDetails: action.payload
            }   
        case 'UPDATE_MERCHANTDETAILS':
            return{
                updateMerchant: action.payload
            }    
        default:
            return state;
    }
}
