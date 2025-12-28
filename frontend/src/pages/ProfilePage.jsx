import React,{useState} from 'react'
import { useAuthStore } from '../lib/useAuthStore'
import {Camera, Mail, User, Eye, Lock, EyeOff, Loader2} from 'lucide-react'

const ProfilePage = () => {
  const {authUser, profileUpdating, isUpdatingProfile, isPasswordUpdating, passwordUpdate} = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleImageUpload = async(e) => {
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async() => {
      const base64ImgURL = reader.result;
      setSelectedImage(base64ImgURL);
      await profileUpdating({profilePic: base64ImgURL});
    }
    
  }

  function handlePasswordChange(e){
    e.preventDefault();
    passwordUpdate({oldPass, newPass});
    setOldPass('');
    setNewPass('');
  }

  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-2'>Your Profile Information</p>
          </div>

          <div className='flex flex-col gap-4 items-center'>
            <div className='relative'>
              <img src={selectedImage ||authUser.profilePic || "../../public/avatar.png"}  alt={authUser.fullName}
              className='size-32 rounded-full object-cover border-4'
              />
              <label htmlFor='avatar-upload'
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-110 p-2 rounded-full cursor-pointer transition-all duration-200 ${isUpdatingProfile ? 'animate-pulse pointer-events-none' : ''}`}
              >
                <Camera className="w-5 h-5 text-base-200"/>
                <input type="file"
                id='avatar-upload'
                className='hidden'
                accept='image/*'
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className='text-sm text-zinc-400'>
              {`${isUpdatingProfile ? 'Updating...' : 'Click the camera icon to update the profile'}`}
            </p>
          </div>

          <div className='space-y-6'>
            <div className='space-y-1.5'>
              <div className='text-sm text-zinc-400 flex items-center gap-2'>
                <User className="w-4 h-4"/>
                FullName
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser.fullName}</p>
            </div>

            <div className='space-y-1.5'>
              <div className='text-sm text-zinc-400 flex items-center gap-2'>
                <Mail className="w-4 h-4"/>
                Email
              </div>
              <p className='px-4 py-2.5 bg-base-200 rounded-lg border'>{authUser.email}</p>
            </div>
          </div>

          <div className='mt-6 bg-base-300 rounded-xl p-6'>
            <h2 className='text-lg font-medium mb-4'>Account Information</h2>
              <div className='space-y-3 text-sm'>
                <div className='flex items-center justify-between py-2 border-b border-zinc-700'>
                  <span>Member Since</span>
                  <span>{authUser.createdAt?.split('T')[0]}</span>
                </div>
                <div className='flex items-center justify-between py-2'>
                  <span>Account Status</span>
                  <span className='text-green-500'>Active</span>
                </div>
              </div>
          </div>

        </div>

        <form onSubmit={(e) => handlePasswordChange(e)} className='max-w-md mx-auto mt-10 p-6 bg-base-300 rounded-xl space-y-6'>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Old Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                type={showOldPassword ? "text" : "password"}
                className={`input input-bordered w-full pl-10`}
                placeholder="••••••••"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <EyeOff className="size-5 text-base-content/40" />
                ) : (
                  <Eye className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          <div className="form-control mb-5">
            <label className="label">
              <span className="label-text font-medium">New Password</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 text-base-content/40" />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                className={`input input-bordered w-full pl-10`}
                placeholder="••••••••"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="size-5 text-base-content/40" />
                ) : (
                  <Eye className="size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isPasswordUpdating}>
            {isPasswordUpdating ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Updating...
              </>
            ) : (
              "Update"
            )}
          </button>
        </form>

      </div>

    </div>
  )
}

export default ProfilePage
