import axios from 'axios';
import { HeaderWithToken } from '../../Services/headerServices';
import { toast } from 'react-toastify'

export function getBlogIdSuccess(data) {// Template Redux
    return {
        type: 'GETBLOGIDSUCCESS',
        payload: data
    }
}

function getPageIdSuccess(data) {
    return {
        type: 'GETPAGEIDSUCCESS',
        payload: data
    }
}

function getBlogIdPending() {
    return {
        type: 'GETBLOGIDPENDING'
    }
}

function getBlogIdError(error) {
    return {
        type: 'GETBLOGIDERROR',
        payload: error
    }
}

//fetchBlog
export function fetchIdTemplate(name) {
    return async (dispatch) => {
        debugger
        console.log(name)
        await axios.get(`https://w3bizz.com/template/classes/getTemplate.php?username=${name}`)
            .then(res => {
                debugger
                dispatch(getBlogIdSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(getBlogIdError("Unable To Fetch Data"));
            })
    }
}

export async function fetchIdPage() {
    return async (dispatch) => {
        await axios.get(`https://w3bizz.com/template/classes/getTemplate.php`)
            .then(async (res) => {
                await dispatch(getPageIdSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(getBlogIdError("Unable To Fetch Data"));
            })
    }
}

export async function createTemplate(data1) {
    return async (dispatch) => {
        dispatch(getBlogIdPending());
        await axios.post(`https://w3bizz.com/template/classes/addTemplate.php`, data1, HeaderWithToken())
            .then(res => {
                toast.success("Template Created Successfully")
                dispatch(fetchIdTemplate());
                return res.data;
            })
            .catch(error => {
                dispatch(getBlogIdError("Unable to Register"));
            })
    }
}

// export function createPage(data1, username) {
//         return async (dispatch) => {
//             await axios.post(`https://w3bizz.com/template/classes/addPage.php`, data1)
//                 .then(async (res) => {
//                     toast.success("Page Created Successfully")
//                     debugger
//                     await axios.get(`https://w3bizz.com/template/classes/getTemplate.php?username=${username}`)
//                         .then(res => {
//                             debugger
//                             dispatch(getBlogIdSuccess(res.data));
//                         })
//                 })
//                 .catch(error => {
//                     getBlogIdError("Unable to Register");
//                 })
//         }
// }

// export function delete(id){
//     return dispatch => {
//         dispatch(getBlogIdPending());
//         axios.delete(`http://localhost:3003/blogData/${id}`,HeaderWithToken())
//         .then(res => {
//             axios.get('http://localhost:3003/status',HeaderWithToken())
//             .then(res=>{
//                 var data1 = res.data.filter(val=>val.blog_id===id);
//                 if(data1){
//                     data1.map(val=>
//                     axios.delete(`http://localhost:3003/status/${val.id}`,HeaderWithToken())
//                     );
//                 }

//             })
//             axios.get('http://localhost:3003/comments',HeaderWithToken())
//             .then(res=>{
//                 var data2 = res.data.filter(val=>val.blog_id===id)
//                 if(data2){
//                 data2.map(val=>
//                 axios.delete(`http://localhost:3003/comments/${val.id}`,HeaderWithToken())
//                 );
//                 }

//             })
//             toast.warn("Blog Deleted Successfully")
//             dispatch(fetchIdBlog());
//             return res.data;
//         })
//         .catch(error => {
//             dispatch(getBlogIdError("Unable to Register"));
//         })
//     }
// }