import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import { storage, firestore } from '../../firebase';

const ImageUpdate = ({ imageUrl, title, content, docId, fetchImages }) => {
  const [fileUpload, setFileUpload] = useState(null);

  const handleUpdateImage = async () => {
    if (!fileUpload) return;

    const imagePath = imageUrl.split('?')[0];
    const imageRef = ref(storage, imagePath);

    try {
      await uploadBytes(imageRef, fileUpload);
      const updatedImageUrl = await getDownloadURL(imageRef);

      const userImagesRef = collection(firestore, 'users', 'images');
      const querySnapshot = await getDocs(userImagesRef);

      querySnapshot.forEach(async (doc) => {
        if (doc.id === docId) {
          await updateDoc(doc.ref, {
            imageUrl: updatedImageUrl,
            title,
            content,
          });
        }
      });

      alert('Image updated successfully');
      fetchImages();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileUpload(file);
  };

  return (
    <div>
      <input type="file" accept="image/x-png,image/jpeg" onChange={handleFileChange} />
      <button className="update-image-button" onClick={handleUpdateImage}>
        Update
      </button>
    </div>
  );
};

export default ImageUpdate;
