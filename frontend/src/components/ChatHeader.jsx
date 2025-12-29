import { X } from "lucide-react";
import { useAuthStore } from "../lib/useAuthStore";
import useMessagesStore from "../lib/useMessagesStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useMessagesStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
            </div>
          </div>

          {/* User info */}
          <div className="flex-1">
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="ml-4"
        >
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;