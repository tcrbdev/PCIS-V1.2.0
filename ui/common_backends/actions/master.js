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
    ON_OPEN_MAIN_MENU,
    ON_DRAG_EVENT_CALENDAR,

    LOAD_CALENDAR_MASTER_EVENTS_REQUEST,
    LOAD_CALENDAR_MASTER_EVENTS_SUCCESS,
    LOAD_CALENDAR_MASTER_EVENTS_FAILED,

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

import {
    CALENDAR_MASTER_EVENTS_URL,
    CALENDAR_EVENTS_URL,
    CALENDAR_EVENTS_CONFIRM_URL,
    CALENDAR_EVENTS_ACKNOWLEDGE_URL
} from '../constants/endpoints'

export const setOnOpenMainMenu = (isOpen) => dispatch => dispatch({ type: ON_OPEN_MAIN_MENU, payload: isOpen })

export const setOnDragEventCalendar = (isDrag) => dispatch => dispatch({ type: ON_DRAG_EVENT_CALENDAR, payload: isDrag })

export const getCalendarMasterEvents = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${CALENDAR_MASTER_EVENTS_URL}`,
            method: 'GET',
            types: [LOAD_CALENDAR_MASTER_EVENTS_REQUEST, LOAD_CALENDAR_MASTER_EVENTS_SUCCESS, LOAD_CALENDAR_MASTER_EVENTS_FAILED]
        }
    })
})

export const getCalendarEvent = () => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${CALENDAR_EVENTS_URL}`,
            method: 'GET',
            types: [LOAD_CALENDAR_EVENT_REQUEST, LOAD_CALENDAR_EVENT_SUCCESS, LOAD_CALENDAR_EVENT_FAILED]
        }
    })
})

export const insertCalendarEvent = (value, current_data, success_callback) => ((dispatch) => {
    // Insert
    //    @E_EmployeeCode nvarchar(50) = NULL ,
    //    @E_Type_Code nvarchar(50) = NULL ,
    //    @E_Title nvarchar(max) = NULL ,
    //    @E_Description nvarchar(max) = NULL ,
    //    @E_Location nvarchar(max) = NULL ,
    //    @E_Latitude nvarchar(200) = NULL ,
    //    @E_Longitude nvarchar(200) = NULL ,
    //    @E_Start datetime = NULL ,
    //    @E_End datetime = NULL ,
    //    @E_IsAllDay nvarchar(1) = NULL ,
    //    @E_InviteStatus nvarchar(50) = NULL ,
    //    @E_InviteBy nvarchar(max) = NULL ,
    //    @E_CreateBy nvarchar(200) = NULL ,
    //    @E_InviteCC nvarchar(max) = NULL

    dispatch({ type: INSERT_CALENDAR_EVENT_REQUEST })

    fetch(`${CALENDAR_EVENTS_URL}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value),
        timeout: 1500000
    })
        .then(res => (res.json()))
        .then(res => {

            let new_data = _.unionBy(current_data, res, 'E_Id')

            dispatch({
                type: INSERT_CALENDAR_EVENT_SUCCESS,
                payload: new_data
            })

            console.log("Success Insert : ", res, new_data, current_data)

        })
})

export const updateCalendarEvent = (value, current_data, success_callback) => ((dispatch) => {
    // Update
    // @E_Id int ,
    // @E_Description nvarchar(max) = NULL ,
    // @E_Location nvarchar(max) = NULL ,
    // @E_Latitude nvarchar(200) = NULL ,
    // @E_Longitude nvarchar(200) = NULL ,
    // @E_Start datetime = NULL ,
    // @E_End datetime = NULL ,
    // @E_IsAllDay nvarchar(1) = NULL ,
    // @E_IsDelete nvarchar(1) = NULL ,
    // @E_InviteStatus nvarchar(50) = NULL ,
    // @E_InviteBy nvarchar(max) = NULL ,
    // @E_UpdateBy nvarchar(200) = NULL ,
    // @E_InviteCC nvarchar(max) = NULL

    dispatch({ type: UPDATE_CALENDAR_EVENT_REQUEST })

    fetch(`${CALENDAR_EVENTS_URL}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value),
        timeout: 1500000
    })
        .then(res => (res.json()))
        .then(res => {

            let new_data = _.cloneDeep(current_data)

            _.remove(new_data, { E_Id: value.E_Id })

            if (value.E_IsDelete == 'Y') {

                dispatch({
                    type: DELETE_CALENDAR_EVENT_SUCCESS,
                    payload: new_data
                })
            }
            else {
                console.log(res)
                new_data = _.unionBy(new_data, res, 'E_Id')

                dispatch({
                    type: UPDATE_CALENDAR_EVENT_SUCCESS,
                    payload: new_data
                })
            }
            // let new_data = _.unionBy(current_data, res, 'E_Id')

            console.log("Success Update : ", res, new_data, current_data)
        })
})

export const confirmCalendarEvent = (value) => ((dispatch) => {
    // Confirm
    // @E_Id int ,
    // @E_IsConfirm nvarchar(1) = NULL ,
    // @E_UpdateBy nvarchar(200) = NULL 
    dispatch({
        [CALL_API]: {
            endpoint: `${CALENDAR_EVENTS_URL}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(value),
            types: [INSERT_CALENDAR_EVENT_REQUEST, INSERT_CALENDAR_EVENT_SUCCESS, INSERT_CALENDAR_EVENT_FAILED]
        }
    })
})

export const acknowledgeCalendarEvent = (value) => ((dispatch) => {
    // Acknowledge
    // 1 acknowledge , 2 pedding acknowledge , 3 cancel acknowledge
    // @E_Id int ,
    // @E_AcknowledgeStatus nvarchar(50) = NULL ,
    // @E_UpdateBy nvarchar(200) = NULL 
    dispatch({
        [CALL_API]: {
            endpoint: `${CALENDAR_EVENTS_URL}`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: JSON.stringify(value),
            types: [INSERT_CALENDAR_EVENT_REQUEST, INSERT_CALENDAR_EVENT_SUCCESS, INSERT_CALENDAR_EVENT_FAILED]
        }
    })
})