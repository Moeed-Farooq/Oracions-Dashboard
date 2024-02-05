import React, { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc,
  uploadBytes,
  ref as firestoreRef,
  getDownloadURL as getFirestoreDownloadURL,
} from 'firebase/firestore';
import app from '../firebase'; // Adjust the path based on your project structure
import {
  getStorage,
  ref as storageRef,
  uploadBytes as uploadStorageBytes,
  getDownloadURL as getStorageDownloadURL,
} from 'firebase/storage'; // Update these imports

const Dashboard = () => {
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  const [companyName, setCompanyName] = useState('');
  const [HomeDescription, setHomeDescription] = useState('');
  const [image, setImage] = useState(null);
  const [logo, setLogo] = useState('');
  const [loading, setLoading] = useState(true); // Initially set loading to true

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dataCollection = collection(firestore, 'home');
      const dataSnapshot = await getDocs(dataCollection);

      dataSnapshot.forEach((doc) => {
        const data = doc.data();
        setCompanyName(data.companyName);
        setHomeDescription(data.HomeDescription);
        setLogo(data.logo || '');
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Set loading to false when data fetching is complete
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
      setLoading(true); // Set loading to true when starting the update process

      if (image) {
        const storageReference = storageRef(storage, 'images/' + image.name);
        await uploadStorageBytes(storageReference, image);
        const imageUrl = await getStorageDownloadURL(storageReference);

        const dataDoc = doc(firestore, 'home', 'B0ftAjUaDzjb2kSrLil6');
        await updateDoc(dataDoc, {
          companyName,
          HomeDescription,
          logo: imageUrl,
        });

        alert('Data updated successfully!');
      } else {
        const dataDoc = doc(firestore, 'home', 'B0ftAjUaDzjb2kSrLil6');
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
    } finally {
      setLoading(false); // Set loading to false when the update process is complete
    }
  };

  return (
    <div id='home' className='text-center'>
      <h1>HomePage Content</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className='mt-5'>
            <h2>Company Name</h2>
            <input
              type='text'
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className='mt-5'>
            <h2>Company Description</h2>
            <textarea
              value={HomeDescription}
              onChange={(e) => setHomeDescription(e.target.value)}
            />
          </div>
          <div className='mt-5'>
            <h2>Choose Logo</h2>
            <img src={logo} alt='Selected' width={100} height={100} /> <br />
            <input className='mt-2' type='file' onChange={handleImageChange} />
          </div>
          <div>
            <button className='update' onClick={handleUpdate} disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
