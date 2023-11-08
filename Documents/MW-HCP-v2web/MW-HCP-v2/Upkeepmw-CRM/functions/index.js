//////////////////variables///////////////////
import { https } from "firebase-functions/v1";
import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from 'firebase-admin/app';
import { createTransport } from "nodemailer";
import { promisify } from "util";
import { createClient } from "redis";
import axios from "axios"
initializeApp();
const REDISHOST = '10.163.132.195';
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

 

//////////////////////////////////////////
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "raymondfowler2.0@gmail.com",
    pass: "rhwjyzzlwbupuphx",
  },
});
//aux funtions
async function emailVHSCard(email, uid) {
  var comments = [];
  var reviews = [];
  var referrals = [];
  var notes = [];
  var supportTickets = [];
  var payments = [];
  var behaviors = [];
  var address;
  var city;
  var state;
  var zipcode;
  var points;
  var docId;
  var badges = [];
  var firstName;
  var lastName;
  var summaryContent;
  var months = [
    { name: "Jan" },
    { name: "Feb" },
    { name: "Mar" },
    { name: "Apr" },
    { name: "May" },
    { name: "Jun" },
    { name: "Jul" },
    { name: "Aug" },
    { name: "Sep" },
    { name: "Oct" },
    { name: "Nov" },
    { name: "Dec" },
  ];
  var dbPromises = [];

  const promiseConst = await Promise.all(dbPromises);

  promiseConst.forEach((qs) => {
    if (qs.size > 0) {
      if (qs.query._queryOptions.collectionId == "user") {
        Promise.all(
          qs.docs.map((doc) => {
            firstName = doc.data().firstName;
            lastName = doc.data().lastName;
            userEmail = doc.data().email;
            city = doc.data().city;
            state = doc.data().state;
            address = doc.data().address;
            zipcode = doc.data().zip;
            points = doc.data().points;
            docId = doc.data().docId;
            badges = doc.data().badges;
          })
        );
      } else if (qs.query._queryOptions.collectionId == "Comments") {
        Promise.all(
          qs.docs.map((doc) => {
            comments.push(doc.data());
          })
        );
      } else if (qs.query._queryOptions.collectionId == "Reviews") {
        Promise.all(
          qs.docs.map((doc) => {
            reviews.push(doc.data());
          })
        );
      } else if (qs.query._queryOptions.collectionId == "SupportTickets") {
        Promise.all(
          qs.docs.map((doc) => {
            supportTickets.push(doc.data());
          })
        );
      } else if (qs.query._queryOptions.collectionId == "Payments") {
        Promise.all(
          qs.docs.map((doc) => {
            payments.push(doc.data());
          })
        );
      } else if (qs.query._queryOptions.collectionId == "Notes") {
        Promise.all(
          qs.docs.map((doc) => {
            notes.push(doc.data());
          })
        );
      } else if (qs.query._queryOptions.collectionId == "Referrals") {
        Promise.all(
          qs.docs.map((doc) => {
            referrals.push(doc.data());
          })
        );
      } else if (qs.query._queryOptions.collectionId == "BehaviorTickets") {
        Promise.all(
          qs.docs.map((doc) => {
            behaviors.push(doc.data());
          })
        );
      }
    } else {
      return;
    }
  });

  function toDate(message) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(message * 1000).toLocaleDateString(undefined, options);
  }

  function getFilteredDate(idx) {
    return (
      payments.filter((payment) => {
        var dates = new Date(payment.createdOn);
        const shortMonth = dates.getMonth();
        return shortMonth === idx;
      }) || []
    );
  }

  function monthItems() {
    return months.map((e, i) => {
      const createdOn = getFilteredDate(i);
      return {
        ...e,
        createdOn,
      };
    });
  }

  var content = monthItems().reduce(function (a, b) {
    for (const item of b.createdOn) {
      if (item.daysTilLate == 0) {
        return (
          a +
          '<div class= "btn-circle btn-md red-shade" style="height: 30px; width: 30px; border-radius: 50%; display: inline-block;" align="center">' +
          b.name +
          "</div>"
        );
      } else if (item.daysTilLate <= 9 && item.daysTilLate >= 0) {
        return (
          a +
          '<div class= "btn-circle btn-md darkorange-shade" style="height: 30px; width: 30px; border-radius: 50%; display: inline-block;" align="center">' +
          b.name +
          "</div>"
        );
      } else if (item.daysTilLate <= 16 && item.daysTilLate >= 9) {
        return (
          a +
          '<div class= "btn-circle btn-md orange-shade" style="height: 30px; width: 30px; border-radius: 50%; display: inline-block;" align="center">' +
          b.name +
          "</div>"
        );
      } else if (item.daysTilLate <= 23 && item.daysTilLate >= 16) {
        return (
          a +
          '<div class= "btn-circle btn-md yellow-shade" style="height: 30px; width: 30px; border-radius: 50%; display: inline-block;" align="center">' +
          b.name +
          "</div>"
        );
      } else if (item.daysTilLate <= 30 && item.daysTilLate >= 23) {
        return (
          a +
          '<div class= "btn-circle btn-md green-shade" style="height: 30px; width: 30px; border-radius: 50%; display: inline-block;" align="center">' +
          b.name +
          "</div>"
        );
      } else {
        return;
      }
    }
  }, "");

  var justDaysTilLate = payments.map((e) => e.daysTilLate);

  var sum = justDaysTilLate.reduce((a, b) => {
    return a + b;
  }, 0);

  if (sum == 0) {
    summaryContent =
      '<span class= "summary red-shade" style="height: 40px; width: 80px; display: inline-block;" align="center"></span>';
  }

  if (sum <= 144 && sum >= 72) {
    summaryContent =
      '<span class= "summary darkorange-shade" style="height: 40px; width: 80px; display: inline-block;" align="center"></span>';
  }

  if (sum <= 216 && sum >= 144) {
    summaryContent =
      '<span class= "summary orange-shade" style="height: 40px; width: 80px; display: inline-block;" align="center"></span>';
  }

  if (sum <= 288 && sum >= 216) {
    summaryContent =
      '<span class= "summary yellow-shade" style="height: 40px; width: 80px; display: inline-block;" align="center"></span>';
  }

  if (sum <= 360 && sum >= 288) {
    summaryContent =
      '<span class= "summary green-shade" style="height: 40px; width: 80px; display: inline-block;" align="center"></span>';
  }

  return transporter
    .sendMail({
      from: "raymondfowler2.0@gmail.com",
      to: email,
      subject: "testing dynamic data",
      html: `
       <head>
<!-- Compiled with Bootstrap Email version: 1.1.5 --><meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<style>
    a:visited {
    color: blue; text-align: center; text-decoration: none; display: inline-block;
    }
    a:hover {
    color: red;
    }
    a:active {
    color: red;
    }
    .docId {
        font-size: 85%;
    }
    .summary{
			width: 125px;
			height: 60px;
		}
    .btn-circle.btn-md.red-shade {
    background-color: rgb(199, 13, 13);
    }
    .btn-circle.btn-md.green-shade {
    background-color: green;
    }
    .btn-circle.btn-md.yellow-shade {
    background-color: rgb(233, 219, 23);
    }
    .btn-circle.btn-md.orange-shade {
    background-color: rgb(241, 112, 7);
    }
    .btn-circle.btn-md.darkorange-shade {
    background-color: rgb(177, 82, 5);
    }
    .summary.btn-md.red-shade {
    background-color: rgb(199, 13, 13);
    }
    .summary.green-shade {
    background-color: green;
    }
    .summary.yellow-shade {
    background-color: rgb(233, 219, 23);
    }
    .summary.orange-shade {
    background-color: rgb(241, 112, 7);
    }
    .summary.darkorange-shade {
    background-color: rgb(177, 82, 5);
    }
		.images {
			width: 40px;
			height: 40px;
		}
    .btn-circle.btn-md {
      width: 40px;
      height: 40px;
      padding: 10px 0px;
      border-radius: 15px;
      text-align: center;
      font-size: 12px;
      line-height: 1.42857;
    }
</style>          <style type="text/css">
    body,table,td{font-family:Helvetica,Arial,sans-serif !important}.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:150%}a{text-decoration:none}*{color:inherit}a[x-apple-data-detectors],u+#body a,#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}img{-ms-interpolation-mode:bicubic}table:not([class^=s-]){font-family:Helvetica,Arial,sans-serif;mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;border-collapse:collapse}table:not([class^=s-]) td{border-spacing:0px;border-collapse:collapse}@media screen and (max-width: 600px){.w-full,.w-full>tbody>tr>td{width:100% !important}*[class*=s-lg-]>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-2>tbody>tr>td{font-size:8px !important;line-height:8px !important;height:8px !important}.s-5>tbody>tr>td{font-size:20px !important;line-height:20px !important;height:20px !important}.s-10>tbody>tr>td{font-size:40px !important;line-height:40px !important;height:40px !important}}
</style>
</head>
<body class="bg-light" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#f7fafc">
<table class="bg-light body" valign="top" role="presentation" border="0" cellpadding="0" cellspacing="0" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#f7fafc">
    <tbody>
    <tr>
        <td valign="top" style="line-height: 24px; font-size: 16px; margin: 0;" align="left" bgcolor="#f7fafc">
        <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; position: relative; line-height: 75px; height: 50px; margin: 0 auto;">
            <tbody>
            <tr>
                <td align="center" style="line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;">
                <!--[if (gte mso 9)|(IE)]>
                    <table align="center" role="presentation">
                    <tbody>
                        <tr>
                        <td width="600">
                <![endif]-->
                <table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
                    <tbody>
                    <tr>
                        <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
                        <table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;" align="left" width="100%" height="40">
                                &#160;
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table class="card" role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-radius: 6px; border-collapse: separate !important; width: 100%; overflow: hidden; border: 1px solid #e2e8f0;" bgcolor="#ffffff">
                            <tbody>
                            <tr>
                                <td style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left" bgcolor="#ffffff">
                                <table class="card-body" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                                    <tbody>
                                    <tr>
                                        <td style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 20px;" align="left">
                                        <h1 class="h3" style="padding-top: 0; padding-bottom: 0; font-weight: 500; vertical-align: baseline; font-size: 28px; line-height: 33.6px; margin: 0;" align="left">Vhs Card</h1>
                                        <table class="s-2 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                            <tbody>
                                            <tr>
                                                <td style="line-height: 8px; font-size: 8px; width: 100%; height: 8px; margin: 0;" align="left" width="100%" height="8">
                                                &#160;
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                            <tbody>
                                            <tr>
                                                <td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0;" align="left" width="100%" height="20">
                                                &#160;
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <table class="hr" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                                            <tbody>
                                            <tr>
                                                <td style="line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; height: 1px; width: 100%; margin: 0;" align="left">
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                            <tbody>
                                            <tr>
                                                <td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0;" align="left" width="100%" height="20">
                                                &#160;
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width:100%" position: relative; line-height: 75px; height: 50px; margin: 0 auto;">
                                            <tbody>
                                            <tr>
                                                <td align="center" style="line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;">
                                                <!--[if (gte mso 9)|(IE)]>
                                                    <table align="center" role="presentation">
                                                    <tbody>
                                                        <tr>
                                                        <td width="600">
                                                <![endif]-->
                                                <table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
                                                    <tbody>
                                                    <tr>
                                                        <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
                                                        <div class="row" style="margin-right: -24px;">
                                                            <table class="" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed; width: 900px;" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                <td class="col-sm" style="line-height: 24px; font-size: 16px; min-height: 1px; font-weight: normal; padding-right: 24px; margin: 0;" align="left" valign="top">
                                                                    Doc Id: <span class="docId">${docId}</span>
                                                                    <p style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left"> </p>
                                                                    <br>
                                                                    Name: ${firstName} ${lastName}
                                                                    <p style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left"> </p>
                                                                    <br>
                                                                    Address: ${address} ${city}, ${state} ${zipcode} 
                                                                    <p style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left"> </p>
                                                                    <br>
																																		Badges: ${badges.map(
                                                                      (badge) =>
                                                                        `<img class="images mt-4" src="${badge.badgeUrl}">`
                                                                    )}
                                                                    <p style="font-size: 16px; width: 100%; margin: 0;" align="left" margin-right: 10px;></p>
                                                                    <br>
                                                                    Points: ${points}
                                                                    <p style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left"> </p>
                                                                    <br>
                                                                    Summary: ${summaryContent}
                                                                    <p style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left"> </p>
                                                                </td>
                                                                <td class="col-sm" style="line-height: 24px; font-size: 16px; min-height: 1px; font-weight: normal; padding-right: 24px; margin: 0;" align="left" valign="top">
                                                                    <u>History</u>
                                                                    <br>
                                                                    Payments:
                                                                    <br>
                                                                    ${content}
                                                                    <br>
                                                                    Maint:
                                                                    <div class="row" style="margin-right: -24px;">
                                                                    <table class="" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed; width: 100%;" width="100%">
                                                                        <tbody>
                                                                        ${supportTickets.map(
                                                                          (
                                                                            supportTicket
                                                                          ) =>
                                                                            `<a href="maryswatch.com" target="_blank" style="color: blue; text-align: center; text-decoration: none; display: inline-block;">${toDate(
                                                                              supportTicket
                                                                                .createdOn
                                                                                .seconds
                                                                            )}</a>`
                                                                        )}
                                                                        </tbody>
                                                                    </table>
                                                                    </div>
                                                                    <br>
                                                                    Behavior:
                                                                    <div class="row" style="margin-right: -24px;">
                                                                    <table class="" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed; width: 100%;" width="100%">
                                                                        <tbody>
                                                                        ${behaviors.map(
                                                                          (
                                                                            behavior
                                                                          ) =>
                                                                            `<a href="https://www.maryswatch.com" target="_blank" style="color: blue; text-align: center; word-spacing: 10px; text-decoration: none; display: inline-block;">${toDate(
                                                                              behavior
                                                                                .createdOn
                                                                                .seconds
                                                                            )}</a>`
                                                                        )}
                                                                        </tbody>
                                                                    </table>
                                                                    </div>
                                                                    <br>
                                                                    Comments: 
                                                                    <br>
                                                                    <div class="row" style="margin-right: -24px;">
                                                                    <table class="" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed; width: 100%;" width="100%">
                                                                        <tbody>
                                                                        ${comments.map(
                                                                          (
                                                                            comment
                                                                          ) =>
                                                                            `<a href="https://www.maryswatch.com" target="_blank" style="color: blue; word-spacing: 10px; text-align: center; text-decoration: none; display: inline-block;">${toDate(
                                                                              comment
                                                                                .createdOn
                                                                                .seconds
                                                                            )}</a>`
                                                                        )}
                                                                        </tbody>
                                                                    </table>
                                                                    </div>
                                                                    <br>
                                                                    Reviews: 
                                                                    <br>
                                                                    <div class="row" style="margin-right: -24px;">
                                                                    <table class="" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed; width: 100%;" width="100%">
                                                                        <tbody>
                                                                        ${reviews.map(
                                                                          (
                                                                            review
                                                                          ) =>
                                                                            `<a href="https://www.maryswatch.com" target="_blank" style="color: blue; word-spacing: 10px; text-align: center; text-decoration: none; display: inline-block;">${toDate(
                                                                              review
                                                                                .createdOn
                                                                                .seconds
                                                                            )}</a>`
                                                                        )}
                                                                        </tbody>
                                                                    </table>
                                                                    </div>
                                                                    <br>
                                                                    Notes: 
                                                                    <div class="row" style="margin-right: -24px;">
                                                                    <table class="" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed; width: 100%;" width="100%">
                                                                        <tbody>
                                                                        ${notes.map(
                                                                          (
                                                                            note
                                                                          ) =>
                                                                            `<a href="https://www.maryswatch.com" target="_blank" style="color: blue; word-spacing: 10px; text-align: center; text-decoration: none; display: inline-block;">${toDate(
                                                                              note
                                                                                .createdOn
                                                                                .seconds
                                                                            )}</a>`
                                                                        )}
                                                                        </tbody>
                                                                    </table>
                                                                    </div>
                                                                    <br>
                                                                    Referrals: 
                                                                    <br>
                                                                    <div class="row" style="margin-right: -24px;">
                                                                    <table class="" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed; width: 100%;" width="100%">
                                                                        <tbody>
																																				  ${referrals.map(
                                                                            (
                                                                              referral
                                                                            ) =>
                                                                              `<a href="https://www.maryswatch.com" target="_blank" style="color: blue; word-spacing: 10px; text-align: center; text-decoration: none; display: inline-block;">${toDate(
                                                                                referral
                                                                                  .createdOn
                                                                                  .seconds
                                                                              )}</a>`
                                                                          )}
                                                                        </tbody>
                                                                    </table>
                                                                    </div>
                                                                </td>
                                                    
                                                                </tr>
                                                            </tbody>
                                                            </table>
                                                        </div>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <!--[if (gte mso 9)|(IE)]>
                                                </td>
                                                </tr>
                                            </tbody>
                                            </table>
                                                <![endif]-->
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;" align="left" width="100%" height="40">
                                &#160;
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
            </tbody>
            </table>
                <![endif]-->
                </td>
            </tr>
            </tbody>
        </table>
        </td>
    </tr>
    </tbody>
</table>
</body>
      `,
    })
    .then((r) => console.log(r))
    .catch((e) => console.log(e.message));
}
async function welcomeEmail(userEmail, uid) {
  var dbPromises = [];
  var teams = [];
  var newsCollection = [];
  var store = [];
  var lastName;
  var firstName;

  var storeContent;

  dbPromises.push(
    "hi"
  );

  const promiseConst = await Promise.all(dbPromises);

  promiseConst.forEach((qs) => {
    if (qs.size > 0) {
      if (qs.query._queryOptions.collectionId == "user") {
        Promise.all(
          qs.docs.map((doc) => {
            firstName = doc.data().firstName;
            lastName = doc.data().lastName;
            docId = doc.data().docId;
          })
        );
      }

      if (qs.query._queryOptions.collectionId == "Teams") {
        Promise.all(
          qs.docs.map((doc) => {
            teams.push(doc.data());
          })
        );
      } else if (qs.query._queryOptions.collectionId == "Store") {
        Promise.all(
          qs.docs.map((doc) => {
            store.push(doc.data());
          })
        );
      } else if (qs.query._queryOptions.collectionId == "NewsCollection") {
        Promise.all(
          qs.docs.map((doc) => {
            newsCollection.push(doc.data());
          })
        );
      } else {
        return;
      }
    }
  });

  return transporter
    .sendMail({
      from: "raymondfowler2.0@gmail.com",
      to: userEmail,
      subject: "Welcome to Mary's Watch",
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
      <html>
        <head>
          <!-- Compiled with Bootstrap Email version: 1.3.1 --><meta http-equiv="x-ua-compatible" content="ie=edge">
          <meta name="x-apple-disable-message-reformatting">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
          <style type="text/css">
            body,table,td{font-family:Helvetica,Arial,sans-serif !important}.ExternalClass{width:100%}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:150%}a{text-decoration:none}*{color:inherit}a[x-apple-data-detectors],u+#body a,#MessageViewBody a{color:inherit;text-decoration:none;font-size:inherit;font-family:inherit;font-weight:inherit;line-height:inherit}img{-ms-interpolation-mode:bicubic}table:not([class^=s-]){font-family:Helvetica,Arial,sans-serif;mso-table-lspace:0pt;mso-table-rspace:0pt;border-spacing:0px;border-collapse:collapse}table:not([class^=s-]) td{border-spacing:0px;border-collapse:collapse}@media screen and (max-width: 600px){.w-full,.w-full>tbody>tr>td{width:100% !important}*[class*=s-lg-]>tbody>tr>td{font-size:0 !important;line-height:0 !important;height:0 !important}.s-3>tbody>tr>td{font-size:12px !important;line-height:12px !important;height:12px !important}.s-5>tbody>tr>td{font-size:20px !important;line-height:20px !important;height:20px !important}.s-10>tbody>tr>td{font-size:40px !important;line-height:40px !important;height:40px !important}}
          </style>
        </head>
        <body class="bg-light" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#f7fafc">
          <table class="bg-light body" valign="top" role="presentation" border="0" cellpadding="0" cellspacing="0" style="outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 16px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; color: #000000; margin: 0; padding: 0; border-width: 0;" bgcolor="#f7fafc">
            <tbody>
              <tr>
                <td valign="top" style="line-height: 24px; font-size: 16px; margin: 0;" align="left" bgcolor="#f7fafc">
                  <table class="container" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                    <tbody>
                      <tr>
                        <td align="center" style="line-height: 24px; font-size: 16px; margin: 0; padding: 0 16px;">
                          <!--[if (gte mso 9)|(IE)]>
                            <table align="center" role="presentation">
                              <tbody>
                                <tr>
                                  <td width="600">
                          <![endif]-->
                          <table align="center" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 600px; margin: 0 auto;">
                            <tbody>
                              <tr>
                                <td style="line-height: 24px; font-size: 16px; margin: 0;" align="left">
                                  <table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                    <tbody>
                                      <tr>
                                        <td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;" align="left" width="100%" height="40">
                                          &#160;
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table class="card" role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-radius: 6px; border-collapse: separate !important; width: 100%; overflow: hidden; border: 1px solid #e2e8f0;" bgcolor="#ffffff">
                                    <tbody>
                                      <tr>
                                        <td style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left" bgcolor="#ffffff">
                                          <table class="card-body" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                                            <tbody>
                                              <tr>
                                                <td style="line-height: 24px; font-size: 16px; width: 100%; margin: 0; padding: 20px;" align="left">
                                                  <div class="space-y-3">
                                                    <img href="maryswatch.com" src="https://firebasestorage.googleapis.com/v0/b/testapp-ddf1a.appspot.com/o/Screen%20Shot%202022-08-05%20at%2012.01.06%20PM_250x250.png?alt=media&amp;token=919ca6fd-29be-4652-9e74-1d06e4d9c925" height="60px" width="60px" border="1px" align="right" class="" style="height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; border-style: none; border-width: 0;">
                                                    <table class="s-3 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 12px; font-size: 12px; width: 100%; height: 12px; margin: 0;" align="left" width="100%" height="12">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <p class="text-gray-700" style="line-height: 24px; font-size: 16px; color: #4a5568; width: 100%; margin: 0;" align="left">
                                                      Welcome to the Mary's Watch platform ${firstName} ${lastName}. Our mission is to provide a way to Organize housing for everyone. 
                                                      You can Start below by interacting with our site. Or you can look at our tutorial videos that we 
                                                      have linked below as well. We are commited to giving you the best way to operate all avenues of housing. We look foward to 
                                                      how you help us change the world.
                                                    </p>
                                                    <table class="s-3 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 12px; font-size: 12px; width: 100%; height: 12px; margin: 0;" align="left" width="100%" height="12">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0;" align="left" width="100%" height="20">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class="hr" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; height: 1px; width: 100%; margin: 0;" align="left">
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0;" align="left" width="100%" height="20">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <div class="row" style="margin-right: -24px;">
                                                      <table class="" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed; width: 100%;" width="100%">
                                                        <tbody>
                                                          <tr>
                                                            <p style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left"><u>Stores</u></p>
                                                            
                                                            ${store
                                                              .map(
                                                                (
                                                                  s
                                                                ) => `<td class=".col-4" style="line-height: 24px; font-size: 16px; min-height: 1px; font-weight: normal; padding-right: 24px; margin: 0;" align="left" valign="top">
                                                            <img src="${s.storeProfileImage}" height="100px" width="100px" class="circular--square" style="height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; border-style: none; border-width: 0;">
                                                            <br>
                                                            <a style="color: #0d6efd;"><u>${s.storeName}</u></a>
                                                          </td>`
                                                              )
                                                              .join("")}

                                                            
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                    <table class="s-3 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 12px; font-size: 12px; width: 100%; height: 12px; margin: 0;" align="left" width="100%" height="12">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0;" align="left" width="100%" height="20">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class="hr" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; height: 1px; width: 100%; margin: 0;" align="left">
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0;" align="left" width="100%" height="20">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <div class="row" style="margin-right: -24px;">
                                                      <table class="" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed; width: 100%;" width="100%">
                                                        <tbody>
                                                          <tr>
                                                            <p style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left">Teams</p>
                                                
                                                            ${teams
                                                              .map(
                                                                (
                                                                  t
                                                                ) => `<td class=".col-4" style="line-height: 24px; font-size: 16px; min-height: 1px; font-weight: normal; padding-right: 24px; margin: 0;" align="left" valign="top">
                                                            <img src="${t.teamProfileImage}" height="100px" width="100px" class="circular--square" style="height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; border-style: none; border-width: 0;">
                                                            <br>
                                                            <a style="color: #0d6efd;"><u>${t.teamName}</u></a>
                                                          </td>`
                                                              )
                                                              .join("")}

                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                    <table class="s-3 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 12px; font-size: 12px; width: 100%; height: 12px; margin: 0;" align="left" width="100%" height="12">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0;" align="left" width="100%" height="20">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class="hr" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; height: 1px; width: 100%; margin: 0;" align="left">
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0;" align="left" width="100%" height="20">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <div class="row" style="margin-right: -24px;">
                                                      <table class="" role="presentation" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed; width: 100%;" width="100%">
                                                        <tbody>
                                                          <tr>
                                                            <p style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left">News Articles</p>
                                                            
                                                            ${newsCollection
                                                              .map(
                                                                (
                                                                  n
                                                                ) => `<td class=".col-4" style="line-height: 24px; font-size: 16px; min-height: 1px; font-weight: normal; padding-right: 24px; margin: 0;" align="left" valign="top">
                                                            <img src="${n.newsArticleImageURL}" height="100px" width="100px" class="circular--square" style="height: auto; line-height: 100%; outline: none; text-decoration: none; display: block; border-style: none; border-width: 0;">
                                                            <br>
                                                            <a style="color: #0d6efd;"><u>${n.articleTitle}</u></a>
                                                          </td>`
                                                              )
                                                              .join("")}

                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </div>
                                                    <table class="s-3 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 12px; font-size: 12px; width: 100%; height: 12px; margin: 0;" align="left" width="100%" height="12">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0;" align="left" width="100%" height="20">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class="hr" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; height: 1px; width: 100%; margin: 0;" align="left">
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0;" align="left" width="100%" height="20">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <p class="text-gray-700" style="line-height: 24px; font-size: 16px; color: #4a5568; width: 100%; margin: 0;" align="left">
                                                      Here you can find our <a href="https://bootstrapemail.com/docs/introduction" target="_blank" style="color: #0d6efd;">Documentation</a> of how to navigate through the site.
                                                    </p>
                                                    <table class="s-3 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                      <tbody>
                                                        <tr>
                                                          <td style="line-height: 12px; font-size: 12px; width: 100%; height: 12px; margin: 0;" align="left" width="100%" height="12">
                                                            &#160;
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <p style="line-height: 24px; font-size: 16px; width: 100%; margin: 0;" align="left">
                                                      Here you can find the <a href="https://bootstrapemail.com/docs/introduction" target="_blank" style="color: #0d6efd;">tutorial videos</a> that can also help you on your way to organizing the hosuing market.
                                                    </p>
                                                  </div>
                                                  <table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                    <tbody>
                                                      <tr>
                                                        <td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0;" align="left" width="100%" height="20">
                                                          &#160;
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                  <table class="hr" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;">
                                                    <tbody>
                                                      <tr>
                                                        <td style="line-height: 24px; font-size: 16px; border-top-width: 1px; border-top-color: #e2e8f0; border-top-style: solid; height: 1px; width: 100%; margin: 0;" align="left">
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                  <table class="s-5 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                                    <tbody>
                                                      <tr>
                                                        <td style="line-height: 20px; font-size: 20px; width: 100%; height: 20px; margin: 0;" align="left" width="100%" height="20">
                                                          &#160;
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table class="s-10 w-full" role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: 100%;" width="100%">
                                    <tbody>
                                      <tr>
                                        <td style="line-height: 40px; font-size: 40px; width: 100%; height: 40px; margin: 0;" align="left" width="100%" height="40">
                                          &#160;
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <!--[if (gte mso 9)|(IE)]>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                          <![endif]-->
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>      
      `,
    })
    .then((r) => console.log("response from email", r))
    .catch((e) => console.log("error message if there is one", e.message));
}
export const sendVHSCard = https.onCall(async (data, context) => {
  var uid = data.uid;
  console.log(uid);

  var email = data.email;

  return emailVHSCard(email, uid);
});

export const adddownloadurltouserprofile = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
		const { gUID, downloadURL, userData } = req.body;

		if (gUID !== undefined) {
      const userProfileNewData = `mw-userProfileData-${gUID}`;

			const userDataWithPicture = { ...userData, profileImage: downloadURL}

      try {
        const response = await redisClient.set(
          userProfileNewData,
          JSON.stringify(userDataWithPicture)
        );
        res.set(200, { "Content-Type": "text/plain" });
        res.send(JSON.parse(response));
        redisClient.quit();
      } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
      }
    }
  }
);

export const getuserdatafromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { gUID } = req.body;
		console.log(gUID)
		if(gUID !== undefined) {
			const userProfileNewData = `mw-userProfileData-${gUID}`;
			const value = await redisClient.get(userProfileNewData);
			console.log(value)
			
			// if (value) {
			// 	res.send(JSON.parse(value));
			// }
  	}
	} 
);

export const cacheediteduser = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { editedUserData, gUID } = req.body;

    if (gUID !== undefined) {
       const userProfileNewData = `mw-userProfileData-${gUID}`;

			console.log('edited user data', editedUserData, 'uid', gUID)


			var customers = [
        {
          first_name: "Lorry",
          last_name: "Copp",
          email: "lcopp0@wordpress.org",
          phone: "202-553-5284",
          address: "7 Hanover Hill",
          city: "Washington",
          state: "DC",
          zip: "20016",
        },
        {
          first_name: "Hinze",
          last_name: "Van Der Weedenburg",
          email: "hvanderweedenburg1@wp.com",
          phone: "217-790-2948",
          address: "2091 Golf Course Plaza",
          city: "Decatur",
          state: "IL",
          zip: "62525",
        },
        {
          first_name: "Kipp",
          last_name: "Spencers",
          email: "kspencers2@webeden.co.uk",
          phone: "860-905-2220",
          address: "1 Westerfield Drive",
          city: "Hartford",
          state: "CT",
          zip: "06160",
        },
        {
          first_name: "Leone",
          last_name: "Dorking",
          email: "ldorking3@mysql.com",
          phone: "559-353-6033",
          address: "2 Ruskin Road",
          city: "Visalia",
          state: "CA",
          zip: "93291",
        },
        {
          first_name: "Elisha",
          last_name: "Satchel",
          email: "esatchel4@discuz.net",
          phone: "850-756-8611",
          address: "289 Evergreen Center",
          city: "Pensacola",
          state: "FL",
          zip: "32511",
        },
      ];

      var assets = [
        {
          email: "fmockler0@google.ca",
          phone: "971-601-6355",
          address: "857 Scoville Hill",
          city: "Salem",
          state: "OR",
          zip: "97312",
        },
        {
          email: "pduester1@oaic.gov.au",
          phone: "321-991-6973",
          address: "1494 Charing Cross Park",
          city: "Melbourne",
          state: "FL",
          zip: "32919",
        },
        {
          email: "smiddle2@accuweather.com",
          phone: "502-110-6631",
          address: "057 Grasskamp Terrace",
          city: "Louisville",
          state: "KY",
          zip: "40205",
        },
        {
          email: "dmanssuer3@nymag.com",
          phone: "218-702-9296",
          address: "7 Forest Run Drive",
          city: "Duluth",
          state: "MN",
          zip: "55805",
        },
        {
          email: "akhrishtafovich4@usda.gov",
          phone: "234-954-4022",
          address: "633 Transport Pass",
          city: "Akron",
          state: "OH",
          zip: "44393",
        },
      ];

      var payments = [
        {
          first_name: "Beatrix",
          last_name: "Drover",
          address: "1 Scott Lane",
          city: "Oklahoma City",
          state: "OK",
          zip: "73142",
          amount: "$223.60",
        },
        {
          first_name: "Carita",
          last_name: "Swyer-Sexey",
          address: "5589 Duke Lane",
          city: "Saint Louis",
          state: "MO",
          zip: "63167",
          amount: "$724.79",
        },
        {
          first_name: "Jan",
          last_name: "Fenemore",
          address: "4 Chive Circle",
          city: "Knoxville",
          state: "TN",
          zip: "37939",
          amount: "$155.45",
        },
        {
          first_name: "Reynard",
          last_name: "Gumb",
          address: "2 Hovde Plaza",
          city: "Hyattsville",
          state: "MD",
          zip: "20784",
          amount: "$3.81",
        },
        {
          first_name: "Norene",
          last_name: "Seawright",
          address: "75717 Everett Way",
          city: "Scranton",
          state: "PA",
          zip: "18514",
          amount: "$5.53",
        },
      ];

			

			
			try {
				// const response = await redisClient.set(
				// 	userProfileNewData,
				// 	JSON.stringify(changedData)
				// );

				
				const response = await redisClient.set(userProfileNewData, JSON.stringify(editedUserData))
				res.set(200, { "Content-Type": "text/plain" });
			
			} catch (err) {
				console.log(err);
				res.status(500).send(err.message);
			}
    }
  }
);

export const cacheuser = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const { userData, gUID } = req.body;
		
    if (gUID !== undefined) {
			//Decide on how Ids will work for caching....
			console.log(userData, gUID)
			const userProfileNewData = `mw-userProfileData-${gUID}`;

			var customers = [
        {
          first_name: "Lorry",
          last_name: "Copp",
          email: "lcopp0@wordpress.org",
          phone: "202-553-5284",
          address: "7 Hanover Hill",
          city: "Washington",
          state: "DC",
          zip: "20016",
        },
        {
          first_name: "Hinze",
          last_name: "Van Der Weedenburg",
          email: "hvanderweedenburg1@wp.com",
          phone: "217-790-2948",
          address: "2091 Golf Course Plaza",
          city: "Decatur",
          state: "IL",
          zip: "62525",
        },
        {
          first_name: "Kipp",
          last_name: "Spencers",
          email: "kspencers2@webeden.co.uk",
          phone: "860-905-2220",
          address: "1 Westerfield Drive",
          city: "Hartford",
          state: "CT",
          zip: "06160",
        },
        {
          first_name: "Leone",
          last_name: "Dorking",
          email: "ldorking3@mysql.com",
          phone: "559-353-6033",
          address: "2 Ruskin Road",
          city: "Visalia",
          state: "CA",
          zip: "93291",
        },
        {
          first_name: "Elisha",
          last_name: "Satchel",
          email: "esatchel4@discuz.net",
          phone: "850-756-8611",
          address: "289 Evergreen Center",
          city: "Pensacola",
          state: "FL",
          zip: "32511",
        },
      ];

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

			var assets = [
        {
          email: "fmockler0@google.ca",
          phone: "971-601-6355",
          address: "857 Scoville Hill",
          city: "Salem",
          state: "OR",
          zip: "97312",
        },
        {
          email: "pduester1@oaic.gov.au",
          phone: "321-991-6973",
          address: "1494 Charing Cross Park",
          city: "Melbourne",
          state: "FL",
          zip: "32919",
        },
        {
          email: "smiddle2@accuweather.com",
          phone: "502-110-6631",
          address: "057 Grasskamp Terrace",
          city: "Louisville",
          state: "KY",
          zip: "40205",
        },
        {
          email: "dmanssuer3@nymag.com",
          phone: "218-702-9296",
          address: "7 Forest Run Drive",
          city: "Duluth",
          state: "MN",
          zip: "55805",
        },
        {
          email: "akhrishtafovich4@usda.gov",
          phone: "234-954-4022",
          address: "633 Transport Pass",
          city: "Akron",
          state: "OH",
          zip: "44393",
        },
      ];

			var payments = [
        {
          first_name: "Beatrix",
          last_name: "Drover",
          address: "1 Scott Lane",
          city: "Oklahoma City",
          state: "OK",
          zip: "73142",
          amount: "$223.60",
        },
        {
          first_name: "Carita",
          last_name: "Swyer-Sexey",
          address: "5589 Duke Lane",
          city: "Saint Louis",
          state: "MO",
          zip: "63167",
          amount: "$724.79",
        },
        {
          first_name: "Jan",
          last_name: "Fenemore",
          address: "4 Chive Circle",
          city: "Knoxville",
          state: "TN",
          zip: "37939",
          amount: "$155.45",
        },
        {
          first_name: "Reynard",
          last_name: "Gumb",
          address: "2 Hovde Plaza",
          city: "Hyattsville",
          state: "MD",
          zip: "20784",
          amount: "$3.81",
        },
        {
          first_name: "Norene",
          last_name: "Seawright",
          address: "75717 Everett Way",
          city: "Scranton",
          state: "PA",
          zip: "18514",
          amount: "$5.53",
        },
      ];

			var bigUserObj = {
				...userData,
				teams: teams,
				customers: customers,
				assets: assets,
				payments: payments,

			}

      try {
      	const response = await redisClient.set(
      		userProfileNewData, 
      		JSON.stringify(bigUserObj)
      	);
      	res.set(200, { "Content-Type": "text/plain" });
      	res.send(JSON.parse(response));
     
      } catch (err) {
      	console.log(err);
      	res.status(500).send(err.message);
      }
    }
  }
);

export const deletepreviousfromcache = onRequest(
  {
    cors: true,
    region: "us-west1",
    vpcConnector: "mw-cache-connector",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    const currentUserData = "currentUserData";

    const response = await redisClient.del(currentUserData);

    console.log(response);

    res.send("deleted key");
  }
);

//Helper functions to build VHS Card
async function buildVHSCard(email, uid) {
  var comments = [];
  var reviews = [];
  var referrals = [];
  var notes = [];
  var supportTickets = [];
  var payments = [];
  var behaviors = [];
  var address;
  var city;
  var state;
  var zipcode;
  var points;
  var docId;
  var badges = [];
  var firstName;
  var lastName;
  var summaryContent;

  var months = [
    { name: "Jan" },
    { name: "Feb" },
    { name: "Mar" },
    { name: "Apr" },
    { name: "May" },
    { name: "Jun" },
    { name: "Jul" },
    { name: "Aug" },
    { name: "Sep" },
    { name: "Oct" },
    { name: "Nov" },
    { name: "Dec" },
  ];

  getUserData(uid)
	getUserAssetData(uid)
	getUserCustomerData(uid)
	getUserTeamData(uid)
	getUserTicketData(uid)

  function toDate(message) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(message * 1000).toLocaleDateString(undefined, options);
  }

  function getFilteredDate(idx) {
    return (
      payments.filter((payment) => {
        var dates = new Date(payment.createdOn);
        const shortMonth = dates.getMonth();
        return shortMonth === idx;
      }) || []
    );
  }

  function monthItems() {
    return months.map((e, i) => {
      const createdOn = getFilteredDate(i);
      return {
        ...e,
        createdOn,
      };
    });
  }

  var content = monthItems().reduce(function (a, b) {
    for (const item of b.createdOn) {
      if (item.daysTilLate == 0) {
        return (
          a +
          '<div class= "btn-circle btn-md red-shade" style="height: 30px; width: 30px; border-radius: 50%; display: inline-block;" align="center">' +
          b.name +
          "</div>"
        );
      } else if (item.daysTilLate <= 9 && item.daysTilLate >= 0) {
        return (
          a +
          '<div class= "btn-circle btn-md darkorange-shade" style="height: 30px; width: 30px; border-radius: 50%; display: inline-block;" align="center">' +
          b.name +
          "</div>"
        );
      } else if (item.daysTilLate <= 16 && item.daysTilLate >= 9) {
        return (
          a +
          '<div class= "btn-circle btn-md orange-shade" style="height: 30px; width: 30px; border-radius: 50%; display: inline-block;" align="center">' +
          b.name +
          "</div>"
        );
      } else if (item.daysTilLate <= 23 && item.daysTilLate >= 16) {
        return (
          a +
          '<div class= "btn-circle btn-md yellow-shade" style="height: 30px; width: 30px; border-radius: 50%; display: inline-block;" align="center">' +
          b.name +
          "</div>"
        );
      } else if (item.daysTilLate <= 30 && item.daysTilLate >= 23) {
        return (
          a +
          '<div class= "btn-circle btn-md green-shade" style="height: 30px; width: 30px; border-radius: 50%; display: inline-block;" align="center">' +
          b.name +
          "</div>"
        );
      } else {
        return;
      }
    }
  }, "");

  var justDaysTilLate = payments.map((e) => e.daysTilLate);

  var sum = justDaysTilLate.reduce((a, b) => {
    return a + b;
  }, 0);
gf
  if (sum == 0) {
    summaryContent =
      '<span class= "summary red-shade" style="height: 40px; width: 80px; display: inline-block;" align="center"></span>';
  }

  if (sum <= 144 && sum >= 72) {
    summaryContent =
      '<span class= "summary darkorange-shade" style="height: 40px; width: 80px; display: inline-block;" align="center"></span>';
  }

  if (sum <= 216 && sum >= 144) {
    summaryContent =
      '<span class= "summary orange-shade" style="height: 40px; width: 80px; display: inline-block;" align="center"></span>';
  }

  if (sum <= 288 && sum >= 216) {
    summaryContent =
      '<span class= "summary yellow-shade" style="height: 40px; width: 80px; display: inline-block;" align="center"></span>';
  }

  if (sum <= 360 && sum >= 288) {
    summaryContent =
      '<span class= "summary green-shade" style="height: 40px; width: 80px; display: inline-block;" align="center"></span>';
  }
}

async function getUserData(uid) {

	await axios.post("https://getuserdatafromcache-qqntzlhyfq-uw.a.run.app"),
					{uid: uid}
          .catch((err) => {
            console.log("err", err);
          });
}

async function getUserTicketData(uid) {
	await axios.post("https://getuserticketdatafromcache-qqntzlhyfq-uw.a.run.app"),
					{uid: uid}
          .catch((err) => {
            console.log("err", err);
          });
}

async function getUserTeamData(uid) {
  await axios.post("https://getuserteamdatafromcache-qqntzlhyfq-uw.a.run.app"),
		{uid: uid}
    .catch((err) => {
      console.log("err", err);
    });
}

async function getUserAssetData(uid) {
  await axios.post("https://getuserassetdatafromcache-qqntzlhyfq-uw.a.run.app"),
		{uid: uid}
    .catch((err) => {
      console.log("err", err);
    });
}

async function getUserCustomerData(uid) {
  await axios.post("https://getuserdatafromcache-qqntzlhyfq-uw.a.run.app"),
		{uid: uid}
    .catch((err) => {
      console.log("err", err);
    });
}