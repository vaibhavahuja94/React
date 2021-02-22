import axios from 'axios';

function getUsersSuccess(data){
    return{
        type:'GETUSERSUCCESS',
        payload:data
    }
}

function getUsersByIdSuccess(data){
    return{
        type:'GETUSERBYIDSUCCESS',
        payload:data
    }
}

function getUsersPending(){
    return{
        type:'GETUSERPENDING'
    }
}

function getUsersError(error){
    return{
        type:'GETUSERERROR',
        payload:error
    }
}

export function fetchUser() {
    return dispatch => {
        dispatch(getUsersPending());
        axios.get('http://localhost:3003/userData')
        .then(res => {
            dispatch(getUsersSuccess(res.data));
            return res.data;
        })
        .catch(error => {
            dispatch(getUsersError("Unable To Fetch Data"));
        })
    }
}

export function fetchUserById() {
    return dispatch => {
        dispatch(getUsersPending());
        let id = localStorage.getItem('token')
        
        axios.get(`http://localhost:3003/userData/${id}`)
        .then(res => {
         
            dispatch(getUsersByIdSuccess(res.data));
            return res.data;
        })
        .catch(error => {
            dispatch(getUsersError("Unable To Fetch Data"));
        })
    }
}
