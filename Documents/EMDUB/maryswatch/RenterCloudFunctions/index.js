//////////////////variables///////////////////
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
const axios = require("axios");
const googleMapsApiKey = "AIzaSyCZWa8sZcUO159z5FK2FFbZcM-5BF7GRJE";
admin.initializeApp();

exports.renterTeamMap = functions.https.onRequest(async (request, response) => {
  try {
    const address = request.body.address;
    const renterId = request.body.renterId;
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${googleMapsApiKey}`
    );

    data, data.status;

    if (data.status !== "OK") {
      //no results
      return cors(request, response, () => {
        response.status(200).send("No Results");
      });
    }

    const geocodedLocation = data.results[0];
    const objGeolocationAndID = {
      createdOn: admin.firestore.Timestamp.fromDate(new Date()),
      address: geocodedLocation.formatted_address,
      geoPoint: new admin.firestore.GeoPoint(
        geocodedLocation.geometry.location.lat,
        geocodedLocation.geometry.location.lng
      ),
      renterId: renterId,
    };
    var userPerspectives = [];
    var renter = "renter";
    await admin
      .firestore()
      .collection("user")
      .where("user_id", "==", renterId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          userPerspectives = doc.data().perspective;
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });

    if (userPerspectives.includes(renter)) {
      await admin
        .firestore()
        .collection("RenterTeamLocations")
        .add(objGeolocationAndID);
    }

    return cors(request, response, () => {
      response.status(200).send(objGeolocationAndID);
    });
  } catch (error) {
    functions.logger.error(error.message);
    return cors(request, response, () => {
      response.status(500).send();
    });
  }
});

 exports.updateRenterTeamImage = functions.firestore
   .document("/RenterTeams/{teamId}")
   .onCreate((snapshot, context) => {
     const value = snapshot.data();

     console.log("document reference", snapshot.ref);

     var image = value.profileImage;

     if (image.includes(".png")) {
       var image = image.split(".png");
       var splitImage = image[0];

       console.log("split image", splitImage);

       var desiredPNGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/RenterTeamProfileImages/${splitImage}_250x250.png`;
       console.log("png", desiredPNGImage);
       return snapshot.ref.update({ teamProfileImage: desiredPNGImage });
     } else if (image.includes(".jpg")) {
       var image = image.split(".jpg");
       var splitImage = image[0];

       console.log("split image", splitImage);

       var desiredJPGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/RenterTeamProfileImages/${splitImage}_250x250.jpg`;
       console.log("jpg", desiredJPGImage);
       return snapshot.ref.update({ teamProfileImage: desiredJPGImage });
     } else if (image.includes(".jpeg")) {
       var image = image.split(".jpeg");
       var splitImage = image[0];

       console.log("split image", splitImage);

       var desiredJPEGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/RenterTeamProfileImages/${splitImage}_250x250.jpeg`;
       console.log("jpeg", desiredJPEGImage);
       return snapshot.ref.update({ teamProfileImage: desiredJPEGImage });
     }
   });

 exports.updateRenterTeamTeamMemberImage = functions.firestore
   .document("/RenterTeamTeamMembers/{teamMemberId}")
   .onCreate((snapshot, context) => {
     const value = snapshot.data();

     console.log("document reference", snapshot.ref);

     var image = value.profileImage;

     if (image.includes(".png")) {
       var image = image.split(".png");
       var splitImage = image[0];

       console.log("split image", splitImage);

       var desiredPNGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/RenterTeamTeamMemberProfileImages/${splitImage}_250x250.png`;
       console.log("png", desiredPNGImage);
       return snapshot.ref.update({
         teamMemberProfileImage: desiredPNGImage,
       });
     } else if (image.includes(".jpg")) {
       var image = image.split(".jpg");
       var splitImage = image[0];

       console.log("split image", splitImage);

       var desiredJPGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/RenterTeamTeamMemberProfileImages/${splitImage}_250x250.jpg`;
       console.log("jpg", desiredJPGImage);
       return snapshot.ref.update({
         teamMemberProfileImage: desiredJPGImage,
       });
     } else if (image.includes(".jpeg")) {
       var image = image.split(".jpeg");
       var splitImage = image[0];

       console.log("split image", splitImage);

       var desiredJPEGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/RenterTeamTeamMemberProfileImages/${splitImage}_250x250.jpeg`;
       console.log("jpeg", desiredJPEGImage);
       return snapshot.ref.update({
         teamMemberProfileImage: desiredJPEGImage,
       });
     }
   });