import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, uploadBytes, ref, getDownloadURL } from 'firebase/firestore';
import app from '../firebase';
import { getStorage, ref as storageRef, uploadBytes as uploadStorageBytes, getDownloadURL as getStorageDownloadURL } from 'firebase/storage';

const CreateTeam = () => {
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    role: '',
    image: null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsCollection = collection(firestore, 'members');
      const projectsData = await getDocs(projectsCollection);

      const projectsArray = projectsData.docs.map((project) => {
        const data = project.data();
        return { id: project.id, ...data };
      });

      setProjects(projectsArray);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleProjectSelect = (projectId) => {
    const selected = projects.find((project) => project.id === projectId);
    setSelectedProject(selected);
    setNewProject({
      name: '',
      description: '',
      role: '',
      image: null,
    }); // Clear new project data
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setNewProject((prev) => ({ ...prev, image: selectedImage }));
    }
  };

  const handleCreate = async () => {
    try {
      const projectsCollection = collection(firestore, 'members');
      const newProjectDocRef = await addDoc(projectsCollection, {
        name: newProject.name,
        description: newProject.description,
        role: newProject.role,
        // Other fields as needed
      });

      if (newProject.image) {
        const storageReference = storageRef(storage, `images/${newProject.image.name}`);
        await uploadStorageBytes(storageReference, newProject.image);
        const imageUrl = await getStorageDownloadURL(storageReference);

        // Update the new project with the image URL
        await updateDoc(newProjectDocRef, { image: imageUrl });
      }

      alert('Project created successfully!');
      setNewProject({
        name: '',
        description: '',
        role: '',
        cardColor: '',
        image: null,
      });
      window.location.reload();
    } catch (error) {
      alert('Error creating project:', error.message);
      console.error('Error creating project:', error);
    }
  };

  const handleUpdate = async () => {
    if (!selectedProject) {
      alert('Please select a project to update.');
      return;
    }

    try {
      // Update data in Firestore
      const dataDoc = doc(firestore, 'members', selectedProject.id);
      await updateDoc(dataDoc, {
        name: selectedProject.name,
        description: selectedProject.description,
        role: selectedProject.role,
        cardColor: selectedProject.cardColor,
      });

      // Upload image to Firebase Storage if a new image is selected
      if (selectedProject.image) {
        const storageReference = storageRef(storage, `images/${selectedProject.image.name}`);
        await uploadStorageBytes(storageReference, selectedProject.image);
        const imageUrl = await getStorageDownloadURL(storageReference);

        // Update the project with the new image URL
        await updateDoc(dataDoc, { image: imageUrl });
      }

      alert('Data updated successfully!');
      setSelectedProject(null);
      window.location.reload();
    } catch (error) {
      alert('Error updating data and image:', error.message);
      console.error('Error updating data and image:', error);
    }
  };

  // ... (rest of the code)

  return (
    <div id='projects'>

      <div className='mt-5'>
        <h2>Create New Member</h2>
        <div>
          <input
            type="text"
            placeholder="Name"
            value={newProject.name}
            onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className='mt-5'>
          <textarea
            placeholder="Description"
            value={newProject.description}
            onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div className='mt-5'>
          <textarea
            placeholder="Role"
            value={newProject.role}
            onChange={(e) => setNewProject((prev) => ({ ...prev, role: e.target.value }))}
          />
        </div>
        <div className='mt-2'>
          <h2>Choose Image</h2>
          <img src={newProject.image} alt="Selected" width={100} height={100} /> <br />
          <input
            type="file"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <button className='update' onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
