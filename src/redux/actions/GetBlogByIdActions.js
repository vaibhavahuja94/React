import axios from 'axios';
import { HeaderWithToken } from '../../Services/headerServices';
import { toast } from 'react-toastify'

export function getBlogIdSuccess(data) {// Template Redux
    return {
        type: 'GETBLOGIDSUCCESS',
        payload: data
    }
}

export function getAdminBlogIdSuccess(data) {// Template Redux
    return {
        type: 'GETADMINBLOGIDSUCCESS',
        payload: data
    }
}

export function defaultPagesSuccess(data) {// Template Redux
    return {
        type: 'GETDEFAULTPAGESUCCESS',
        payload: data
    }
}

export function publishedTemplates(data) {
    return {
        type: 'GETPUBLISEDTEMPLATES',
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
        await axios.get(`https://w3bizz.com/template/classes/getTemplate.php?username=${name}`)
            .then(res => {
                const data = res.data
                dispatch(getBlogIdSuccess(data.DEFAULT_TEMPLATE));
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
