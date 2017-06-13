import bluebird from 'bluebird'
import config from '../../config'
import { Cookies } from 'react-cookie';
import fetch from 'isomorphic-fetch'
const cookie = new Cookies()


import {
    MASTER_PROVINCE,
    MASTER_AMPHUR,
    MASTER_DISTRICT,
    MASTER_SOURCE_TYPE,
    MASTER_CHANNEL_TYPE,
    MASTER_BUSINESS_TYPE,
    MASTER_INTERESTING_PRODUCT,
    MASTER_OPPORTUNITY_CUSTOMER,
    MASTER_PRESENT_PRODUCT_TYPE,
    MASTER_BUSINESS_PREFIX,
    MASTER_APPOINTMENT_REASON,
    MASTER_PREFIX
} from '../constants/endpoints'

import { MASTER_ALL_SUCCESS } from '../constants/actionsType'

export const getMasterAll = (token) => ((dispatch) => {

    const token = cookie.get(config.tokenName, { path: config.tokenPath })

    var headers = {
        'x-access-token': token
    }

    let api = [
        fetch(MASTER_PROVINCE).then(res => (res.json())),
        fetch(MASTER_AMPHUR).then(res => (res.json())),
        fetch(MASTER_DISTRICT).then(res => (res.json())),
        fetch(MASTER_SOURCE_TYPE).then(res => (res.json())),
        fetch(MASTER_CHANNEL_TYPE).then(res => (res.json())),
        fetch(MASTER_BUSINESS_TYPE).then(res => (res.json())),
        fetch(MASTER_INTERESTING_PRODUCT).then(res => (res.json())),
        fetch(MASTER_OPPORTUNITY_CUSTOMER).then(res => (res.json())),
        fetch(MASTER_PRESENT_PRODUCT_TYPE).then(res => (res.json())),
        fetch(MASTER_BUSINESS_PREFIX).then(res => (res.json())),
        fetch(MASTER_APPOINTMENT_REASON).then(res => (res.json())),
        fetch(MASTER_PREFIX).then(res => (res.json())),
    ]

    bluebird.all(api).spread((
        province,
        amphur,
        district,
        source_type,
        channel_type,
        business_type,
        interesting_product,
        opportunity_customer,
        present_product_type,
        business_prefix,
        appointment_reason,
        prefix) => {
        dispatch({
            type: MASTER_ALL_SUCCESS, payload: {
                province,
                amphur,
                district,
                source_type,
                channel_type,
                business_type,
                interesting_product,
                opportunity_customer,
                present_product_type,
                business_prefix,
                appointment_reason,
                prefix
            }
        })
    }).catch(err => {
        console.error(`Error : ${err}`)
    })
})