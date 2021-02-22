import axios from 'axios';
import { HeaderWithToken } from '../../Services/headerServices';

function getBlogStatusSuccess(data){
    return{
        type:'GETBLOGSTATUSSUCCESS',
        payload:data
    }
}

function getBlogCommentSuccess(data){
    return{
        type:'GET_BLOG_COMMENT_SUCCESS',
        payload:data
    }
}

function getBlogStatusPending(){
    return{
        type:'GETBLOGSTATUSPENDING'
    }
}

function getBlogStatusError(error){
    return{
        type:'GETBLOGSTATUSERROR',
        payload:error
    }
}

export function fetchStatusBlog() {
    return dispatch => {
        dispatch(getBlogStatusPending())
        axios.get(`http://localhost:3003/status`,HeaderWithToken())
        .then(res => {
            dispatch(getBlogStatusSuccess(res.data));
            return res.data;
        })
        .catch(error => {
            dispatch(getBlogStatusError("Unable To Fetch Data"));
        })
    }
}

export function changeBlogStatus(data){
    return dispatch => {
        dispatch(getBlogStatusPending())
        axios.get(`http://localhost:3003/status`,HeaderWithToken())
        .then(res => {
        var user = res.data.find(data1=>(data1.user_id===data.user_id)&&(data1.blog_id===data.blog_id))
        if(user){
            if(user.status===data.status){
            axios.delete(`http://localhost:3003/status/${user.id}`,HeaderWithToken())
            }
            else if(user.status!==data.status){
            user.status = data.status
            axios.put(`http://localhost:3003/status/${user.id}`,user,HeaderWithToken())
            }
        }else{
            axios.post(`http://localhost:3003/status`,data,HeaderWithToken())
        }
            dispatch(fetchStatusBlog());
            return res.data;
        })
        .catch(error => {
            dispatch(getBlogStatusError("Unable To Fetch Data"));
        })
    }
}

export function fetchCommentBlog() {
    return dispatch => {
        dispatch(getBlogStatusPending())
        axios.get(`http://localhost:3003/comments`,HeaderWithToken())
        .then(res => {
            dispatch(getBlogCommentSuccess(res.data));
            return res.data;
        })
        .catch(error => {
            dispatch(getBlogStatusError("Unable To Fetch Data"));
        })
    }
}