import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, updateDoc, doc, uploadBytes, ref, getDownloadURL, getDoc } from 'firebase/firestore';
import app from '../firebase';
import { getStorage, ref as storageRef, uploadBytes as uploadStorageBytes, getDownloadURL as getStorageDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';

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
      <h1 className='text-center'>ProjectPage Content</h1>
      <div className='row d-flex justify-content-between'>
        <div className='col-md-2 mt-3'>
          <h4>Project List</h4>
          <ul>
            {projects.map((project) => (
              <li key={project.id} className='projectList'>
                <button className='w-100' onClick={() => handleProjectSelect(project.id)}>
                  {project.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-10">
        {descriptionData && (
            <div className='row mt-2'>
              <div className="col-md-3">
              <h4>Projects Description</h4>
              </div>
              <div className="col-md-6">
              <textarea
                value={descriptionData.description}
                onChange={(e) => setDescriptionData((prev) => ({ ...prev, description: e.target.value }))}
              />
              
              </div>
              <div className="col-md-3">
              <div>
                <button className='update w-100'  onClick={handleDescriptionChange}>Update Description</button>
              </div>
              </div>

              
              
            </div>
          )}
          {selectedProject && (
            <div className='row'>
              <div className="col-md-3">
              <h4>Name</h4>
              </div>
              <div className="col-md-6">
              <input
                type="text"
                value={selectedProject.title}
                onChange={(e) => setSelectedProject((prev) => ({ ...prev, title: e.target.value }))}
              />
              </div>
              
              <div className='row mt-1'>
                <div className="col-md-3"><h4>Description</h4></div>
                <div className="col-md-6">
                <textarea
                  value={selectedProject.Description}
                  onChange={(e) => setSelectedProject((prev) => ({ ...prev, Description: e.target.value }))}
                />
                </div>

              </div>
              <div className='row mt-1'>
                <div className="col-md-3">
                <h4>Role</h4>
                </div>
                <div className="col-md-6">
                <textarea
                  value={selectedProject.role}
                  onChange={(e) => setSelectedProject((prev) => ({ ...prev, role: e.target.value }))}
                />
                </div>

                
                
              </div>
              <div className='row mt-1'>
                <div className="col-md-3"><h4>Color Combination</h4></div>
                <div className="col-md-6">
                <textarea
                  value={selectedProject.cardColor}
                  onChange={(e) => setSelectedProject((prev) => ({ ...prev, cardColor: e.target.value }))}
                />
                </div>

                
                
              </div>
              <div className='row mt-1'>
                <div className="col-md-3"><h4>Choose Image</h4></div>
                <div className="col-md-6">
                <img src={selectedProject.image} alt="Selected" width={100} height={100} /> <br />
                <input
                  type="file"
                  onChange={handleImageChange}
                />
                </div>
                <div className="col-md-3">
                <div>
                <button className='update w-100' onClick={handleUpdate}>Update</button>
              </div>
              <div>
                <button className='delete w-100'  onClick={handleDelete}>Delete</button>
              </div>
              <div>
              <Link to="/CreateProjects"><button className='update w-100'  >create new Project</button></Link>

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

export default Projects;
