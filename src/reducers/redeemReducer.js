export default function (state = {}, action) {
    switch (action.type) {
        case 'GET_REDEEM_MODES':
            return {
                ...state, redeemModeList: action.payload
            }       
        case 'CREATE_REDEEM_MODE':
            return{
                createRedeemMode: action.payload
            }    
        case 'DELETE_REDEEM_MODE':
            return{
                deleteRedeemMode: action.payload
            }    
        case 'UPDATE_REDEEM_MODE':
            return{
                updateRedeemMode: action.payload
            }  
        case 'GET_REDEEM_MODE_DETAILS':
            return{
                redeemModeDetails: action.payload
            }      
        case 'GET_REDEEM_REQUESTS':
            return{
                ...state, redeemRequestList: action.payload
            }    
        case 'GET_REDEEM_REQUEST_DETAILS':
            return{
                redeemRequestDetails: action.payload
            }   
        case 'APPROVE_REDEEM_REQUEST':
            return{
                approveRedeemRequest: action.payload
            }     
        case 'REJECT_REDEEM_REQUEST':
            return{
                rejectRedeemRequest: action.payload
            }    
        default:
            return state;
    }
}