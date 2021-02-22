import {toast} from 'react-toastify'

const initialState = {
    pending: false,
    data: [],
    error: ""
}

export default function LoginReducer(state = initialState, action) {
    switch(action.type) {
            case 'LOGINUSERREQUEST':
             
            return {
                ...state,
                pending: true
            }
        case 'LOGINUSERSUCCESS':
            toast.success("Login SuccessFul")
            return {
                ...state,
                pending: false,
                data: action.payload,
            }
        case 'LOGINUSERERROR':
            toast.error("Login UnssessFul")
            return {
                ...state,
                pending: false,
                error: action.payload
            }
        default: 
            return state;
    }
}
