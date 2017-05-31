import { CALL_API } from 'redux-api-middleware'
import { API_LOGIN } from '../constants/endpoints'
import { AUTH_REQUEST, AUTH_SUCCESS, AUTH_FAILURE } from '../constants/actionsType'

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
                                return auth
                            })
                        }
                    },
                    AUTH_FAILURE
                ]
            }
        })
)