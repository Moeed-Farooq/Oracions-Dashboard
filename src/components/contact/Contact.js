// Dashboard.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc, uploadBytes, ref, getDownloadURL } from 'firebase/firestore';
import app from '../firebase'; // Adjust the path based on your project structure
import { getStorage, ref as storageRef, uploadBytes as uploadStorageBytes, getDownloadURL as getStorageDownloadURL } from 'firebase/storage'; // Update these imports
import Message from './Message';

const Contact = () => {
  const firestore = getFirestore(app);
  const storage = getStorage(app); // Initialize Firebase Storage instance

  const [address, setAddress] = useState('');
  const [ContactNumber, setContactNumber] = useState('');
  const [map, setMap] = useState('');
  const [whatsappLink, setwhatsappLink] = useState('');
  const [LocationLink, setLocationLink] = useState('');
  const [EmailLink, setEmailLink] = useState('');
  const [contactUsDescription, setcontactUsDescription] = useState('');
  const [ContactEmail, setContactEmail] = useState('');




  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch data from Firestore
      const dataCollection = collection(firestore, 'contact'); // Replace with your Firestore collection name
      const dataSnapshot = await getDocs(dataCollection);

      dataSnapshot.forEach((doc) => {
        const data = doc.data();
        setAddress(data.address);
        setContactNumber(data.ContactNumber);
        setwhatsappLink(data.whatsappLink);
        setMap(data.map);
        setLocationLink(data.LocationLink);
        setEmailLink(data.EmailLink);
        setContactEmail(data.ContactEmail);
        setcontactUsDescription(data.contactUsDescription);

        
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleUpdate = async () => {
    try {
        // Update data in Firestore
        const dataDoc = doc(firestore, 'contact', 'csfMceQFOwpQEHduqG3R'); 
        await updateDoc(dataDoc, {
            address,
            ContactEmail,
            ContactNumber,
            whatsappLink,
            LocationLink,
            map,
            EmailLink,
            contactUsDescription
        });
        alert('Data updated successfully!');
      
    } catch (error) {
      alert('Error updating data and image:', error.message);
      console.error('Error updating data and image:', error);
    }
  };

  return (
   <>
   <div id='contact'>
   <hr className='mt-5' />

<div id='home' className='text-center mb-5'>
  <h1 className='text-center'>ContactPage Content</h1>
  <div className='mt-5'>
    <h2>Contact Us Description</h2>
    <input type="text" 
     value={contactUsDescription} onChange={(e) => setcontactUsDescription(e.target.value)} />
  </div>

<div className='mt-5 '>
    <h2>Address</h2>
    <input
      type="text"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />
  </div>
  <div className='mt-5'>
    <h2>Address Link</h2>
    <input
      type="text"
      value={LocationLink}
      onChange={(e) => setLocationLink(e.target.value)}
    />
  </div>

<div className='mt-5 '>
    <h2>Contact Number</h2>
    <textarea
      value={ContactNumber}
      onChange={(e) => setContactNumber(e.target.value)}
    />
  </div>
  <div className='mt-5'>
    <h2>whatsapp link</h2>
    <textarea
      value={whatsappLink}
      onChange={(e) => setwhatsappLink(e.target.value)}
    />
  </div>

 <div className='mt-5 '>
    <h2>Email</h2>
    <textarea
      value={ContactEmail}
      onChange={(e) => setContactEmail(e.target.value)}
    />
  </div>
  <div className='mt-5'>
    <h2>Email Link</h2>
    <textarea
      value={EmailLink}
      onChange={(e) => setEmailLink(e.target.value)}
    />
  </div>
  <div className='mt-5'>
    <h2>Google map link</h2>
    <textarea
      value={map}
      onChange={(e) => setMap(e.target.value)}
    />
  </div>
  <div>
    <button className='update' onClick={handleUpdate}>Update</button>
  </div>
</div>
   </div>
   <Message/>
   </>
  );
};

export default Contact;
