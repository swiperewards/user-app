export default function (state = {}, action) {
    switch (action.type) {
        case 'ADD_DEAL':
            return {
                addDeal: action.payload
            }
        case 'GET_DEALS':
            return{
                dealList: action.payload
            }  
        case 'DELETE_DEAL':
            return{
                deleteDeal: action.payload
            }     
        case 'GET_DEAL_DETAILS':
            return{
                ...state, dealDetails: action.payload
            }   
        case 'UPDATE_DEAL':
            return{
                updateDeal: action.payload
            }    
        case 'GET_CITIES':
            return{
                ...state, citiesList: action.payload
            }    
        default:
            return state;
    }
}