import config from '../../config'

const root_new_service = 'lendingbranch'
const apiUri = `http://${config.apiHost}/${root_new_service}/LBServices.svc`
const apiDevUri = `http://${config.apiDevHost}:${config.apiDevPort}/api`

export const MASTER_PROVINCE = `${apiUri}/master/province`
export const MASTER_AMPHUR = `${apiUri}/master/amphur`
export const MASTER_DISTRICT = `${apiUri}/master/district`

export const API_LOGIN = `${apiDevUri}/authenticate`