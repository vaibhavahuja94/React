const initialState = {
    pending: true,
    error: null
}

export default function blogStatusReducer(state = initialState, action) {
    switch(action.type) {
        case 'GETBLOGSTATUSPENDING': 
            return {
                ...state,
                pending: true
            }
        /*case 'GETBLOGLIKEIDSUCCESS':
            return {
                ...state,
                pending: false,
            likeIdBlog: action.payload
            }
            case 'GETBLOGDISLIKEIDSUCCESS':
            return {
                ...state,
                pending: false,
            dislikeIdBlog: action.payload
            }
            case 'GETBLOGDISLIKESUCCESS':
            return {
                ...state,
                pending: false,
            dislikeBlog: action.payload
            }*/
            case 'GETBLOGSTATUSSUCCESS':
                return {
                    ...state,
                    pending: false,
                blogStatus: action.payload
                }
            case 'GET_BLOG_COMMENT_SUCCESS':
                return{
                    ...state,
                    pending:false,
                    comment:action.payload
                }
        case 'GETBLOGSTATUSERROR':
            return {
                ...state,
                pending: false,
                error: action.payload
            }
            
        default: 
            return state;
    }
}
