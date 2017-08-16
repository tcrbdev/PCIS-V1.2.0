import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { MASTER_ALL } from './master'
import { AUTH } from './login'
import {
    NANO_MASTER_ALL,
    NANO_INIT_PAGE,

    ON_NANO_SEARCHING_DATA,
    ON_NANO_CHANGE_VIEW_SEARCHING_DATA,
    NANO_FILTER_CRITERIA,
    SELECTED_CA_MAP,
    DO_BOUNDS_MAP,
    RELATED_BRANCH_DATA,
    RELATED_EXITING_MARKET_DATA,
    RELATED_EXITING_MARKET_DATA_BACKUP,
    RELATED_TARGET_MARKET_DATA,
    RELATED_CA_IN_MARKET_DATA,
    RELATED_PERFORMANCE_SUMMARY_DATA,
    RELATED_OVERALL_SUMMARY_DATA,
    RELATED_GROUP_BY_SUMMARY_DATA,
    RELATED_COMPLITITOR_DATA
} from './nanomaster'

export default combineReducers({
    routing: routerReducer,
    AUTH: AUTH,
    MASTER_ALL: MASTER_ALL,

    NANO_MASTER_ALL,
    NANO_INIT_PAGE,

    ON_NANO_SEARCHING_DATA,
    ON_NANO_CHANGE_VIEW_SEARCHING_DATA,
    NANO_FILTER_CRITERIA,
    SELECTED_CA_MAP,
    DO_BOUNDS_MAP,
    RELATED_BRANCH_DATA,
    RELATED_EXITING_MARKET_DATA,
    RELATED_EXITING_MARKET_DATA_BACKUP,
    RELATED_TARGET_MARKET_DATA,
    RELATED_CA_IN_MARKET_DATA,
    RELATED_PERFORMANCE_SUMMARY_DATA,
    RELATED_OVERALL_SUMMARY_DATA,
    RELATED_GROUP_BY_SUMMARY_DATA,
    RELATED_COMPLITITOR_DATA
})
