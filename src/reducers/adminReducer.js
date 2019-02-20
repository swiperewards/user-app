export default function (state = {}, action) {
    switch (action.type) {
        case 'ADD_ADMIN':
            return {
                addAdmin: action.payload
            }
        case 'GET_ADMINS':
            return{
                adminList: action.payload
            }  
        case 'DELETE_ADMIN':
            return{
                deleteAdmin: action.payload
            }     
        case 'GET_ADMIN_DETAILS':
            return{
                ...state, adminDetails: action.payload
            }   
        case 'UPDATE_ADMIN':
            return{
                updateAdmin: action.payload
            }    
        default:
            return state;
    }
}