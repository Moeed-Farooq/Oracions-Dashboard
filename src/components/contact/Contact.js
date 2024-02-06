// Dashboard.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc, uploadBytes, ref, getDownloadURL } from 'firebase/firestore';
import app from '../firebase'; // Adjust the path based on your project structure
import { getStorage, ref as storageRef, uploadBytes as uploadStorageBytes, getDownloadURL as getStorageDownloadURL } from 'firebase/storage'; // Update these imports
import Message from './Message';
import { Link } from 'react-router-dom';

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

<div id='home' className='row text-center mb-5'>
  <h1 className='text-center '>ContactPage Content</h1>
  <div className='col-md-4 mt-3'>
    <h4  className='text-start' >Contact Us Description</h4>
    <input type="text" 
     value={contactUsDescription} onChange={(e) => setcontactUsDescription(e.target.value)} />
  </div>

<div className=' col-md-4 mt-3 '>
    <h4  className='text-start'>Address</h4>
    <input
      type="text"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />
  </div>
  <div className='col-md-4 mt-3'>
    <h4  className='text-start'>Address Link</h4>
    <input
      type="text"
      value={LocationLink}
      onChange={(e) => setLocationLink(e.target.value)}
    />
  </div>

<div className='mt-3 col-md-4'>
    <h4  className='text-start'>Contact Number</h4>
    <textarea
      value={ContactNumber}
      onChange={(e) => setContactNumber(e.target.value)}
    />
  </div>
  <div className='mt-3 col-md-4'>
    <h4  className='text-start'>whatsapp link</h4>
    <textarea
      value={whatsappLink}
      onChange={(e) => setwhatsappLink(e.target.value)}
    />
  </div>

 <div className='mt-3 col-md-4 '>
    <h4  className='text-start'>Email</h4>
    <textarea
      value={ContactEmail}
      onChange={(e) => setContactEmail(e.target.value)}
    />
  </div>
  <div className='mt-3 col-md-4'>
    <h4  className='text-start'>Email Link</h4>
    <textarea
      value={EmailLink}
      onChange={(e) => setEmailLink(e.target.value)}
    />
  </div>
  <div className='mt-3 col-md-4'>
    <h4  className='text-start'>Google map link</h4>
    <textarea
      value={map}
      onChange={(e) => setMap(e.target.value)}
    />
  </div>
  <div className="col-md-4 " style={{marginTop:"50px"}}>
  <div>
    <button className='update w-100' onClick={handleUpdate}>Update</button>
  </div>
  <div>

  <Link to="/Message">
          <button className='update w-100'>See Messages</button>
        </Link>
    
  </div>
  </div>
 
</div>
   </div>
   
   </>
  );
};

export default Contact;
