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