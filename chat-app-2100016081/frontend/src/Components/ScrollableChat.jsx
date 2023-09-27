import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../Config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import { Avatar, Tooltip } from '@chakra-ui/react'


const ScrollableChat = ({ messages }) => {

    const { user } = ChatState()
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => (
                <div
                    key={m._id}
                    className='flex'
                >
                    {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)
                    ) && (
                            <Tooltip
                                label={m.sender.name}
                                placement='bottom-start'
                                hasArrow
                            >
                                <Avatar
                                    size="sm"
                                    name={m.sender.name}
                                    src={m.sender.pic}
                                    className="mr-1 cursor-pointer"
                                />
                            </Tooltip>
                        )}
                    <span
                        style={{
                            backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                                }`,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%",
                            marginLeft: isSameSenderMargin(messages, m, i, user._id),
                            marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                        }}
                    >
                        {m.content}
                    </span>
                </div>
            ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat