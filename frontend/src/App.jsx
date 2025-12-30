import React, {useEffect} from 'react'
import { Routes, Route } from 'react-router-dom'
import {Loader} from "lucide-react";

import {useAuthStore} from "./lib/useAuthStore"
import { Navigate } from 'react-router-dom';  

import Navbar from './components/Navbar'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import OtherProfile from './pages/OtherProfile'


import {Toaster} from 'react-hot-toast'

const App = () => {
  const {authUser, checkAuth, isCheckingauth, onlineUsers} = useAuthStore();

  console.log(onlineUsers);

  useEffect(() => {
    checkAuth();
  },[checkAuth]);

  if(isCheckingauth && !authUser){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin'/>
      </div>
    )
  }

  return (
    <div>
      <Navbar/>

      <Routes>
        <Route path='/' element = {authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element = {!authUser ? <LoginPage/> : <Navigate to="/" />} />
        <Route path='/signup' element = {!authUser ? <SignUpPage/> : <Navigate to="/" />} />
        <Route path='/profile' element = {authUser ? <ProfilePage/> : <Navigate to="/login" />} />
        <Route path='/other-profile' element = {authUser ? <OtherProfile/> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />

    </div>
  )
}

export default App
