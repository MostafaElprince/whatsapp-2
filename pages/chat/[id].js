import Sidebar from '../../components/Sidebar'
import ChatScreen from '../../components/ChatScreen'

import styled from 'styled-components'
import Head from 'next/head'
import { auth, db } from '../../src/firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import getRecipientEmail from '../../src/utils/getRecipientEmail'


const Chat = ({ chat, messages }) => {
    const [user] = useAuthState(auth)
    return (
        <Container>
            <Head>
                <title>Chat With {getRecipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    )
}

export default Chat


export async function getServerSideProps(context) {
    const ref = db.collection('chats').doc(context.query.id)

    // PREP the message on the server 
    const messageRef = await ref.collection('messages').orderBy('timestamp', 'asc').get()

    const messages = messageRef.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })).map(messages => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime()
    }))

    // PREP the chats
    const chatRef = await ref.get();
    const chat = {
        id: chatRef.id,
        ...chatRef.data()
    }

    return {
        props: {
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex:1;
    overflow: scroll;
    height:100vh;


    ::-webkit-scrollbar{
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;