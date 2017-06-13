import config from '../../config'

const root_new_service = 'lendingbranch'
const apiUri = `http://${config.apiHost}/${root_new_service}/LBServices.svc`
const apiDevUri = `http://${config.apiDevHost}:${config.apiDevPort}/api`
const apiDevUrl = `http://${config.apiDevHost}:${config.apiDevPort}`

export const MASTER_PROVINCE = `${apiDevUrl}/master/province`
export const MASTER_AMPHUR = `${apiDevUrl}/master/amphur`
export const MASTER_DISTRICT = `${apiDevUrl}/master/district`
export const MASTER_SOURCE_TYPE = `${apiDevUrl}/master/sourcetype`
export const MASTER_CHANNEL_TYPE = `${apiDevUrl}/master/channeltype`
export const MASTER_BUSINESS_TYPE = `${apiDevUrl}/master/businesstype`
export const MASTER_INTERESTING_PRODUCT = `${apiDevUrl}/master/interestingproduct`
export const MASTER_OPPORTUNITY_CUSTOMER = `${apiDevUrl}/master/opportunitycustomer`
export const MASTER_PRESENT_PRODUCT_TYPE = `${apiDevUrl}/master/presentproducttype`
export const MASTER_BUSINESS_PREFIX = `${apiDevUrl}/master/businessprefix`
export const MASTER_APPOINTMENT_REASON = `${apiDevUrl}/master/appointmentreason`
export const MASTER_PREFIX = `${apiDevUrl}/master/prefix`

export const API_LOGIN = `${apiDevUri}/authenticate`