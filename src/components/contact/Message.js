import React, { useEffect, useState } from 'react';
import app from '../firebase';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const firestore = getFirestore(app);

const Message = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const messageCollection = collection(firestore, 'message');
        const querySnapshot = await getDocs(messageCollection);

        const messageData = [];
        querySnapshot.forEach((doc) => {
          messageData.push({ id: doc.id, ...doc.data() });
        });

        setMessages(messageData);
      } catch (error) {
        console.error('Error fetching messages:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        <h1>Messages:</h1>
        {messages.map((message) => (
          <div key={message.id}>
            <p>First Name: {message.firstName}</p>
            <p>Last Name: {message.lastName}</p>
            <p>Email: {message.email}</p>
            <p>Message: {message.message}</p>
            {message.fileUrl && (
              <img
                src={message.fileUrl}
                alt={`Image for ${message.firstName}`}
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
            )}
            <p>Timestamp: {message.timestamp?.toDate().toString()}</p>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
};

export default Message;
