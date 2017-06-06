import { MASTER_ALL_SUCCESS } from '../constants/actionsType'

const initialState = {}

export const MASTER_ALL = (state = initialState, action) => {
    switch (action.type) {
        case MASTER_ALL_SUCCESS:
            return action.payload
            break;
        default:
            return state
            break;
    }
}