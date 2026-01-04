import React, { useState } from 'react'
import { useAuthStore } from '../lib/useAuthStore'
import useMessagesStore from '../lib/useMessagesStore'
import { Mail, User, Images } from 'lucide-react'

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const { selectedUser, messages } = useMessagesStore();

  const MediaMessages = messages.filter(msg => msg.image !== undefined);

  return (
    <div className='h-screen pt-20'>
      <div className='max-w-6xl mx-auto p-4 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

          {/* Left Side - Profile Update */}
          <div className='bg-base-300 rounded-xl p-6 space-y-8'>
            <div className='text-center'>
              <h1 className='text-2xl font-semibold'>Profile</h1>
              <p className='mt-2'>{selectedUser.fullName} Profile Information</p>
            </div>

            <div className='flex flex-col gap-4 items-center'>
              <div className='relative'>
                <img src={selectedUser.profilePic || "avatar.png"} alt={selectedUser.fullName}
                  className='size-32 rounded-full object-cover border-4'
                />
              </div>
            </div>

            <div className='space-y-6'>
              <div className='space-y-1.5'>
                <div className='text-sm text-zinc-400 flex items-center gap-2'>
                  <User className="w-4 h-4" />
                  FullName
                </div>
                <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{selectedUser.fullName}</p>
              </div>

              <div className='space-y-1.5'>
                <div className='text-sm text-zinc-400 flex items-center gap-2'>
                  <Mail className="w-4 h-4" />
                  Email
                </div>
                <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{selectedUser.email}</p>
              </div>
            </div>

            <div className='mt-6 bg-base-300 rounded-xl p-6'>
              <h2 className='text-lg font-medium mb-4'>Account Information</h2>
              <div className='space-y-3 text-sm'>
                <div className='flex items-center justify-between py-2 border-b border-zinc-700'>
                  <span>Member Since</span>
                  <span>{selectedUser.createdAt?.split('T')[0]}</span>
                </div>
                <div className='flex items-center justify-between py-2'>
                  <span>Account Status</span>
                  <span className='text-green-500'>Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Media Gallery */}
          <div className='bg-base-300 rounded-xl p-4'>
            <div className='flex items-center gap-2 mb-4'>
              <Images className='size-5 text-primary' />
              <div>
                <h2 className='text-lg font-semibold'>Shared Media</h2>
                <p className='text-xs text-zinc-400'>{MediaMessages.length} {MediaMessages.length === 1 ? 'photo' : 'photos'}</p>
              </div>
            </div>

            {MediaMessages.length > 0 ? (
              <div className='grid grid-cols-4 gap-1.5'>
                {MediaMessages.map((msg) => (
                  <div key={msg._id} className='aspect-square overflow-hidden rounded-md bg-base-200 hover:opacity-80 transition-opacity cursor-pointer'>
                    <a href={msg.image} target="_blank" rel="noopener noreferrer">
                      <img
                        src={msg.image}
                        alt="Shared media"
                        className='w-full h-full object-cover'
                      />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-8 text-zinc-400'>
                <Images className='size-10 mx-auto mb-2 opacity-50' />
                <p className='text-sm'>No shared media yet</p>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  )
}

export default ProfilePage
