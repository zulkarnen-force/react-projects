import React from 'react'
import { Avatar, Box, Text } from '@chakra-ui/react'

const UserListItem = ({ user, handleFunction }) => {

    return (
        <Box
            onClick={handleFunction}
            className="cursor-pointer bg-gray-200 hover:bg-teal-500 hover:text-white w-full flex items-center text-black px-3 py-2 mb-2 rounded-lg"
        >
            <Avatar
                name={user.name}
                src={user.pic}
                className="mr-2 text-sm cursor-pointer"
            />
            <Box>
                <Text>{user.name}</Text>
                <Text fontSize="xs">
                    <b>Email : </b>
                    {user.email}
                </Text>
            </Box>
        </Box>
    )
}

export default UserListItem