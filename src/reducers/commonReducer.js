export default function (state = {}, action) {
    switch (action.type) {
        case 'LOADER':
            return {
                ...state, isLoading: action.data
            }
        default:
            return state;
    }
}