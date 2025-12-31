import {axiosInstance} from "./axios.js";
import {create} from "zustand";
import {toast} from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingauth: true,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isPasswordUpdating: false,
  isPasswordChangeStatus: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async() => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({authUser: res.data});
      get().connectSocket();
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
      get().connectSocket();
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
      get().connectSocket();
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
      get().disconnectSocket();
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
  },

  connectSocket: () => {
    const {authUser} = get();
    if(!authUser || !authUser._id || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query:{
        userId: authUser._id
      }
    });
    set({socket: socket});

    socket.on("getOnlineUsers", (userIds) => {
      set({onlineUsers: userIds});
    });

    socket.on("connect_error", (error) => {
      console.log("Socket connection error:", error);
    });
  },

  disconnectSocket: () => {
    if(get().socket?.connected) {
      get().socket.disconnect();
    }
    set({socket: null});
  }
}));