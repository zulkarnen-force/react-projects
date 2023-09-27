import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({ user, handleFunction }) => {
    return (
        <Box
            onClick={handleFunction}
            className="px-2 py-1 rounded-lg m-1 mb-2 bg-blue-500 text-white text-sm cursor-pointer"
        >
            {user.name}
            <CloseIcon className='pl-1 ml-1' />
        </Box>
    )
}

export default UserBadgeItem