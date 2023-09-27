import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import UserBadgeItem from './UserBadgeItem'
import axios from 'axios'
import UserListItem from './UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("second")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState()

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((user) => user._id === user1._id)) {
            toast({
                title: 'User sudah ada di grup',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Hanya admin yang bisa menambah anggota',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                "https://chat-app-2100016081-api.vercel.app/api/chat/groupadd",
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error!',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            setLoading(false);
        }
    }

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: 'Hanya admin yang bisa mengeluarkan anggota',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                "https://chat-app-2100016081-api.vercel.app/api/chat/groupremove",
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.response.data.message,
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            setLoading(false);
        }
    }

    const handleRename = async () => {
        if (!groupChatName) {
            return
        }

        try {
            setRenameLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put("https://chat-app-2100016081-api.vercel.app/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config);

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: 'Gagal mengubah nama grup',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            setRenameLoading(false)
        }

        setGroupChatName("")
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }

        try {
            setLoading(true)

            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`https://chat-app-2100016081-api.vercel.app/api/user?search=${search}`, config);
            console.log(data);
            setLoading(false)
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Gagal mencari user',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            setLoading(false)
        }
    }

    return (
        <>
            <IconButton
                icon={<ViewIcon />}
                onClick={onOpen}
                className="flex"
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedChat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box className="w-full flex flex-wrap pb-3">
                            {selectedChat.users.map(user => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleRemove(user)}
                                />
                            ))}
                        </Box>
                        <FormControl className='flex'>
                            <Input
                                placeholder='Nama Grup'
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                                className='mb-3'
                            />
                            <Button
                                isLoading={renameLoading}
                                onClick={handleRename}
                                variant='solid'
                                colorScheme='teal'
                                className="ml-1"
                            >
                                Ubah
                            </Button>
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder='Tambahkan anggota'
                                className='mb-1'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='red'
                            onClick={() => handleRemove(user)}
                        >
                            Keluar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal