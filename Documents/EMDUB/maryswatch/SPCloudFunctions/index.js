//////////////////variables///////////////////
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
const axios = require("axios");
const googleMapsApiKey = "AIzaSyCZWa8sZcUO159z5FK2FFbZcM-5BF7GRJE";
admin.initializeApp();


exports.SPSupportTicketEstimate = functions.firestore
  .document("/SPSupportTickets/{SPSupportTicketsId}")
  .onCreate(async (snap, context) => {
    const estimateData = snap.data();
    var ticketAddress = estimateData.address;
    const uid = estimateData.spId;
    const estimateTopic = "estimateTopic";
    var teams = [];
    var tokenUid;
    var teamOwnerUid;
    var teamRenterUid;
    var ownerEntryEstimateTopic = "SPEstimateEntryForOwner";
    var renterEntryEstimateTopic = "SPEstimateEntryForRenter";
    var notifyTeamsEstimateTopic = "SPEstimateTeamEntry";
    var assets = [];
    var estimateTeamName;
    var teamId;

    for (const e of estimateData.teams) {
      estimateTeamName = e.name;
    }
    console.log("line 29", estimateTeamName);
    assets.push(
      admin
        .firestore()
        .collection("Assets")
        .where("address", "==", ticketAddress)
        .where("assetOwnerId", "==", uid)
        .get(),
      admin
        .firestore()
        .collection("Teams")
        .where("teamName", "==", estimateTeamName)
        .get()
    );

    const assetPromises = await Promise.all(assets);

    assetPromises.forEach((qs) => {
      if (qs.query._queryOptions.collectionId == "Assets") {
        qs.docs.map((doc) => {
          teams = doc.data().teams;
        });
      } else if (qs.query._queryOptions.collectionId == "Teams") {
        qs.docs.map((doc) => {
          teamId = doc.data().teamId;
        });
      }
    });
    console.log("this is the docId", estimateData.docId);
    teams.forEach(async (e) => {
      if (e.memberType === "owner") {
        teamOwnerUid = e.uid;
        try {
          return await admin.firestore().collection("OwnerSupportTickets").add({
            createdOn: estimateData.createdOn,
            address: estimateData.address,
            jobType: estimateData.jobType,
            estimatedAmount: estimateData.estimatedAmount,
            estimatedStartDate: estimateData.estimatedStartDate,
            isEmergency: estimateData.isEmergency,
            laborType: estimateData.laborType,
            numberOfHours: estimateData.numberOfHours,
            numberOfLaborers: estimateData.numberOfLaborers,
            problemDescription: estimateData.problemDescription,
            rate: estimateData.rate,
            room: estimateData.room,
            submittedBy: estimateData.submittedBy,
            time: estimateData.time,
            sentBySP: true,
            ownerUID: e.uid,
          });
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      } else if (e.memberType === "renter") {
        teamRenterUid = e.uid;
        try {
          return await admin
            .firestore()
            .collection("RenterSupportTickets")
            .add({
              createdOn: estimateData.createdOn,
              address: estimateData.address,
              jobType: estimateData.jobType,
              estimatedAmount: estimateData.estimatedAmount,
              estimatedStartDate: estimateData.estimatedStartDate,
              isEmergency: estimateData.isEmergency,
              laborType: estimateData.laborType,
              numberOfHours: estimateData.numberOfHours,
              numberOfLaborers: estimateData.numberOfLaborers,
              problemDescription: estimateData.problemDescription,
              rate: estimateData.rate,
              room: estimateData.room,
              submittedBy: estimateData.submittedBy,
              time: estimateData.time,
              sentBySP: true,
              renterUID: e.uid,
            });
        } catch (error_1) {
          console.error("Error adding document: ", error_1);
        }
      } else {
        return;
      }
    });

    console.log("ticket has been add to other collections at this point");

    await admin
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
            tokenUid = key.data().uid;
          }

          console.log(tokens);

          admin
            .messaging()
            .subscribeToTopic(tokens, estimateTopic)
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
              title: "Profile Update",
              body: `A new Support Ticket at ${ticketAddress} , has been added to your Profile `,
            },
            topic: estimateTopic,
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
    if (tokenUid === teamId) {
      admin
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

            admin
              .messaging()
              .subscribeToTopic(tokens, notifyTeamsEstimateTopic)
              .then((response) => {
                // See the MessagingTopicManagementResponse reference documentation
                // for the contents of response.
                console.log("Successfully subscribed to topic:", response);
              })
              .catch((error) => {
                console.log("Error subscribing to topic:", error);
              });

            console.log(
              "tokens have been found and message about to go out at line 121"
            );
          }
        });
      const message = {
        notification: {
          title: "Team Estimate Update",
          body: `your team estimate has been added at, ${estimateData.address}`,
        },
        topic: notifyTeamsEstimateTopic,
      };

      console.log("message should show here at line 148", message);
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
    if (tokenUid === teamOwnerUid) {
      const message = {
        notification: {
          title: "Estimate added by a SP",
          body: `${estimateData.submittedBy} has added a new SP Support Ticket to address, ${data.address}`,
        },
        topic: ownerEntryEstimateTopic,
      };

      console.log("message should show here at line 133", message);
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
    if (tokenUid === teamRenterUid) {
      const message = {
        notification: {
          title: "Estimate added by a SP",
          body: `${estimateData.submittedBy} has added a new SP Support Ticket to address, ${data.address}`,
        },
        topic: renterEntryEstimateTopic,
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
    } else {
      return;
    }
  });

exports.SPProjectComplete = functions.firestore
  .document("/SPSupportTickets/{userId}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data(); //use these value and previousData properties and  in your if statement below check that badge.name doesnt already exist in the array.

    console.log(data.completed);

    const topic = "ProjectComplete";

    if (data.completed == true) {
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

            console.log(tokens);

            admin
              .messaging()
              .subscribeToTopic(tokens, topic)
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
                title: "Project Update",
                body: `The project at, ${data.location} , has been completed `,
              },
              topic: topic,
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
exports.SPTicketUpdate = functions.firestore
  .document("/SPSupportTickets/{userId}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();

    var name = null;
    var complete = null;
    var teamMember = null;

    for (const comp of data.checklistItems) {
      name = comp.name;
      complete = comp.completed;
    }
    for (const c of data.teams) {
      teamMember = c.teamMember;
    }
    console.log(complete, name, teamMember);
    const topic = "ProjectUpdate";

    const previous = previousData.checklistItems;

    if (data !== previous) {
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
            .catch((error) => {});

          if (complete == true) {
            const completes = {
              notification: {
                title: "Project Update",
                body: `${name} has been completed at , ${data.location}. `,
              },
              topic: topic,
            };
            return admin
              .messaging()
              .send(completes)
              .then((response) => {
                // Response is a message ID string.
                console.log("Successfully sent message:", response);
              })
              .catch((error) => {
                console.log("Error sending message:", error);
              });
          }

          if (complete == false) {
            const added = {
              notification: {
                title: "Project Update",
                body: `${name} has been added to your project checklist at , ${data.location}. `,
              },
              topic: topic,
            };
            return admin
              .messaging()
              .send(added)
              .then((response) => {
                // Response is a message ID string.
                console.log("Successfully sent message:", response);
              })
              .catch((error) => {
                console.log("Error sending message:", error);
              });
          }

          if (data.teams !== previous.teams) {
            const addedteamMember = {
              notification: {
                title: "Project Update",
                body: `${teamMember} has been add to, ${data.location}. `,
              },
              topic: topic,
            };
            return admin
              .messaging()
              .send(addedteamMember)
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
exports.SPTeamMemberAdded = functions.firestore
  .document("/SPSupportTickets/{userId}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();
    const addedTopic = "teamMemberAdded";
    const removedTopic = "teamMemberRemoved";
    var teamMember = null;

    if (data.teams.length === previousData.teams.length) {
      return;
    }

    for (const c of data.teams) {
      teamMember = c.name;
    }

    const foundMember = data.teams.find((elem) => elem.name === teamMember);

    if (data.teams.length > 0) {
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
            .subscribeToTopic(tokens, addedTopic)
            .then((response) => {
              // See the MessagingTopicManagementResponse reference documentation
            })
            .catch((error) => {});

          const addedteamMember = {
            notification: {
              title: "Project Team $Update",
              body: `${teamMember} has been added to your project at location: ${data.address}`,
            },
            topic: addedTopic,
          };

          console.log(addedteamMember);

          return admin
            .messaging()
            .send(addedteamMember)
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
exports.SPTeamProgressPhotoRemoved = functions.firestore
  .document("/SPSupportTickets/{userId}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();

    var photoName = null;
    var url = null;

    for (const c of data.progressPhotos) {
      (photoName = c.photoName), (url = c.url);
    }
    const removedPhoto = previousData.progressPhotos.includes(url);

    console.log(photoName, url);

    const topic = "progressPhoto";

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
          .catch((error) => {});

        if (removedPhoto == false) {
          const removedPhoto = {
            notification: {
              title: "Project Team Update",
              body: `${photoName} has been removed at location: ${data.location}`,
            },
            topic: topic,
          };

          console.log(removedPhoto);

          return admin
            .messaging()
            .send(removedPhoto)
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
exports.SPProgressPhotoAdded = functions.firestore
  .document("/SPSupportTickets/{userId}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();

    var photoName = null;
    var url = null;

    for (const c of data.progressPhotos) {
      (photoName = c.photoName), (url = c.url);
    }

    console.log(photoName, url);

    const addedPhoto = previousData.progressPhotos.find(
      (elem) => elem.url === url
    );

    const topic = "progressPhotoUpdate";

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
          .catch((error) => {});

        if (!addedPhoto) {
          const addedPhoto = {
            notification: {
              title: "Project Team Update",
              body: `${photoName} has been added to your project at location: ${data.location}`,
            },
            topic: topic,
          };

          console.log(addedPhoto);

          return admin
            .messaging()
            .send(addedPhoto)
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
exports.SPTeamAdded = functions.firestore
  .document("/Teams/{teamId}")
  .onCreate(async (snap, context) => {
    const teamData = snap.data();
    var teamsAddedToLocationTopic = "teamsAddedToLocation";
    var tokenUid;
    var teamId = teamData.teamId;

    console.log("team id from entered document", teamId);

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
            tokenUid = key.data().uid;
          }

          console.log(
            "tokens have been found and message about to go out at line 2070"
          );
          if (tokenUid === teamId) {
            admin
              .messaging()
              .subscribeToTopic(tokens, teamsAddedToLocationTopic)
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
                title: "Team Update",
                body: `A new team has been added at, ${teamData.address}`,
              },
              topic: teamsAddedToLocationTopic,
            };

            console.log("message should show here at line 2080", message);
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
          } else {
            return;
          }
        }
      });
  });
//////// new functions//////////
exports.SPestimateAdded = functions.firestore
  .document("/ownerSupportTicket/{teamId}")
  .onCreate(async (snap, context) => {
    const teamData = snap.data();
    var teamsAddedToLocationTopic = "teamsAddedToLocation";
    var tokenUid;
    var teamId = teamData.teamId;

    console.log("team id from entered document", teamId);

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
            tokenUid = key.data().uid;
          }

          console.log(
            "tokens have been found and message about to go out at line 2070"
          );
          if (tokenUid === teamId) {
            admin
              .messaging()
              .subscribeToTopic(tokens, teamsAddedToLocationTopic)
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
                title: "Team Update",
                body: `A new team has been added at, ${teamData.address}`,
              },
              topic: teamsAddedToLocationTopic,
            };

            console.log("message should show here at line 2080", message);
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
          } else {
            return;
          }
        }
      });
  });	

exports.spTeamMap = functions.https.onRequest(async (request, response) => {
  try {
    const address = request.body.address;
    const spId = request.body.spId;
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
      spId: spId,
    };
    var userPerspectives = [];
    var sp = "service provider";
    await admin
      .firestore()
      .collection("user")
      .where("user_id", "==", spId)
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

    if (userPerspectives.includes(sp)) {
      await admin
        .firestore()
        .collection("SPTeamLocations")
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

exports.updateSPCustomerImage = functions.firestore
  .document("/SPCustomers/{customerId}")
  .onCreate((snapshot, context) => {
    const value = snapshot.data();

    console.log("document reference", snapshot.ref);

    var image = value.profileImage;

    if (image.includes(".png")) {
      var image = image.split(".png");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredPNGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/SPCustomerProfileImages/${splitImage}_250x250.png`;
      console.log("png", desiredPNGImage);
      return snapshot.ref.update({ customerProfileImage: desiredPNGImage });
    } else if (image.includes(".jpg")) {
      var image = image.split(".jpg");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredJPGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/SPCustomerProfileImages/${splitImage}_250x250.jpg`;
      console.log("jpg", desiredJPGImage);
      return snapshot.ref.update({ customerProfileImage: desiredJPGImage });
    } else if (image.includes(".jpeg")) {
      var image = image.split(".jpeg");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredJPEGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/SPCustomerProfileImages/${splitImage}_250x250.jpeg`;
      console.log("jpeg", desiredJPEGImage);
      return snapshot.ref.update({
        customerProfileImage: desiredJPEGImage,
      });
    }
  });

 exports.updateSPTeamImage = functions.firestore
   .document("/SPTeams/{teamId}")
   .onCreate((snapshot, context) => {
     const value = snapshot.data();

     console.log("document reference", snapshot.ref);

     var image = value.profileImage;

     if (image.includes(".png")) {
       var image = image.split(".png");
       var splitImage = image[0];

       console.log("split image", splitImage);

       var desiredPNGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/SPTeamProfileImages/${splitImage}_250x250.png`;
       console.log("png", desiredPNGImage);
       return snapshot.ref.update({ teamProfileImage: desiredPNGImage });
     } else if (image.includes(".jpg")) {
       var image = image.split(".jpg");
       var splitImage = image[0];

       console.log("split image", splitImage);

       var desiredJPGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/SPTeamProfileImages/${splitImage}_250x250.jpg`;
       console.log("jpg", desiredJPGImage);
       return snapshot.ref.update({ teamProfileImage: desiredJPGImage });
     } else if (image.includes(".jpeg")) {
       var image = image.split(".jpeg");
       var splitImage = image[0];

       console.log("split image", splitImage);

       var desiredJPEGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/SPTeamProfileImages/${splitImage}_250x250.jpeg`;
       console.log("jpeg", desiredJPEGImage);
       return snapshot.ref.update({ teamProfileImage: desiredJPEGImage });
     }
   });
	 
exports.updateSPTeamTeamMemberImage = functions.firestore
  .document("/SPTeamTeamMembers/{teamMemberId}")
  .onCreate((snapshot, context) => {
    const value = snapshot.data();

    console.log("document reference", snapshot.ref);

    var image = value.profileImage;

    if (image.includes(".png")) {
      var image = image.split(".png");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredPNGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/SPTeamTeamMemberProfileImages/${splitImage}_250x250.png`;
      console.log("png", desiredPNGImage);
      return snapshot.ref.update({
        teamMemberProfileImage: desiredPNGImage,
      });
    } else if (image.includes(".jpg")) {
      var image = image.split(".jpg");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredJPGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/SPTeamTeamMemberProfileImages/${splitImage}_250x250.jpg`;
      console.log("jpg", desiredJPGImage);
      return snapshot.ref.update({
        teamMemberProfileImage: desiredJPGImage,
      });
    } else if (image.includes(".jpeg")) {
      var image = image.split(".jpeg");
      var splitImage = image[0];

      console.log("split image", splitImage);

      var desiredJPEGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/SPTeamTeamMemberProfileImages/${splitImage}_250x250.jpeg`;
      console.log("jpeg", desiredJPEGImage);
      return snapshot.ref.update({
        teamMemberProfileImage: desiredJPEGImage,
      });
    }
  });


