import { createContext, useState } from "react";

export const AuthenticationContext=createContext({})

export default  function AuthenticationFunction({children}) {
    
    const [RegisterCheck,setRegisterCheck]=useState(true)
    return <AuthenticationContext.Provider value={{RegisterCheck,setRegisterCheck}}>
        {children}
    </AuthenticationContext.Provider>
    
}



export const TodoListContext=createContext({})

export  function TodoListFunction({children}) {
    
    const [Todolist,setTodolist]=useState([])
    return <TodoListContext.Provider value={{Todolist,setTodolist}}>
        {children}
    </TodoListContext.Provider>
    
}
