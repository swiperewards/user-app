export default function (state = {}, action) {
    switch (action.type) {
        case 'GET_USERS':
            return {
                ...state, userList: action.payload
            }    
        case 'DELETE_USER':
            return{
                deleteUser: action.payload
            }    
        case 'GET_USER_DETAILS':
            return{
                ...state, userDetails: action.payload
            }
        case 'UPDATE_USER':
            return{
                updateUser: action.payload
            }    
        default:
            return state;
    }
}