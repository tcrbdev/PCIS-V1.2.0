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

const API_ROOT = 'http://localhost:5000/api/v1'
export const LOAD_ASSIGNMENT_GRID = `${apiDevUrl}/gridAssignment`
export const LOAD_ASSIGNMENT_CHART = `${apiDevUrl}/assignmentChart`


//-------------------- FOR NANO MAP
let url = "", urlPcis = "http://tc001pcis1p/newservices/LBServices.svc/";
if (process.env.NODE_ENV === 'dev')
    url = `http://localhost:60001`
else
    url = `http://TC001PCIS1P:60001`

export const MASTER_REGION_URL = `${url}/master/region`
export const MASTER_AREA_URL = `${url}/master/area`
export const MASTER_BRANCH_URL = `${url}/master/branch`
export const MASTER_TARGET_MARKET_PROVINCE_URL = `${url}/master/target/market/province`
export const MASTER_CALIST_URL = `${url}/master/calist`
export const MASTER_COMPLITITOR_PROVINCE_URL = `${url}/master/complititor/province`

export const SEARCH_NANO_MARKER_URL = `${url}/nano/marker`
export const SEARCH_COMPLITITOR_MARKER_URL = `${url}/master/complititor`
//--------------------------------------- Nano Summary Report
export const SEARCH_PRODUCT_PERFORMANCE_URL = `${url}/nano/product/performance`
export const SEARCH_TOTAL_SUMMARY_URL = `${url}/nano/total/summary`
export const SEARCH_GROUP_BY_SUMMARY_URL = `${url}/nano/groupby/summary`
export const SEARCH_GROUP_BY_MARKET_SUMMARY_URL = `${url}/nano/groupby/market/summary`
export const GET_CA_SUMMARY_ONLY_URL = `${url}/nano/ca/summary/`


export const GET_BRANCH_MARKER_DATA_URL = `${url}/nano/branch/`
export const GET_BRANCH_IMAGE_MARKER_URL = `${urlPcis}/nano/branch/image/list/`
export const GET_EXITING_MARKET_MARKER_DATA_URL = `${url}/nano/market/`
export const GET_EXITING_MARKET_IMAGE_MARKER_URL = `${urlPcis}/nano/market/image/list/`


export const INSERT_UPDATE_MARKER_NOTE_URL = `${url}/nano/marker/note`

export const GET_PORTFOLIO_QUALITY_CHART_URL = `${url}/nano/portfolioquality/chart`

