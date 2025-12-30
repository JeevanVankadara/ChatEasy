import React, {useEffect, useState} from 'react'
import useMessagesStore from '../lib/useMessagesStore.js';
import {useAuthStore} from '../lib/useAuthStore.js';
import SidebarSkeleton from '../skeletons/SideBarSkeleton.jsx';
import {Users, Search} from 'lucide-react';


const SideBar = () => {
  const {users, getUsers, isUsersLoading, setSelectedUser, selectedUser, subscribeToNewUsers, unSubscribeFromNewUsers} = useMessagesStore();
  const {onlineUsers} = useAuthStore();
  const [Onlinebtn, setOnlinebtn] = useState(false);
  
  const [searchItem, setSearchItem] = useState('');

  const filterUsers = Onlinebtn ? users.filter(user => onlineUsers.includes(user._id)) : users; 

  const NormalUsers = filterUsers.filter(filterUsers => filterUsers.fullName.toLowerCase().includes(searchItem.toLowerCase())); 

  useEffect(() => {
    getUsers();
    subscribeToNewUsers();

    return () => {
      unSubscribeFromNewUsers();
    };
  }, [getUsers, subscribeToNewUsers, unSubscribeFromNewUsers]);
  
  if(isUsersLoading){
    return <SidebarSkeleton />;
  }

  return (
    <aside className='h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200'>
      <div className='border-b border-base-300 w-full p-5'>
        <div className='flex items-center gap-2 mb-5'>
          <Users className="size-6 h-6" />
          <span className='font-medium hidden lg:block'>Members</span>
        </div>

        {/* Online members */}
        <div className='mt-3 hidden lg:flex items-center gap-2'>
          <label className='cursor-pointer flex items-center gap-2'>
            <input type="checkbox" 
              checked={Onlinebtn}
              onChange={() => {setOnlinebtn(!Onlinebtn)}}
              className='checkbox checked:sm'
            />
            <span className='text-sm'>Show Online Only</span>
          </label>
          <span className='text-xs text-zinc-500'>({onlineUsers.length - 1} Online)</span>
        </div>

        {/* Search bar */}
        <div className='mt-3 hidden lg:block'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-zinc-500' />
            <input 
              type="text" 
              placeholder='Search members...'
              value={searchItem}
              className='w-full pl-10 pr-4 py-2 rounded-lg bg-base-200 border border-base-300 focus:outline-none focus:border-primary transition-colors text-sm'
              onChange={(e) => {setSearchItem(e.target.value)}}
            />
          </div>
        </div>
      </div>

      <div className='overflow-y-auto w-full py-3'>
        {NormalUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {setSelectedUser(user)}}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors
        ${selectedUser && selectedUser._id === user._id ? 'bg-base-300 ring-1 ring-base-300' : ''}
            `}
          >
              <div className='relative'>
                <img src={user.profilePic || "/avatar.png"} alt={`${user.fullName}'s profile`} 
                  className='size-12 object-cover rounded-full'
                />
                {
                  onlineUsers.includes(user._id) && (
                    <span className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900'/>
                  )
                }
              </div>

              <div className='hidden lg:block text-left min-w-0'>
                <div className='font-medium truncate'>{user.fullName}</div>
                <div>
                  {onlineUsers.includes(user._id) ? (
                    <span className='text-sm text-green-500'>Online</span>
                  ) : (
                    <span className='text-sm text-zinc-400'>Offline</span>
                  )}
                </div>
              </div>
          </button>
        ))}

        {NormalUsers.length === 0 && (
          <div className='text-center text-zinc-300 py-4'>
            No Online Users to display.
          </div>
        )}
      </div>
    </aside>
  )
}

export default SideBar
