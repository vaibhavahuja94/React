import axios from 'axios';
import { HeaderWithToken } from '../../Services/headerServices';
import {toast} from 'react-toastify'

function getBlogIdSuccess(data){
    return{
        type:'GETBLOGIDSUCCESS',
        payload:data
    }
}

function getBlogIdPending(){
    return{
        type:'GETBLOGIDPENDING'
    }
}

function getBlogIdError(error){
    return{
        type:'GETBLOGIDERROR',
        payload:error
    }
}

//fetchBlog
export function fetchIdBlog() {
    return dispatch => {
        dispatch(getBlogIdPending())
        axios.get(`http://localhost:3003/blogData`,HeaderWithToken())
        .then(res => {
            let arr = res.data
            let user = JSON.parse(localStorage.getItem('user'))
            let data = arr.filter(values=>values.user_id===user.id);
            dispatch(getBlogIdSuccess(data));
            return res.data;
        })
        .catch(error => {
            dispatch(getBlogIdError("Unable To Fetch Data"));
        })
    }
}


export function createBlog(data1) {
    return dispatch => {
        dispatch(getBlogIdPending());
        axios.post(`http://localhost:3003/blogData`,data1,HeaderWithToken())
        .then(res => {
            toast.success("Blog Created Successfully")
            
            dispatch(fetchIdBlog());
            return res.data;
        })
        .catch(error => {
            dispatch(getBlogIdError("Unable to Register"));
        })
    }
}

export function createComment(data1) {
    return dispatch => {
        dispatch(getBlogIdPending());
        axios.post(`http://localhost:3003/comments`,data1,HeaderWithToken())
        .then(res => {
            toast.success("Comment Successfully")
            dispatch(fetchIdBlog());
            return res.data;
        })
        .catch(error => {
            dispatch(getBlogIdError("Unable to Comment"));
        })
    }
}

export function deleteBlog(id){
    return dispatch => {
        dispatch(getBlogIdPending());
        axios.delete(`http://localhost:3003/blogData/${id}`,HeaderWithToken())
        .then(res => {
            axios.get('http://localhost:3003/status',HeaderWithToken())
            .then(res=>{
                var data1 = res.data.filter(val=>val.blog_id===id);
                if(data1){
                    data1.map(val=>
                    axios.delete(`http://localhost:3003/status/${val.id}`,HeaderWithToken())
                    );
                }
                    
            })
            axios.get('http://localhost:3003/comments',HeaderWithToken())
            .then(res=>{
                var data2 = res.data.filter(val=>val.blog_id===id)
                if(data2){
                data2.map(val=>
                axios.delete(`http://localhost:3003/comments/${val.id}`,HeaderWithToken())
                );
                }
               
            })
            toast.warn("Blog Deleted Successfully")
            dispatch(fetchIdBlog());
            return res.data;
        })
        .catch(error => {
            dispatch(getBlogIdError("Unable to Register"));
        })
    }
}