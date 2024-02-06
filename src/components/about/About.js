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

const About = () => {
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  const [service1, setService1] = useState('');
  const [service2, setService2] = useState('');
  const [service3, setService3] = useState('');
  const [service4, setService4] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dataCollection = collection(firestore, 'About');
      const dataSnapshot = await getDocs(dataCollection);

      dataSnapshot.forEach((doc) => {
        const data = doc.data();
        setDescription(data.description);
        setService1(data.service1);
        setService2(data.service2);
        setService3(data.service3);
        setService4(data.service4);

        setImageUrl(data.imageUrl || '');
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
        setImageUrl(reader.result);
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

        const dataDoc = doc(firestore, 'About', 'L3XszjGawD4qzIcd0GdG');
        await updateDoc(dataDoc, {
          service1,
          service2,
          service3,
          service4,
          description,
          imageUrl: imageUrl, // Update logo with the image URL
        });

        alert('Data updated successfully!');
      } else {
        const dataDoc = doc(firestore, 'About', 'L3XszjGawD4qzIcd0GdG');
        await updateDoc(dataDoc, {
          service1,
          service2,
          service3,
          service4,
          description,
          imageUrl,
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
      <h1>AboutPage Content</h1>
      
      <div className='row mt-5'>
        <div className="col-md-3 text-start">
        <h4>About Description</h4>
        </div>
        <div className="col-md-6">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        </div>
      </div>
      <div className='row mt-2'>
        <div className="col-md-3 text-start">
        <h4>service1</h4>
        </div>
        <div className="col-md-6">
        <textarea
          value={service1}
          onChange={(e) => setService1(e.target.value)}
        />
        </div>
      </div>
      <div className='row mt-2'>
        <div className="col-md-3 text-start">
        <h4>service2</h4>
        </div>
        <div className="col-md-6">
        <textarea
          value={service2}
          onChange={(e) => setService2(e.target.value)}
        />
        </div>
      </div>
      <div className='row mt-2'>
        <div className="col-md-3 text-start">
        <h4>service3</h4>
        </div>
        <div className="col-md-6">
        <textarea
          value={service3}
          onChange={(e) => setService3(e.target.value)}
        />
        </div>
      </div>
      <div className='row mt-2'>
        <div className="col-md-3 text-start">
        <h4>service4</h4>
        </div>
        <div className="col-md-6">
        <textarea
          value={service4}
          onChange={(e) => setService4(e.target.value)}
        />
        </div>
      </div>
      <div className='row mt-2'>
        <div className="col-md-3 text-start">
        <h4>Choose Image</h4>
        </div>
        <div className="col-md-6 d-flex  justify-content-between">
        <img src={imageUrl} alt='Selected' width={100} height={100} /> <br />
        <input className='mt-2 w-50  ' style={{height:"50px"}}  type='file' onChange={handleImageChange} />
        </div>
        <div className="col-md-3">
        <div className='text-start mt-5'>
        <button className='update w-100' onClick={handleUpdate} disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
      </div>
        </div>
        

      </div>
      
    </div>
  );
};

export default  About;
