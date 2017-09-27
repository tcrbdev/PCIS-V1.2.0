import bluebird from 'bluebird'
import fetch from 'isomorphic-fetch'
import _ from 'lodash'
import { CALL_API } from 'redux-api-middleware'

import {
    MASTER_REGION_URL,
    MASTER_AREA_URL,
    MASTER_BRANCH_URL,
    MASTER_TARGET_MARKET_PROVINCE_URL,
    MASTER_CALIST_URL,
    MASTER_COMPLITITOR_PROVINCE_URL,

    SEARCH_NANO_MARKER_URL,
    SEARCH_COMPLITITOR_MARKER_URL,
    SEARCH_PRODUCT_PERFORMANCE_URL,
    SEARCH_TOTAL_SUMMARY_URL,
    SEARCH_GROUP_BY_SUMMARY_URL,
    SEARCH_GROUP_BY_MARKET_SUMMARY_URL,
    GET_CA_SUMMARY_ONLY_URL,

    GET_BRANCH_MARKER_DATA_URL,
    GET_BRANCH_IMAGE_MARKER_URL,
    GET_EXITING_MARKET_MARKER_DATA_URL,
    GET_EXITING_MARKET_IMAGE_MARKER_URL,

    INSERT_UPDATE_MARKER_NOTE_URL
} from '../../common/constants/endpoints'

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

    DELETE_MARKER_NOTE_REQUEST,
    DELETE_MARKER_NOTE_SUCCESS,
    DELETE_MARKER_NOTE_FAILURE,

    SET_MARKER_NOTE_DEFAULT_REQUEST,
    SET_MARKER_NOTE_DEFAULT_SUCCESS,
    SET_MARKER_NOTE_DEFAULT_FAILURE,
    EDIT_NOTE_CA_SUCCESS,

    GET_CA_SUMMARY_ONLY_REQUEST,
    GET_CA_SUMMARY_ONLY_SUCCESS,
    GET_CA_SUMMARY_ONLY_FAILURE
} from '../../common/constants/actionsType'

export const setOpenBranchMarkerMenu = (targetMarker, currentState, isOpen) => dispatch => {
    let item = _.find(currentState, { BranchCode: targetMarker.BranchCode })
    item.showMenu = isOpen

    let newState = _.cloneDeep(currentState)

    dispatch({
        type: SET_OPEN_BRANCH_MARKER_REQUEST,
        payload: newState
    })
}

export const setOpenBranchMarker = (targetMarker, currentState, isOpen) => dispatch => {
    const URL = `${GET_BRANCH_MARKER_DATA_URL}${targetMarker.BranchCode}`

    fetch(URL)
        .then(res => (res.json()))
        .then(res => {
            let item = _.find(currentState, { BranchCode: targetMarker.BranchCode })
            item.showInfo = isOpen
            item.showImage = false
            item.showMenu = false
            item.BRANCH_INFORMATION = res[0]
            item.CA_BRANCH_INFORMATION = res[1]
            item.BRANCH_DESCRIPTION = res[2]
            item.BRANCH_RADIUS = res[3]
            item.NOTE = res[4]
            item.BRANCH_IMAGE = []

            let newState = _.cloneDeep(currentState)

            dispatch({
                type: SET_OPEN_BRANCH_MARKER_REQUEST,
                payload: newState
            })
        })
}

export const setOpenBranchImageMarker = (targetMarker, currentState, isOpen) => dispatch => {
    const URL = `${GET_BRANCH_IMAGE_MARKER_URL}${targetMarker.BranchCode}`

    fetch(URL)
        .then(res => (res.json()))
        .then(res => {
            let item = _.find(currentState, { BranchCode: targetMarker.BranchCode })
            item.showInfo = false
            item.showImage = isOpen
            item.showMenu = false
            item.BRANCH_INFORMATION = []
            item.CA_BRANCH_INFORMATION = []
            item.BRANCH_DESCRIPTION = []
            item.BRANCH_RADIUS = []
            item.NOTE = []
            item.BRANCH_IMAGE = res

            let newState = _.cloneDeep(currentState)

            dispatch({
                type: SET_OPEN_BRANCH_MARKER_REQUEST,
                payload: newState
            })
        })
}

export const setOpenExitingMarketMarkerMenu = (targetMarker, currentState, isOpen) => dispatch => {
    let item = _.find(currentState, { MarketCode: targetMarker.MarketCode })
    item.showMenu = isOpen

    let newState = _.cloneDeep(currentState)

    dispatch({
        type: SET_OPEN_EXITING_MARKET_MARKER_REQUEST,
        payload: newState
    })
}

export const setOpenExitingMarketMarker = (targetMarker, currentState, isOpen) => dispatch => {

    const URL = `${GET_EXITING_MARKET_MARKER_DATA_URL}${targetMarker.MarketCode}`

    fetch(URL)
        .then(res => (res.json()))
        .then(res => {
            let item = _.find(currentState, { MarketCode: targetMarker.MarketCode })
            item.showInfo = isOpen
            item.showImage = false
            item.showMenu = false
            item.showShopLayout = false
            item.showSaleSummary = false
            item.showPortfolio = false
            item.MARKET_INFORMATION = res[0]
            item.CA_INFORMATION = res[1]
            item.NOTE = res[2]
            item.MARKET_IMAGE = []

            let newState = _.cloneDeep(currentState)

            dispatch({
                type: SET_OPEN_EXITING_MARKET_MARKER_REQUEST,
                payload: newState
            })
        })
}

export const setOpenExitingMarketImageMarker = (targetMarker, currentState, isOpen) => dispatch => {

    const URL = `${GET_EXITING_MARKET_IMAGE_MARKER_URL}${targetMarker.MarketCode}`

    fetch(URL)
        .then(res => (res.json()))
        .then(res => {
            let item = _.find(currentState, { MarketCode: targetMarker.MarketCode })
            item.showInfo = false
            item.showImage = isOpen
            item.showMenu = false
            item.showShopLayout = false
            item.showSaleSummary = false
            item.showPortfolio = false
            item.MARKET_INFORMATION = []
            item.CA_INFORMATION = []
            item.NOTE = []
            item.MARKET_IMAGE = res

            let newState = _.cloneDeep(currentState)

            dispatch({
                type: SET_OPEN_EXITING_MARKET_MARKER_REQUEST,
                payload: newState
            })
        })
}

export const setOpenExitingMarketShopLayoutMarker = (targetMarker, currentState, isOpen) => dispatch => {

    const URL = `${GET_EXITING_MARKET_IMAGE_MARKER_URL}${targetMarker.MarketCode}`

    fetch(URL)
        .then(res => (res.json()))
        .then(res => {
            let item = _.find(currentState, { MarketCode: targetMarker.MarketCode })
            item.showInfo = false
            item.showImage = false
            item.showMenu = false
            item.showShopLayout = isOpen
            item.showSaleSummary = false
            item.showPortfolio = false
            item.MARKET_INFORMATION = []
            item.CA_INFORMATION = []
            item.NOTE = []
            item.MARKET_IMAGE = res

            let newState = _.cloneDeep(currentState)

            dispatch({
                type: SET_OPEN_EXITING_MARKET_MARKER_REQUEST,
                payload: newState
            })
        })
}

export const setOpenExitingMarketSaleSummaryMarker = (targetMarker, currentState, isOpen) => dispatch => {

    const URL = `${GET_EXITING_MARKET_IMAGE_MARKER_URL}${targetMarker.MarketCode}`

    fetch(URL)
        .then(res => (res.json()))
        .then(res => {
            let item = _.find(currentState, { MarketCode: targetMarker.MarketCode })
            item.showInfo = false
            item.showImage = false
            item.showMenu = false
            item.showShopLayout = false
            item.showSaleSummary = isOpen
            item.showPortfolio = false
            item.MARKET_INFORMATION = []
            item.CA_INFORMATION = []
            item.NOTE = []
            item.MARKET_IMAGE = res

            let newState = _.cloneDeep(currentState)

            dispatch({
                type: SET_OPEN_EXITING_MARKET_MARKER_REQUEST,
                payload: newState
            })
        })
}

export const setOpenExitingMarketPortfolioMarker = (targetMarker, currentState, isOpen) => dispatch => {

    const URL = `${GET_EXITING_MARKET_IMAGE_MARKER_URL}${targetMarker.MarketCode}`

    fetch(URL)
        .then(res => (res.json()))
        .then(res => {
            let item = _.find(currentState, { MarketCode: targetMarker.MarketCode })
            item.showInfo = false
            item.showImage = false
            item.showMenu = false
            item.showShopLayout = false
            item.showSaleSummary = false
            item.showPortfolio = isOpen
            item.MARKET_INFORMATION = []
            item.CA_INFORMATION = []
            item.NOTE = []
            item.MARKET_IMAGE = res

            let newState = _.cloneDeep(currentState)

            dispatch({
                type: SET_OPEN_EXITING_MARKET_MARKER_REQUEST,
                payload: newState
            })
        })
}













export const setOpenTargetMarketMarker = (targetMarker, currentState, isOpen) => dispatch => {

    let item = _.find(currentState, { MarketName: targetMarker.MarketName })
    item.showInfo = isOpen

    let newState = _.cloneDeep(currentState)

    dispatch({
        type: SET_OPEN_TARGET_MARKET_MARKER_REQUEST,
        payload: newState
    })
}


export const selectMarkerByCA = (newState, value) => dispatch => {
    dispatch({
        type: CHANGE_MAP_MARKER_BY_CA,
        payload: newState,
        selectedCA: value
    })
}

export const getNanoMasterData = (token = '') => ((dispatch) => {

    dispatch({
        type: LOAD_NANO_MASTER_ALL_REQUEST,
        payload: {}
    })

    let api = [
        fetch(`${MASTER_REGION_URL}/${token}`).then(res => (res.json())),
        fetch(`${MASTER_AREA_URL}/${token}`).then(res => (res.json())),
        fetch(`${MASTER_BRANCH_URL}/${token}`).then(res => (res.json())),
        fetch(`${MASTER_TARGET_MARKET_PROVINCE_URL}/${token}`).then(res => (res.json())),
        fetch(`${MASTER_CALIST_URL}/${token}`).then(res => (res.json())),
        fetch(`${MASTER_COMPLITITOR_PROVINCE_URL}/${token}`).then(res => (res.json()))
    ]

    bluebird.all(api).spread((
        MASTER_REGION_DATA,
        MASTER_AREA_DATA,
        MASTER_BRANCH_DATA,
        MASTER_TARGET_MARKET_PROVINCE_DATA,
        MASTER_CALIST_DATA,
        MASTER_COMPLITITOR_PROVINCE_DATA) => {
        dispatch({
            type: LOAD_NANO_MASTER_ALL_SUCCESS,
            payload: {
                MASTER_REGION_DATA: MASTER_REGION_DATA[0],
                MASTER_AREA_DATA,
                MASTER_BRANCH_DATA,
                MASTER_TARGET_MARKET_PROVINCE_DATA,
                MASTER_CALIST_DATA,
                MASTER_COMPLITITOR_PROVINCE_DATA,
                MASTER_ASOF_DATA: MASTER_REGION_DATA[1],
            }
        })
    }).catch(err => {
        dispatch({
            type: LOAD_NANO_MASTER_ALL_FAILURE,
            payload: {
                status: 'Error',
                statusText: err
            }
        })
    })
})

export const searchNanoChangeViewByData = criteria => dispatch => {

    dispatch({ type: SET_FILTER_CRITERIA_REQUEST, criteria })

    dispatch({ type: SEARCH_NANO_CHANGE_VIEW_DATA_REQUEST })

    let api = [
        fetch(SEARCH_GROUP_BY_SUMMARY_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(criteria),
            timeout: 1500000
        }).then(res => (res.json())),
        fetch(SEARCH_GROUP_BY_MARKET_SUMMARY_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(criteria),
            timeout: 1500000
        }).then(res => (res.json()))
    ]

    bluebird.all(api)
        .spread((groupBYSummary, groupBYMarketSummary) => {
            const res = {
                groupBYSummary,
                groupBYMarketSummary
            }
            dispatch({
                type: SEARCH_NANO_CHANGE_VIEW_DATA_SUCCESS,
                payload: res
            })
        })
        .catch(e => {
            if (!e.response) {
                dispatch({
                    type: SEARCH_NANO_CHANGE_VIEW_DATA_FAILURE,
                    payload: {
                        status: "Error",
                        statusText: e.response
                    }
                })
            }
        })
}

export const searchNanoData = criteria => (
    dispatch => {
        dispatch({ type: SET_FILTER_CRITERIA_REQUEST, criteria })

        dispatch({ type: SEARCH_NANO_DATA_REQUEST })

        let api = [
            fetch(SEARCH_NANO_MARKER_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(criteria),
                timeout: 1500000
            }).then(res => (res.json())),
            fetch(SEARCH_COMPLITITOR_MARKER_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(criteria),
                timeout: 1500000
            }).then(res => (res.json())),
            fetch(SEARCH_PRODUCT_PERFORMANCE_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(criteria),
                timeout: 1500000
            }).then(res => (res.json())),
            fetch(SEARCH_TOTAL_SUMMARY_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(criteria),
                timeout: 1500000
            }).then(res => (res.json())),
            fetch(SEARCH_GROUP_BY_SUMMARY_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(criteria),
                timeout: 1500000
            }).then(res => (res.json())),
            fetch(SEARCH_GROUP_BY_MARKET_SUMMARY_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(criteria),
                timeout: 1500000
            }).then(res => (res.json()))
        ]

        bluebird.all(api)
            .spread((nanoMarker, complititorMarker, productPerformance, totalSummary, groupBYSummary, groupBYMarketSummary) => {
                const res = {
                    nanoMarker,
                    complititorMarker,
                    productPerformance,
                    totalSummary,
                    groupBYSummary,
                    groupBYMarketSummary
                }
                dispatch({
                    type: SEARCH_NANO_DATA_SUCCESS,
                    payload: res
                })
            })
            .catch(e => {
                if (!e.response) {
                    dispatch({
                        type: SEARCH_NANO_DATA_FAILURE,
                        payload: {
                            status: "Error",
                            statusText: e.response
                        }
                    })
                }
            })

    }

)

export const setMarkerNoteDefault = criteria => dispatch => {
    dispatch({
        [CALL_API]: {
            endpoint: INSERT_UPDATE_MARKER_NOTE_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(criteria),
            types: [SET_MARKER_NOTE_DEFAULT_REQUEST, SET_MARKER_NOTE_DEFAULT_SUCCESS, SET_MARKER_NOTE_DEFAULT_FAILURE]
        }
    })
}

export const deleteMarkerNote = SysNO => dispatch => {
    dispatch({
        [CALL_API]: {
            endpoint: `${INSERT_UPDATE_MARKER_NOTE_URL}/${SysNO}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
            types: [DELETE_MARKER_NOTE_REQUEST, DELETE_MARKER_NOTE_SUCCESS, DELETE_MARKER_NOTE_FAILURE]
        }
    })
}

export const insertUpdateMarkerNote = (criteria, type, loading, success, targetMarker, currentState) => dispatch => {
    const load = loading()

    fetch(INSERT_UPDATE_MARKER_NOTE_URL, {
        method: type.toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(criteria),
        timeout: 1500000
    })
        .then(res => (res.json()))
        .then(res => {
            if (targetMarker.MarketCode) {
                const URL = `${GET_EXITING_MARKET_MARKER_DATA_URL}${targetMarker.MarketCode}`

                let item = _.find(currentState, { MarketCode: targetMarker.MarketCode })
                item.NOTE = res

                let newState = _.cloneDeep(currentState)

                dispatch({
                    type: SET_OPEN_EXITING_MARKET_MARKER_REQUEST,
                    payload: newState
                })
            }
            else {
                let item = _.find(currentState, { BranchCode: targetMarker.BranchCode })
                item.NOTE = res

                let newState = _.cloneDeep(currentState)

                dispatch({
                    type: SET_OPEN_BRANCH_MARKER_REQUEST,
                    payload: newState
                })
            }

            console.log("Save Note : ", res)

            success(load)
        })
}

export const insertUpdateMarkerNoteCA = (criteria, type, loading, success, currentState) => dispatch => {
    const load = loading()

    fetch(INSERT_UPDATE_MARKER_NOTE_URL, {
        method: type.toUpperCase(),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(criteria),
        timeout: 1500000
    })
        .then(res => (res.json()))
        .then(res => {

            if (type == 'post') {
                currentState.push(res[0])

                let newState = _.cloneDeep(currentState)

                dispatch({
                    type: EDIT_NOTE_CA_SUCCESS,
                    payload: newState
                })
            }
            else {
                let item = _.find(currentState, { SysNO: criteria.SysNO })

                currentState[0] = res[0]

                let newState = _.cloneDeep(currentState)

                dispatch({
                    type: EDIT_NOTE_CA_SUCCESS,
                    payload: newState
                })
            }

            success(load)
        })
}

export const getCASummaryOnlyData = CAID => dispatch => {
    dispatch({
        [CALL_API]: {
            endpoint: `${GET_CA_SUMMARY_ONLY_URL}${CAID}`,
            method: 'GET',
            types: [GET_CA_SUMMARY_ONLY_REQUEST, GET_CA_SUMMARY_ONLY_SUCCESS, GET_CA_SUMMARY_ONLY_FAILURE]
        }
    })
}


