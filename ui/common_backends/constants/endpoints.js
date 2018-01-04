//-------------------- FOR NANO MAP
let url = "", urlPcis = "http://tc001pcis1p/newservices/LBServices.svc/";
if (process.env.NODE_ENV === 'dev')
    url = `http://localhost:60001`
else
    url = `http://TC001PCIS1P:60001`

export const CALENDAR_MASTER_EVENTS_URL = `${url}/calendar/master/events/`
export const CALENDAR_EVENTS_URL = `${url}/calendar/events/`
export const CALENDAR_EVENTS_CONFIRM_URL = `${url}/calendar/events/confirm/`
export const CALENDAR_EVENTS_ACKNOWLEDGE_URL = `${url}/calendar/events/acknowledge/`

