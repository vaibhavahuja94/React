import axios from 'axios'

export const loginUserError = (error) => {
    return{
        type:'LOGINUSERERROR',
        payload:error
    }
}

export const loginUserSuccess = (data) => {
    return{
        type:'LOGINUSERSUCCESS',
        payload:data
    }
}
