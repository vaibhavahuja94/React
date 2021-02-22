const initialState = {
    pending: false,
    allBlog: [],
    error: null
}

export default function getAllBlogReducer(state = initialState, action) {
    switch(action.type) {
        case 'GETBLOGPENDING': 
            return {
                ...state,
                pending: true
            }
        case 'GETBLOGSUCCESS':
            return {
                ...state,
                pending: false,
                allBlog: action.payload
            }
        case 'GETBLOGERROR':
            return {
                ...state,
                pending: false,
                error: action.payload
            }
            
        default: 
            return state;
    }
}
