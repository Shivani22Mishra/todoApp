import { STORE_TODO_DETAILS } from "../actionTypes"

export const setTodoDetails = (data) => {
    // localStorage.setItem('contactData', JSON.stringify(data))
    
    return {
        type: STORE_TODO_DETAILS,
        payload: data
    }
}