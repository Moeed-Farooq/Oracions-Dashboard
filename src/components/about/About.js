import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc, uploadBytes, ref, getDownloadURL } from 'firebase/firestore';
import app from '../firebase'; // Adjust the path based on your project structure
import { getStorage, ref as storageRef, uploadBytes as uploadStorageBytes, getDownloadURL as getStorageDownloadURL } from 'firebase/storage'; // Update these imports
import Contact from '../contact/Contact';


const About = () => {

    const firestore = getFirestore(app);
    const storage = getStorage(app); // Initialize Firebase Storage instance
  
    const [description, setDescription] = useState('');
    const [service1, setService1] = useState('');
    const [service2, setService2] = useState('');
    const [service3, setService3] = useState('');
    const [service4, setService4] = useState('');
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        // Fetch data from Firestore
        const dataCollection = collection(firestore, 'About'); // Replace with your Firestore collection name
        const dataSnapshot = await getDocs(dataCollection);
  
        dataSnapshot.forEach((doc) => {
          const data = doc.data();
          setDescription(data.description);
          setService1(data.service1);
          setService2(data.service2);
          setService3(data.service3);
          setService4(data.service4);
          setImageUrl(data.imageUrl || ''); // Set imageUrl or an empty string if it doesn't exist
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
        // Upload image to Firebase Storage
        if (image) {
          const storageReference = storageRef(storage, 'images/' + image.name);
          await uploadStorageBytes(storageReference, image);
          const imageUrl = await getStorageDownloadURL(storageReference);
  
          // Update data in Firestore
          const dataDoc = doc(firestore, 'About', 'L3XszjGawD4qzIcd0GdG'); // Replace with your Firestore collection name and document ID
          await updateDoc(dataDoc, {
            description,
            service1,
            service2,
            service3,
            service4,
            imageUrl,
          });
  
          alert('Data updated successfully!');
        } else {
          // If no new image is selected, update data only
          const dataDoc = doc(firestore, 'About', 'L3XszjGawD4qzIcd0GdG'); // Replace with your Firestore collection name and document ID
          await updateDoc(dataDoc, {
            description,
            service1,
            service2,
            service3,
            service4,
          });
  
          alert('Data updated successfully!');
        }
      } catch (error) {
        alert('Error updating data and image:', error.message);
        console.error('Error updating data and image:', error);
      }
    };

    
  return (
    <>
    <hr className='mt-5' />
    <div id='about' className='mt-5 text-center'>
    <h1>About us Content</h1>
      <div className='my-5'>
       <h2>AboutUs Description</h2>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <h2>Services1</h2>
        <textarea
          value={service1}
          onChange={(e) => setService1(e.target.value)}
        />
      </div>
      <div>
        <h2>Services2</h2>
        <textarea
          value={service2}
          onChange={(e) => setService2(e.target.value)}
        />
      </div>
      <div>
        <h2>Services3</h2>
        <textarea
          value={service3}
          onChange={(e) => setService3(e.target.value)}
        />
      </div>
      <div>
       <h2>Services4</h2>
        <textarea
          value={service4}
          onChange={(e) => setService4(e.target.value)}
        />
      </div>
      <div>
        <h2>Image</h2>
        
        <img src={imageUrl} alt="Selected" className='w-25 h-25'   /> <br />
        <input className='mt-3 mb-3'
          type="file"
          onChange={handleImageChange}
        />
      </div>
      <div>
        <button className='update' onClick={handleUpdate}>Update</button>
      </div>

    </div>
    </>
  )
}

export default About