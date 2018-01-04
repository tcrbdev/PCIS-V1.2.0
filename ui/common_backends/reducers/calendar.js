
import {
    LOAD_CALENDAR_EVENT_REQUEST,
    LOAD_CALENDAR_EVENT_SUCCESS,
    LOAD_CALENDAR_EVENT_FAILED,

    INSERT_CALENDAR_EVENT_REQUEST,
    INSERT_CALENDAR_EVENT_SUCCESS,
    INSERT_CALENDAR_EVENT_FAILED,

    UPDATE_CALENDAR_EVENT_REQUEST,
    UPDATE_CALENDAR_EVENT_SUCCESS,
    UPDATE_CALENDAR_EVENT_FAILED,

    DELETE_CALENDAR_EVENT_REQUEST,
    DELETE_CALENDAR_EVENT_SUCCESS,
    DELETE_CALENDAR_EVENT_FAILED
} from '../constants/actionType'

const initialStateObj = {}
const initialStateArray = []
const initialStateBoolean = true
const initialStateOnSearchData = false

export const CALENDAR_EVENT_DATA = (state = initialStateArray, action) => {
    switch (action.type) {
        case LOAD_CALENDAR_EVENT_SUCCESS:
        case INSERT_CALENDAR_EVENT_SUCCESS:
        case UPDATE_CALENDAR_EVENT_SUCCESS:
        case DELETE_CALENDAR_EVENT_SUCCESS:
            return action.payload
            break;
        default:
            return state
            break;
    }
}