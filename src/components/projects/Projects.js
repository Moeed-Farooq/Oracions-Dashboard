import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, updateDoc, doc, uploadBytes, ref, getDownloadURL, getDoc } from 'firebase/firestore';
import app from '../firebase';
import { getStorage, ref as storageRef, uploadBytes as uploadStorageBytes, getDownloadURL as getStorageDownloadURL } from 'firebase/storage';

const Projects = () => {
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState({
    title: '',
    Description: '',
    role: '',
    cardColor: '',
    image: null,
  });
  const [descriptionData, setDescriptionData] = useState({
    id: 'description',
    description: '', // Add the field you want to edit here
  });

  useEffect(() => {
    fetchData();
    fetchDescriptionData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsCollection = collection(firestore, 'projects');
      const projectsData = await getDocs(projectsCollection);

      const projectsArray = projectsData.docs
        .filter((project) => project.id !== 'description') // Exclude data with ID 'description'
        .map((project) => {
          const data = project.data();
          return { id: project.id, ...data };
        });

      setProjects(projectsArray);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDescriptionData = async () => {
    try {
      const descriptionDoc = await getDoc(doc(firestore, 'projects', 'description'));
      if (descriptionDoc.exists()) {
        const data = descriptionDoc.data();
        setDescriptionData((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching description data:', error);
    }
  };

  const handleProjectSelect = (projectId) => {
    // Check if the selected project is not 'description'
    if (projectId !== 'description') {
      const selected = projects.find((project) => project.id === projectId);
      setSelectedProject(selected || {
        title: '',
        Description: '',
        role: '',
        cardColor: '',
        image: null,
      });
    }
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
      const dataDoc = doc(firestore, 'projects', selectedProject.id);
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
        await uploadStorageBytes(storageReference, selectedProject.image);
        const imageUrl = await getStorageDownloadURL(storageReference);

        // Update data in Firestore with the new image URL
        const dataDoc = doc(firestore, 'projects', selectedProject.id);
        await updateDoc(dataDoc, {
          title: selectedProject.title,
          Description: selectedProject.Description,
          role: selectedProject.role,
          cardColor: selectedProject.cardColor,
          image: imageUrl,  // Update the Firestore document with the image URL
        });

        alert('Data updated successfully!');
        setSelectedProject(null); // Clear selected project after update
        window.location.reload();
      } else {
        // If no new image is selected, update data only
        const dataDoc = doc(firestore, 'projects', selectedProject.id);
        await updateDoc(dataDoc, {
          title: selectedProject.title,
          Description: selectedProject.Description,
          role: selectedProject.role,
          cardColor: selectedProject.cardColor,
        });

        alert('Data updated successfully!');
        setSelectedProject(null); // Clear selected project after update
        window.location.reload();
      }
    } catch (error) {
      alert('Error updating data and image:', error.message);
      console.error('Error updating data and image:', error);
    }
  };

  const handleDescriptionChange = async () => {
    try {
      // Update description in the 'members' collection
      const descriptionDoc = doc(firestore, 'projects', 'description');
      await updateDoc(descriptionDoc, {
        description: descriptionData.description,
      });
      alert('Description updated successfully!');
    } catch (error) {
      alert('Error updating description:', error.message);
      console.error('Error updating description:', error);
    }
  };

  return (
    <>
      <div id='projects'>
      <hr className='mt-5' />
      <h1 className='text-center'>ProjectPage Content</h1>
      <div className='d-flex justify-content-between'>
        <div className='section1 mt-5 w-100'>
          <h2>Project List</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.id} className='projectList'>
                <button onClick={() => handleProjectSelect(project.id)}>
                  {project.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="section2 w-100">
        {descriptionData && (
            <div className='mt-3'>
              <h2>Description from Projects Page</h2>
              <textarea
                style={{ width: "60%" }}
                value={descriptionData.description}
                onChange={(e) => setDescriptionData((prev) => ({ ...prev, description: e.target.value }))}
              />
              <div>
                <button className='update' style={{ width: "60%" }} onClick={handleDescriptionChange}>Update Description</button>
              </div>
            </div>
          )}
          {selectedProject && (
            <div className='mt-5'>
              <h2>Name</h2>
              <input
                type="text"
                style={{ width: "60%" }}
                value={selectedProject.title}
                onChange={(e) => setSelectedProject((prev) => ({ ...prev, title: e.target.value }))}
              />
              <div className='mt-5'>
                <h2>Description</h2>
                <textarea
                  style={{ width: "60%" }}
                  value={selectedProject.Description}
                  onChange={(e) => setSelectedProject((prev) => ({ ...prev, Description: e.target.value }))}
                />
              </div>
              <div className='mt-5'>
                <h2>Role</h2>
                <textarea
                  style={{ width: "60%" }}
                  value={selectedProject.role}
                  onChange={(e) => setSelectedProject((prev) => ({ ...prev, role: e.target.value }))}
                />
              </div>
              <div className='mt-5'>
                <h2>Color Combination</h2>
                <textarea
                  style={{ width: "60%" }}
                  value={selectedProject.cardColor}
                  onChange={(e) => setSelectedProject((prev) => ({ ...prev, cardColor: e.target.value }))}
                />
              </div>
              <div className='mt-2'>
                <h2>Choose Image</h2>
                <img src={selectedProject.image} alt="Selected" width={100} height={100} /> <br />
                <input
                  style={{ width: "60%" }}
                  type="file"
                  onChange={handleImageChange}
                />
              </div>
              <div>
                <button className='update' style={{ width: "60%" }} onClick={handleUpdate}>Update</button>
              </div>
              <div>
                <button className='delete' style={{ width: "60%" }} onClick={handleDelete}>Delete</button>
              </div>
            </div>
          )}
        
        </div>
      </div>
      </div>
    </>
  );
};

export default Projects;
