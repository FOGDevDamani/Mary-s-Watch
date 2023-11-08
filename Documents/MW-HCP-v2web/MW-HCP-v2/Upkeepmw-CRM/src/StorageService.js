import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

class Storage {

	async uploadProfileImage(image, currentUID, userData) {
      console.log("image from user", image);

      const storage = getStorage();
    
      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: image.type,
      };

			const storageRef = ref(storage, "UserProfileImages/" + image.name);
      const uploadTask = uploadBytesResumable(storageRef, image, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
						await axios
              .post(
                "https://adddownloadurltouserprofile-qqntzlhyfq-uw.a.run.app",
                {
                  gUID: currentUID,
                  downloadURL: downloadURL,
									userData: userData
                }
              )
              .catch((err) => {
                console.log("err", err);
              });
          })
        }
      );
    }

    uploadAssetProfileImage(image) {
      console.log("image from asset", image);

      const storage = getStorage();
      const storageRef = ref(storage, `/OwnerAssetImages/${image.name}`);

      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, image)
        .then((snapshot) => {
          console.log(snapshot);
          console.log("Uploaded a blob or file!");
        })
        .catch((err) => console.log(err));
    }

    uploadTicketProfileImage(image, perspective) {
      console.log("image from ticket", image);

      const storage = getStorage();
      const storageRef = ref(
        storage,
        `/${perspective}TicketProfileImages/${image.name}`
      );

      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, image).then((snapshot) => {
        console.log(snapshot);
        console.log("Uploaded a blob or file!");
      });
    }

    uploadTeamProfileImage(image, currentUID, perspective, cloudFunctionPerspective) {
      console.log("image from team", image);

      const storage = getStorage();
      const storageRef = ref(
        storage,
        `/${perspective}TeamProfileImages/${image.name}`
      );

      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: image.type,
      };
     
      const uploadTask = uploadBytesResumable(storageRef, image, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref)
            .then(async (downloadURL) => {
              console.log("File available at", downloadURL);
              await axios
                .post(
                  `https://adddownloadurlto${cloudFunctionPerspective}teamprofile-qqntzlhyfq-uw.a.run.app`,
                  {
                    currentUID: currentUID,
                    downloadURL: downloadURL,
                  }
                )
                .catch((err) => {
                  console.log("err", err);
                });
              this.$patch({
                downloadURL: downloadURL,
              });
            })
        }
      );
    }

    uploadTeamMemberProfileImage(image, currentUID, perspective,  cloudFunctionPerspective) {
      console.log("image from team member", image);

      const storage = getStorage();
      const storageRef = ref(
        storage,
        `/${perspective}TeamTeamMemberProfileImages/${image.name}`
      );

      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: image.type,
      };

      const uploadTask = uploadBytesResumable(storageRef, image, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            await axios
              .post(
                `https://adddownloadurlto${cloudFunctionPerspective}teamteammemberprofile-qqntzlhyfq-uw.a.run.app`,
                {
                  currentUID: currentUID,
                  downloadURL: downloadURL,
                }
              )
              .catch((err) => {
                console.log("err", err);
              });
            this.$patch({
              downloadURL: downloadURL,
            });
          });
        }
      );
    }

    uploadCustomerProfileImage(image, currentUID, perspective, cloudFunctionPerspective) {
      console.log("image from customer", image);

      const storage = getStorage();
      const storageRef = ref(
        storage,
        `/${perspective}CustomerProfileImages/${image.name}`
      );

      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: image.type,
      };

      const uploadTask = uploadBytesResumable(storageRef, image, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log("File available at", downloadURL);
            await axios
              .post(
                `https://adddownloadurlto${cloudFunctionPerspective}customerprofile-qqntzlhyfq-uw.a.run.app`,
                {
                  currentUID: currentUID,
                  downloadURL: downloadURL,
                }
              )
              .catch((err) => {
                console.log("err", err);
              });
            this.$patch({
              downloadURL: downloadURL,
            });
          });
        }
      );
    }
}

export { Storage }