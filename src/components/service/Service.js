import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import app from '../firebase';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';

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
     
      <h1 className='text-center'>ServicePage Content</h1>
      <div className='row  '>
        <div className='col-md-2 mt-5 text-center  '>
          <h4>Service List</h4>
          <ul >
            {projects.map((project) => (
              <li key={project.id} className='projectList'>
                <button style={{width:"100%"}} onClick={() => handleProjectSelect(project.id)}>
                  {project.serviceTitle}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-10  ">
           {/* Display editable serviceDescription data */}
           <div className='row mt-5 '>
            <div className="col-md-3 ">
            <h4 className='serviceDescription'>ServicePage Description</h4>
            </div>
            <div className="col-md-6">
              
            <input
              type='text'
              value={editableServiceDescription}
              onChange={(e) => setEditableServiceDescription(e.target.value)}
            /> <br />
            <button className='update w-100'  onClick={handleUpdateServiceDescription}>Update Description</button>
            </div>

          </div>
          {selectedProject && (
            <div className='row mt-3'>
              <div className="col-md-3 "><h4>ServiceTitle</h4></div>
              <div className="col-md-6 "><input
                type='text'
                value={selectedProject.serviceTitle}
                onChange={(e) => setSelectedProject((prev) => ({ ...prev, serviceTitle: e.target.value }))}
              /></div>

              
              
              <div className='row mt-3'>
                <div className="col-md-3 "><h4>Description</h4></div>
                <div className="col-md-6 ms-2">  
                <textarea

                  value={selectedProject.description}
                  onChange={(e) => setSelectedProject((prev) => ({ ...prev, description: e.target.value }))}
                />
                </div>

              
              </div>
              <div className='row mt-2'>
                <div className="col-md-3  ">
                <h4>Choose Image</h4>
                </div>
                <div className="col-md-6 ps-2">
                <img src={selectedProject.image} alt='Selected' width={100} height={100} /> <br />
                <input
                  type='file'
                  onChange={handleImageChange}
                />
                </div>
                <div className="col-md-3">
                <div className='text-start '>
                <button className='update w-100' onClick={handleUpdate}>
                  Update
                </button>
              </div>
              <div className='text-start'>
                <button className='delete w-100'  onClick={handleDelete}>
                  Delete
                </button>
              </div>
              <div className='text-start '>
               <Link to="CreateService"><button className='update w-100' >
                  create a new service
                </button>
                </Link> 
              </div>
                </div>

                
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
