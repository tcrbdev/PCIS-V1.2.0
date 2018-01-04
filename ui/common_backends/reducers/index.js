import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import {
    IS_OPEN_MAIN_MENU,
    IS_DRAG_EVENT_CALENDAR,

    CALENDAR_MASTER_EVENTS_DATA
} from './master'
import {
    CALENDAR_EVENT_DATA
} from './calendar'

export default combineReducers({
    routing: routerReducer,

    IS_OPEN_MAIN_MENU,
    IS_DRAG_EVENT_CALENDAR,

    CALENDAR_MASTER_EVENTS_DATA,

    CALENDAR_EVENT_DATA
})
