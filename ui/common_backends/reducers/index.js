import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import {
    AUTH_INFO,
    EMP_INFO,
    IS_OPEN_MAIN_MENU,
    IS_DRAG_EVENT_CALENDAR,
    ORGANIZATION_TEAM,

    CALENDAR_MASTER_EVENTS_DATA,
    CALENDAR_MASTER_BRANCH_LOCATION_DATA
} from './master'

import {
    CALENDAR_EVENT_DATA,
    CALENDAR_EVENT_NON_CONFIRM,
    IS_LOAD_CALENDAR_EVENT
} from './calendar'

export default combineReducers({
    routing: routerReducer,

    AUTH_INFO,
    EMP_INFO,
    IS_OPEN_MAIN_MENU,
    IS_DRAG_EVENT_CALENDAR,

    ORGANIZATION_TEAM,

    CALENDAR_MASTER_EVENTS_DATA,
    CALENDAR_EVENT_NON_CONFIRM,
    CALENDAR_MASTER_BRANCH_LOCATION_DATA,

    CALENDAR_EVENT_DATA,
    CALENDAR_EVENT_NON_CONFIRM,
    IS_LOAD_CALENDAR_EVENT
})
