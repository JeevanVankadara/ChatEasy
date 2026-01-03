import React from 'react'
import useMessagesStore from '../lib/useMessagesStore';

import SideBar from '../components/SideBar';
import ChatContainer from '../components/ChatContainer';
import NoChatSelected from '../components/NoChatSelected';;

const HomePage = () => {
  const {selectedUser, setSelectedUser} = useMessagesStore();

  return (
    <div className='h-screen bg-base-200'>
      <div className='flex items-center justify-center pt-20 px-4'>
        <div className='bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]'>
          <div className='flex h-full overflow-hidden rounded-lg'>
            {/* Show SideBar only when no user is selected on mobile, always show on larger screens */}
            <div className={`${selectedUser ? 'hidden' : 'flex'} md:flex h-full`}>
              <SideBar />
            </div>
            
            {/* Show ChatContainer/NoChatSelected only when user is selected on mobile, always show on larger screens */}
            <div className={`${selectedUser ? 'flex' : 'hidden'} md:flex flex-1 h-full`}>
              {!selectedUser ? <NoChatSelected /> : <ChatContainer/>}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default HomePage
