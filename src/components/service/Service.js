import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import app from '../firebase';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

const Service = () => {
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState({
    serviceTitle: '',
    description: '',
    image: null,
  });
  const [serviceDescriptionData, setServiceDescriptionData] = useState({
    serviceDescription: '',
  });
  const [editableServiceDescription, setEditableServiceDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch regular project data
      const projectsCollection = collection(firestore, 'service');
      const projectsData = await getDocs(projectsCollection);

      const projectsArray = projectsData.docs
        .filter((project) => project.id !== 'serviceDescription')
        .map((project) => ({
          id: project.id,
          ...project.data(),
        }));

      setProjects(projectsArray);

      // Fetch 'serviceDescription' data separately
      const serviceDescriptionDoc = doc(firestore, 'service', 'serviceDescription');
      const serviceDescriptionSnapshot = await getDoc(serviceDescriptionDoc);
      const serviceDescriptionData = serviceDescriptionSnapshot.data() || {};

      // Set both the original data and editable version
      setServiceDescriptionData(serviceDescriptionData);
      setEditableServiceDescription(serviceDescriptionData.serviceDescription);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleProjectSelect = (projectId) => {
    const selected = projects.find((project) => project.id === projectId);
    setSelectedProject(selected || {
      serviceTitle: '',
      description: '',
      image: null,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setSelectedProject((prev) => ({ ...prev, image: selectedImage }));
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) {
      alert('Please select a project to delete.');
      return;
    }

    try {
      const dataDoc = doc(firestore, 'service', selectedProject.id);
      await deleteDoc(dataDoc);

      alert('Data deleted successfully!');
      setSelectedProject(null);
      window.location.reload();
    } catch (error) {
      alert('Error deleting data:', error.message);
      console.error('Error deleting data:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedProject) {
      alert('Please select a project to update.');
      return;
    }

    try {
      // Check if a new image is selected
      if (selectedProject.image) {
        // Upload image to Firebase Storage
        const storageReference = storageRef(storage, `images/${selectedProject.image.name}`);
        await uploadBytes(storageReference, selectedProject.image);
        const imageUrl = await getDownloadURL(storageReference);

        // Update data in Firestore with the new image URL
        const dataDoc = doc(firestore, 'service', selectedProject.id);
        await updateDoc(dataDoc, {
          serviceTitle: selectedProject.serviceTitle,
          description: selectedProject.description,
          image: imageUrl,
        });

        alert('Data updated successfully!');
        setSelectedProject(null);
        window.location.reload();
      } else {
        // If no new image is selected, update data only
        const dataDoc = doc(firestore, 'service', selectedProject.id);
        await updateDoc(dataDoc, {
          serviceTitle: selectedProject.serviceTitle,
          description: selectedProject.description,
        });

        alert('Data updated successfully!');
        setSelectedProject(null);
        window.location.reload();
      }
    } catch (error) {
      alert('Error updating data and image:', error.message);
      console.error('Error updating data and image:', error);
    }
  };

  const handleUpdateServiceDescription = async () => {
    try {
      const serviceDescriptionDoc = doc(firestore, 'service', 'serviceDescription');
      await updateDoc(serviceDescriptionDoc, {
        serviceDescription: editableServiceDescription,
      });

      alert('Service description updated successfully!');
    } catch (error) {
      alert('Error updating service description:', error.message);
      console.error('Error updating service description:', error);
    }
  };

  return (
    <>
      <div id='services'>
      <hr className='mt-5' />
      <h1 className='text-center'>ServicePage Content</h1>
      <div className='d-flex justify-content-between'>
        <div className='section1 mt-5 w-100'>
          <h2>Service List</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.id} className='projectList'>
                <button onClick={() => handleProjectSelect(project.id)}>
                  {project.serviceTitle}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="section2 w-100">
           {/* Display editable serviceDescription data */}
           <div className='mt-5 '>
            <h2 className='serviceDescription'>ServicePage Description</h2>
            <input
              type='text'
              style={{width:"60%"}}
              value={editableServiceDescription}
              onChange={(e) => setEditableServiceDescription(e.target.value)}
            /> <br />
            <button className='update' style={{width:"60%"}} onClick={handleUpdateServiceDescription}>Update Description</button>
          </div>
          {selectedProject && (
            <div className='mt-5'>
              <h2>ServiceTitle</h2>
              <input
                type='text'
                style={{ width: '60%' }}
                value={selectedProject.serviceTitle}
                onChange={(e) => setSelectedProject((prev) => ({ ...prev, serviceTitle: e.target.value }))}
              />
              <div className='mt-5'>
                <h2>Description</h2>
                <textarea
                  style={{ width: '60%' }}
                  value={selectedProject.description}
                  onChange={(e) => setSelectedProject((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className='mt-2'>
                <h2>Choose Image</h2>
                <img src={selectedProject.image} alt='Selected' width={100} height={100} /> <br />
                <input
                  style={{ width: '60%' }}
                  type='file'
                  onChange={handleImageChange}
                />
              </div>
              <div>
                <button className='update' style={{ width: '60%' }} onClick={handleUpdate}>
                  Update
                </button>
              </div>
              <div>
                <button className='delete' style={{ width: '60%' }} onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          )}

         
        </div>
      </div>
      </div>
    </>
  );
};

export default Service;
