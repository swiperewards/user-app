export default function (state = {}, action) {
    switch (action.type) {
        case 'GET_DASHBOARD_DETAILS':
            return {
                ...state, dashboardDetails: action.payload
            }
        default:
            return state;
    }
}