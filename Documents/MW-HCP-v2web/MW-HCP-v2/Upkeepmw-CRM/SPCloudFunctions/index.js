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
  

export const cachespticketdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { id, spTicketData } = req.body;
      console.log(id, spTicketData);
      const ticketData = {
        ticket: spTicketData.data._value,
        preferredStartingDate: spTicketData.date,
        preferredStartingTime: spTicketData.time,
      };
      const response = await redisClient.set(id, JSON.stringify(ticketData));
      res.writeHead(200, { "Content-Type": "text/plain" });
      console.log("res", response);
      redisClient.disconnect();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const getspticketdetaildatafromcache = onRequest(
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

export const getspticketlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

    const spTicketList = "spTicketList";

    const value = await redisClient.get(spTicketList);

    const tempArr = [];

    if (value) {
      const cachedTicketList = JSON.parse(value);
      console.log("cached tickets", cachedTicketList);

      await db
        .collection("SPSupportTickets")
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
        spTicketList,
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

export const cachesppaymentdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { id, spPaymentData } = req.body;
      console.log(id, spPaymentData);
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

export const getsppaymentdetaildatafromcache = onRequest(
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

export const getsppaymentlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

    const spPaymentList = "spPaymentList";

    const value = await redisClient.get(spPaymentList);

    const tempArr = [];

    if (value) {
      const cachedPaymentList = JSON.parse(value);
      console.log("cached payments", cachedPaymentList);

      await db
        .collection("SPPayments")
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
        spPaymentList,
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

export const cachespteamdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { id, spTeamData } = req.body;
      console.log(id, spTeamData);
      const response = await redisClient.set(id, JSON.stringify(spTeamData));
      res.writeHead(200, { "Content-Type": "text/plain" });
      console.log("res", response);
      await redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const getspteamdetaildatafromcache = onRequest(
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

export const getspteamlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

    const spTeamList = "spTeamList";

    const value = await redisClient.get(spTeamList);

    const tempArr = [];

    if (value) {
      const cachedTeamList = JSON.parse(value);
      console.log("cached teams", cachedTeamList);

      await db
        .collection("SPTeams")
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
        spTeamList,
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

export const adddocidtospteamteammemberprofile = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { docId, firstName, lastName } = req.body;

    const spTeamTeamMemberRef = db
      .collection("SPTeamTeamMembers")
      .where("firstName", "==", firstName)
      .where("lastName", "==", lastName);

    await spTeamTeamMemberRef.set(
      {
        docId: docId,
      },
      { merge: true }
    );
  }
);

export const adddownloadurltospteamteammemberprofile = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID, downloadURL } = req.body;

    const spTeamTeamMemberRef = db
      .collection("SPTeamTeamMembers")
      .where("uid", "==", currentUID);

    await spTeamTeamMemberRef.set(
      {
        teamMemberProfileImage: downloadURL,
      },
      { merge: true }
    );
  }
);

export const cachespteamteammemberdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { id, spTeamTeamMemberData } = req.body;
      console.log(id, spTeamTeamMemberData);
      const response = await redisClient.set(
        id,
        JSON.stringify(spTeamTeamMemberData)
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

export const getspteamtemmemberdetaildatafromcache = onRequest(
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

export const getspteamteammemberlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

    const spTeamTeamMemberList = "spTeamTeamMemberList";

    const value = await redisClient.get(spTeamTeamMemberList);

    const tempArr = [];

    if (value) {
      const cachedTeamTeamMemberList = JSON.parse(value);
      console.log("cached team members", cachedTeamTeamMemberList);

      await db
        .collection("SPTeamTeamMembers")
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
        spTeamTeamMemberList,
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

export const adddocidtospcustomerprofile = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { docId, firstName, lastName } = req.body;

    const spCustomerRef = db
      .collection("SPCustomers")
      .where("firstName", "==", firstName)
      .where("lastName", "==", lastName);

    await spCustomerRef.set(
      {
        docId: docId,
      },
      { merge: true }
    );
  }
);

export const adddownloadurltospcustomerprofile = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID, downloadURL } = req.body;

    const spCustomerRef = db
      .collection("SPCustomers")
      .where("uid", "==", currentUID);

    await spCustomerRef.set(
      {
        profileImage: downloadURL,
      },
      { merge: true }
    );
  }
);

export const cachespcustomerdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { id, spCustomerData } = req.body;
      console.log(id, spCustomerData);
      const response = await redisClient.set(
        id,
        JSON.stringify(spCustomerData)
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

export const getspcustomerdetaildatafromcache = onRequest(
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

export const getspcustomerlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

    const spCustomerList = "spCustomerList";

    const value = await redisClient.get(spCustomerList);

    const tempArr = [];

    if (value) {
      const cachedCustomerList = JSON.parse(value);
      console.log("cached customers", cachedCustomerList);

      await db
        .collection("SPCustomers")
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
        spCustomerList,
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
