import "@/app/globals.css";
import ChatList from "@/components/ChatList";
import ChatWindow from "@/components/ChatWindow";

export default function Messages() {
  return (
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <ChatList />
      <ChatWindow profilePic="/placeholder_profile_img.png" name="Sarah" />
    </div>
  );
}
