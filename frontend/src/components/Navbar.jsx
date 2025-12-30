import React from 'react'
import { useAuthStore } from '../lib/useAuthStore.js';
import { Link, Navigate } from 'react-router-dom';
import{MessageSquare, Settings, User, LogOut} from 'lucide-react';

const Navbar = () => {
  const {authUser, logout} = useAuthStore();

  function handleLogout(){
    logout();
    Navigate("/");
  }

  return (
    <header className='bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80'>

      <div className='container mx-auto px-4 h-16'>
        <div className='flex items-center justify-between h-full'>
          <div className='flex items-center gap-8'>
            <Link to="/" className='flex items-center gap-2.5 hover:bg-opacity-80 transition-all'>
              <div className='size-9 rounded-lg bg-primary/10 flex items-center justify-center'>
                <MessageSquare className='w-5 h-5 text-primary' />
              </div>
              <h1 className='text-lg font-bold'>ChatEasy</h1>
            </Link>
          </div>

          <div className='flex items-center gap-2'>
            {authUser && (
              <>
              <Link to={"/profile"} className='btn btn-sm gap-2'>
                <User className='size-5'/>
                <span className='hidden sm-inline'>Profile</span>
              </Link>

              <button onClick={handleLogout}>
                <LogOut className='size-5' />
                <span className='hidden sm-inline'>Logout</span>
              </button>
              </>
            )} 
          </div>
        </div>
      </div>

    </header>
  )
}

export default Navbar
