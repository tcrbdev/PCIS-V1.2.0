import bluebird from 'bluebird'
import fetch from 'isomorphic-fetch'
import _ from 'lodash'
import { CALL_API } from 'redux-api-middleware'

import {
    LOAD_NANO_MASTER_ALL_REQUEST,
    LOAD_NANO_MASTER_ALL_SUCCESS,
    LOAD_NANO_MASTER_ALL_FAILURE
} from '../../common/constants/actionsType'

import {
    ON_DRAG_EVENT_CALENDAR
} from '../constants/actionType'

import {
    MASTER_REGION_URL,
    MASTER_AREA_URL,
    MASTER_BRANCH_URL,
    MASTER_TARGET_MARKET_PROVINCE_URL,
    MASTER_CALIST_URL,
    MASTER_COMPLITITOR_PROVINCE_URL
} from '../../common/constants/endpoints'

export const setOnDragEventCalendar = (isDrag) => dispatch => dispatch({ type: ON_DRAG_EVENT_CALENDAR, payload: isDrag })

export const getNanoMasterData = (auth = {}) => ((dispatch) => {

    dispatch({
        type: LOAD_NANO_MASTER_ALL_REQUEST,
        payload: {}
    })

    let token = ''
    if (!_.isEmpty(auth)) {
        token = auth.Session.sess_empcode
    }

    let api = [
        fetch(`${MASTER_REGION_URL}/${token}`).then(res => (res.json())),
        fetch(`${MASTER_AREA_URL}/${token}`).then(res => (res.json())),
        fetch(`${MASTER_BRANCH_URL}/${token}`).then(res => (res.json())),
        fetch(`${MASTER_TARGET_MARKET_PROVINCE_URL}/${token}`).then(res => (res.json())),
        fetch(`${MASTER_CALIST_URL}/${token}`).then(res => (res.json())),
        fetch(`${MASTER_COMPLITITOR_PROVINCE_URL}/${token}`).then(res => (res.json())),
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
                AUTH_NANO_USER: auth
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