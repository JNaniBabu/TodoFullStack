
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import {  ThemeProvider } from './theme.jsx'
import { TodoListFunction } from './auth.jsx'

import AuthenticationFunction from './auth.jsx'



 
createRoot(document.getElementById('root')).render(
    <AuthenticationFunction>
        <TodoListFunction>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </TodoListFunction>
    </AuthenticationFunction>

)
