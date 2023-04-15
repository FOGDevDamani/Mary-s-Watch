//////////////////variables///////////////////
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
const axios = require("axios");
const googleMapsApiKey = "AIzaSyCZWa8sZcUO159z5FK2FFbZcM-5BF7GRJE";
admin.initializeApp();

//////////////////////////////////////////
const transporter = nodemailer.createTransport({
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

  dbPromises.push(
    admin.firestore().collection("user").where("user_id", "==", uid).get(),
    admin.firestore().collection("Comments").where("user_id", "==", uid).get(),
    admin.firestore().collection("Reviews").where("user_id", "==", uid).get(),
    admin.firestore().collection("Referrals").where("user_id", "==", uid).get(),
    admin.firestore().collection("Payments").where("user_id", "==", uid).get(),
    admin.firestore().collection("Notes").where("user_id", "==", uid).get(),
    admin
      .firestore()
      .collection("SupportTickets")
      .where("user_id", "==", uid)
      .get(),
    admin
      .firestore()
      .collection("BehaviorTickets")
      .where("user_id", "==", uid)
      .get()
  );

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
    admin.firestore().collection("user").where("user_id", "==", uid).get(),
    admin.firestore().collection("Teams").limit(3).get(),
    admin.firestore().collection("NewsCollection").limit(3).get(),
    admin.firestore().collection("Store").limit(3).get()
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
async function assetNetworkIncludesUser(assetNetwork, sentBy) {
  for (const member of assetNetwork) {
    if (member.name.includes(sentBy)) {
      console.log("conditional for helper function passes");
      return true;
    }
  }
}
exports.sendVHSCard = functions.https.onCall(async (data, context) => {
  var uid = data.uid;
  console.log(uid);

  var email = data.email;

  return emailVHSCard(email, uid);
});
(exports.extractNewsArticleImageAndHeadline = functions.firestore
  .document("/NewsCollection/{newsCollectionId}")
  .onCreate((snapshot, context) => {
    const value = snapshot.data();

    var articleURL = value.newsArticleURL;

    return retrieveArticleContents(articleURL, snapshot);
  })),
  /////////--------completionstatus-----/////////////////
  (exports.completionStatus = functions.firestore
    .document("/completionStatus/{id}")
    .onWrite((change, context) => {
      newValue = change.after.data() || {};
      previousValue = change.before.data() || {};

      const new_name = newValue.status;
      const old_name = previousValue.status;
      console.log(old_name, new_name);
      const topic = "payment";

      if (new_name !== old_name) {
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
                  title: "completion status notification",
                  body: "status of completion was changed",
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
            }
          });
      }
    })),
  (exports.paymentStatus = functions.firestore
    .document("/payments/{id}")
    .onWrite((change, context) => {
      newValue = change.after.data() || {};
      previousValue = change.before.data() || {};

      const new_name = newValue.status;
      const old_name = previousValue.status;
      console.log(old_name, new_name);
      const topic = "paymentStatus";

      if (new_name !== old_name) {
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
                  title: "payment status notification",
                  body: "status of payment was changed",
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
            }
          });
      }
    })),
  (exports.greetUser = functions.firestore
    .document("/user/{userId}")
    .onCreate(async (snapshot, context) => {
      var ref = snapshot.ref;
      const snapshot_1 = await admin.firestore().collection("Badges").get();
      snapshot_1.forEach((doc) => {
        const badgeURLS = [];
        const badgeInfo = {
          name: doc.data().name,
          url: doc.data().badgeURL,
        };
        badgeURLS.push(badgeInfo);
        // doc.data() is never undefined for query doc snapshots
        if (doc.data().name === "Housing Sentinel") {
          ref.set({ badges: badgeURLS }, { merge: true });
        }
      });
    })),
  //////////////////functions////////////
  (exports.logActivities = functions.firestore
    .document("/{collection}/{id}")
    .onCreate((snap, context) => {
      console.log(snap.data());

      const activities = admin.firestore().collection("activities");
      const collection = context.params.collection;

      if (collection === "SupportTicket") {
        return activities.add({ text: "A new tutorial request was added" });
      }
      if (collection === "User") {
        return activities.add({ text: "A new user signed up" });
      }
      if (collection === "Teams") {
        return activities.add({ text: "A new team member signed up" });
      }
      if (collection === "user") {
        return activities.add({ text: "A new user signed up" });
      }
      if (collection === "Companies") {
        return activities.add({ text: "A new company has been created" });
      }
      if (collection === "Commnets") {
        return activities.add({ text: "A user has commented" });
      }
      if (collection === "Payments") {
        return activities.add({ text: "A payment has been made" });
      }
      if (collection === "Customers") {
        return activities.add({ text: "A new customer has signed up" });
      }
      if (collection === "ServicePro") {
        return activities.add({ text: "A new service pro has signed up" });
      }
      if (collection === "Badges") {
        return activities.add({ text: "A new badge has been earned" });
      }
      if (collection === "BusinessAccount") {
        return activities.add({
          text: "a new business account has been created",
        });
      }
      if (collection === "Reviews") {
        return activities.add({ text: "a new review had been posted" });
      }

      //////need a sepreate cloud fuction for each command so that it one colection being referenced at a/////////////

      ///////////////new notifications that need to be made////////////////////
      if (collection === "") {
        return activities.add({ text: "A new user signed up" });
      }
      if (collection === "user") {
        return activities.add({ text: "A new user signed up" });
      }
      if (collection === "user") {
        return activities.add({ text: "A new user signed up" });
      }
      /////////////////

      return null;
    }));
/////////////////////////////activeMarketer////////////////////////////////////////
exports.customerSupportSpecialist = functions.firestore
  .document("/user/{userId}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data(); //use these value and previousData properties and  in your if statement below check that badge.name doesnt already exist in the array.
    const pointSum = data.points + previousData.points;

    console.log(pointSum, data.points, previousData.points);

    for (const e of previousData.badges) {
      if (e.name == "Customer Support Specialist") {
        return null;
      }
    }

    const topic = "badges";

    if (data.numberOfCustomersInteracted > 4) {
      change.after.ref.update({ customersInteracted: true });
      // }

      // if (data.customersInteracted === true) {
      //   admin
      //     .firestore()
      //     .collection("Badges")
      //     .get()
      //     .then((snapshot) => {
      //       snapshot.forEach((doc) => {
      //         const badgeInfo = {
      //           name: doc.data().name,
      //           url: doc.data().badgeURL,
      //         };
      //         if (data.points !== previousData.points) {
      //           return null;
      //         } else if (doc.data().name == "Customer Support Specialist") {
      //           change.after.ref.update({
      //             badges: admin.firestore.FieldValue.arrayUnion(badgeInfo),
      //             points: admin.firestore.FieldValue.increment(50),
      //           });
      //         } else if (
      //           data.customersInteracted === false ||
      //           data.customersInteracted == undefined
      //         ) {
      //           console.log(
      //             "can't give a badge just yet and point total is too large"
      //           );
      //         }
      //       });
      //     });

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
                title: "badge update",
                body: "congrats! you earned the customer support badge",
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

exports.welcomeNewUser = functions.firestore
  .document("/user/{userId}")
  .onCreate(async (snap, context) => {
    var topic = "welcomeUser";

    await welcomeEmail(snap.data().email, snap.data().user_id);

    return await admin
      .firestore()
      .collection("tokens")
      .get()
      .then((snapshot) => {
        const tokens = [];

        snapshot.forEach((doc) => {
          console.log(doc.data());
          tokens.push(doc.data().token);
        });

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
            title: "Welcome to MW",
            body: "Thanks for signing up!",
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
      });
  });
///////////Payments///////
exports.newFormOfPayment = functions.firestore
  .document("/user/{userId}")
  .onCreate(async (snap, context) => {
    var topic = "newPayment";

    if (paymentOption) {
      return await admin
        .firestore()
        .collection("tokens")
        .get()
        .then((snapshot) => {
          const tokens = [];

          snapshot.forEach((doc) => {
            console.log(doc.data());
            tokens.push(doc.data().token);
          });

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
              title: "New Payment Method Added",
              body: "Check to see if your payment infromation is correct.",
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
        });
    }
  });
exports.paymentOptionAdded = functions.firestore
  .document("/user/{userId}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data(); //use these value and previousData properties and  in your if statement below check that badge.name doesnt already exist in the array.
    const pointSum = data.paymentOption + previousData.paymentOption;

    console.log(data.paymentOption);

    const topic = "PaymentOption";

    if (data.paymentOption) {
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
            console.log("before message goes out");
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
                title: "Payment Information Updated",
                body: "you have sucessfully added a new payment option",
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
exports.paymentOptionAddedToTicketEstimate = functions.firestore
  .document("/OwnerSupportTickets/{ownerID}")
  .onUpdate(async (change, context) => {
    const data = change.after.data();
    console.log(data, "payment option added");
    var userPerspectives = [];
    var owner = "owner";

    const topic = "PaymentOptionEstimate";

    await admin
      .firestore()
      .collection("user")
      .where("perspective", "array-contains-any", ["owner"])
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

    if (userPerspectives.includes(owner)) {
      if (data.paymentOption) {
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
              console.log("before message goes out");
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
                  title: "Payment Information Updated on Ticket Estimate",
                  body: "You have sucessfully added a new payment option to youe ticket estimate",
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
    }
  });
//////users above 200 hundred///////
exports.userAboveTwoHundred = functions.firestore
  .document("/user/{userId}")
  .onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data(); //use these value and previousData properties and  in your if statement below check that badge.name doesnt already exist in the array.
    const pointSum = data.points + previousData.points;

    console.log(pointSum, data.points, previousData.points);

    const topic = "Points";

    if (data.points > 200) {
      change.after.ref.update({ pointsAboveTwoHundred: true });
    }

    if (data.points >= 200) {
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
                title: "Profile Update",
                body: "congrats! you earned 200 points ",
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
////////assets updated//////////
exports.addedAsset = functions.firestore
  .document("/Assets/{assetId}")
  .onWrite((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data(); //use these value and previousData properties and  in your if statement below check that badge.name doesnt already exist in the array.
    const address =
      data.address +
      " " +
      data.city +
      " " +
      data.state +
      " " +
      data.zipcode +
      " ";

    console.log(address);

    const topic = "Assets";

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
              title: "Profile Update",
              body: `${address} , has been added to your assets `,
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
  });
exports.shareRenterTicketWithAssetNetwork = functions.firestore
  .document("/RenterSupportTickets/{userId}")
  .onUpdate(async (change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();
    const renterSupportTicketTopic = "renterSupportTicketAdded";
    var usersName = "";

    var assetNetwork = [];
    var assetNetworkId = "";

    console.log(data.renterId);

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
      if (member.perspective == "renter") {
        usersName = member.name;
      }
    }

    change.after.ref.update({ assetNetworkId: assetNetworkId });

    await admin.firestore().collection("OwnerSupportTickets").add({
      createdOn: Date.now(),
      assetNetworkId: assetNetworkId,
      sentByRenter: true,
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
            .subscribeToTopic(tokens, renterSupportTicketTopic)
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
              title: "Owner and SP received your support ticket",
              body: "Your maintenance request has been received. Your preferred service provider has been contacted. Someone will get back to you shortly",
            },
            topic: renterSupportTicketTopic,
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
///////project update///////////
exports.materialsAdded = functions.firestore
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
exports.acceptOrDenyOwnerTeam = functions.https.onCall(
  async (data, context) => {
    var teamName = data.teamName;
    var uid = data.uid;
    var sendingUsersName = data.sendingUsersName;
    var acceptOrDenyTeamOwnerTopic = "acceptOrDenyOwnerTeam";
    var companyName;

    console.log("team name:", teamName, "user uid:", uid);

    const snapshot_1 = await admin
      .firestore()
      .collection("user")
      .where("user_id", "==", uid)
      .get();

    snapshot_1.forEach((doc) => {
      companyName = doc.data().companyName;
    });

    console.log("company named to be matched with team name", companyName);

    if (teamName == companyName) {
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
            admin
              .messaging()
              .subscribeToTopic(tokens, acceptOrDenyTeamOwnerTopic)
              .then((response) => {
                // See the MessagingTopicManagementResponse reference documentation
                // for the contents of response.
                console.log("Successfully subscribed to topic:", response);
              })
              .catch((error) => {
                console.log("Error subscribing to topic:", error);
              });
            const permissionMessage = {
              notification: {
                title: "Accept or Deny",
                body: `${sendingUsersName} added you to their team`,
              },
              topic: acceptOrDenyTeamOwnerTopic,
            };

            console.log("message should show here", permissionMessage);
            return admin
              .messaging()
              .send(permissionMessage)
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
  }
);
exports.acceptOrDenySPTeam = functions.https.onCall(async (data, context) => {
  var teamName = data.teamName;
  var uid = data.uid;
  var sendingUsersName = data.sendingUsersName;
  var acceptOrDenyTeamSPTopic = "acceptOrDenySPTeam";
  var companyName;

  console.log("team name:", teamName, "user uid:", uid);

  const snapshot_1 = await admin
    .firestore()
    .collection("user")
    .where("user_id", "==", uid)
    .get();

  snapshot_1.forEach((doc) => {
    companyName = doc.data().companyName;
  });

  console.log("company named to be matched with team name", companyName);

  if (teamName == companyName) {
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
          admin
            .messaging()
            .subscribeToTopic(tokens, acceptOrDenyTeamSPTopic)
            .then((response) => {
              // See the MessagingTopicManagementResponse reference documentation
              // for the contents of response.
              console.log("Successfully subscribed to topic:", response);
            })
            .catch((error) => {
              console.log("Error subscribing to topic:", error);
            });
          const permissionMessage = {
            notification: {
              title: "Accept or Deny",
              body: `${sendingUsersName} added you to their team`,
            },
            topic: acceptOrDenyTeamSPTopic,
          };

          console.log("message should show here", permissionMessage);
          return admin
            .messaging()
            .send(permissionMessage)
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
exports.teamAcceptedInvitation = functions.https.onCall(
  async (data, context) => {
    var teamName = data.teamName;
    // var uid = data.uid;
    var teamAcceptedInvitationTopic = "teamAcceptedInvitation";

    // admin.firestore().collection("OwnerTeams").where("teamName", "==", teamName).where("teamId", "==", uid).get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     doc.ref.update({
    //       status: "declined"
    //     })
    //   });
    // })
    // .catch((error) => {
    //   console.log("Error getting documents: ", error);
    // });

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
          admin
            .messaging()
            .subscribeToTopic(tokens, teamAcceptedInvitationTopic)
            .then((response) => {
              // See the MessagingTopicManagementResponse reference documentation
              // for the contents of response.
              console.log("Successfully subscribed to topic:", response);
            })
            .catch((error) => {
              console.log("Error subscribing to topic:", error);
            });
          const teamAcceptedInvitationMessage = {
            notification: {
              title: "Invite Accepted",
              body: `${teamName} accepted your invitation`,
            },
            topic: teamAcceptedInvitationTopic,
          };

          console.log(
            "message should show here",
            teamAcceptedInvitationMessage
          );

          return admin
            .messaging()
            .send(teamAcceptedInvitationMessage)
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
);
exports.spStartEstimateAccepted = functions.https.onCall(
  async (data, context) => {
    console.log("data from the client", data);
    var date = data.date;
    var startToday = data.startToday;
    var assetNetwork = [];
    var ownerName = "";

    var assetAddress = "";

    var SPAcceptedInvitationTopic = "SPAcceptedInvitation";

    await admin
      .firestore()
      .collection("Assets")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          assetAddress = doc.data().fullAddress;
          assetNetwork = doc.data().assetNetwork;
          assetNetworkId = doc.data().assetNetworkId;
        });
      });

    for (const member of assetNetwork) {
      if (member.perspective == "owner") {
        ownerName = member.name;
      }
    }

    if (startToday == true) {
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
            admin
              .messaging()
              .subscribeToTopic(tokens, SPAcceptedInvitationTopic)
              .then((response) => {
                // See the MessagingTopicManagementResponse reference documentation
                // for the contents of response.
                console.log("Successfully subscribed to topic:", response);
              })
              .catch((error) => {
                console.log("Error subscribing to topic:", error);
              });
            const SPAcceptedInvitationMessage = {
              notification: {
                title: "You're approved to begin your estimate",
                body: `the owner ${ownerName} approved for you start your estimate at ${assetAddress}`,
              },
              topic: SPAcceptedInvitationTopic,
            };

            console.log(
              "message should show here",
              SPAcceptedInvitationMessage
            );

            return admin
              .messaging()
              .send(SPAcceptedInvitationMessage)
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
  }
);
exports.spStartEstimateDenied = functions.https.onCall(
  async (data, context) => {
    var teamName = data.teamName;
    // var uid = data.uid;
    var SPDeniedInvitationTopic = "SPDeniedInvitation";

    // admin.firestore().collection("OwnerTeams").where("teamName", "==", teamName).where("teamId", "==", uid).get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     doc.ref.update({
    //       status: "declined"
    //     })
    //   });
    // })
    // .catch((error) => {
    //   console.log("Error getting documents: ", error);
    // });

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
          admin
            .messaging()
            .subscribeToTopic(tokens, SPDeniedInvitationTopic)
            .then((response) => {
              // See the MessagingTopicManagementResponse reference documentation
              // for the contents of response.
              console.log("Successfully subscribed to topic:", response);
            })
            .catch((error) => {
              console.log("Error subscribing to topic:", error);
            });
          const SPDeniedInvitationMessage = {
            notification: {
              title: "Invite Denied",
              body: `${teamName} denied your invitation`,
            },
            topic: SPDeniedInvitationTopic,
          };

          console.log("message should show here", SPDeniedInvitationMessage);

          return admin
            .messaging()
            .send(SPDeniedInvitationMessage)
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
);
exports.teamDeclinedInvitation = functions.https.onCall(
  async (data, context) => {
    var teamName = data.teamName;
    // var uid = data.uid;
    var teamDeclinedInvitationTopic = "teamDeclinedInvitation";

    // admin.firestore().collection("OwnerTeams").where("teamName", "==", teamName).where("teamId", "==", uid).get().then((querySnapshot) => {
    //   querySnapshot.forEach((doc) => {
    //     doc.ref.update({
    //       status: "declined"
    //     })
    //   });
    // })
    // .catch((error) => {
    //   console.log("Error getting documents: ", error);
    // });

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
          admin
            .messaging()
            .subscribeToTopic(tokens, teamDeclinedInvitationTopic)
            .then((response) => {
              // See the MessagingTopicManagementResponse reference documentation
              // for the contents of response.
              console.log("Successfully subscribed to topic:", response);
            })
            .catch((error) => {
              console.log("Error subscribing to topic:", error);
            });
          const teamDeclinedInvitationMessage = {
            notification: {
              title: "Invited Declined",
              body: `${teamName} accepted your invitation`,
            },
            topic: teamDeclinedInvitationTopic,
          };

          console.log(
            "message should show here",
            teamDeclinedInvitationMessage
          );
          return admin
            .messaging()
            .send(teamDeclinedInvitationMessage)
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
);
exports.customerAcceptedInvitation = functions.https.onCall(
  async (data, context) => {
    var customerName = (data.firstName, data.lastName);
    var uid = data.uid;
    admin
      .firestore()
      .collection("Customers")
      .where("customerName", "==", customerName)
      .where("userId", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            status: "accepted",
          });
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }
);
exports.customerDeniedInvitation = functions.https.onCall(
  async (data, context) => {
    var customerName = (data.firstName, data.lastName);
    var uid = data.uid;
    admin
      .firestore()
      .collection("Customers")
      .where("customerName", "==", customerName)
      .where("userId", "==", uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            status: "declined",
          });
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }
);
exports.completedJobAccepted = functions.https.onCall(async (data, context) => {
  var estimateDocId = data.estimateDocId;
  var uid = data.uid;
  var ticketData;
  console.log("estimateDocID", estimateDocId, "uid", uid);
  await admin
    .firestore()
    .collection("SPSupportTickets")
    .where("docId", "==", estimateDocId)
    .where("spId", "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("doc,.data", doc.data());
        ticketData = doc.data();
        doc.ref.update({
          status: "accepted",
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
});
exports.completedJobDenied = functions.https.onCall(async (data, context) => {
  var estimateDocId = data.estimateDocId;
  var uid = data.estimate;
  await admin
    .firestore()
    .collection("SPSupportTickets")
    .where("docId", "==", estimateDocId)
    .where("spId", "==", uid)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.update({
          status: "declined",
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
});
exports.givePointsOnTeamReferrall = functions.firestore
  .document("/SPSupportTickets/{userId}")
  .onUpdate(async (change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();
    const pointsTopic = "pointsUpdatedTopic";
    var teamMemberName = "";
    var firstName = "";
    var lastName = "";
    var points = 0;
    var users = [];
    var dbPromises = [];
    var fullName = [];

    for (const c of data.checkListItems) {
      for (i of c.teamMembers) {
        teamMemberName = i.name;
        console.log(
          "should have access to the team members array now",
          teamMemberName
        );
      }
    }

    if (data.wouldReferTeam === true) {
      console.log("points can be provided");

      admin
        .firestore()
        .collection("user")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            firstName = doc.data().firstName;
            lastName = doc.data().lastName;
            if (teamMemberName === `${firstName} ${lastName}`) {
              console.log("time to add points");
              admin
                .firestore()
                .collection("user")
                .get()
                .then((snapshot) =>
                  snapshot.forEach((doc) => {
                    points = doc.data().points;
                    doc.ref.update({ points: points + 50 });
                  })
                );
            }
          });
        });

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
            .subscribeToTopic(tokens, pointsTopic)
            .then((response) => {
              // See the MessagingTopicManagementResponse reference documentation
            })
            .catch((error) => {
              console.log(error);
            });

          const message = {
            notification: {
              title: "Project Completed",
              body: `Your team ${teamMemberName} at,${data.address} has completed the project.`,
            },
            topic: pointsTopic,
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
exports.referredTeam = functions.https.onCall(async (data, context) => {
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
          wouldReferTeam: true,
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
});
exports.didNotReferTeam = functions.https.onCall(async (data, context) => {
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
          wouldReferTeam: false,
        });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
});
exports.storeAdded = functions.firestore
  .document("/Store/{storeId}")
  .onCreate(async (snap, context) => {
    const storeData = snap.data();
    var storeAddedTopic = "storeCreated";
    var tokenUid;
    var storeId = storeData.storeId;

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

          if (tokenUid === storeId) {
            admin
              .messaging()
              .subscribeToTopic(tokens, storeAddedTopic)
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
                title: "New Store Created",
                body: `Your store ${storeData.name} has been added.`,
              },
              topic: storeAddedTopic,
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
exports.newsArticleUrlAdded = functions.firestore
  .document("/NewsCollection/{newsUrl}")
  .onCreate(async (snap, context) => {
    const articleData = snap.data();
    var newsArticleUrlAddedTopic = "articleCreated";
    var tokenUid;
    var articleId = articleData.articleId;

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

          if (tokenUid === articleId) {
            admin
              .messaging()
              .subscribeToTopic(tokens, newsArticleUrlAddedTopic)
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
                title: "New Article Added",
                body: `Your link: ${articleData.newUrl} has been successfully submitted.`,
              },
              topic: newsArticleUrlAddedTopic,
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
exports.messageNotifications = functions.database
  .ref("/messages/{messageId}")
  .onWrite(async (change, context) => {
    var nodeKey = change.after.key;

    var messageTopic = "messageTopic";

    console.log(
      "current group chat uid",
      nodeKey,
      "currently logged in user",
      context.auth.uid
    );

    if (nodeKey.includes(context.auth.uid)) {
      const snapshot = await admin.firestore().collection("tokens").get();
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
        .subscribeToTopic(tokens, messageTopic)
        .then((response) => {})
        .catch((error) => {
          console.log(error);
        });
      const message_1 = {
        notification: {
          title: "New Message Received",
          body: "Check your chat box to view the message",
        },
        topic: messageTopic,
      };
      console.log("this is the message", message_1);
      try {
        const response_1 = await admin.messaging().send(message_1);
        // Response is a message ID string.
        console.log("Successfully sent message:", response_1);
      } catch (error_1) {
        console.log("Error sending message:", error_1);
      }
    }
  });
exports.InformAboutAvailableTeams = functions.firestore
  .document("PublicTeams/{teamId}")
  .onCreate(async (snapshot, context) => {
    const value = snapshot.data();

    const teamName = value.teamName;
    const teamCity = value.city;
    var users = [];
    var availableTeamTopic = "availableTeams";
    var firstName, lastName;

    var dbPromises = [];

    dbPromises.push(admin.firestore().collection("user").get());

    const promiseConst = await Promise.all(dbPromises);

    promiseConst.forEach((qs) => {
      if (qs.size > 0) {
        if (qs.query._queryOptions.collectionId == "user") {
          Promise.all(
            qs.docs.map((doc) => {
              firstName = doc.data().firstName;
              lastName = doc.data().lastName;
              users.push(doc.data());
            })
          );
        }
      } else {
        return;
      }
    });

    console.log("team city", teamCity);

    var usersInSameCityAsTeam = users.filter((user) => user.city == teamCity);

    console.log(
      "All users in the same city as the team",
      usersInSameCityAsTeam
    );

    for (var users of usersInSameCityAsTeam) {
      var userCity = "";
      userCity = users.city;
      if (userCity == teamCity) {
        console.log("users in the city are:", firstName, lastName);
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
              admin
                .messaging()
                .subscribeToTopic(tokens, availableTeamTopic)
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
                  title: "New team avaialble in your area!",
                  body: `${teamName} is in your area, explore their services today!`,
                },
                topic: availableTeamTopic,
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
            }
          });
      }
    }
  });

exports.invoiceMade = functions.firestore
  .document("/SPSupportTickets/{userId}")
  .onUpdate(async (change, context) => {
    const data = change.after.data();
    const addedTopic = "invoiceAdded";

    if (data.employeeRates.length > 0 && data.materials.length > 0) {
      await admin.firestore().collection("Invoice").add({
        createdOn: data.createdOn,
        isEmergency: data.isEmergency,
        jobType: data.jobType,
        address: data.address,
        customerSatisfied: data.customerSatisfied,
        room: data.room,
        problemDescription: data.problemDescription,
        numberOfLaborers: data.numberOfLaborers,
        numberOfHours: data.numberOfHours,
        rate: data.rate,
        laborType: data.laborType,
        estimatedAmount: data.estimatedAmount,
        estimatedStartDate: data.estimatedStartDate,
        time: data.time,
        matrials: data.materials,
        employeeRates: data.employeeRates,
      });

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
              title: "SPSupport ticket invoice added",
              body: "An invoice has been added from the creation of a sp support ticket.",
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

exports.benificialOwnerToAssets = functions.firestore
  .document("Assets/{teamId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    var topic = "benificialOwnerInfo";

    var user = {};

    await admin
      .firestore()
      .collection("user")
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (data.assetOwnerId == doc.data().user_id) {
            user = doc.data();
            doc.ref.update({
              isBeneficialOwner: true,
            });
          }
        });
      });

    var beneficialOwner = {
      firstName: user.firstName,
      lastName: user.lastName,
      dateOfBirth: "3/27/1993",
      ssn: "123-45-6789",
      address: {
        address: user.address,
        city: user.city,
        stateProvidenceRegion: user.state,
        country: "usa",
        postalCode: user.zip,
      },
    };

    snapshot.ref.update({
      beneficalOwnerInfo: beneficialOwner,
    });

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

        const benificialOwnerToAssets = {
          notification: {
            title: "Assets collection has been updated",
            body: "A Benificial owner has been added to an asset",
          },
          topic: topic,
        };

        console.log(benificialOwnerToAssets);

        return admin
          .messaging()
          .send(benificialOwnerToAssets)
          .then((response) => {
            // Response is a message ID string.
            console.log("Successfully sent message:", response);
          })

          .catch((error) => {
            console.log("Error sending message:", error);
          });
      });
  });

exports.bankAccountAdded = functions.firestore
  .document("/user/{userId}")
  .onUpdate(async (change, context) => {
    const data = change.after.data();
    const topic = "bankAccountAdded";
    var accountNumber = "";
    var routingNumber = "";
    var accountType = "";
    var name = "";
    var accountRequestBody = {
      accountNumber: accountNumber,
      routingNumber: routingNumber,
      accountType: accountType,
      name: name,
    };

    // console.log('inside the console.log for the axios method', accountData, accountData.status)

    for (var c of data.bankAccountInfo) {
      accountNumber = c.accountNumber;

      accountRequestBody.accountNumber = c.accountNumber;
      accountRequestBody.routingNumber = c.routingNumber;
      accountRequestBody.accountType = c.accountType;
      accountRequestBody.name = c.name;
    }

    await axios
      .post("http://127.0.0.1:4041/add-bank", accountRequestBody)
      .then((response) => {
        console.log("res", response);
      })
      .catch((error) => {
        console.log("error", error);
      });

    console.log("this is the accountNumber", accountNumber);

    const myString = accountNumber.substr(accountNumber.length - 4);
    console.log("this is inside the function");
    if (data.bankAccountInfo.length > 0) {
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

          const addedbankAccount = {
            notification: {
              title: "New bank Account infromation added",
              body: `your acccount ending in ${myString} has been added to your profile.`,
            },
            topic: topic,
          };

          console.log(addedbankAccount);

          return admin
            .messaging()
            .send(addedbankAccount)
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
exports.cardAdded = functions.firestore
  .document("/user/{userId}")
  .onUpdate(async (change, context) => {
    const data = change.after.data();
    const topic = "cardAdded";
    var cardNumber = "";

    for (var c of data.bankCardInfo) {
      console.log("c", c);
      cardNumber = c.cardNumber;
    }

    console.log("this is the accountNumber", cardNumber);

    const myString = cardNumber.substr(cardNumber.length - 4);

    if (data.bankCardInfo.length > 0) {
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

          const cardAdded = {
            notification: {
              title: "New card infromation added",
              body: `your card ending in ${myString} has been added to your profile.`,
            },
            topic: topic,
          };

          console.log(cardAdded);

          return admin
            .messaging()
            .send(cardAdded)
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
exports.bankAccountinfoVerified = functions.firestore
  .document("/user/{userId}")
  .onUpdate(async (change, context) => {
    const data = change.after.data();
    const topic = "bankAccountinfoVerified";
    var accountNumber;
    var verified = data.bankAccountInfo.accountVerified;

    if (data.bankAccountInfo == undefined) {
      return;
    }

    for (var c of data.bankAccountInfo) {
      console.log("c", c);
      accountNumber = c.accountNumber;
    }

    console.log("this is the accountNumber", accountNumber);
    const myString = accountNumber.substr(accountNumber.length - 4);
    if (verified == true) {
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

          const bankAccountVerified = {
            notification: {
              title: "New bank Account infromation added",
              body: `your acccount ending in ${myString} has been verified.`,
            },
            topic: topic,
          };

          console.log(bankAccountVerified);

          return admin
            .messaging()
            .send(bankAccountVerified)
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

exports.bankAccountinfoNotVerified = functions.firestore
  .document("/user/{userId}")
  .onUpdate(async (change, context) => {
    const data = change.after.data();
    const topic = "bankAccountinfoNotVerified";
    var accountNumber;
    var verified = data.bankAccountInfo.accountVerified;

    if (data.bankAccountInfo == undefined) {
      return;
    }
    for (var c of data.bankAccountInfo) {
      console.log("c", c);
      accountNumber = c.accountNumber;
    }

    console.log("this is the accountNumber", accountNumber);
    const myString = accountNumber.substr(accountNumber.length - 4);
    if (verified == false) {
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

          const bankAccountinfoNotVerified = {
            notification: {
              title: "New bank Account infromation added",
              body: `your acccount ending in ${myString} has not been verified.`,
            },
            topic: topic,
          };

          console.log(bankAccountinfoNotVerified);

          return admin
            .messaging()
            .send(bankAccountinfoNotVerified)
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

exports.updateUserProfileImage = functions.firestore
.document("/user/{teamId}")
.onCreate((snapshot, context) => {
	const value = snapshot.data();

	console.log("document reference", snapshot.ref);

	var image = value.profileImage;

	if (image.includes(".png")) {
		var image = image.split(".png");
		var splitImage = image[0];

		console.log("split image", splitImage);

		var desiredPNGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/UserProfileImages/${splitImage}_250x250.png`;
		console.log("png", desiredPNGImage);
		return snapshot.ref.update({ userProfileImage: desiredPNGImage });
	} else if (image.includes(".jpg")) {
		var image = image.split(".jpg");
		var splitImage = image[0];

		console.log("split image", splitImage);

		var desiredJPGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/UserProfileImages/${splitImage}_250x250.jpg`;
		console.log("jpg", desiredJPGImage);
		return snapshot.ref.update({ userProfileImage: desiredJPGImage });
	} else if (image.includes(".jpeg")) {
		var image = image.split(".jpeg");
		var splitImage = image[0];

		console.log("split image", splitImage);

		var desiredJPEGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/UserProfileImages/${splitImage}_250x250.jpeg`;
		console.log("jpeg", desiredJPEGImage);
		return snapshot.ref.update({ userProfileImage: desiredJPEGImage });
	}
});
exports.updateStoreProfileImage = functions.firestore
	.document("/Store/{teamId}")
	.onCreate((snapshot, context) => {
		const value = snapshot.data();

		console.log("document reference", snapshot.ref);

		var image = value.profileImage;

		if (image.includes(".png")) {
			var image = image.split(".png");
			var splitImage = image[0];

			console.log("split image", splitImage);

			var desiredPNGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/StorefrontProfileImages/${splitImage}_250x250.png`;
			console.log("png", desiredPNGImage);
			return snapshot.ref.update({ storeProfileImage: desiredPNGImage });
		} else if (image.includes(".jpg")) {
			var image = image.split(".jpg");
			var splitImage = image[0];

			console.log("split image", splitImage);

			var desiredJPGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/StorefrontProfileImages/${splitImage}_250x250.jpg`;
			console.log("jpg", desiredJPGImage);
			return snapshot.ref.update({ storeProfileImage: desiredJPGImage });
		} else if (image.includes(".jpeg")) {
			var image = image.split(".jpeg");
			var splitImage = image[0];

			console.log("split image", splitImage);

			var desiredJPEGImage = `https://storage.googleapis.com/testapp-ddf1a.appspot.com/StorefrontProfileImages/${splitImage}_250x250.jpeg`;
			console.log("jpeg", desiredJPEGImage);
			return snapshot.ref.update({ storeProfileImage: desiredJPEGImage });
		}
	})


