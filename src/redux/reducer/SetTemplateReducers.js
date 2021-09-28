const initialState = {
    userTemplate: [],
    adminTemplate:[],
    published:[],
    defaultPages:[]
}

export default function SetTemplateReducers(state = initialState, action) {
    switch (action.type) {
        case 'SETUSERTEMPLATE':
            return {
                ...state,
                userTemplate: action.payload
            }
        case 'SETADMINTEMPLATE':
            return {
                ...state,
                adminTemplate: action.payload
            }
        case 'SETDEFAULTPAGES':
            return {
                ...state,
                defaultPages: action.payload
            }
            case 'GETPUBLISEDTEMPLATES':
                return {
                    ...state,
                    published: action.payload
                }

        default:
            return state;
    }
}
