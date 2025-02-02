import React from 'react';
import ChatItem from './ChatItem';
import styles from "../../styles/ChatList.module.css";
import Image from 'next/image';

const ChatList = () => {
  return (
    <div className={styles["chatlist-container"]}>
        <span>Chats</span>
        {/* Search bar to filter chat items */}
        <div className={styles["search-bar"]}>
            <span>Search</span>
            <Image src="/search_icon.png" alt="Search Icon" width={30} height={30}/>
        </div>
        {/* The individual chat items that can be clicked on */}
        <ChatItem profilePic="/placeholder_profile_img.png" name="Sarah" msgPreview="Hey there!" timestamp="1:47 PM"/>
        <ChatItem profilePic="/placeholder_profile_img_2.png" name="John" msgPreview="Thanks!" timestamp="2:00 PM"/>
    </div>
  )
}

export default ChatList;