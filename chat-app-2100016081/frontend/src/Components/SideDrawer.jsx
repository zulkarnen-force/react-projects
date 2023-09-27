import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import NotificationBadge, { Effect } from 'react-notification-badge';

import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './ProfileModal'
import ChatLoading from './ChatLoading'
import UserListItem from './UserListItem'
import { getSender } from '../Config/ChatLogics'

const SideDrawer = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const navigate = useNavigate()

    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        navigate("/auth/login")
        window.location.reload();
    }

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: 'Masukkan nama user',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            return
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`https://chat-app-2100016081-api.vercel.app/api/user?search=${search}`, config)

            setLoading(false)
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Gagal mencari user',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post("https://chat-app-2100016081-api.vercel.app/api/chat", { userId }, config)

            if (!chats.find((chat) => chat._id === data._id)) {
                setChats([data, ...chats])
            }
            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch (error) {
            toast({
                title: 'Gagal mengakses chat',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })

        }
    }

    const handleDeleteUser = async () => {
        try {
            setLoading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.delete(`https://chat-app-2100016081-api.vercel.app/api/user/${user._id}`, config)

            toast({
                title: 'User berhasil dihapus',
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            });
            setLoading(false);
            localStorage.removeItem("userInfo")
            navigate("/auth/login")
        } catch (error) {
            toast({
                title: 'Error!',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            });
            setLoading(false);
        }
    };


    return (
        <>
            <Box className='flex justify-between items-center bg-white w-full p-2 border-2'>
                <Tooltip label="Cari user" hasArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen}>
                        <i className='fas fa-search'></i>
                        <Text className='hidden sm:flex px-3'>
                            Cari User
                        </Text>
                    </Button>
                </Tooltip>

                <p className='text-xl'>Chat App</p>

                <div>
                    <Menu>
                        <MenuButton className='p-1'>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList className='pl-2 font-thin'>
                            {!notification.length && "Tidak ada pesan baru"}
                            {notification.map(notif => {
                                return (
                                    <MenuItem
                                        key={notif._id}
                                        onClick={() => {
                                            setSelectedChat(notif.chat)

                                            // Menghapus notifikasi
                                            setNotification(notification.filter((n) => n !== notif))
                                        }}
                                    >
                                        {notif.chat.isGroupChat ? `${notif.chat.chatName}` : `${getSender(user, notif.chat.users)}`}
                                    </MenuItem>
                                )
                            })}
                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar
                                size="sm"
                                cursor="pointer"
                                name={user.name}
                                src={user.pic}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                            <MenuDivider />
                            <MenuItem onClick={handleDeleteUser}>Hapus Akun Saya</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Cari User</DrawerHeader>

                    <DrawerBody>
                        <Box className="flex pb-2">
                            <Input
                                placeholder="Cari user"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button
                                onClick={handleSearch}
                            >Cari</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner className="ml-auto flex" />}
                    </DrawerBody>
                </DrawerContent>

            </Drawer>
        </>
    )
}

export default SideDrawer