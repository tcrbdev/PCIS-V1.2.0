import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE } from '../constants/actionsType'

const initialState = {
    load: false,
    data: null
}

export const AUTH = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_REQUEST:
            return { load: true, data: null }
            break;
        case AUTH_SUCCESS:
            return { load: false, data: action.payload }
            break;
        default:
            return state
            break;
    }
}