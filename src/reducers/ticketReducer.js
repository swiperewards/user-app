export default function (state = {}, action) {
    switch (action.type) {
        case 'GET_QUERY_TYPE':
            return {
                ...state, queryType: action.payload
            }
        case 'GENERATE_TICKET':
            return{
                generateTicket: action.payload
            }    
        case 'GET_TICKET_TYPE_LIST':
            return{
                ...state, ticketTypeList: action.payload
            }    
        case 'DELETE_TICKETTYPE':
            return{
                deleteTicketType: action.payload
            } 
        case 'ADD_TICKETTYPE':
            return{
                createTicketType: action.payload
            }     
        case 'UPDATE_TICKETTYPE':
            return{
                updateTicketType : action.payload
            }     
        case 'GET_TICKET_TYPE_DETAILS':
            return{
                ...state, ticketTypeDetails: action.payload
            }   
        case 'GET_CUSTOMER_QUERY_LIST':
            return{
                customerQueriesList: action.payload
            }  
        case 'GET_CUSTOMER_QUERY_DETAILS':
            return{
                customerQueryDetails: action.payload
            }    
        case 'MANAGE_CUSTOMER_QUERY_DETAILS':
            return{
                manageCustomerQuery: action.payload
            }    
        case 'RESOLVE_CUSTOMER_QUERY':
            return{
                resolveCustomerQuery: action.payload
            }    
        default:
            return state;
    }
}