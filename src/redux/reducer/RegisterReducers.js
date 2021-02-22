import {toast} from 'react-toastify'

const initialState = {
    pending: false,
    data: [],
    error: null
}

export default function registerReducer(state = initialState, action) {
    switch(action.type) {
            case 'REGISTERUSERPENDING': 
            return {
                ...state,
                pending: true
            }
        case 'REGISTERUSERSUCCESS':
            toast.success("Registration Successful")
            return {
                ...state,
                pending: false,
                data: action.payload
            }
            case 'REGISTER_CONTACT_SUCCESS':
                toast.success("Contact Saved SuccessFul")
            return {
                ...state,
                pending: false,
                data: action.payload
            }
            case 'UPDATEUSERSUCCESS':
                toast.success("Data Update SuccessFul")
            return {
                ...state,
                pending: false,
                data: action.payload,
                
            }
            case 'UPDATEUSERPASSWORDSUCCESS':
                toast.success('Updated succesful')
            return {
                ...state,
                pending: false,
                data: action.payload
            }
        case 'REGISTERUSERERROR':
            toast.error('Registeration or Update Unseccesfull')
            return {
                ...state,
                pending: false,
                error: action.payload
            }
        default: 
            return state;
    }
}

