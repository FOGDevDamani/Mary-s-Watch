import { initializeApp } from "firebase-admin/app";
import { onRequest } from "firebase-functions/v2/https";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import { promisify } from "util";
import { createClient } from "redis";
initializeApp();
const db = getFirestore();
import { v4 } from "uuid";
const REDISHOST = "10.163.132.195";
const REDISPORT = 6379;

const redisClient = createClient({
	socket: {
		host: REDISHOST,
		port: REDISPORT,
	},
	legacyMode: false,
});
await redisClient.connect().catch((err) => console.log(err));
redisClient.on("error", (err) => console.error("ERR:REDIS:", err));
redisClient.set = promisify(redisClient.set);
  


export const cacheownerticketdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { id, ownerTicketData } = req.body;
      console.log(id, ownerTicketData);
      const ticketData = {
        ticket: ownerTicketData.data._value,
        preferredStartingDate: ownerTicketData.date,
        preferredStartingTime: ownerTicketData.time,
      };
      const response = await redisClient.set(id, JSON.stringify(ticketData));
      res.writeHead(200, { "Content-Type": "text/plain" });
      console.log("res", response);
      await redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const getownerticketdetaildatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { id } = req.body;
    console.log("id", id);
    const value = await redisClient.get(id);
    if (value) {
      console.log("value", value);
      return res.send(JSON.parse(value));
			
    }
		await redisClient.quit();
  }
);

export const getownerticketlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

    const ownerTicketList = "ownerTicketList";

    const value = await redisClient.get(ownerTicketList);

    const tempArr = [];

    if (value) {
      const cachedTicketList = JSON.parse(value);
      console.log("cached tickets", cachedTicketList);

      await db
        .collection("OwnerSupportTickets")
        .where("uid", "==", currentUID)
        .get()
        .then(async (querySnapshot) => {
          if (cachedTicketList.length !== querySnapshot.size) {
            console.log(
              "array in cache is not in sync and needs to be rehydrated. should see count here",
              querySnapshot.size
            );
            querySnapshot.forEach((doc) => {
              console.log("doc", `${doc.id} '->' ${doc.data()}`);
              var ticket = {
                id: doc.id,
                data: doc.data(),
              };
              tempArr.push(ticket);
            });
            return res.status(200).send(tempArr);
          } else {
            console.log(
              "cache data is in sync with firestore and sending cached data now"
            );
            return res.status(200).send(cachedTicketList);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }

    try {
      const response = await redisClient.set(
        ownerTicketList,
        JSON.stringify(tempArr)
      );
      res.set(200, { "Content-Type": "text/plain" });
      res.send(JSON.parse(response));
      redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const cacheownerpaymentdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { id, ownerPaymentData } = req.body;
      console.log(id, ownerPaymentData);
      const paymentData = {
        //payment data to be deconstructed
      };
      const response = await redisClient.set(id, JSON.stringify(paymentData));
      res.writeHead(200, { "Content-Type": "text/plain" });
      console.log("res", response);
      await redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const getownerpaymentdetaildatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { id } = req.body;
    console.log("id", id);
    const value = await redisClient.get(id);
    if (value) {
      console.log("value", value);
      return res.send(JSON.parse(value));
    }
		await redisClient.quit();
  }
);

export const getownerpaymentlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

    const ownerPaymentList = "ownerPaymentList";

    const value = await redisClient.get(ownerPaymentList);

    const tempArr = [];

    if (value) {
      const cachedPaymentList = JSON.parse(value);
      console.log("cached tickets", cachedPaymentList);

      await db
        .collection("OwnerPayments")
        .where("uid", "==", currentUID)
        .get()
        .then(async (querySnapshot) => {
          if (cachedPaymentList.length !== querySnapshot.size) {
            console.log(
              "array in cache is not in sync and needs to be rehydrated. should see count here",
              querySnapshot.size
            );
            querySnapshot.forEach((doc) => {
              console.log("doc", `${doc.id} '->' ${doc.data()}`);
              var payment = {
                id: doc.id,
                data: doc.data(),
              };
              tempArr.push(payment);
            });
            return res.status(200).send(tempArr);
          } else {
            console.log(
              "cache data is in sync with firestore and sending cached data now"
            );
            return res.status(200).send(cachedPaymentList);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }

    try {
      const response = await redisClient.set(
        ownerPaymentList,
        JSON.stringify(tempArr)
      );
      res.set(200, { "Content-Type": "text/plain" });
      res.send(JSON.parse(response));
      await redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const cacheownerteamdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { userUid, ownerTeamUuid, ownerTeamData } = req.body;
      console.log(
        "personal uid",
        userUid,
        "uuid made for the team",
        ownerTeamUuid,
        "team data",
        ownerTeamData
      );
      const ownerTeamId = `mw:${userUid}:${ownerTeamUuid}`;
      const ownerTeamIdListKey = "renter:team:ids";
      const ownerTeamIdListResponse = await redisClient
        .lPush(ownerTeamIdListKey, ownerTeamId)
        .then(async () => {
          const ownerTeamHashResponse = await redisClient.hSet(ownerTeamId, [
            "profileImage",
            JSON.stringify(ownerTeamData.profileImage),
            "projects",
            JSON.stringify(ownerTeamData.projects),
            "teamName",
            JSON.stringify(ownerTeamData.teamName),
            "teamLead",
            JSON.stringify(ownerTeamData.teamLead),
            "address",
            JSON.stringify(ownerTeamData.address),
            "city",
            JSON.stringify(ownerTeamData.city),
            "state",
            JSON.stringify(ownerTeamData.state),
            "zipcode",
            JSON.stringify(ownerTeamData.zipcode),
            "ownerTeamId",
            JSON.stringify(ownerTeamId),
          ]);
          console.log("might be returned here", ownerTeamHashResponse);
        });
      console.log("list res", ownerTeamIdListResponse);
      res.writeHead(200, { "Content-Type": "text/plain" });

      await redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const getownerteamdetaildatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { id } = req.body;
    console.log("id", id);
    const value = await redisClient.get(id);
    if (value) {
      console.log("value", value);
      return res.send(JSON.parse(value));
    }
		await redisClient.quit();
  }
);

export const getownerteamlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

    const ownerTeamList = "ownerTeamList";

    const value = await redisClient.get(ownerTeamList);

    const tempArr = [];

    if (value) {
      const cachedTeamList = JSON.parse(value);
      console.log("cached teams", cachedTeamList);

      await db
        .collection("OwnerTeams")
        .where("uid", "==", currentUID)
        .get()
        .then(async (querySnapshot) => {
          if (cachedTeamList.length !== querySnapshot.size) {
            console.log(
              "array in cache is not in sync and needs to be rehydrated. should see count here",
              querySnapshot.size
            );
            querySnapshot.forEach((doc) => {
              console.log("doc", `${doc.id} '->' ${doc.data()}`);
              var team = {
                id: doc.id,
                data: doc.data(),
              };
              tempArr.push(team);
            });
            return res.status(200).send(tempArr);
          } else {
            console.log(
              "cache data is in sync with firestore and sending cached data now"
            );
            return res.status(200).send(cachedTeamList);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }

    try {
      const response = await redisClient.set(
        ownerTeamList,
        JSON.stringify(tempArr)
      );
      res.set(200, { "Content-Type": "text/plain" });
      res.send(JSON.parse(response));
      redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const adddocidtoownerteamteammemberprofile = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { docId, firstName, lastName } = req.body;

    const ownerTeamTeamMemberRef = db
      .collection("OwnerTeamTeamMembers")
      .where("firstName", "==", firstName)
      .where("lastName", "==", lastName);

    await ownerTeamTeamMemberRef.set(
      {
        docId: docId,
      },
      { merge: true }
    );
  }
);

export const adddownloadurltoownerteamteammemberprofile = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID, downloadURL } = req.body;

    const ownerTeamTeamMemberRef = db
      .collection("OwnerTeamTeamMembers")
      .where("uid", "==", currentUID);

    await ownerTeamTeamMemberRef.set(
      {
        teamMemberProfileImage: downloadURL,
      },
      { merge: true }
    );
  }
);

export const cacheownerteamteammemberdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { id, ownerTeamTeamMemberData } = req.body;
      console.log(id, ownerTeamTeamMemberData);
      const response = await redisClient.set(
        id,
        JSON.stringify(ownerTeamTeamMemberData)
      );
      res.writeHead(200, { "Content-Type": "text/plain" });
      console.log("res", response);
      await redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const getownerteamtemmemberdetaildatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { id } = req.body;
    console.log("id", id);
    const value = await redisClient.get(id);
    if (value) {
      console.log("value", value);
      return res.send(JSON.parse(value));
    }
		await redisClient.quit();
  }
);

export const getownerteamteammemberlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

    const ownerTeamTeamMemberList = "ownerTeamTeamMemberList";

    const value = await redisClient.get(ownerTeamTeamMemberList);

    const tempArr = [];

    if (value) {
      const cachedTeamTeamMemberList = JSON.parse(value);
      console.log("cached team members", cachedTeamTeamMemberList);

      await db
        .collection("OwnerTeamTeamMembers")
        .where("uid", "==", currentUID)
        .get()
        .then(async (querySnapshot) => {
          if (cachedTeamTeamMemberList.length !== querySnapshot.size) {
            console.log(
              "array in cache is not in sync and needs to be rehydrated. should see count here",
              querySnapshot.size
            );
            querySnapshot.forEach((doc) => {
              console.log("doc", `${doc.id} '->' ${doc.data()}`);
              var teamMember = {
                id: doc.id,
                data: doc.data(),
              };
              tempArr.push(teamMember);
            });
            return res.status(200).send(tempArr);
          } else {
            console.log(
              "cache data is in sync with firestore and sending cached data now"
            );
            return res.status(200).send(cachedTeamTeamMemberList);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }

    try {
      const response = await redisClient.set(
        ownerTeamTeamMemberList,
        JSON.stringify(tempArr)
      );
      res.set(200, { "Content-Type": "text/plain" });
      res.send(JSON.parse(response));
      redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const adddocidtoownerassetprofile = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { docId, assetOwner } = req.body;

    const ownerAssetRef = db
      .collection("Assets")
      .where("assetOwner", "==", assetOwner);

    await ownerAssetRef.set(
      {
        docId: docId,
      },
      { merge: true }
    );
  }
);

export const adddownloadurltoownerassetprofile = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID, downloadURL } = req.body;

    const ownerAssetRef = db
      .collection("Assets")
      .where("assetOwnerID", "==", currentUID);

    await ownerAssetRef.set(
      {
        assetImage: downloadURL,
      },
      { merge: true }
    );
  }
);

export const cacheownerassetdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { id, ownerAssetData } = req.body;
      console.log(id, ownerAssetData);
      const response = await redisClient.set(
        id,
        JSON.stringify(ownerAssetData)
      );
      res.writeHead(200, { "Content-Type": "text/plain" });
      console.log("res", response);
      await redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const getownerassetdetaildatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { id } = req.body;
    console.log("id", id);
    const value = await redisClient.get(id);
    if (value) {
      console.log("value", value);
      return res.send(JSON.parse(value));
    }
  }
);

export const getownerassetlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

    const ownerAssetList = "ownerAssetList";

    const value = await redisClient.get(ownerAssetList);

    const tempArr = [];

    if (value) {
      const cachedAssetList = JSON.parse(value);
      console.log("cached assets", cachedAssetList);

      await db
        .collection("Assets")
        .where("assetOwnerID", "==", currentUID)
        .get()
        .then(async (querySnapshot) => {
          if (cachedAssetList.length !== querySnapshot.size) {
            console.log(
              "array in cache is not in sync and needs to be rehydrated. should see count here",
              querySnapshot.size
            );
            querySnapshot.forEach((doc) => {
              console.log("doc", `${doc.id} '->' ${doc.data()}`);
              var asset = {
                id: doc.id,
                data: doc.data(),
              };
              tempArr.push(asset);
            });
            return res.status(200).send(tempArr);
          } else {
            console.log(
              "cache data is in sync with firestore and sending cached data now"
            );
            return res.status(200).send(cachedAssetList);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }

    try {
      const response = await redisClient.set(
        ownerAssetList,
        JSON.stringify(tempArr)
      );
      res.set(200, { "Content-Type": "text/plain" });
      res.send(JSON.parse(response));
      redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const adddocidtoownercustomerprofile = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { docId, firstName, lastName } = req.body;

    const ownerCustomerRef = db
      .collection("OwnerCustomers")
      .where("firstName", "==", firstName)
      .where("lastName", "==", lastName);

    await ownerCustomerRef.set(
      {
        docId: docId,
      },
      { merge: true }
    );
  }
);

export const adddownloadurltoownercustomerprofile = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID, downloadURL } = req.body;

    const ownerCustomerRef = db
      .collection("OwnerCustomers")
      .where("uid", "==", currentUID);

    await ownerCustomerRef.set(
      {
        profileImage: downloadURL,
      },
      { merge: true }
    );
  }
);

export const cacheownercustomerdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { id, ownerCustomerData } = req.body;
      console.log(id, ownerCustomerData);
      const response = await redisClient.set(
        id,
        JSON.stringify(ownerCustomerData)
      );
      res.writeHead(200, { "Content-Type": "text/plain" });
      console.log("res", response);
      await redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const getownercustomerdetaildatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { id } = req.body;
    console.log("id", id);
    const value = await redisClient.get(id);
    if (value) {
      console.log("value", value);
      return res.send(JSON.parse(value));
    }
		await redisClient.quit();
  }
);

export const getownercustomerlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

    const ownerCustomerList = "ownerCustomerList";

    const value = await redisClient.get(ownerCustomerList);

    const tempArr = [];

    if (value) {
      const cachedCustomerList = JSON.parse(value);
      console.log("cached customers", cachedCustomerList);

      await db
        .collection("OwnerCustomers")
        .where("uid", "==", currentUID)
        .get()
        .then(async (querySnapshot) => {
          if (cachedCustomerList.length !== querySnapshot.size) {
            console.log(
              "array in cache is not in sync and needs to be rehydrated. should see count here",
              querySnapshot.size
            );
            querySnapshot.forEach((doc) => {
              console.log("doc", `${doc.id} '->' ${doc.data()}`);
              var customer = {
                id: doc.id,
                data: doc.data(),
              };
              tempArr.push(customer);
            });
            return res.status(200).send(tempArr);
          } else {
            console.log(
              "cache data is in sync with firestore and sending cached data now"
            );
            return res.status(200).send(cachedCustomerList);
          }
        })
        .catch((error) => {
          console.log("Error getting documents: ", error);
        });
    }

    try {
      const response = await redisClient.set(
        ownerCustomerList,
        JSON.stringify(tempArr)
      );
      res.set(200, { "Content-Type": "text/plain" });
      res.send(JSON.parse(response));
      await redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

