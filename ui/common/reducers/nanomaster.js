import {
    LOAD_NANO_MASTER_ALL_REQUEST,
    LOAD_NANO_MASTER_ALL_SUCCESS,
    LOAD_NANO_MASTER_ALL_FAILURE,

    SET_FILTER_CRITERIA_REQUEST,
    SET_OPEN_BRANCH_MARKER_REQUEST,
    SET_OPEN_EXITING_MARKET_MARKER_REQUEST,
    SET_OPEN_TARGET_MARKET_MARKER_REQUEST,
    SEARCH_NANO_DATA_REQUEST,
    SEARCH_NANO_DATA_SUCCESS,
    SEARCH_NANO_DATA_FAILURE,

    SEARCH_NANO_CHANGE_VIEW_DATA_REQUEST,
    SEARCH_NANO_CHANGE_VIEW_DATA_SUCCESS,
    SEARCH_NANO_CHANGE_VIEW_DATA_FAILURE,

    CHANGE_MAP_MARKER_BY_CA,

    INSERT_MARKER_NOTE_REQUEST,
    INSERT_MARKER_NOTE_SUCCESS,
    INSERT_MARKER_NOTE_FAILURE,
    EDIT_NOTE_CA_SUCCESS,

    GET_CA_SUMMARY_ONLY_REQUEST,
    GET_CA_SUMMARY_ONLY_SUCCESS,
    GET_CA_SUMMARY_ONLY_FAILURE
} from '../constants/actionsType'

const initialStateObj = {}
const initialStateArray = []
const initialStateBoolean = true
const initialStateOnSearchData = false

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

export const NANO_INIT_PAGE = (state = initialStateBoolean, action) => {
    switch (action.type) {
        case LOAD_NANO_MASTER_ALL_REQUEST:
            return true
            break;
        case LOAD_NANO_MASTER_ALL_SUCCESS:
        case LOAD_NANO_MASTER_ALL_FAILURE:
            return false
            break;
        default:
            return state
            break;
    }
}

export const ON_NANO_SEARCHING_DATA = (state = initialStateOnSearchData, action) => {
    switch (action.type) {
        case SEARCH_NANO_DATA_REQUEST:
            return true
            break;
        case SEARCH_NANO_DATA_SUCCESS:
        case SEARCH_NANO_DATA_FAILURE:
            return false
            break;
        default:
            return state
            break;
    }
}

export const ON_NANO_CHANGE_VIEW_SEARCHING_DATA = (state = initialStateOnSearchData, action) => {
    switch (action.type) {
        case SEARCH_NANO_CHANGE_VIEW_DATA_REQUEST:
            return true
            break;
        case SEARCH_NANO_CHANGE_VIEW_DATA_SUCCESS:
        case SEARCH_NANO_CHANGE_VIEW_DATA_FAILURE:
            return false
            break;
        default:
            return state
            break;
    }
}

export const NANO_FILTER_CRITERIA = (state = initialStateObj, action) => {
    switch (action.type) {
        case SET_FILTER_CRITERIA_REQUEST:
            return action.criteria
            break;
        default:
            return state
            break;
    }
}

export const SELECTED_CA_MAP = (state = "", action) => {
    switch (action.type) {
        case CHANGE_MAP_MARKER_BY_CA:
            return action.selectedCA
            break;
        default:
            return state
            break;

    }
}

export const DO_BOUNDS_MAP = (state = initialStateBoolean, action) => {
    switch (action.type) {
        case SET_OPEN_BRANCH_MARKER_REQUEST:
        case SET_OPEN_EXITING_MARKET_MARKER_REQUEST:
        case SET_OPEN_TARGET_MARKET_MARKER_REQUEST:
            return false
            break;
        case CHANGE_MAP_MARKER_BY_CA:
        case SEARCH_NANO_DATA_REQUEST:
            return true
            break;
        default:
            return state
            break;

    }
}

export const RELATED_BRANCH_DATA = (state = initialStateArray, action) => {
    switch (action.type) {
        case SET_OPEN_BRANCH_MARKER_REQUEST:
            return action.payload
            break;
        case SEARCH_NANO_DATA_SUCCESS:
            return action.payload.nanoMarker[0]
            break;
        case SEARCH_NANO_DATA_FAILURE:
            return [action.payload]
            break;
        default:
            return state
            break;
    }
}

export const RELATED_EXITING_MARKET_DATA = (state = initialStateArray, action) => {
    switch (action.type) {
        case SET_OPEN_EXITING_MARKET_MARKER_REQUEST:
        case CHANGE_MAP_MARKER_BY_CA:
            return action.payload
            break;
        case SEARCH_NANO_DATA_SUCCESS:
            return action.payload.nanoMarker[1]
            break;
        case SEARCH_NANO_DATA_FAILURE:
            return [action.payload]
            break;
        default:
            return state
            break;
    }
}

export const RELATED_EXITING_MARKET_DATA_BACKUP = (state = initialStateArray, action) => {
    switch (action.type) {
        case SEARCH_NANO_DATA_SUCCESS:
            return action.payload.nanoMarker[1]
            break;
        case SEARCH_NANO_DATA_FAILURE:
            return [action.payload]
            break;
        default:
            return state
            break;
    }
}

export const RELATED_TARGET_MARKET_DATA = (state = initialStateArray, action) => {
    switch (action.type) {
        case SET_OPEN_TARGET_MARKET_MARKER_REQUEST:
            return action.payload
            break;
        case SEARCH_NANO_DATA_SUCCESS:
            return action.payload.nanoMarker[2]
            break;
        case SEARCH_NANO_DATA_FAILURE:
            return [action.payload]
            break;
        default:
            return state
            break;
    }
}

export const RELATED_CA_IN_MARKET_DATA = (state = initialStateArray, action) => {
    switch (action.type) {
        case SEARCH_NANO_DATA_SUCCESS:
            return action.payload.nanoMarker[3]
            break;
        case SEARCH_NANO_DATA_FAILURE:
            return [action.payload]
            break;
        default:
            return state
            break;
    }
}

export const RELATED_CA_NOTE_DATA = (state = initialStateArray, action) => {
    switch (action.type) {
        case EDIT_NOTE_CA_SUCCESS:
            return action.payload
            break;
        case SEARCH_NANO_DATA_SUCCESS:
            return action.payload.nanoMarker[4]
            break;
        case SEARCH_NANO_DATA_FAILURE:
            return [action.payload]
            break;
        default:
            return state
            break;
    }
}

export const RELATED_PERFORMANCE_SUMMARY_DATA = (state = initialStateArray, action) => {
    switch (action.type) {
        case SEARCH_NANO_DATA_SUCCESS:
            return action.payload.productPerformance[0]
            break;
        case SEARCH_NANO_DATA_FAILURE:
            return [action.payload]
            break;
        default:
            return state
            break;
    }
}

export const RELATED_OVERALL_SUMMARY_DATA = (state = initialStateArray, action) => {
    switch (action.type) {
        case SEARCH_NANO_DATA_SUCCESS:
            return action.payload.totalSummary[0]
            break;
        case SEARCH_NANO_DATA_FAILURE:
            return [action.payload]
            break;
        default:
            return state
            break;
    }
}

export const RELATED_GROUP_BY_SUMMARY_DATA = (state = initialStateArray, action) => {
    switch (action.type) {
        case SEARCH_NANO_CHANGE_VIEW_DATA_SUCCESS:
            return action.payload.groupBYSummary[0]
            break;
        case SEARCH_NANO_DATA_SUCCESS:
            return action.payload.groupBYSummary[0]
            break;
        case SEARCH_NANO_DATA_FAILURE:
            return [action.payload]
            break;
        default:
            return state
            break;
    }
}

export const RELATED_COMPLITITOR_DATA = (state = initialStateArray, action) => {
    switch (action.type) {
        case SEARCH_NANO_DATA_SUCCESS:
            return action.payload.complititorMarker[0]
            break;
        case SEARCH_NANO_DATA_FAILURE:
            return [action.payload]
            break;
        default:
            return state
            break;
    }
}

export const INSERT_MARKER_NOTE_DATA = (state = initialStateObj, action) => {
    switch (action.type) {
        case INSERT_MARKER_NOTE_SUCCESS:
            return action.payload
            break;
        case INSERT_MARKER_NOTE_FAILURE:
            return action.payload
            break;
        default:
            return state
            break;
    }
}

export const CA_SUMMARY_ONLY_MARKET_PENETRATION = (state = initialStateArray, action) => {
    switch (action.type) {
        case GET_CA_SUMMARY_ONLY_SUCCESS:
            return action.payload[0]
            break;
        default:
            return state
            break;
    }
}

export const CA_SUMMARY_ONLY_MARKET_CONTRIBUTION = (state = initialStateArray, action) => {
    switch (action.type) {
        case GET_CA_SUMMARY_ONLY_SUCCESS:
            return action.payload[1]
            break;
        default:
            return state
            break;
    }
}