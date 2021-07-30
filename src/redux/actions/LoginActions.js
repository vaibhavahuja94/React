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


// export function loginUsers(data1) {
//     return dispatch => {
//     axios.get('http://localhost:3003/userData')
//         .then(res => {
//             var user = res.data
//             var user1 = user.find(values=>values.email===data1.email&&values.password===data1.password)
            
//             if(user1===undefined){
//                 throw(res.error)
//             }
//             localStorage.setItem('login',JSON.stringify(true))
//             localStorage.setItem('user',JSON.stringify(user1))
//             localStorage.setItem('token',(user1.id))
//             dispatch(loginUserSuccess(user1)) 
//         }).catch(err => {
//             dispatch(loginUserError("UserName or Password "));
//             return ({status:"ERROR" , data:[] , error:err})
//         })
//     }
// }

// export default {
//     loginUserError,
//     loginUserSuccess
// }