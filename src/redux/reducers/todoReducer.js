import { STORE_TODO_DETAILS } from "../actionTypes"

let initialState = {
    todoRecords: []
}

export const TodoReducer = (state = initialState, action) =>{
    
    const {type, payload} = action
    
    switch(type){
        case STORE_TODO_DETAILS:
            return { ...state,
                todoRecords: payload  
            }
        default :
            return state;    
    }
}