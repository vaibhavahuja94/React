import axios from 'axios';
import { HeaderWithToken } from '../../Services/headerServices';

function getBlogSuccess(data){
    return{
        type:'GETBLOGSUCCESS',
        payload:data
    }
}

function getBlogPending(){
    return{
        type:'GETBLOGPENDING'
    }
}

function getBlogError(error){
    return{
        type:'GETBLOGERROR',
        payload:error
    }
}

export function fetchBlog() {
    return dispatch => {
        dispatch(getBlogPending())
        axios.get(`http://localhost:3003/blogData`,HeaderWithToken())
        .then(res => {
            dispatch(getBlogSuccess(res.data));
            return res.data;
        })
        .catch(error => {
            dispatch(getBlogError("Unable To Fetch Data"));
        })
    }
}
 

