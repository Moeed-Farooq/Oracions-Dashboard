import React, { useState, useEffect } from 'react';
import { getFirestore, collection,getDoc, getDocs, deleteDoc, updateDoc, doc, uploadBytes, ref, getDownloadURL } from 'firebase/firestore';
import app from '../firebase';
import { getStorage, ref as storageRef, uploadBytes as uploadStorageBytes, getDownloadURL as getStorageDownloadURL } from 'firebase/storage';
import { Link } from 'react-router-dom';

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
      <h1 className='text-center'>Executive Team Page Content</h1>
      <div id='projects' className='row d-flex justify-content-between'>
        <div className='col-md-2 mt-5 '>
          <h4>Members List</h4>
          <ul>
            {projects.map((project) => (
              <li key={project.id} className='projectList'>
                <button className='w-100' onClick={() => handleProjectSelect(project.id)}>
                  {project.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-10 ">
          {/* Editable Description Section */}
          <div className='row mt-5'>
            <div className="col-md-3">
            <h4>ExecutiveMembers Description</h4>
            </div>
            <div className="col-md-6">
            <textarea
              value={editableDescription}
              onChange={(e) => setEditableDescription(e.target.value)}
            />
            </div>
            <div className="col-md-3">
            <div>
              <button   className='update w-100' onClick={handleUpdateDescription}>Update Description</button>
            </div>
            </div>            
          </div>
          {selectedProject && (
            <div className='row mt-2'>
              <div className="col-md-3"><h4>Name</h4></div>
              <div className="col-md-6">
                <input
                type="text"
                value={selectedProject.name}
                onChange={(e) => setSelectedProject((prev) => ({ ...prev, name: e.target.value }))}
              />
              </div>

              
              
              <div className='row mt-2'>
                <div className="col-md-3"><h4>Description</h4></div>
                <div className="col-md-6"><textarea
                  value={selectedProject.description}
                  onChange={(e) => setSelectedProject((prev) => ({ ...prev, description: e.target.value }))}
                /></div>

                
                
              </div>
              <div className='row mt-2'>
                <div className="col-md-3"><h4>Role</h4></div>
                <div className="col-md-6">
                  <textarea
                  value={selectedProject.role}
                  onChange={(e) => setSelectedProject((prev) => ({ ...prev, role: e.target.value }))}
                />
                </div>
              </div>
              <div className='row mt-2'>
                <div className="col-md-3">
                <h4>Choose Image</h4>
                </div>
                <div className="col-md-6">
                <img src={selectedProject.image} alt="Selected" width={100} height={100} /> <br />
                <input
                  type="file"
                  onChange={handleImageChange}
                />
                </div>
                <div className="col-md-3">
                <div>
                <button className='update w-100'   onClick={handleUpdate}>Update</button>
              </div>
              <div>
                <button className='delete w-100'   onClick={handleDelete}>Delete</button>
              </div>
              <div>
                <Link to="/CreateTeam">
                <button className='update w-100' >Add new Member</button>
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

export default Team;
