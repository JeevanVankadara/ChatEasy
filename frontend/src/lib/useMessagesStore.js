import {create} from 'zustand';
import {toast} from 'react-hot-toast';
import {axiosInstance} from '../lib/axios.js';
import { useAuthStore } from './useAuthStore.js';

const useMessagesStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isMessageSending: false,

  setSelectedUser: (selectedUser) => set({selectedUser}),

  getUsers: async() => {
    set({isUsersLoading: true});
    try {
      const res = await axiosInstance.get("/message/users");
      set({users: res.data});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    } finally{
      set({isUsersLoading: false});
    }
  },

  getMessages: async(data) => {
    set({isMessagesLoading: true});
    try {
      const res = await axiosInstance.get(`/message/${data}`);
      set({messages: res.data});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch messages')
    } finally{
      set({isMessagesLoading: false});
    }
  },

  sendMessage: async(data) => {
    const {messages, selectedUser} = get();
    set({isMessageSending: true})
    try {
      const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, data);
      set({messages: [...messages, res.data]});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally{
      set({isMessageSending: false});
    }
  },

  subscribeToMessages: () => {
    const {selectedUser} = get();
    const socket = useAuthStore.getState().socket;

    if(!selectedUser || !socket) return;

    socket.on("newMessage", (newMessage) => {
      if(newMessage.senderId === selectedUser._id){
        const {messages} = get();
        set({messages: [...messages, newMessage]});
      }
    });

  },

  unSubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if(!socket) return;
    socket.off("newMessage"); 
  }

}));

export default useMessagesStore;