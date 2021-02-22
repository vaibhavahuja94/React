const initialState = {
    pending: false,
    user: [],
    error: null
}

export default function newUserReducer(state = initialState, action) {
    switch(action.type) {
        case 'GETUSERPENDING': 
            return {
                ...state,
                pending: true
            }
        case 'GETUSERSUCCESS':
            return {
                ...state,
                pending: false,
                user: action.payload
            }
            case 'GETUSERBYIDSUCCESS':
                return {
                    ...state,
                    pending: false,
                    data: action.payload
                }
        case 'GETUSERERROR':
            return {
                ...state,
                pending: false,
                error: action.payload
            }
            
        default: 
            return state;
    }
}

