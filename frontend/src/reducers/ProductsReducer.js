

//prev state before change, and action we pass into dispatch function
//Local state is an array of products we want to be in sync w/ db, dispactch these actions locally

//loading, error, success, imageData, products, pages, page, deleteSuccess, 
//loadingProductReview, successProductReview, errorProductReview, topProducts
const productsReducer = (state, action) => {
    switch (action.type) {
        case "IMAGE_UPLOAD_REQUEST":
            return { ...state, loading: true, success: false, error: null }
        case "IMAGE_UPLOAD_SUCCESS":
            return { ...state, loading: false, success: true, imageData: action.payload }
        case "IMAGE_UPLOAD_FAIL":
            return { ...state, loading: false, error: action.payload }


        case "PRODUCT_LIST_REQUEST":
            return { ...state, loading: true, success: false, error: null, products: [] }
        case "PRODUCT_LIST_SUCCESS":
            return {
                ...state,
                loading: false,
                success: true,
                products: action.payload.products,
                pages: action.payload.pages,
                page: action.payload.page,
            }
        case "PRODUCT_LIST_FAIL":
            return { ...state, loading: false, error: action.payload }


        case "PRODUCT_DETAILS_REQUEST":
            return { ...state, loading: true, success: false, error: null }
        case "PRODUCT_DETAILS_SUCCESS":
            return { ...state, loading: false, product: action.payload }
        case "PRODUCT_DETAILS_FAIL":
            return { ...state, loading: false, error: action.payload }


        case "PRODUCT_DELETE_REQUEST":
            return { ...state, loading: true, error: null, deleteSuccess: false }
        case "PRODUCT_DELETE_SUCCESS":
            return { ...state, loading: false, deleteSuccess: true, products: action.payload }
        case "PRODUCT_DELETE_FAIL":
            return { ...state, loading: false, error: action.payload }


        case "PRODUCT_CREATE_REQUEST":
            return { ...state, loading: true, error: null, success: false }
        case "PRODUCT_CREATE_SUCCESS":
            return { ...state, loading: false, success: true, products: action.payload }
        case "PRODUCT_CREATE_FAIL":
            return { ...state, loading: false, error: action.payload }
        case "PRODUCT_CREATE_RESET":
            return { ...state, product: null }


        case "PRODUCT_UPDATE_REQUEST":
            return { ...state, loading: true, success: false, error: null }
        case "PRODUCT_UPDATE_SUCCESS":
            return { ...state, loading: false, success: true, product: action.payload }
        case "PRODUCT_UPDATE_FAIL":
            return { ...state, loading: false, error: action.payload }
        case "PRODUCT_UPDATE_RESET":
            return { ...state, product: null, success: false }


        case "PRODUCT_CREATE_REVIEW_REQUEST":
            return { ...state, loadingProductReview: true, successProductReview: false, errorProductReview: null }
        case "PRODUCT_CREATE_REVIEW_SUCCESS":
            return { ...state, loadingProductReview: false, successProductReview: true }
        case "PRODUCT_CREATE_REVIEW_FAIL":
            return { ...state, loadingProductReview: false, errorProductReview: action.payload }
        case "PRODUCT_CREATE_REVIEW_RESET":
            return { ...state, successProductReview: false, errorProductReview: null }


        case "PRODUCT_TOP_REQUEST":
            return { ...state, loading: true, success: false, error: null, topProducts: [] }
        case "PRODUCT_TOP_SUCCESS":
            return { ...state, loading: false, topProducts: action.payload }
        case "PRODUCT_TOP_FAIL":
            return { ...state, loading: false, error: action.payload }

        default:
            return state;

    }
}
export default productsReducer