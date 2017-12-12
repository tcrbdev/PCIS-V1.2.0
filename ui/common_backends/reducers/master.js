import {
    LOAD_NANO_MASTER_ALL_REQUEST,
    LOAD_NANO_MASTER_ALL_SUCCESS,
    LOAD_NANO_MASTER_ALL_FAILURE
} from '../../common/constants/actionsType'

import {
    ON_DRAG_EVENT_CALENDAR
} from '../constants/actionType'

const initialStateObj = {}
const initialStateArray = []
const initialStateBoolean = true
const initialStateOnSearchData = false

export const IS_DRAG_EVENT_CALENDAR = (state = false, action) => {
    switch (action.type) {
        case ON_DRAG_EVENT_CALENDAR:
            return action.payload
            break;
        default:
            return state
            break;
    }
}

export const NANO_MASTER_ALL = (state = initialStateObj, action) => {
    switch (action.type) {
        case LOAD_NANO_MASTER_ALL_SUCCESS:
            return action.payload
            break;
        case LOAD_NANO_MASTER_ALL_FAILURE:
            return action.payload
            break;
        default:
            return state
            break;
    }
}