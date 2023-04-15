import { defineStore } from "pinia";
import { getStorage, ref, uploadBytes } from "firebase/storage";


export const useStoreStorage = defineStore("storeStorage", {
  state: () => {
    return {
      
    };
  },
  actions: {
  	uploadProfileImage(image) {
      console.log("image from user", image);

      const storage = getStorage();
      const storageRef = ref(storage, `/UserProfileImages/${image.name}`);

      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, image)
			.then((snapshot) => {
				console.log(snapshot)
        console.log("Uploaded a blob or file!");
      });
    },
  },
  
});
