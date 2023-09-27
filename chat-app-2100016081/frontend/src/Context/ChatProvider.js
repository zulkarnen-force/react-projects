import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const [selectedChat, setSelectedChat] = useState();
    const [user, setUser] = useState();
    const [notification, setNotification] = useState([])
    const [chats, setChats] = useState([])

    const navigate = useNavigate();
    const location = useLocation();



    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        setUser(userInfo)
        const isSignupPage = location.pathname === "/auth/signup";

        if (!userInfo && !isSignupPage) {
            navigate("/auth/login")
        }
    }, [navigate])

    return (
        <ChatContext.Provider value={{
            selectedChat,
            setSelectedChat,
            user,
            setUser,
            chats,
            setChats,
            notification,
            setNotification
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;