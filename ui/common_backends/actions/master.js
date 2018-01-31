import bluebird from 'bluebird'
import fetch from 'isomorphic-fetch'
import _ from 'lodash'
import { CALL_API } from 'redux-api-middleware'

import {
    AUTH_REQUEST,
    AUTH_SUCCESS,
    AUTH_FAILURE,

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
    LOAD_CALENDAR_MASTER_BRANCH_LOCATION_FAILED,

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
    API_LOGIN,
    CALENDAR_MASTER_EVENTS_URL,
    CALENDAR_EVENTS_URL,
    CALENDAR_EVENTS_CONFIRM_URL,
    CALENDAR_EVENTS_ACKNOWLEDGE_URL,
    CALENDAR_MASTER_BRANCH_LOCATION_URL,
    MASTER_ORGANIZATION_TEAM_URL
} from '../constants/endpoints'

export const authenticate = (values) => (
    (dispatch) =>
        dispatch({
            [CALL_API]: {
                endpoint: API_LOGIN,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(values),
                types: [
                    AUTH_REQUEST, {
                        type: AUTH_SUCCESS,
                        payload: (_action, _state, res) => {
                            return res.json().then((auth) => {
                                auth[0].EmpName_EN = auth[0].EmpName_EN.replace("+", ' ')
                                auth[0].EmpName_TH = auth[0].EmpName_TH.replace("+", ' ')

                                return auth[0]
                            })
                        }
                    },
                    AUTH_FAILURE
                ]
            }
        })
)

export const setAuthentication = AUTH_INFO => dispatch => {
    AUTH_INFO.EmpName_EN = AUTH_INFO.EmpName_EN.replace("+", ' ')
    AUTH_INFO.EmpName_TH = AUTH_INFO.EmpName_TH.replace("+", ' ')

    dispatch({ type: SET_AUTHENTICATION_REQUEST, payload: AUTH_INFO })
}

export const setEmployeeInformation = (AUTH_INFO, obj) => dispatch => {
    dispatch({ type: SET_EMPLOYEE_INFO_REQUEST, payload: AUTH_INFO })
    loadCalendarEvent(AUTH_INFO, obj, dispatch)
}

export const jsonToQueryString = (json) => {
    return '?' +
        Object.keys(json).map(function (key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}

export const setOnOpenMainMenu = (isOpen) => dispatch => dispatch({ type: ON_OPEN_MAIN_MENU, payload: isOpen })

export const setOnDragEventCalendar = (isDrag) => dispatch => dispatch({ type: ON_DRAG_EVENT_CALENDAR, payload: isDrag })

export const getOrganizationTem = (AUTH_INFO, obj) => ((dispatch) => {
    let query = ''

    if (obj) {
        query = jsonToQueryString({ EmployeeCode: AUTH_INFO.EmployeeCode, ...obj })
    }
    else {
        query = jsonToQueryString({ EmployeeCode: AUTH_INFO.EmployeeCode })
    }

    dispatch({
        [CALL_API]: {
            endpoint: `${MASTER_ORGANIZATION_TEAM_URL}/${query}`,
            method: 'GET',
            types: [LOAD_MASTER_ORGANIZATION_TEAM_REQUEST, LOAD_MASTER_ORGANIZATION_TEAM_SUCCESS, LOAD_MASTER_ORGANIZATION_TEAM_FAILED]
        }
    })
})

export const getCalendarMasterEvents = (AUTH_INFO) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${CALENDAR_MASTER_EVENTS_URL}/${AUTH_INFO.EmployeeCode}`,
            method: 'GET',
            types: [LOAD_CALENDAR_MASTER_EVENTS_REQUEST, LOAD_CALENDAR_MASTER_EVENTS_SUCCESS, LOAD_CALENDAR_MASTER_EVENTS_FAILED]
        }
    })
})

export const getCalendarMasterBranchLocation = (AUTH_INFO) => ((dispatch) => {
    dispatch({
        [CALL_API]: {
            endpoint: `${CALENDAR_MASTER_BRANCH_LOCATION_URL}`,
            method: 'GET',
            types: [LOAD_CALENDAR_MASTER_BRANCH_LOCATION_REQUEST, LOAD_CALENDAR_MASTER_BRANCH_LOCATION_SUCCESS, LOAD_CALENDAR_MASTER_BRANCH_LOCATION_FAILED]
        }
    })
})

export const getCalendarEvent = (AUTH_INFO, obj) => ((dispatch) => {
    loadCalendarEvent(AUTH_INFO, obj, dispatch)
})

const loadCalendarEvent = (AUTH_INFO, obj, dispatch) => {
    let query = ''

    if (obj) {
        query = jsonToQueryString({ empcode: AUTH_INFO.EmployeeCode, ...obj })
    }
    else {
        query = jsonToQueryString({ empcode: AUTH_INFO.EmployeeCode })
    }

    dispatch({
        [CALL_API]: {
            endpoint: `${CALENDAR_EVENTS_URL}/${query}`,
            method: 'GET',
            types: [LOAD_CALENDAR_EVENT_REQUEST, LOAD_CALENDAR_EVENT_SUCCESS, LOAD_CALENDAR_EVENT_FAILED]
        }
    })
}

export const insertCalendarEvent = (value, current_data, success_callback) => ((dispatch) => {
    // Insert
    //    @E_EmployeeCode nvarchar(50) = NULL ,
    //    @E_Type_Code nvarchar(50) = NULL ,
    //    @E_Title nvarchar(max) = NULL ,
    //    @E_Description nvarchar(max) = NULL ,
    //    @E_Location nvarchar(max) = NULL ,
    //    @E_LocationCode nvarchar(max) = NULL ,
    //    @E_LocationMode nvarchar(max) = NULL ,
    //    @E_LocationType nvarchar(max) = NULL ,
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

            let new_data = _.unionBy(current_data[0], res[0], 'E_Id')

            let new_confirm_data = _.unionBy(current_data[1], res[1], 'E_Id')

            dispatch({
                type: INSERT_CALENDAR_EVENT_SUCCESS,
                payload: [new_data, new_confirm_data]
            })
            success_callback('success', 'Create Event Success', 'Please check in your calendar.')
            console.log("Success Insert : ", res, new_data, new_confirm_data)

        }).catch(function (error) {
            success_callback('error', 'Create Event Failed', 'Please contanct administrator for support your data. Sorry for your inconvenience.')
        })
})

export const updateCalendarEvent = (value, current_data, success_callback) => ((dispatch) => {
    // Update
    // @E_Id int ,
    // @E_Description nvarchar(max) = NULL ,
    // @E_Location nvarchar(max) = NULL ,
    // @E_LocationCode nvarchar(max) = NULL ,
    // @E_LocationMode nvarchar(max) = NULL ,
    // @E_LocationType nvarchar(max) = NULL ,
    // @E_Latitude nvarchar(200) = NULL ,
    // @E_Longitude nvarchar(200) = NULL ,
    // @E_Start datetime = NULL ,
    // @E_End datetime = NULL ,
    // @E_IsAllDay nvarchar(1) = NULL ,
    // @E_IsDelete nvarchar(1) = NULL ,
    // @E_IsConfirm nvarchar(1) = NULL ,
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

            let new_data = _.cloneDeep(current_data[0])
            let new_confirm_data = _.cloneDeep(current_data[1])

            _.remove(new_data, { E_Id: value.E_Id })
            _.remove(new_confirm_data, { E_Id: value.E_Id })

            if (value.E_IsDelete == 'Y') {

                dispatch({
                    type: DELETE_CALENDAR_EVENT_SUCCESS,
                    payload: [new_data, new_confirm_data]
                })

                success_callback('success', 'Delete Event Success', 'If you want to rollback event please contact admin.')
            }
            else {
                new_data = _.unionBy(new_data, res[0], 'E_Id')
                new_confirm_data = _.unionBy(new_confirm_data, res[1], 'E_Id')

                dispatch({
                    type: UPDATE_CALENDAR_EVENT_SUCCESS,
                    payload: [new_data, new_confirm_data]
                })

                success_callback('success', 'Update Event Success', 'Please check for more information in your calendar.')
            }
            // let new_data = _.unionBy(current_data, res, 'E_Id')

            console.log("Success Update : ", res, new_data, current_data)
        }).catch(function (error) {
            success_callback('error', 'Update Event Failed', 'Please contanct administrator for support your data. Sorry for your inconvenience.')
        })
})

// export const confirmCalendarEvent = (value) => ((dispatch) => {
//     // Confirm
//     // @E_Id int ,
//     // @E_IsConfirm nvarchar(1) = NULL ,
//     // @E_UpdateBy nvarchar(200) = NULL 
//     dispatch({
//         [CALL_API]: {
//             endpoint: `${CALENDAR_EVENTS_URL}`,
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             method: 'PATCH',
//             body: JSON.stringify(value),
//             types: [INSERT_CALENDAR_EVENT_REQUEST, INSERT_CALENDAR_EVENT_SUCCESS, INSERT_CALENDAR_EVENT_FAILED]
//         }
//     })
// })

// export const acknowledgeCalendarEvent = (value) => ((dispatch) => {
//     // Acknowledge
//     // 1 acknowledge , 2 pedding acknowledge , 3 cancel acknowledge
//     // @E_Id int ,
//     // @E_AcknowledgeStatus nvarchar(50) = NULL ,
//     // @E_UpdateBy nvarchar(200) = NULL 
//     dispatch({
//         [CALL_API]: {
//             endpoint: `${CALENDAR_EVENTS_URL}`,
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             method: 'PATCH',
//             body: JSON.stringify(value),
//             types: [INSERT_CALENDAR_EVENT_REQUEST, INSERT_CALENDAR_EVENT_SUCCESS, INSERT_CALENDAR_EVENT_FAILED]
//         }
//     })
// })