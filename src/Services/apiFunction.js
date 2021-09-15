import axios from 'axios';

export function postLogin(fields) {
    return new Promise((resolve, reject) => {
        axios.post("https://w3bizz.com/template/login.php", fields)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    })
}

export function addPage(fields, username) {
    return new Promise((resolve, reject) => {
        axios.post("https://w3bizz.com/template/classes/addPage.php", fields)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}

export function uploadImage(data) {
    let formData = new FormData()
    formData.append("upload_preset","w3bizz_serdxz")
    formData.append("file", data)
    return new Promise((resolve, reject) => {
        axios.post("https://api.cloudinary.com/v1_1/w3bizz-com/image/upload", formData)
        .then((res)=>resolve(res))
        .catch((err)=>reject(err))
    })
}

export function mergeTemplate(fields, username) {
    return new Promise((resolve, reject) => {
        axios.post("https://w3bizz.com/template/classes/mergeTemplate.php", fields)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}

export function mergePage(fields, username) {
    return new Promise((resolve, reject) => {
        axios.post("https://w3bizz.com/template/classes/mergePage.php", fields)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}

export function publishTemplate(fields, username) {
    return new Promise((resolve, reject) => {
        axios.post("https://w3bizz.com/template/classes/publish.php", fields)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}

export function addTemplate(fields, username) {
    return new Promise((resolve, reject) => {
        axios.post("https://w3bizz.com/template/classes/addTemplate.php", fields)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}

export function sendEmailOTP(fields, username) {
    return new Promise((resolve, reject) => {
        axios.post("https://w3bizz.com/template/classes/sendemailotp.php", fields)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}

export function sendVerifyOTP(fields, username) {
    return new Promise((resolve, reject) => {
        axios.post("https://w3bizz.com/template/classes/verifyotp.php", fields)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}

export function updateTemplate(fields) {
    return new Promise((resolve, reject) => {
        axios.post("https://w3bizz.com/template/classes/updateTemplate.php", fields)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}

export function getTemplate(username) {
    return new Promise((resolve, reject) => {
        axios.get(`https://w3bizz.com/template/classes/getTemplate.php?username=${username}`)
            .then((res) => resolve(res.data))
            .catch((err) => reject(err))
    })
}

export function registerApi(data) {
    return new Promise((resolve, reject) => {
        axios.post('https://w3bizz.com/template/register.php', data)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    })
}

export function patchApi(id, data) {
    return new Promise((resolve, reject) => {
        data.username = id
        axios.post(`https://w3bizz.com/template/classes/updateUser.php`, data)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    })
}

export function updateHide(value) {
    return new Promise((resolve, reject) => {
        axios.post("https://w3bizz.com/template/classes/updateTemplate.php", value)
        .then((res)=> resolve(res.data))
        .catch((err)=>reject(err))
    })
}

export function updateHidePage(value) {
    return new Promise((resolve, reject) => {
        axios.post("https://w3bizz.com/template/classes/updatePage.php", value)
        .then((res)=> resolve(res.data))
        .catch((err)=>reject(err))
    })
}
