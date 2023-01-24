import React, { useRef, useEffect, useState } from 'react'
import ScrollToBottom  from 'react-scroll-to-bottom';
function Chat({ socket, username, room }) {
    let messageRef = useRef();
    let mostRecentMessageRef = useRef();
    const [messageLog, setMessageLog] = useState([]);

    const sendMessage = async () => {
        if (messageRef.current.value !== "") {
            //contains all message data (room, user, id, date)
            let currentTime = new Date(Date.now());
            const messageData = {
                room: room,
                author: username,
                message: messageRef.current.value,
                displayTime: currentTime.getHours() + ":" + currentTime.getMinutes(), //e.g. 12:45,
                timeId: currentTime
            }

            await socket.emit("send_message", messageData);
            setMessageLog((list) => [...list, messageData]);
            messageRef.current.value = "" //reset message
            mostRecentMessageRef.current?.scrollIntoView({behavior: "smooth"})
        }
    }

    const handleEnter = (e) => {
        if(e.key==="Enter") sendMessage()
        
    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessageLog((list) => [...list, data]);
            mostRecentMessageRef.current?.scrollIntoView({behavior: "smooth"})
        });
    }, [socket]);

    return (
        <>
            <div className='chat-wrapper'>
                <div className='chat-header'>
                    <p>Live Chat</p>
                </div>
                <ScrollToBottom  className='chat-body'>
                    {messageLog.map((chat, i) => {
                        return (
                            <div
                                id={username === chat.author ? "currentUserChat" : "otherUserchat"}
                                key={`${chat.timeId}+${chat.author}+${chat.room}+${i}`}
                                className='message'
                            >
                                <div className='message-content'>
                                    <p>{chat.message}</p>
                                </div>
                                <div className='message-meta'>
                                    <span>{chat.displayTime} {chat.author}</span>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={mostRecentMessageRef}></div>
                </ScrollToBottom >
                <div className='chat-footer'>
                    <div className='chat-input-group'>
                        <input 
                            type="text" 
                            ref={messageRef} 
                            onKeyDown={handleEnter}
                        />
                        <button onClick={sendMessage}>&#9658;</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Chat