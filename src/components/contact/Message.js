import React, { useEffect, useState } from 'react';
import app from '../firebase';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

const firestore = getFirestore(app);

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: '',
    fileUrl: '',
    timestamp: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 7;

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
  }, [firestore]);

  const handleButtonClick = (message) => {
    setSelectedMessage(message);
  };

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

  const renderPagination = () => {
    const pageNumbers = Math.ceil(messages.length / messagesPerPage);

    return (
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
            disabled={currentPage === 1}
            style={{ backgroundColor: '#41B2A8', color: 'white' }}
          >
            Previous
          </button>
        </li>
        {Array.from({ length: pageNumbers }).map((_, index) => (
          <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(index + 1)}
              style={{ backgroundColor: '#41B2A8', color: 'white' }}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === pageNumbers ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
            disabled={currentPage === pageNumbers}
            style={{ backgroundColor: '#41B2A8', color: 'white' }}
          >
            Next
          </button>
        </li>
      </ul>
    );
  };

  return (
    <>
      <div className="row">
        <div className='col-md-4'>
          <h1>Messages:</h1>
          {currentMessages.map((message) => (
            <div key={message.id} className='mt-2'>
              <button className='update w-100' onClick={() => handleButtonClick(message)}>
                {`${message.firstName} - ${message.timestamp?.toDate().toLocaleString()}`}
              </button>
            </div>
          ))}
        </div>
        <div className='col-md-8'>
          <h2>Selected Message:</h2>
          <p>First Name: {selectedMessage.firstName}</p>
          <p>Last Name: {selectedMessage.lastName}</p>
          <p>Email: {selectedMessage.email}</p>
          <p>Message: {selectedMessage.message}</p>
          {selectedMessage.fileUrl && (
            <img
              src={selectedMessage.fileUrl}
              alt={`Image for ${selectedMessage.firstName}`}
              style={{ maxWidth: '100%', maxHeight: '200px' }}
            />
          )}
          <p>
            Timestamp: {selectedMessage.timestamp?.toDate ? selectedMessage.timestamp.toDate().toString() : 'N/A'}
          </p>
        </div>
      </div>
      <div className="row mt-2">
        <div className='col-md-12 d-flex justify-content-center'>
          {renderPagination()}
        </div>
      </div>
    </>
  );
};

export default Message;
