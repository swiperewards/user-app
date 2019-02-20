import { AuthError } from '../actions/accountAction'
export const authentocationMiddleware = store => next => action => {
    if (action.type) {
        if (action.payload) {
            if (action.payload.message === "Failed to authorize" || action.payload.status === 1050) {
                store.dispatch(AuthError());
            }
        }
    }
    next(action)
}