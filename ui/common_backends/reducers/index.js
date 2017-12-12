import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import {
    IS_DRAG_EVENT_CALENDAR,

    NANO_MASTER_ALL
} from './master'

export default combineReducers({
    routing: routerReducer,

    IS_DRAG_EVENT_CALENDAR,
    NANO_MASTER_ALL
})
