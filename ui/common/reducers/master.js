const initialState = {
    load: false,
    data: null
}

export const MASTER_ALL = (state = initialState, action) => {
    switch (action.type) {
        case 'ALL_LOAD':
            return { load: true, data: null }
            break;
        case 'ALL_SUCCESS':
            return { load: false, data: action.payload }
            break;
        default:
            return state
            break;
    }
}