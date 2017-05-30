import config from '../../config'

const root_new_service = 'lendingbranch'
const apiUri = `http://${config.apiHost}/${root_new_service}/LBServices.svc`

export const MASTER_PROVINCE = `${apiUri}/master/province`
export const MASTER_AMPHUR = `${apiUri}/master/amphur`
export const MASTER_DISTRICT = `${apiUri}/master/district`