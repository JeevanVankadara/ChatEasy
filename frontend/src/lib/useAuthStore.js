import {axiosInstance} from "./axios.js";
import {create} from "zustand";
import {toast} from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingauth: true,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isPasswordUpdating: false,
  isPasswordChangeStatus: false,
  onlineUsers: [],

  checkAuth: async() => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({authUser: res.data});
    } catch (error) {
      console.log('Error in check thing '+ error);
      set({authUser: null});
    } finally {
      set({isCheckingauth: false});
    }
  },

  signup: async(data) => {
    set({isSigningUp: true});
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({authUser: res.data});  
      toast.success('Account Created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create account');
    } finally{
      set({isSigningUp: false});
    }
  },
  login: async(data) => {
    set({isLoggingIn: true});
    try {
      const res = await axiosInstance.post('auth/login', data);
      set({authUser: res.data});
      toast.success('Login Successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to login');
    }finally{
      set({isLoggingIn: false});
    }
  }
  ,
  logout: async() => {
    set({authUser: null});
    try{
      const res = await axiosInstance.post('auth/logout');
      toast.success('Logout Succesfully');
    }catch(error){
      toast.error(error.response?.data?.message || 'Failed to logout');
    }
  },

  profileUpdating: async(data) => {
    set({isUpdatingProfile: true});
    try {
      const res = await axiosInstance.put("auth/updateProfile", data);
      set({authUser: res.data});
      toast.success('Profile Updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally{
      set({isUpdatingProfile: false});
    }
  },

  passwordUpdate: async(data) => {
    set({isPasswordUpdating: true});
    try {
      const res = await axiosInstance.put("auth/updatePassword", data);
      toast.success('Password Updated successfully');
      set({isPasswordChangeStatus: true});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      set({isPasswordUpdating: false});
      setTimeout(() => {
        set({isPasswordChangeStatus: false});
      }, 3000);
    }
  }

}));