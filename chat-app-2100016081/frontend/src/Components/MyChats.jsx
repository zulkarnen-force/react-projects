import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { useEffect } from 'react';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../Config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState()
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast()

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("https://chat-app-2100016081-api.vercel.app/api/chat", config);
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: 'Gagal mendapatkan chat',
        status: 'error',
        duration: 2000,
        position: 'top-right',
        isClosable: true,
      })
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      className={`${selectedChat ? 'hidden' : 'flex'} md:flex flex-col items-center p-3 bg-white w-full md:w-96 rounded-lg border-1`}
    >
      <Box
        className="pb-3 px-3 text-28px md:text-30px flex w-full justify-between items-center"
      >
        Chat Saya

        <GroupChatModal>
          <Button
            className="flex text-17px md:text-10px lg:text-17px"
            rightIcon={<AddIcon />}
          >
            <span className="hidden md:flex">Grup Baru</span>
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        className="flex flex-col p-3 bg-gray-200 w-full h-full rounded-lg overflow-hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                className={`cursor-pointer ${selectedChat === chat ? 'bg-teal-500 text-white' : 'bg-gray-200 text-black'} px-3 py-2 rounded-lg`}
              >
                <Text>
                  {!chat.isGroupChat ? (
                    getSender(loggedUser, chat.users)
                  ) : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats