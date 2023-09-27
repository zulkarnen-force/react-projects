import React, { useEffect, useState } from 'react'
import axios from 'axios'
import io from 'socket.io-client'

import { Box, FormControl, IconButton, Input, InputGroup, InputRightElement, Spinner, Text, useToast } from '@chakra-ui/react'
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'

import { ChatState } from '../Context/ChatProvider'
import { getSender, getSenderFull } from '../Config/ChatLogics'
import ProfileModal from './ProfileModal'
import UpdateGroupChatModal from './UpdateGroupChatModal'
import ScrollableChat from './ScrollableChat'

const ENDPOINT = 'https://chat-app-2100016081-api.vercel.app';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const toast = useToast()

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()

    const fetchMessages = async () => {
        if (!selectedChat) return

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true)
            const { data } = await axios.get(`https://chat-app-2100016081-api.vercel.app/api/message/${selectedChat._id}`, config);

            setMessages(data)
            setLoading(false)

            socket.emit('join chat', selectedChat._id);
        } catch (error) {
            toast({
                title: 'Gagal memuat pesan',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
        };

    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [])

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                // Nofifikasi
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })


    const sendMessage = async () => {
        if (newMessage) {
            socket.emit('stop typing', selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("")
                const { data } = await axios.post("https://chat-app-2100016081-api.vercel.app/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);

                // console.log(data);

                socket.emit('new message', data);
                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: 'Gagal mengirim pesan',
                    status: 'error',
                    duration: 2000,
                    position: 'top-right',
                    isClosable: true,
                })
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id);
                setTyping(false)
            }
        }, timerLength)
    }

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        className="text-28px md:text-30px pb-3 px-2 w-full flex justify-between items-center"
                    >
                        <IconButton
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {messages &&
                            (!selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName}
                                    <UpdateGroupChatModal
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    />
                                </>
                            ))}
                    </Text>

                    <Box
                        className="flex flex-col justify-end p-3 bg-gray-200 w-full h-full rounded-lg overflow-hidden"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <Spinner size="xl" />
                            </div>
                        ) : (
                            <div
                                className="flex flex-col overflow-y-scroll scrollbar-none"
                            >
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl
                            className='mt-3'
                        >
                            {isTyping ? (
                                <p className='text-gray-500 text-sm mb-1'>
                                    Sedang mengetik...
                                </p>
                            ) : (<></>)}
                            <InputGroup>
                                <Input
                                    variant="filled"
                                    bg="#E0E0E0"
                                    placeholder="Tulis pesan.."
                                    autoComplete="off"
                                    value={newMessage}
                                    onChange={typingHandler}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            event.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                />
                                <InputRightElement>
                                    <IconButton
                                        colorScheme="teal"
                                        icon={<ArrowForwardIcon />}
                                        onClick={sendMessage}
                                    />
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    className="flex items-center justify-center bg-gray-200 w-full h-full rounded-lg overflow-hidden"
                >
                    <Text>
                        Pilih chat untuk memulai percakapan
                    </Text>
                </Box>
            )
            }
        </>
    )
}

export default SingleChat