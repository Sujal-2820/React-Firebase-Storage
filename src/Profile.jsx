/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { auth, firestore, storage } from '../../firebase';
import { collection, doc, getDoc, addDoc, updateDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { deleteImage } from './ImageDelete';
import ImageUpdate from './ImageUpdate';

import './Profile.css';

function Profile() {
  const [fullName, setFullName] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userDocRef = doc(collection(firestore, 'users'), user.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            setFullName(userData.fullName);
            setUserId(user.uid); // Set the userId state variable
          }
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    fetchImages();
  }, []);

  

  const uploadImage = () => {
    if (imageUpload == null) return;
  
    const user = auth.currentUser;
  
    if (user) {
      const userId = user.uid;
  
      const imageRef = ref(
        storage,
        `images/${userId}/${imageUpload.name}_${uuidv4()}`
      );
  
      uploadBytes(imageRef, imageUpload)
        .then(async () => {
          const imageUrl = await getDownloadURL(imageRef);
  
          const userImagesRef = collection(firestore, 'users', userId, 'images');
          await addDoc(userImagesRef, {
            imageUrl,
            title,
            content
          });
  
          alert('Image uploaded successfully');
          fetchImages();
          setImageUpload(null); // Reset the imageUpload state
          setTitle(''); // Reset the title state
          setContent(''); // Reset the content state
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  
  

  const fetchImages = async () => {
    try {
      const user = auth.currentUser;
  
      if (user) {
        const userId = user.uid;
        const userImagesRef = collection(firestore, 'users', userId, 'images');
        const querySnapshot = await getDocs(userImagesRef);
  
        const imageData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            url: data.imageUrl,
            title: data.title,
            content: data.content,
          };
        });
  
        setImageList(imageData);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  

  const handleDeleteImage = async (index) => {
    try {
      const imageData = imageList[index];
      const imageUrl = imageData.url;
      const imageTitle = imageData.title;
      const imageContent = imageData.content;
  
      await deleteImage(imageUrl, imageTitle, imageContent);
      alert('Image deleted successfully');
      fetchImages();
    } catch (error) {
      console.error(error);
    }
  };
  

  const handleUpdateImage = async (index) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/x-png,image/jpeg';
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const user = auth.currentUser;
        const userId = user.uid;
        const userImagesRef = collection(firestore, 'users', userId, 'images');
        const querySnapshot = await getDocs(userImagesRef);
  
        const imageUrl = imageList[index];
        const docToUpdate = querySnapshot.docs.find((doc) => doc.data().imageUrl === imageUrl);
        if (!docToUpdate) {
          console.error('Image document not found');
          return;
        }
  
        if (typeof imageUrl === 'string') {
          const imagePath = imageUrl.split('?')[0];
          const imageRef = ref(storage, imagePath);
  
          try {
            await uploadBytes(imageRef, file);
            const updatedImageUrl = await getDownloadURL(imageRef);
  
            await updateDoc(docToUpdate.ref, { imageUrl: updatedImageUrl });
  
            alert('Image updated successfully');
            fetchImages();
          } catch (error) {
            console.error(error);
          }
        } else {
          console.error('Invalid image URL');
        }
      }
    };
  
    input.click();
  };
  
  
  
  

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!auth.currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="container">
        <div className="form-container">
          <h2>Welcome, {fullName}!</h2>
          <br />
          <p>This is your profile page.</p>
          <br />
          <p>
            Go back to <Link to="/login">Login</Link> page.
          </p>
        </div>

        <div className="input-container">
          <input
            className="Title-input"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <br />
          <input
            className="Content-input"
            type="text"
            placeholder="Content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
          <input
            type="file"
            accept="image/x-png,image/jpeg"
            onChange={(event) => setImageUpload(event.target.files[0])}
          />
          <button onClick={uploadImage}>Upload</button>
        </div>

        <div className="images">
        {imageList.map((imageData, index) => (
          <div key={index} className="image-container">
            <img src={imageData.url} alt="img" />
            <h3>{imageData.title}</h3>
            <p>{imageData.content}</p>
            <br />
            <button
              className="delete-button"
              onClick={() => handleDeleteImage(index)}
            >
              Delete
            </button>
            <button
              className="update-button"
              onClick={() => handleUpdateImage(index)}
            >
              Update
            </button>
            {/* <ImageUpdate
              imageUrl={imageData.url}
              title={imageData.title}
              content={imageData.content}
              docId={imageData.docId}
              fetchImages={fetchImages}
            /> */}
          </div>
        ))}
      </div>
      </div>
    </>
  );
}

export default Profile;
