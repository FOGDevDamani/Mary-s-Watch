//////////////////variables///////////////////
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
const axios = require("axios");
const googleMapsApiKey = "AIzaSyCZWa8sZcUO159z5FK2FFbZcM-5BF7GRJE";
admin.initializeApp();




exports.shareOwnerTicketWithAssetNetwork = functions.firestore
  .document("/OwnerSupportTickets/{userId}")
  .onUpdate(async (change, context) => {
    const data = change.after.data();
    const ownerSupportTicketTopic = "ownerSupportTicketAdded";
    var usersName = "";

    var assetNetwork = [];
    var assetNetworkId = "";

    console.log(data.ownerId);

    if (data.sentByRenter == true && data.docId == undefined) {
      return;
    }

    await admin
      .firestore()
      .collection("Assets")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          assetNetwork = doc.data().assetNetwork;
          assetNetworkId = doc.data().assetNetworkId;
        });
      });

    for (const member of assetNetwork) {
      if (member.perspective == "owner") {
        usersName = member.name;
      }
    }

    change.after.ref.update({ assetNetworkId: assetNetworkId });

    await admin.firestore().collection("SPSupportTickets").add({
      createdOn: Date.now(),
      docIdFromOwnerTicket: data.docId,
      assetNetworkId: assetNetworkId,
      address: data.address,
      sentByOwner: true,
      sentBy: usersName,
      ticketData: data,
    });

    return await admin
      .firestore()
      .collection("tokens")
      .get()
      .then((snapshot) => {
        const tokens = [];
        if (snapshot.empty) {
          console.log("No tokens");
          return false;
        } else {
          for (var key of snapshot.docs) {
            tokens.push(key.data().token);
          }

          console.log(tokens);

          admin
            .messaging()
            .subscribeToTopic(tokens, ownerSupportTicketTopic)
            .then((response) => {
              // See the MessagingTopicManagementResponse reference documentation
              // for the contents of response.
              console.log("Successfully subscribed to topic:", response);
            })
            .catch((error) => {
              console.log("Error subscribing to topic:", error);
            });

          const message = {
            notification: {
              title: "SP received your support ticket",
              body: "Your maintenance request has been received. Your preferred service provider has been contacted. Someone will get back to you shortly",
            },
            topic: ownerSupportTicketTopic,
          };

          console.log(message);

          return admin
            .messaging()
            .send(message)
            .then((response) => {
              // Response is a message ID string.
              console.log("Successfully sent message:", response);
            })
            .catch((error) => {
              console.log("Error sending message:", error);
            });
        }
      });
  });
exports.tellOwnerAboutRenterTicket = functions.firestore
  .document("/OwnerSupportTickets/{ticketId}")
  .onCreate(async (snap, context) => {
    data = snap.data();
    var assetNetwork = [];

    var notifyOwnerTopic = "notifyOwnerTopic";

    if (data.sentByRenter == false) {
      console.log("stopping here");
      return;
    }

    console.log("data from submitted renter ticket", data);

    await admin
      .firestore()
      .collection("Assets")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          assetNetwork = doc.data().assetNetwork;
        });
      });

    if (
      data.sentByRenter &&
      assetNetworkIncludesUser(assetNetwork, data.sentBy)
    ) {
      return await admin
        .firestore()
        .collection("tokens")
        .get()
        .then((snapshot) => {
          const tokens = [];
          if (snapshot.empty) {
            console.log("No tokens");
            return false;
          } else {
            for (var key of snapshot.docs) {
              tokens.push(key.data().token);
            }

            console.log(tokens);

            admin
              .messaging()
              .subscribeToTopic(tokens, notifyOwnerTopic)
              .then((response) => {
                // See the MessagingTopicManagementResponse reference documentation
                // for the contents of response.
                console.log("Successfully subscribed to topic:", response);
              })
              .catch((error) => {
                console.log("Error subscribing to topic:", error);
              });

            const message = {
              notification: {
                title: `New ticket submitted by renter at ${data.ticketData.address}`,
                body: `${data.sentBy} has submitted a ticket and is waiting approval to go to your SP Team`,
              },
              topic: notifyOwnerTopic,
            };

            console.log(message);

            return admin
              .messaging()
              .send(message)
              .then((response) => {
                // Response is a message ID string.
                console.log("Successfully sent message:", response);
              })
              .catch((error) => {
                console.log("Error sending message:", error);
              });
          }
        });
    }
  });

exports.estimateCompletionAccepted = functions.firestore
  .document("/SPSupportTickets/{userId}")
  .onUpdate(async (change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();
    console.log("this is data", data);
    const topic = "estimateCompletionAcceptedTopic";

    if (previousData.status == data.status) {
      return;
    }

    if (data.status === "accepted") {
      console.log("the status is accepted");
      return await admin
        .firestore()
        .collection("tokens")
        .get()
        .then((snapshot) => {
          const tokens = [];
          if (snapshot.empty) {
            console.log("No tokens");
            return false;
          } else {
            for (var key of snapshot.docs) {
              tokens.push(key.data().token);
            }
          }

          admin
            .messaging()
            .subscribeToTopic(tokens, topic)
            .then((response) => {
              // See the MessagingTopicManagementResponse reference documentation
            })
            .catch((error) => {
              console.log(error);
            });

          const message = {
            notification: {
              title: "Talk to us",
              body: "",
            },
            topic: topic,
          };
          console.log("this is the message", message);
          return admin
            .messaging()
            .send(message)
            .then((response) => {
              // Response is a message ID string.
              console.log("Successfully sent message:", response);
            })

            .catch((error) => {
              console.log("Error sending message:", error);
            });
        });
    }
  });
exports.estimateCompleted = functions.firestore
  .document("/SPSupportTickets/{userId}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();
    const topic = "estimateCompletedTopic";
    var teamMember = null;

    for (const c of data.teams) {
      teamMember = c.name;
    }

    if (data.status === "complete") {
      console.log("invitation should be ready to go out");
      return admin
        .firestore()
        .collection("tokens")
        .get()
        .then((snapshot) => {
          const tokens = [];
          if (snapshot.empty) {
            console.log("No tokens");
            return false;
          } else {
            for (var key of snapshot.docs) {
              tokens.push(key.data().token);
            }
          }

          admin
            .messaging()
            .subscribeToTopic(tokens, topic)
            .then((response) => {
              // See the MessagingTopicManagementResponse reference documentation
            })
            .catch((error) => {
              console.log(error);
            });

          const message = {
            notification: {
              title: "Project Completed",
              body: `Your team ${teamMember} at,${data.address} has completed the project.`,
            },
            topic: topic,
          };
          return admin
            .messaging()
            .send(message)
            .then((response) => {
              // Response is a message ID string.
              console.log("Successfully sent message:", response);
            })

            .catch((error) => {
              console.log("Error sending message:", error);
            });
        });
    }
  });
	
exports.teamFollowedInstructions = functions.https.onCall(
  async (data, context) => {
    var estimateDocId = data.estimateDocId;
    var uid = data.uid;
    console.log(
      "this is th estimate docID",
      estimateDocId,
      "this is th uid",
      uid
    );
    await admin
      .firestore()
      .collection("SPSupportTickets")
      .where("docId", "==", estimateDocId)
      .where("spId", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log("this is doc.data", doc.data());
          doc.ref.update({
            teamFollowedInstructions: true,
          });
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }
);
exports.teamDidNotFollowInstructions = functions.https.onCall(
  async (data, context) => {
    var estimateDocId = data.estimateDocId;
    var uid = data.uid;
    await admin
      .firestore()
      .collection("SPSupportTickets")
      .where("docId", "==", estimateDocId)
      .where("spId", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            teamFollowedInstructions: false,
          });
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }
);
exports.teamCleanedUp = functions.https.onCall(async (data, context) => {
  var estimateDocId = data.estimateDocId;
  var uid = data.uid;
  console.log(
    "this is th estimate docID",
    estimateDocId,
    "this is th uid",
    uid
  );
  await admin
    .firestore()
    .collection("SPSupportTickets")
    .where("docId", "==", estimateDocId)
    .where("spId", "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("this is doc.data", doc.data());
        doc.ref.update({
          teamCleanedUp: true,
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
});
exports.teamDidNotCleanUp = functions.https.onCall(async (data, context) => {
  var estimateDocId = data.estimateDocId;
  var uid = data.uid;
  await admin
    .firestore()
    .collection("SPSupportTickets")
    .where("docId", "==", estimateDocId)
    .where("spId", "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.update({
          teamDidNotCleanUp: false,
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
});

exports.ownerTeamMap = functions.https.onRequest(async (request, response) => {
  try {
    const address = request.body.address;
    const ownerId = request.body.ownerId;
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
      ownerId: ownerId,
    };
    var userPerspectives = [];
    var homeOwner = "home owner";
    await admin
      .firestore()
      .collection("user")
      .where("user_id", "==", ownerId)
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

    if (userPerspectives.includes(homeOwner)) {
      await admin
        .firestore()
        .collection("OwnerTeamLocations")
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

exports.updateOwnerTeamImage = functions.firestore
  .document("/OwnerTeams/{teamId}")
  .onCreate((snapshot, context) => {
    const value = snapshot.data();

    console.log("document reference", snapshot.ref);

    var image = value.profileImage;

    if (image.includes(".png")) {
      var image = image.split(".png");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredPNGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/OwnerTeamProfileImages/${splitImage}_250x250.png`;
      console.log("png", desiredPNGImage);
      return snapshot.ref.update({ teamProfileImage: desiredPNGImage });
    } else if (image.includes(".jpg")) {
      var image = image.split(".jpg");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredJPGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/OwnerTeamProfileImages/${splitImage}_250x250.jpg`;
      console.log("jpg", desiredJPGImage);
      return snapshot.ref.update({ teamProfileImage: desiredJPGImage });
    } else if (image.includes(".jpeg")) {
      var image = image.split(".jpeg");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredJPEGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/OwnerTeamProfileImages/${splitImage}_250x250.jpeg`;
      console.log("jpeg", desiredJPEGImage);
      return snapshot.ref.update({ teamProfileImage: desiredJPEGImage });
    }
  });

exports.updateOwnerCustomerImage = functions.firestore
  .document("/OwnerCustomers/{customerId}")
  .onCreate((snapshot, context) => {
    const value = snapshot.data();

    console.log("document reference", snapshot.ref);

    var image = value.profileImage;

    if (image.includes(".png")) {
      var image = image.split(".png");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredPNGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/OwnerCustomerProfileImages/${splitImage}_250x250.png`;
      console.log("png", desiredPNGImage);
      return snapshot.ref.update({ customerProfileImage: desiredPNGImage });
    } else if (image.includes(".jpg")) {
      var image = image.split(".jpg");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredJPGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/OwnerCustomerProfileImages/${splitImage}_250x250.jpg`;
      console.log("jpg", desiredJPGImage);
      return snapshot.ref.update({ customerProfileImage: desiredJPGImage });
    } else if (image.includes(".jpeg")) {
      var image = image.split(".jpeg");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredJPEGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/OwnerCustomerProfileImages/${splitImage}_250x250.jpeg`;
      console.log("jpeg", desiredJPEGImage);
      return snapshot.ref.update({
        customerProfileImage: desiredJPEGImage,
      });
    }
  });

exports.updateOwnerTeamTeamMemberImage = functions.firestore
  .document("/OwnerTeamTeamMembers/{teamMemberId}")
  .onCreate((snapshot, context) => {
    const value = snapshot.data();

    console.log("document reference", snapshot.ref);

    var image = value.profileImage;

    if (image.includes(".png")) {
      var image = image.split(".png");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredPNGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/OwnerTeamTeamMemberProfileImages/${splitImage}_250x250.png`;
      console.log("png", desiredPNGImage);
      return snapshot.ref.update({
        teamMemberProfileImage: desiredPNGImage,
      });
    } else if (image.includes(".jpg")) {
      var image = image.split(".jpg");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredJPGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/OwnerTeamTeamMemberProfileImages/${splitImage}_250x250.jpg`;
      console.log("jpg", desiredJPGImage);
      return snapshot.ref.update({
        teamMemberProfileImage: desiredJPGImage,
      });
    } else if (image.includes(".jpeg")) {
      var image = image.split(".jpeg");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredJPEGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/OwnerTeamTeamMemberProfileImages/${splitImage}_250x250.jpeg`;
      console.log("jpeg", desiredJPEGImage);
      return snapshot.ref.update({
        teamMemberProfileImage: desiredJPEGImage,
      });
    }
  });

	