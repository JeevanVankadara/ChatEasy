import {axiosInstance} from "./axios.js";
import {create} from "zustand";
import {toast} from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingauth: true,

  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,

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
      toast.error(error.response.data.message);
    } finally{
      set({isSigningUp: false});
    }
  },
  logout: async() => {
    set({authUser: null});
    try{
      const res = await axiosInstance.post('auth/logout');
      toast.success('Logout Succesfully');
    }catch(error){
      toast.error(error.response.data.message);
    }
  }

}));