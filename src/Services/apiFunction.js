import axios from 'axios';

const url = "http://localhost:3003/userData"

export function GetApi(pathname) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
    })
}

export function GetApiWithParams(fields) {
    return new Promise((resolve, reject) => {
        axios.get(`${url}?email=${fields.email}&password=${fields.password}`)
            .then((res) => resolve(res))
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