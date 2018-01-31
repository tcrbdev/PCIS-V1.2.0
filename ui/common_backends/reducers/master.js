
import {
    AUTH_SUCCESS,
    SET_AUTHENTICATION_REQUEST,
    SET_EMPLOYEE_INFO_REQUEST,
    ON_OPEN_MAIN_MENU,
    ON_DRAG_EVENT_CALENDAR,

    LOAD_MASTER_ORGANIZATION_TEAM_REQUEST,
    LOAD_MASTER_ORGANIZATION_TEAM_SUCCESS,
    LOAD_MASTER_ORGANIZATION_TEAM_FAILED,

    LOAD_CALENDAR_MASTER_EVENTS_REQUEST,
    LOAD_CALENDAR_MASTER_EVENTS_SUCCESS,
    LOAD_CALENDAR_MASTER_EVENTS_FAILED,

    LOAD_CALENDAR_MASTER_BRANCH_LOCATION_REQUEST,
    LOAD_CALENDAR_MASTER_BRANCH_LOCATION_SUCCESS,
    LOAD_CALENDAR_MASTER_BRANCH_LOCATION_FAILED
} from '../constants/actionType'

const initialStateObj = {}
const initialStateArray = []
const initialStateBoolean = true
const initialStateOnSearchData = false

export const AUTH_INFO = (state = initialStateObj, action) => {
    switch (action.type) {
        case AUTH_SUCCESS:
        case SET_AUTHENTICATION_REQUEST:
            return action.payload
            break;
        default:
            return state
            break;
    }
}

export const EMP_INFO = (state = initialStateObj, action) => {
    switch (action.type) {
        case AUTH_SUCCESS:
        case SET_EMPLOYEE_INFO_REQUEST:
        case SET_AUTHENTICATION_REQUEST:
            return action.payload
            break;
        default:
            return state
            break;
    }
}

export const ORGANIZATION_TEAM = (state = initialStateObj, action) => {
    switch (action.type) {
        case LOAD_MASTER_ORGANIZATION_TEAM_SUCCESS:
            return action.payload
            break;
        default:
            return state
            break;
    }
}

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

export const CALENDAR_MASTER_BRANCH_LOCATION_DATA = (state = initialStateArray, action) => {
    switch (action.type) {
        case LOAD_CALENDAR_MASTER_BRANCH_LOCATION_SUCCESS:
            return action.payload
            break;
        default:
            return state
            break;
    }
}