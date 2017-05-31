import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { MASTER_ALL } from './master'
import { AUTH } from './login'

export default combineReducers({
    routing: routerReducer,
    AUTH: AUTH,
    MASTER_ALL: MASTER_ALL
})
