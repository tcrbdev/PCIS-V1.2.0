import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE } from '../constants/actionsType'

const initialState = {
    success: false,
    message: null,
    token: null
}

export const AUTH = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_SUCCESS:
            return action.payload
            break;
        default:
            return state
            break;
    }
}