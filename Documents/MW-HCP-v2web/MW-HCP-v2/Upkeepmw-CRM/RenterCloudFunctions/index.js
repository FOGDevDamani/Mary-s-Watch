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





export const cacherenterticketdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { userUid, renterTicketUuid, renterTicketData } = req.body;
      console.log(
        "personal uid",
        uid,
        "uuid made for the ticket",
        renterTicketUuid,
        "ticket data",
        renterTicketData
      );
      const renterTicketId = `mw:${userUid}:${renterTicketUuid}`;
      const renterTicketIdListKey = "renter:ticket:ids";
      const renterTicketIdListResponse = await redisClient
        .lPush(renterTicketIdListKey, renterTicketId)
        .then(async () => {
          const renterTicketHashResponse = await redisClient.hSet(
            renterTicketId,
            [
              "priority",
              JSON.stringify(renterTicketData.priority),
              "previouslyReported",
              JSON.stringify(renterTicketData.previouslyReported),
              "address",
              JSON.stringify(renterTicketData.address),
              "room",
              JSON.stringify(renterTicketData.room),
              "problemDescription",
              JSON.stringify(renterTicketData.problemDescription),
              "startingDate",
              JSON.stringify(renterTicketData.startingDate),
              "startingTime",
              JSON.stringify(renterTicketData.startTime),
              "petsAllowed",
              JSON.stringify(renterTicketData.petsAllowed),
              "entryAllowedIfAbsent",
              JSON.stringify(renterTicketData.entryAllowedIfAbsent),
              "contactNumber",
              JSON.stringify(renterTicketData.contactNumber),
              "ticketImage",
              JSON.stringify(renterTicketData.ticketImage),
              "createdOn",
              JSON.stringify(renterTicketData.createdOn),
              "uid",
              JSON.stringify(renterTicketData.uid),
              "renterTicketId",
              JSON.stringify(renterTicketId),
            ]
          );
          console.log("might be returned here", renterTicketHashResponse);
        });
      console.log("list res", renterTicketIdListResponse);
      res.writeHead(200, { "Content-Type": "text/plain" });

      await redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const getrenterticketdetaildatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

		var renterTicketObj

    const renterTicketIdListKey = "renter:ticket:ids";
    const renterTicketListRange = await redisClient.lRange(
      renterTicketIdListKey,
      0,
      -1
    );
    console.log(renterTicketListRange);
   for (const id of renterTicketListRange) {
     const splitCurrentUserIdOnQuotations = currentUserUID.split('"');
     console.log(splitCurrentUserIdOnQuotations[1]);
     // const splitCurrentUserIdOnColons = splitCurrentUserIdOnQuotations.split(':')
     // const currentUserUid = splitCurrentUserIdOnColons[1]
     // const currentUserUuid = splitCurrentUserIdOnColons[2]

     const splitRenterTicketId = id.split(":");
     const userUID = splitRenterTicketId[1];
     const uuid = splitRenterTicketId[2];

     // console.log(currentUserUid, currentUserUuid, userUID, uuid)

     if (id == splitCurrentUserIdOnQuotations[1]) {
       console.log("specific id", id);
       renterTicketObj = await redisClient.hGetAll(id);
       console.log(renterTicketObj);
			 await redisClient.quit();
     }
   }
   res.send(renterTicketObj);
  }
);

export const getrenterticketlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUserUID } = req.body;

    const tempArray = [];

    const renterTicketIdListKey = "renter:ticket:ids";
    const renterTicketListRange = await redisClient.lRange(
      renterTicketIdListKey,
      0,
      -1
    );
    console.log(renterTicketListRange);
    for (const id of renterTicketListRange) {
      console.log(id);
      const renterTicketObj = await redisClient.hGetAll(id);
      console.log(renterTicketObj);
      tempArray.push(renterTicketObj);
    }
    res.send(tempArray);
  }
);

export const cacherenterpaymentdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { uid, renterPaymentUuid, renterPaymentData } = req.body;
      console.log(
        "personal uid",
        uid,
        "uuid made for the payment",
        renterPaymentUuid,
        "payment data",
        renterPaymentData
      );
      const renterPaymentId = `mw:${uid}:${renterPaymentUuid}`;
      const renterPaymentIdListKey = "renter:payment:ids";
      const renterPaymentIdListResponse = await redisClient
        .lPush(renterPaymentIdListKey, renterPaymentId)
        .then(async () => {
          const renterPaymentHashResponse = await redisClient.hSet(
            renterTeamId,
            [
              "profileImage",
              JSON.stringify(renterPaymentData.profileImage),
              "projects",
              JSON.stringify(renterPaymentData.projects),
              "teamName",
              JSON.stringify(renterPaymentData.teamName),
              "teamLead",
              JSON.stringify(renterPaymentData.teamLead),
              "address",
              JSON.stringify(renterPaymentData.address),
              "city",
              JSON.stringify(renterPaymentData.city),
              "state",
              JSON.stringify(renterPaymentData.state),
              "zipcode",
              JSON.stringify(renterPaymentData.zipcode),
            ]
          );
          console.log("might be returned here", renterPaymentHashResponse);
        });
      console.log("list res", renterPaymentIdListResponse);
      res.writeHead(200, { "Content-Type": "text/plain" });

      await redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const getrenterpaymentdetaildatafromcache = onRequest(
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

export const getrenterpaymentlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

    const renterPaymentList = "renterPaymentList";

    const value = await redisClient.get(renterPaymentList);

    const tempArr = [];

    if (value) {
      const cachedPaymentList = JSON.parse(value);
      console.log("cached payments", cachedPaymentList);

      await db
        .collection("RenterPayments")
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
        renterPaymentList,
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

export const cacherenterteamdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { userUid, renterTeamUuid, renterTeamData } = req.body;
      console.log(
        "personal uid",
        userUid,
        "uuid made for the team",
        renterTeamUuid,
        "team data",
        renterTeamData
      );

			var teams = [
        {
          team_name: "Ntag",
          first_name: "Harvey",
          last_name: "Alker",
          email: "halker0@photobucket.com",
          phone: "515-299-4604",
          address: "3 Magdeline Junction",
          city: "Des Moines",
          state: "IA",
          zip: "50347",
          projects: "Supervisor",
        },
        {
          team_name: "Thoughtstorm",
          first_name: "Connie",
          last_name: "Meadus",
          email: "cmeadus1@mlb.com",
          phone: "469-346-9385",
          address: "373 Vernon Terrace",
          city: "Irving",
          state: "TX",
          zip: "75062",
          projects: "Architect",
        },
        {
          team_name: "Blogspan",
          first_name: "Valli",
          last_name: "Stallybrass",
          email: "vstallybrass2@miitbeian.gov.cn",
          phone: "803-554-2723",
          address: "07914 Anzinger Alley",
          city: "Columbia",
          state: "SC",
          zip: "29208",
          projects: "Electrician",
        },
        {
          team_name: "Cogibox",
          first_name: "Aldo",
          last_name: "Whatson",
          email: "awhatson3@ibm.com",
          phone: "505-706-1569",
          address: "51791 Monica Drive",
          city: "Santa Fe",
          state: "NM",
          zip: "87505",
          projects: "Estimator",
        },
        {
          team_name: "Yozio",
          first_name: "Lacy",
          last_name: "Kearford",
          email: "lkearford4@squidoo.com",
          phone: "323-462-9042",
          address: "9 Anniversary Park",
          city: "Long Beach",
          state: "CA",
          zip: "90810",
          projects: "Construction Worker",
        },
      ];

			const test =  [
				{
					score: 99,
					value: 'Ninety Nine'
				},
				{
					score: 100,
					value: 'One Hundred'
				},
				{
					score: 101,
					value: 'One Hundred and One'
				},
				{
					score: 102,
					value: 'One Hundred and Two'
				}
			]

			const teamId = v4()
      const renterTeamId = `mw:${userUid}`;
			await redisClient.zAdd(renterTeamId, test)
      res.writeHead(200, { "Content-Type": "text/plain" });

    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const getrenterteamlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { userUid } = req.body;

		try {
			const renterTeamId = `mw:${userUid}`;
			for await (const memberWithScore of redisClient.zScanIterator(renterTeamId)) {
				console.log(memberWithScore);
			}

		} catch (err) { 
			console.log('error message:', err)
		}
  }
);

export const getrenterteamdetaildatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUserUID } = req.body;
    console.log(currentUserUID);

    const tempArray = [];
		var renterTicketObj

    const renterTeamIdListKey = "renter:team:ids";
    const renterTeamListRange = await redisClient.lRange(
      renterTeamIdListKey,
      0,
      -1
    );
    for (const id of renterTeamListRange) {
      const splitCurrentUserIdOnQuotations = currentUserUID.split('"');
      console.log(splitCurrentUserIdOnQuotations[1]);
			// const splitCurrentUserIdOnColons = splitCurrentUserIdOnQuotations.split(':')
      // const currentUserUid = splitCurrentUserIdOnColons[1]
      // const currentUserUuid = splitCurrentUserIdOnColons[2]

      const splitRenterTeamId = id.split(':')
      const userUID = splitRenterTeamId[1]
      const uuid = splitRenterTeamId[2]

      // console.log(currentUserUid, currentUserUuid, userUID, uuid)

      if(id == splitCurrentUserIdOnQuotations[1]) {
        console.log('specific id', id)
        renterTicketObj = await redisClient.hGetAll(id)
        console.log(renterTicketObj)
      }
    }
    res.send(renterTicketObj);
  }
);

export const cacherenterteamteammemberdata = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    try {
      const { userUid, renterTeamTeamMemberGuid, renterTeamTeamMemberData } =
        req.body;
      console.log(
        "personal uid",
        userUid,
        "uuid made for the team member",
        renterTeamTeamMemberGuid,
        "team member data",
        renterTeamTeamMemberData
      );

			const renterTeamTeamMemberId = `mw:${userUid}:renter:team:${renterTeamTeamMemberGuid}`;

      const renterTeamTeamMemberIdListKey = "renter:team:team:member:ids";
      const renterTeamTeamMemberIdListResponse = await redisClient
        .lPush(renterTeamTeamMemberIdListKey, renterTeamTeamMemberId)
        .then(async () => {
          const renterTeamTeamMemberHashResponse = await redisClient.hSet(
            renterTeamTeamMemberId,
            [
              "profileImage",
              JSON.stringify(renterTeamTeamMemberData.profileImage),
              "role",
              JSON.stringify(renterTeamTeamMemberData.role),
              "firstName",
              JSON.stringify(renterTeamTeamMemberData.firstName),
              "lastName",
              JSON.stringify(renterTeamTeamMemberData.lastName),
              "email",
              JSON.stringify(renterTeamTeamMemberData.email),
              "phone",
              JSON.stringify(renterTeamTeamMemberData.phone),
              "address",
              JSON.stringify(renterTeamTeamMemberData.address),
              "city",
              JSON.stringify(renterTeamTeamMemberData.city),
              "state",
              JSON.stringify(renterTeamTeamMemberData.state),
              "zipcode",
              JSON.stringify(renterTeamTeamMemberData.zipcode),
							"teamName",
							JSON.stringify(renterTeamTeamMemberData.teamName),
              "renterTeamTeamMemberIdListKey",
              JSON.stringify(renterTeamTeamMemberIdListKey),
              "renterTeamTeamMemberId",
              JSON.stringify(renterTeamTeamMemberId),
            ]
          );
          console.log(
            "might be returned here",
            renterTeamTeamMemberHashResponse
          );
        });
      console.log("list res", renterTeamTeamMemberIdListResponse);
      res.writeHead(200, { "Content-Type": "text/plain" });

      redisClient.quit();
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  }
);

export const getrenterteamtemmemberdetaildatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUserUID } = req.body;

    console.log(userUid);

		var renterTeamTeamMemberObj

    const renterTeamTeamMemberIdListKey = "renter:team:team:member:ids";
    const renterTeamTeamMemberListRange = await redisClient.lRange(
      renterTeamTeamMemberIdListKey,
      0,
      -1
    );
    console.log(renterTeamTeamMemberListRange);
    // const renterTeamTeamMember = renterTeamTeamMemberListRange.filter(
    //   (teamMember) => {
    //     const splitTeamMemberId = teamMember.renterTeamTeamMemberId.split(":");
    //     const uuid = splitTeamMemberId[2];
    //     return uuid == userUid;
    //   }
    // );

		for (const id of renterTeamTeamMemberListRange) {
      const splitCurrentUserIdOnQuotations = currentUserUID.split('"');
      console.log(splitCurrentUserIdOnQuotations[1]);
      // const splitCurrentUserIdOnColons = splitCurrentUserIdOnQuotations.split(':')
      // const currentUserUid = splitCurrentUserIdOnColons[1]
      // const currentUserUuid = splitCurrentUserIdOnColons[2]

      const splitRenterTeamTeamMemberId = id.split(":");
      const userUID = splitRenterTeamTeamMemberId[1];
      const uuid = splitRenterTeamId[2];

      // console.log(currentUserUid, currentUserUuid, userUID, uuid)

      if (id == splitCurrentUserIdOnQuotations[1]) {
        console.log("specific id", id);
        renterTeamTeamMemberObj = await redisClient.hGetAll(id);
        console.log(renterTeamTeamMemberObj);
      }
    }
    res.send(renterTeamTeamMemberObj);
    
  }
);

export const getrenterteamteammemberlistdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { currentUID } = req.body;

    console.log(currentUID);

    const tempArray = [];

    const renterTeamTeamMemberIdListKey = "renter:team:team:member:ids";
    const renterTeamTeamMemberListRange = await redisClient.lRange(
      renterTeamTeamMemberIdListKey,
      0,
      -1
    );
    console.log(renterTeamTeamMemberListRange);
    for (const id of renterTeamTeamMemberListRange) {
      console.log(id);
      const renterTeamTeamMemberObj = await redisClient.hGetAll(id);
      console.log(renterTeamTeamMemberObj);
      tempArray.push(renterTeamTeamMemberObj);
    }
    res.send(tempArray);
  }
);

