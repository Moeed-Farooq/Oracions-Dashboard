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
  const [loading, setLoading] = useState(false); // New loading state

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
          logo: imageUrl, // Update logo with the image URL
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
      <div className='row mt-5 d-flex'>
        <div className="col-md-3 text-start">
        <h4>Company Name</h4>
        </div>
        <div className="col-md-6">
        <input
          type='text'
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        </div>

        
      </div>
      <div className='row mt-5'>
        <div className="col-md-3 text-start">
        <h4>Compnay Description</h4>
        </div>
        <div className="col-md-6">
        <textarea
          value={HomeDescription}
          onChange={(e) => setHomeDescription(e.target.value)}
        />
        </div>

        
      </div>
      <div className='row mt-5'>
        <div className="col-md-3 text-start">
        <h4>Choose Logo</h4>
        </div>
        <div className="col-md-6   justify-content-between">
        <img src={logo} alt='Selected' width={100} height={100} /> <br />
        <input className='mt-2 w-50 mt-5'   type='file' onChange={handleImageChange} />
        </div>
        <div className="col-md-3">
        <div className='text-start mt-5'>
        <button className='update w-100 ' style={{marginTop:"100px"}} onClick={handleUpdate} disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>
        </div>
        

      </div>
      
    </div>
  );
};

export default Dashboard;
