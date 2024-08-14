//prev state before change, and action we pass into dispatch function
//Local state is a variable thats either null or logged in users, username - dispactch these actions locally 




const userReducer = (state, action) => {

    //loading, success, error, user, otherUser
    switch (action.type) {


        case "LOGIN_REQUEST":
            return { ...state, loading: true, success: false, error: null }
        case "LOGIN_SUCCESS":
            return { ...state, user: action.payload, loading: false, success: true }
        case "LOGIN_FAIL":
            return { ...state, loading: false, error: action.payload }

        case "LOGOUT":
            return {}


        //User Profile Reducers 
        case "USER_UPDATE_PROFILE_REQUEST":
            return { ...state, loading: true, success: false, error: null }
        case "USER_UPDATE_PROFILE_SUCCESS":
            return {
                ...state,
                loading: false,
                user: action.payload,
                success: true
            }
        case "USER_UPDATE_PROFILE_FAIL":
            return { ...state, loading: false, error: action.payload }


        case "USER_DETAILS_REQUEST":
            return { ...state, loading: true, success: false, error: null }
        case "USER_DETAILS_SUCCESS":
            return { ...state, loading: false, success: true, user: action.payload }
        case "USER_DETAILS_FAIL":
            return { ...state, loading: false, error: action.payload }
        case "USER_DETAILS_RESET":
            return { ...state, user: {} }



        //Admin Reducers
        case "OTHER_USER_DETAILS_REQUEST":
            return { ...state, loading: true, success: false, error: null }
        case "OTHER_USER_DETAILS_SUCCESS":
            return { ...state, loading: false, success: true, otherUser: action.payload }
        case "OTHER_USER_DETAILS_FAIL":
            return { ...state, loading: false, error: action.payload }
        case "OTHER_USER_UPDATE_REQUEST":
            return { ...state, loading: true, success: false, error: null }
        case "OTHER_USER_UPDATE_SUCCESS":
            return { ...state, loading: false, success: true, otherUser: action.payload }

        case "OTHER_USER_UPDATE_FAIL":
            return { ...state, loading: false, error: action.payload }
        case "OTHER_USER_UPDATE_RESET":
            return {
                ...state,
                otherUser: {},
            }
        case "USER_LIST_REQUEST":
            return { ...state, loading: true, success: false, error: null }
        case "USER_LIST_SUCCESS":
            return { ...state, loading: false, success: true, users: action.payload }
        case "USER_LIST_FAIL":
            return { ...state, loading: false, error: action.payload }
        case "USER_LIST_RESET":
            return { ...state, users: [] }

        case "USER_DELETE_REQUEST":
            return { ...state, loading: true, success: false, error: null }
        case "USER_DELETE_SUCCESS":
            return { ...state, users: action.payload, loading: false, success: true }
        case "USER_DELETE_FAIL":
            return { ...state, loading: false, error: action.payload }
        default:
            return state;
    }
}



export default userReducer