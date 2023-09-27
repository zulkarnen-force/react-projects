import React, { useState } from 'react'
import { ChatState } from '../Context/ChatProvider'

import SideDrawer from '../Components/SideDrawer';
import MyChats from '../Components/MyChats';
import ChatBox from '../Components/ChatBox';

const ChatPage = () => {
    const [fetchAgain, setFetchAgain] = useState(false)
    const { user } = ChatState();

    return (
        <div className='w-screen'>
            {user && <SideDrawer />}
            <div className="flex justify-between w-full p-10" style={{ height: '91.6vh' }}>
                {user && (
                    <MyChats fetchAgain={fetchAgain} />
                )}
                
                {user && (
                    <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                )}
            </div>
        </div>
    )
}

export default ChatPage