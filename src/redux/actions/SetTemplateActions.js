export function setUserTemplate(data) {// Template Redux
    return {
        type: 'SETUSERTEMPLATE',
        payload: data
    }
}

export function setAdminTemplate(data) {// Template Redux
    return {
        type: 'SETADMINTEMPLATE',
        payload: data
    }
}

export function setDefaultPages(data) {// Template Redux
    return {
        type: 'SETDEFAULTPAGES',
        payload: data
    }
}

export function publishedTemplates(data) {
    return {
        type: 'GETPUBLISEDTEMPLATES',
        payload: data
    }
}