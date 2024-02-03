import React, { useState, useEffect } from 'react';
import { getFirestore, collection,getDoc, getDocs, deleteDoc, updateDoc, doc, uploadBytes, ref, getDownloadURL } from 'firebase/firestore';
import app from '../firebase';
import { getStorage, ref as storageRef, uploadBytes as uploadStorageBytes, getDownloadURL as getStorageDownloadURL } from 'firebase/storage';

const Team = () => {
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState({
    name: '',
    description: '',
    role: '',
    image: null,
  });
  const [editableDescription, setEditableDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsCollection = collection(firestore, 'members');
      const projectsData = await getDocs(projectsCollection);

      const projectsArray = projectsData.docs
        .filter((project) => project.id !== 'description') // Exclude data with ID 'description'
        .map((project) => {
          const data = project.data();
          return { id: project.id, ...data };
        });

      setProjects(projectsArray);

      // Fetch 'description' data separately
      const descriptionDoc = doc(firestore, 'members', 'description');
      const descriptionSnapshot = await getDoc(descriptionDoc);
      const descriptionData = descriptionSnapshot.data() || {};

      // Set the editable description
      setEditableDescription(descriptionData.description);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleProjectSelect = (projectId) => {
    const selected = projects.find((project) => project.id === projectId);
    setSelectedProject(selected || {
      name: '',
      description: '',
      role: '',
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
      alert('Please select a member to delete.');
      return;
    }

    try {
      const dataDoc = doc(firestore, 'members', selectedProject.id);
      await deleteDoc(dataDoc);

      alert('Member deleted successfully!');
      setSelectedProject(null);
      window.location.reload();
    } catch (error) {
      alert('Error deleting member:', error.message);
      console.error('Error deleting member:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedProject) {
      alert('Please select a member to update.');
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
        const dataDoc = doc(firestore, 'members', selectedProject.id);
        await updateDoc(dataDoc, {
          name: selectedProject.name,
          description: selectedProject.description,
          role: selectedProject.role,
          image: imageUrl,
        });

        alert('Member updated successfully!');
        setSelectedProject(null); // Clear selected member after update
        window.location.reload();
      } else {
        // If no new image is selected, update data only
        const dataDoc = doc(firestore, 'members', selectedProject.id);
        await updateDoc(dataDoc, {
          name: selectedProject.name,
          description: selectedProject.description,
          role: selectedProject.role,
        });

        alert('Member updated successfully!');
        setSelectedProject(null); // Clear selected member after update
        window.location.reload();
      }
    } catch (error) {
      alert('Error updating member and image:', error.message);
      console.error('Error updating member and image:', error);
    }
  };

  const handleUpdateDescription = async () => {
    try {
      const descriptionDoc = doc(firestore, 'members', 'description');
      await updateDoc(descriptionDoc, {
        description: editableDescription,
      });

      alert('Description updated successfully!');
    } catch (error) {
      alert('Error updating description:', error.message);
      console.error('Error updating description:', error);
    }
  };

  return (
    <>
     <div id='team'>
     <hr className='mt-5' />
      <h1 className='text-center'>Executive Team Page Content</h1>
      <div id='projects' className='d-flex justify-content-between'>
        <div className='section1 mt-5 w-100'>
          <h2>Members List</h2>
          <ul>
            {projects.map((project) => (
              <li key={project.id} className='projectList'>
                <button onClick={() => handleProjectSelect(project.id)}>
                  {project.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="section2 w-100">
          {/* Editable Description Section */}
          <div className='mt-5'>
            <h2>Executive Members Description</h2>
            <textarea
            style={{width:"60%"}}
              value={editableDescription}
              onChange={(e) => setEditableDescription(e.target.value)}
            />
            <div>
              <button  style={{width:"60%"}} className='update' onClick={handleUpdateDescription}>Update Description</button>
            </div>
          </div>
          {selectedProject && (
            <div className='mt-5'>
              <h2>Name</h2>
              <input
               style={{width:"60%"}}
                type="text"
                value={selectedProject.name}
                onChange={(e) => setSelectedProject((prev) => ({ ...prev, name: e.target.value }))}
              />
              <div className='mt-5'>
                <h2>Description</h2>
                <textarea
                 style={{width:"60%"}}
                  value={selectedProject.description}
                  onChange={(e) => setSelectedProject((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className='mt-5'>
                <h2>Role</h2>
                <textarea
                 style={{width:"60%"}}
                  value={selectedProject.role}
                  onChange={(e) => setSelectedProject((prev) => ({ ...prev, role: e.target.value }))}
                />
              </div>
              <div className='mt-2'>
                <h2>Choose Image</h2>
                <img src={selectedProject.image} alt="Selected" width={100} height={100} /> <br />
                <input
                 style={{width:"60%"}}
                  type="file"
                  onChange={handleImageChange}
                />
              </div>
              <div>
                <button className='update'  style={{width:"60%"}} onClick={handleUpdate}>Update</button>
              </div>
              <div>
                <button className='delete'  style={{width:"60%"}} onClick={handleDelete}>Delete</button>
              </div>
            </div>
          )}

          
        </div>
      </div>
     </div>
    </>
  );
};

export default Team;
