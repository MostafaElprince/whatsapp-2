import styled from 'styled-components'

import AttachFileIcon from '@material-ui/icons/AttachFile'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import InsertEmotioconIcon from '@material-ui/icons/InsertEmoticon'
import MicIcon from '@material-ui/icons/Mic'
import { Avatar, IconButton } from '@material-ui/core'
import TimeAgo from 'timeago-react'

import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useRef, useState } from 'react'
import firebase from 'firebase'

import { auth, db } from '../src/firebase'
import Message from './Message'
import getRecipientEmail from '../src/utils/getRecipientEmail'


function ChatScreen({ chat, messages }) {
    const [user] = useAuthState(auth)
    const [input, setInput] = useState("")
    const endOfMessageRef = useRef(null)
    const router = useRouter()
    const [messageSnapshot] = useCollection(
        db
            .collection('chats')
            .doc(router.query.id)
            .collection('messages')
            .orderBy('timestamp', 'asc')
    )

    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(chat.users, user))
    )

    const ScrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }
    
    const showMessage = () => {
        if (messageSnapshot) {
            ScrollToBottom()
            return messageSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                    }}
                />
            ))
        } else {
            return JSON.parse(messages).map(message => {
                <Message
                    key={message.id}
                    user={message.user}
                    message={message}
                />
            })
        }
    }


    const sendMessage = (e) => {
        e.preventDefault()

        db.collection("users").doc(user.uid).set({
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true })

        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        })
        setInput('')
    }


    const recipient = recipientSnapshot?.docs?.[0]?.data()
    const recipientEmail = getRecipientEmail(chat.users, user)

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}

                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last active : {' '}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            ) : "Unavailable"}
                        </p>
                    ) : (
                        <p>Loading Last active ...</p>
                    )}
                </HeaderInformation>

                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {/* Show Message */}
                {showMessage()}
                <EndOfMessage ref={endOfMessageRef} />
            </MessageContainer>

            <InputContainer>
                <InsertEmotioconIcon />
                <Input value={input} onChange={e => setInput(e.target.value)} />
                <button hidden display={!input} type="submit" onClick={sendMessage}>Send Message</button>
                <MicIcon />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen



const Container = styled.div``;
const Header = styled.div`
    position:sticky;
    top:0;
    background-color: white;
    z-index:100;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom:1px solid whitesmoke;
`;


const HeaderInformation = styled.div`
    margin-left:15px;
    flex:1;

    >h3{
        margin-bottom: 3px;
    }

    >p{
        font-size:14px;
        color:gray;
    }
`;


const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
    padding-top:100px;
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 100px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom:0;
    background-color: white;
    z-index:100;
`;

const Input = styled.input`
    flex:1;
    outline:0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left:15px;
    margin-right: 15px;
`;
