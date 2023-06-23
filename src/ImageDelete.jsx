import { ref, deleteObject } from 'firebase/storage';
import { storage } from '../../firebase';
import { getFirestore, collection, deleteDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const deleteImage = async (imageUrl, imageTitle, imageContent) => {
  try {
    const imagePath = imageUrl.split('?')[0];
    const imageRef = ref(storage, imagePath);

    await deleteObject(imageRef);

    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user.uid;
    const firestore = getFirestore();

    const userImagesRef = collection(firestore, 'users', userId, 'images');
    const querySnapshot = await getDocs(userImagesRef);

    querySnapshot.forEach(async (doc) => {
      const data = doc.data();
      if (data.title === imageTitle && data.content === imageContent) {
        await deleteDoc(doc.ref);
      }
    });
  } catch (error) {
    throw error;
  }
};

export { deleteImage };
