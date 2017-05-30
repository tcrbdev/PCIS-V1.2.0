import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { MASTER_ALL } from './master'

export default combineReducers({
    routing: routerReducer,

    MASTER_ALL: MASTER_ALL
})
