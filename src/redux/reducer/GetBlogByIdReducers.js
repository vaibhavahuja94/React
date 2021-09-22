const initialState = {
    pending: false,
    allBlog: [],
    allAdminBlog:[],
    published:[],
    defaultPages:[],    
    error: null
}

export default function getBlogByIdReducer(state = initialState, action) {
    switch (action.type) {
        case 'GETBLOGIDPENDING':
            return {
                ...state,
                pending: true
            }
        case 'GETBLOGIDSUCCESS':
            return {
                ...state,
                pending: false,
                allBlog: action.payload
            }
        case 'GETADMINBLOGIDSUCCESS':
            return {
                ...state,
                pending: false,
                allAdminBlog: action.payload
            }
        case 'GETDEFAULTPAGESUCCESS':
            return {
                ...state,
                pending: false,
                defaultPages: action.payload
            }
            case 'GETPUBLISEDTEMPLATES':
                return {
                    ...state,
                    pending: false,
                    published: action.payload
                }
        case 'GETBLOGIDERROR':
            return {
                ...state,
                pending: false,
                error: action.payload
            }

        default:
            return state;
    }
}
