
import {
    ON_OPEN_MAIN_MENU,
    ON_DRAG_EVENT_CALENDAR,

    LOAD_CALENDAR_MASTER_EVENTS_REQUEST,
    LOAD_CALENDAR_MASTER_EVENTS_SUCCESS,
    LOAD_CALENDAR_MASTER_EVENTS_FAILED
} from '../constants/actionType'

const initialStateObj = {}
const initialStateArray = []
const initialStateBoolean = true
const initialStateOnSearchData = false

export const IS_OPEN_MAIN_MENU = (state = false, action) => {
    switch (action.type) {
        case ON_OPEN_MAIN_MENU:
            return action.payload
            break;
        default:
            return state
            break;
    }
}

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

export const CALENDAR_MASTER_EVENTS_DATA = (state = initialStateArray, action) => {
    switch (action.type) {
        case LOAD_CALENDAR_MASTER_EVENTS_SUCCESS:
            return action.payload
            break;
        case LOAD_CALENDAR_MASTER_EVENTS_FAILED:
            return action.payload
            break;
        default:
            return state
            break;
    }
}