export const HeaderWithToken=()=>{
    const token = localStorage.getItem('token')

    return{
            headers: {
                'Authorization': token,
                "content-type": "application/json"
            }
    }
}

export const HeaderForTemplate=()=>{
    const token = localStorage.getItem('token')

    return{
            headers: {
                'Authorization': token,
                "Content-Type": "multipart/form-data"
            }
    }
}