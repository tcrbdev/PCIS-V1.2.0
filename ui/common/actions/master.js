import bluebird from 'bluebird'

import {
    MASTER_PROVINCE,
    MASTER_AMPHUR,
    MASTER_DISTRICT
} from '../constants/endpoints'

export const getMasterAll = () => ((dispatch) => {

    dispatch({ type: 'ALL_LOAD', payload: {} })

    let api = [
        fetch(MASTER_PROVINCE).then(res => (res.json())),
        fetch(MASTER_AMPHUR).then(res => (res.json())),
        fetch(MASTER_DISTRICT).then(res => (res.json()))
    ]

    bluebird.all(api).spread((province, amphur, district) => {
        dispatch({
            type: 'ALL_SUCCESS', payload: {
                province,
                amphur,
                district
            }
        })
    }).catch(err => {
        console.error(`Error : ${err}`)
    })
})