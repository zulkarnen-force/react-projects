import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import axios from 'axios'
import UserListItem from './UserListItem'
import UserBadgeItem from './UserBadgeItem'

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])

    const [loading, setLoading] = useState(false)
    const toast = useToast()

    const { user, chats, setChats } = ChatState()

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
            // console.log(data);
            setLoading(false)
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Gagal mencari user',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: 'Peringatan!',
                description: 'Nama grup dan anggota grup tidak boleh kosong',
                status: 'warning',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            return
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post("https://chat-app-2100016081-api.vercel.app/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((user) => user._id))
            }, config);

            setChats([data, ...chats])
            onClose()
            toast({
                title: 'Grup berhasil dibuat',
                status: 'success',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
        } catch (error) {
            toast({
                title: 'Gagal membuat grup',
                status: 'error',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
        }
    }

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: 'User sudah ada di grup',
                status: 'warning',
                duration: 2000,
                position: 'top-right',
                isClosable: true,
            })
            return
        }

        setSelectedUsers([...selectedUsers, userToAdd])
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        className="flex justify-center"
                    >
                        Buat Grup Baru
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        className="flex flex-col items-center"
                    >
                        <FormControl>
                            <Input
                                placeholder='Nama grup'
                                className='mb-3'
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Masukkan nama teman'
                                className='mb-1'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        <Box className="w-full flex flex-wrap">
                            {selectedUsers.map(user => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleDelete(user)}
                                />
                            ))}
                        </Box>

                        {loading ? <div>Loading...</div> : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Buat Grup
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal