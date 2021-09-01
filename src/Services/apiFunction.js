import axios from 'axios';

const url = "http://localhost:3003/userData"

export function GetApi(pathname) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    })
}


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

export function addTemplate(fields, username) {
    return new Promise((resolve, reject) => {
        axios.post("https://w3bizz.com/template/classes/addTemplate.php", fields)
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

export function postApi(pathname, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    })
}

export function patchApi(id, data) {
    return new Promise((resolve, reject) => {
        axios.patch(`${url}/${id}`, data)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    })
}