import {
    GET_ALL_NEEDS, 
    GET_ALL_PROFESSIONALS, 
    GET_BY_USER_ID, 
    NEW_USER, 
    SEARCH_PROFESSIONAL_BY_NAME, 
    ORDER_DATA, 
    FILTER_PROFESSIONS,
    SHOW_FORM_CLIENT_NEED, 
    GET_BY_ACCOUNT_ID
} from '../actions'



const initialState = {
    professionals: [],
    user: [],
    clientNeeds: [],
    message:[],
    modal:"",

    professionsName:[],

    account: [],

};

function rootReducer( state = initialState, { type, payload } ) {
    switch ( type ) {
        case GET_ALL_PROFESSIONALS:
            return {
                ...state,
                professionals: payload,
            };
        case GET_BY_USER_ID:
            return {
                ...state,
                user: payload,
            };
        case GET_BY_ACCOUNT_ID:
            return {
                ...state,
                account: payload,
            };
        case GET_ALL_NEEDS:
            return {
                ...state,
                clientNeeds: payload,
            };
        case NEW_USER:
            return {
                ...state,
                message: payload,
            }
        case SEARCH_PROFESSIONAL_BY_NAME: 
            return {
                ...state,
                professionals: payload
            }
        case SHOW_FORM_CLIENT_NEED: 
            return {
                ...state,
                modal: payload
            }

            case FILTER_PROFESSIONS:
                return {
                    ...state,
                    professionsName: payload,
                }
        

        case ORDER_DATA:
            let option = [];
            switch (payload) {
                case 'A-Z':
                    option = state.professionals.sort((a,b) => {
                        if (a.first_name > b.first_name) return 1;
                        if(a.first_name < b.first_name) return -1;
                        return 0;
                    })
                    break;
                case 'Z-A':
                    option = state.professionals.sort((a,b) => {
                        if (a.first_name > b.first_name) return -1;
                        if(a.first_name < b.first_name)return 1;
                        return 0;
                    })
                    break
                default:
                    break;
            }
            return {
                ...state,
                professionals: option
            }

        default:
            return state;
        

    };
};

export default rootReducer;