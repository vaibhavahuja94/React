import axios from 'axios'
import { HeaderWithToken } from '../../Services/headerServices';

function registerUsersPending(){
    return{
        type:'REGISTERUSERPENDING'
    }
}

function registerUsersError(error){
    return{
        type:'REGISTERUSERERROR',
        payload:error
    }
}

function registerUsersSuccess(data){
    return{
        type:'REGISTERUSERSUCCESS',
        payload:data
    }
}

function registerContactSuccess(data){
    return{
        type:'REGISTER_CONTACT_SUCCESS',
        payload:data
    }
}

function updateUsersSuccess(data){
    return{
        type:'UPDATEUSERSUCCESS',
        payload:data
    }
}

function updateUsersPasswordSuccess(data){
    return{
        type:'UPDATEUSERPASSWORDSUCCESS',
        payload:data
    }
}

export function registerUsers(data1) {
    return dispatch => {
        dispatch(registerUsersPending());
        axios.post('http://localhost:3003/userData',data1)
        .then(res => {
            dispatch(registerUsersSuccess("Data Inserted SuccessFully"));
            return res.data;
        })
        .catch(error => {
            dispatch(registerUsersError("Unable to Register"));
        })
    }
}

export function registerContact(data1) {
    return dispatch => {
        dispatch(registerUsersPending());
        axios.post('http://localhost:3003/Contact',data1)
        .then(res => {
            dispatch(registerContactSuccess("Data Inserted SuccessFully"));
            return res.data;
        })
        .catch(error => {
            dispatch(registerUsersError("Unable to Register"));
        })
    }
}


export function updateUserPassword(data1) {
    return dispatch => {
        dispatch(registerUsersPending());
        let user1 = JSON.parse(localStorage.getItem('user'))
        if(user1.password===data1.oldPassword)
        {
        let dat = {password:data1.newPassword}
        user1.password=data1.newPassword
        localStorage.setItem('user',JSON.stringify(user1))
        axios.patch(`http://localhost:3003/userData/${data1.id}`,dat,HeaderWithToken())
        .then(res => {
            
            dispatch(updateUsersPasswordSuccess("Password Updated SuccessFully"));
            return res.data;
        })
        .catch(error => {
            dispatch(registerUsersError("Unable to Register"));
        })
        }
        else{dispatch(registerUsersError("Unable to Update"));}
}
}

export function updateUserImage(data1) {
    return dispatch => {
        dispatch(registerUsersPending());
        let user1 = JSON.parse(localStorage.getItem('user'))
        let dat = {imgSrc:data1.imgSrc}
        user1.imgSrc=data1.imgSrc
        localStorage.setItem('user',JSON.stringify(user1))
        axios.patch(`http://localhost:3003/userData/${data1.id}`,dat,HeaderWithToken())
        .then(res => {
            
            dispatch(updateUsersPasswordSuccess("Image Updated SuccessFully"));
            return res.data;
        })
        .catch(error => {
            dispatch(registerUsersError("Unable to Register"));
        })
        
}
}

export function updateUser(data1) {
    return dispatch => {
        dispatch(registerUsersPending());
        axios.patch(`http://localhost:3003/userData/${data1.id}`,data1,HeaderWithToken())
        .then(res => {
            let user = JSON.parse(localStorage.getItem('user'))
            axios.get(`http://localhost:3003/userData/${user.id}`)
            .then(res=>
                {
                let user1 = res.data
                localStorage.setItem('user',JSON.stringify(user1))
                localStorage.setItem('token',(user1.id))
                }
            )
            dispatch(updateUsersSuccess(res.data));
            return res.data;
        })
        .catch(error => {
            dispatch(registerUsersError("Unable to Register"));
        })
            
        
}
}
