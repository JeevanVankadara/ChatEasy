import React, {useEffect} from 'react'
import ChatHeader from './ChatHeader.jsx';
import MessageInput from './MessageInput.jsx';
import useMessagesStore from '../lib/useMessagesStore.js';
import { useAuthStore } from '../lib/useAuthStore.js';
import MessageSkeleton from '../skeletons/MessageSkeleton.jsx';

const ChatContainer = () => {
  const {messages, getMessages, selectedUser, isMessagesLoading, subscribeToMessages, unSubscribeFromMessages } = useMessagesStore();
  const {authUser} = useAuthStore();
  
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => {
      unSubscribeFromMessages();
    }
  }, [selectedUser._id, getMessages, subscribeToMessages, unSubscribeFromMessages]);

  if(isMessagesLoading){
    return (
      <div className='flex-1 flex flex-col overflow-auto'>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {
          messages.map((message) => {
            return (
              <div className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`} key={message._id }>
                <div className='chat-image avatar'>
                  <div className='size-10 rounded-full border'>
                    <img src={message.senderId === authUser._id ? authUser.profilePic || "/avatar.png": selectedUser.profilePic || "/avatar.png"} alt="Profile Pic" />
                  </div>
                </div>
                <div className='chat-header mb-1'>
                  <time className='text-xs opacity-50 ml-1'>
                    {message.createdAt}
                  </time>
                </div>
                <div className='chat-bubble flex flex-col'>
                  {message.image && (
                    <img src={message.image} alt="Attachment" className='sm:max-w-[200px] rounded-md mb-2' />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>

              </div>
            )
          })
        }
      </div>
      <MessageInput />
    </div> 
  )
}

export default ChatContainer
