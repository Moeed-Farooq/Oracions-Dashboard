// Dashboard.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc, uploadBytes, ref, getDownloadURL } from 'firebase/firestore';
import app from '../firebase'; // Adjust the path based on your project structure
import { getStorage, ref as storageRef, uploadBytes as uploadStorageBytes, getDownloadURL as getStorageDownloadURL } from 'firebase/storage'; // Update these imports

const Dashboard = () => {
  const firestore = getFirestore(app);
  const storage = getStorage(app); // Initialize Firebase Storage instance

  const [companyName, setCompanyName] = useState('');
  const [HomeDescription, setHomeDescription] = useState('');
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch data from Firestore
      const dataCollection = collection(firestore, 'home'); // Replace with your Firestore collection name
      const dataSnapshot = await getDocs(dataCollection);

      dataSnapshot.forEach((doc) => {
        const data = doc.data();
        setCompanyName(data.companyName);
        setHomeDescription(data.HomeDescription);
        setLogo(data.logo || ''); // Set imageUrl or an empty string if it doesn't exist
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleUpdate = async () => {
    try {
      // Upload image to Firebase Storage
      if (image) {
        const storageReference = storageRef(storage, 'images/' + image.name);
        await uploadStorageBytes(storageReference, image);
        const imageUrl = await getStorageDownloadURL(storageReference);

        // Update data in Firestore
        const dataDoc = doc(firestore, 'home', 'B0ftAjUaDzjb2kSrLil6'); // Replace with your Firestore collection name and document ID
        await updateDoc(dataDoc, {
          companyName,
          HomeDescription,
          logo,
        });

        alert('Data updated successfully!');
      } else {
        // If no new image is selected, update data only
        const dataDoc = doc(firestore, 'home', 'B0ftAjUaDzjb2kSrLil6'); // Replace with your Firestore collection name and document ID
        await updateDoc(dataDoc, {
          companyName,
          HomeDescription,
          logo,
        });

        alert('Data updated successfully!');
      }
    } catch (error) {
      alert('Error updating data and image:', error.message);
      console.error('Error updating data and image:', error);
    }
  };

  return (
    <div id='home' className='text-center' >
      <h1>HomePage Content</h1>
      <div className='mt-5'>
        <h2>Company Name</h2>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
      <div className='mt-5'>
        <h2>Compnay Description</h2>
        <textarea
          value={HomeDescription}
          onChange={(e) => setHomeDescription(e.target.value)}
        />
      </div>
      <div className='mt-5'>
        <h2>Choose Logo</h2>
        <img src={logo} alt="Selected" width={100} height={100} /> <br />
        <input className='mt-2'
          type="file"
          onChange={handleImageChange}
        />
        
      </div>
      <div>
        <button className='update' onClick={handleUpdate}>Update</button>
      </div>
    </div>
  );
};

export default Dashboard;
