import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './style.css'
import App from './App'

import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')).render(

    <AuthProvider>
    <BrowserRouter>
    <App/>
  <ToastContainer />
  </BrowserRouter>
  </AuthProvider>
  
);