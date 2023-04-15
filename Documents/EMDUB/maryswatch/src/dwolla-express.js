const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const FormData = require("form-data");
const Client = require("dwolla-v2").Client;
var cors = require("cors");
const app = express();
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173'
  })
);

const os = require("os");
const fs = require("fs");
const { pathToFileURL } = require("url");
const desktopDir = path.join(os.homedir(), "Downloads");
const pathToFile = path.join(desktopDir, "workbench.jpg");


const dwolla = new Client({
  key: "D2j5ysqjCu7NFCmfNzlQiNNDLIwalXI3j2IfGntuWxk6pTi9m5",
  secret: "KNPtIUS4FzafWeStRKM8iQtv9bqGr2ruCu5jIbdMWiCpGywfTL",
  environment: "sandbox", // defaults to 'production'
});

const ENVIRONMENT = {
  sandbox: "https://api-sandbox.dwolla.com",
  production: "https://api.dwolla.com",
};
const port = 4041;
const env = "sandbox";

var accountFundingSourceUrl = "";
var accountRootUrl = ""

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("src"));

app.get("/", function (req, res) {
  res.send(`listening on port ${port}`);

  // Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
  dwolla.get("/").then((res) => accountRootUrl = res.body._links.account.href); // => 'https://api-sandbox.dwolla.com/accounts/96c67399-76e3-4c18-a896-603d696a067f'
});

app.get("/create-customer", function (req, res) {
  generateClientToken("customer.create").then((cRes) => {
    res.status(200).render(`create-customer`, { token: cRes.token });
  });
});

app.post("/create-business-verified-customer", function (req, res) {
  console.log(req.body);
  dwolla
    .post("customers", req.body)
    .then((res) => console.log(res.headers.get("location")));
}),
  app.get("/upgrade-customer", function (req, res) {
    generateClientToken(
      "customer.update",
      "0c8bafa5-45ab-4282-8916-cae984ceb147"
    ).then((cRes) => {
      const customer = {
        // This body is hard coded, and will need to be replaced in your implementation
        id: "0c8bafa5-45ab-4282-8916-cae984ceb147",
        firstName: "Jane",
        lastName: "Doe",
        email: "email14@email.com",
      };
      res
        .status(200)
        .render(`upgrade-customer`, { customer, token: cRes.token });
    });
  });

app.get("/upload-document", function (req, res) {
  dwolla
    .post("customers", {
      // This body is hard coded, and will need to be replaced in production
      type: "personal",
      firstName: "document",
      lastName: "hodgins",
      email: `${Math.random()}email12@email.com`,
      address1: "726 Evergreen Terrace",
      city: "Springfield",
      state: "OR",
      postalCode: "32817",
      dateOfBirth: "1990-03-22",
      ssn: "1111",
    })

    .then(function (customerRes) {
      const customerId = customerRes.headers
        .get("location")
        .split("/")
        .slice(-1)[0];
      generateClientToken("customer.documents.create", customerId).then(
        (cRes) => {
          const customer = {
            id: customerId,
          };
          res.status(200).render(`document`, { customer, token: cRes.token });
        }
      );
    });
});

// This example lets you select an existing customer to upload a document
app.get("/upload-document-for-existing-customer", function (req, res) {
  generateClientToken(
    "customer.documents.create",
    "26981bca-7a80-4d04-9d21-4c5f44eaef6e"
  ).then((cRes) => {
    // This body is hard coded, and will need to be replaced in your implementation
    const customer = {
      id: "26981bca-7a80-4d04-9d21-4c5f44eaef6e",
    };
    res.status(200).render(`document`, { customer, token: cRes.token });
  });
});

app.get("/personal-vcr-flow", function (req, res) {
  generateClientToken("customer.update", "customerId").then((cRes) => {
    const customer = {
      id: "customerId",
      firstName: "",
      lastName: "",
      email: "",
    };
    res.status(200).render(`personal-vcr`, { customer, token: cRes.token });
  });
});

app.get("/business-vcr-flow", function (req, res) {
  res.status(200).render(`business-vcr`, {});
});

app.get("/beneficial-owners", function (req, res) {
  //TODO: Add option to submit customerId from input on client-side
  dwolla
    .post("customers", {
      // This body is hard coded, and will need to be replaced in production
      firstName: "Account",
      lastName: "Admin",
      email: `${Math.random()}email@email.com`,
      type: "business",
      address1: "99-99 33rd St",
      city: "Some City",
      state: "NY",
      postalCode: "11101",
      controller: {
        firstName: "Jane",
        lastName: "Controller",
        title: "CEO",
        dateOfBirth: "1980-01-31",
        ssn: "1234",
        address: {
          address1: "1234 Main st",
          address2: "Apt 12",
          city: "Des Moines",
          stateProvinceRegion: "IA",
          postalCode: "50309",
          country: "US",
        },
      },
      businessClassification: "9ed38155-7d6f-11e3-83c3-5404a6144203",
      businessType: "llc",
      businessName: "Jane Doe Corp",
      ein: "12-3456789",
    })
    .then(function (customerRes) {
      const customerId = customerRes.headers
        .get("location")
        .split("/")
        .slice(-1)[0];
      res.status(200).render(`beneficial-owners`, { customerId });
    });
});

app.get("/balance-display", function (req, res) {
  generateClientToken(
    "customer.fundingsources.read",
    "640e5978-c099-45e2-b3c6-3eef9dd773f7"
  ).then((cRes) => {
    const customer = {
      id: "640e5978-c099-45e2-b3c6-3eef9dd773f7",
      firstName: "mya",
      lastName: "mya",
      email: "mya@mya.com",
    };
    res.status(200).render(`balance`, { customer, token: cRes.token });
  });
});

app.get("/payin-flow", function (req, res) {
  //TODO: Replace with sample API call chain
  const body = {
    action: "customer.transfers.send",
    _links: {
      customer: {
        href: "http://api-sandbox.dwolla.com/customers/4594a375-ca4c-4220-a36a-fa7ce556449d",
        type: "application/vnd.dwolla.v1.hal+json",
        "resource-type": "customer",
      },
      destination: {
        href: "http://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4",
        type: "application/vnd.dwolla.v1.hal+json",
        "resource-type": "funding-source",
      },
    },
    amount: {
      currency: "USD",
      value: "1.01",
    },
  };
  generateClientTokenWithBody(body).then((cRes) => {
    res.status(200).render(`payin`, { blob: cRes.blob, token: cRes.token });
  });
});

app.get("/iav", function (req, res) {
  res.status(200).render("iav");
});

app.post("/add-bank", function (req, res) {
  console.log(req.body);
  var requestBody = {
    routingNumber: req.body.routingNumber,
    accountNumber: req.body.accountNumber,
    bankAccountType: req.body.accountType,
    name: req.body.name,
  };

  console.log(requestBody);

  var customerUrl =
    "https://api-sandbox.dwolla.com/customers/cd45110c-b007-4d68-a1a8-962b3d143d11";
  dwolla.post(`${customerUrl}/funding-sources`, requestBody).then((res) => {
    accountFundingSourceUrl = res.headers.get("location");
    console.log(accountFundingSourceUrl);
  });
});

app.get("/initiate-micro-deposits", function (req, res) {
  var fundingSourceUrl = accountFundingSourceUrl;

  dwolla.post(`${fundingSourceUrl}/micro-deposits`);
});

app.get("/retrieve-account-transfers", function (req, res) {
  var accountUrl =
    "https://api-sandbox.dwolla.com/accounts/96c67399-76e3-4c18-a896-603d696a067f";

  dwolla
    .get(`${accountUrl}/transfers`)
    .then((res) => console.log(res.body._embedded["transfers"]));
});

app.get("/send-to-funding-source", function (req, res) {
  // var customerUrl =
  //   "https://api-sandbox.dwolla.com/customers/cd45110c-b007-4d68-a1a8-962b3d143d11";

  // dwolla
  //   .get(`${customerUrl}/funding-sources?removed=false`)
  //   .then((res) =>
  //     console.log(
  //       res.body._embedded,
  //       res.body._embedded["funding-sources"][0].name
  //     )
  //   );

  // var accountUrl =
  //   "https://api-sandbox.dwolla.com/accounts/96c67399-76e3-4c18-a896-603d696a067f";

  // dwolla
  //   .get(`${accountUrl}/funding-sources?removed=false`)
  //   .then(function (res) {
  //     console.log(
  //       res.body._embedded,
  //       res.body._embedded["funding-sources"][0].name
  //     ); // => 'ABC Bank Checking'
  //   });

  var fundingSourceUrl =
    "https://api-sandbox.dwolla.com/funding-sources/079081f4-6827-4a57-87eb-c583da3cc311";

  var destinationSourceUrl =
    "https://api-sandbox.dwolla.com/funding-sources/f6d614ba-bc30-4d3c-9a1a-0a2f1f8da49e";

  var transferRequest = {
    _links: {
      source: {
        href: destinationSourceUrl,
      },
      destination: {
        href: fundingSourceUrl,
      },
    },
    amount: {
      currency: "USD",
      value: "1500.00",
    },
  };

  dwolla
    .post("transfers", transferRequest)
    .then(function (res) {
			console.log(res)
      res.headers.get("location"); // => 'https://api-sandbox.dwolla.com/transfers/d76265cd-0951-e511-80da-0aa34a9b2388'
    })
    .then();
});

app.post("/pay-for-items", function (req, res) {
  // var customerUrl =
  // "https://api-sandbox.dwolla.com/customers/cd45110c-b007-4d68-a1a8-962b3d143d11";

  // dwolla
  // .get(`${customerUrl}/funding-sources?removed=false`)
  // .then((res) => console.log(res.body._embedded["funding-sources"][0].name));

  // var accountUrl =
  // "https://api-sandbox.dwolla.com/accounts/96c67399-76e3-4c18-a896-603d696a067f";

  // dwolla.get(`${accountUrl}/funding-sources?removed=false`).then(function (res) {
  //   console.log(res.body, res.body._embedded["funding-sources"][0].name); // => 'ABC Bank Checking'
  // });

	const amount = req.body.amount

	const materialsEstimateTotalSplit = req.body.materialsTotal.split('$')
	const materialsEstimateTotal = materialsEstimateTotalSplit[1]

	const total = parseInt(amount) + parseFloat(materialsEstimateTotal, 16)


  var fundingSourceUrl =
    "https://api-sandbox.dwolla.com/funding-sources/079081f4-6827-4a57-87eb-c583da3cc311";

  var destinationSourceUrl =
    "https://api-sandbox.dwolla.com/funding-sources/a18d21b3-2bfb-4856-b501-ea7fe04fe837";
	
		var requestBody = {
			_links: {
				source: {
					href: destinationSourceUrl,
				},
				destination: {
					href: fundingSourceUrl,
				},
			},
			amount: {
				currency: "USD",
				value: total,
			},
			metadata: {
				paymentId: "12345678",
				note: "payment for completed work Dec. 1",
			},
			clearing: {
				destination: "next-available",
			},
			correlationId: "8a2cdc8d-629d-4a24-98ac-40b735229fe2",
		};

		dwolla
			.post("transfers", requestBody)
			.then((res) => console.log(res.headers.get("location")))
			.catch(err => console.log(err.body._embedded));
});

app.get("/collect-signatures", async function (req, res) {
	const form = new FormData();
  form.append("DisableExpiryAlert", "false");
  form.append("ReminderSettings.ReminderDays", "3");
  form.append("BrandId", "");
  form.append("ReminderSettings.ReminderCount", "5");
  form.append("EnableReassign", "true");
  form.append("Message", "Please sign this.");
  form.append(
    "Signers",
    '{\n  "name": "Damani",\n  "emailAddress": "mwdamani@gmail.com",\n  "formFields": [\n    {\n      "fieldType": "Signature",\n      "pageNumber": 1,\n      "bounds": {\n        "x": 100,\n        "y": 100,\n        "width": 100,\n        "height": 50\n      },\n      "isRequired": true\n    }\n  ]\n}'
  );
  form.append("ExpiryDays", "10");
  form.append("EnablePrintAndSign", "false");
  form.append("AutoDetectFields", "false");
  form.append("OnBehalfOf", "");
  form.append("EnableSigningOrder", "false");
  form.append("UseTextTags", "false");
  form.append("SendLinkValidTill", "");
  form.append("Files", pathToFile, "workbench.jpg");
  form.append("Title", "Agreement");
  form.append("HideDocumentId", "false");
  form.append("EnableEmbeddedSigning", "false");
  form.append("ExpiryDateType", "Days");
  form.append("ReminderSettings.EnableAutoReminder", "false");
  form.append("ExpiryValue", "60");
  form.append("DisableEmails", "false");

  await axios.post(
    "https://api.boldsign.com/v1/document/send",
    form,
    {
      headers: {
        ...form.getHeaders(),
        accept: "application/json",
        "X-API-KEY": "ZTMxN2I1M2EtZjIwOC00Y2Q1LTllZDItNDUzNzc1MWU3MGYy",
        "Content-Type": "multipart/form-data",
      },
    }
  )
	.then(async res => {
		const docId = res.data.documentId
		const response = await axios
      .get("https://api.boldsign.com/v1/document/properties", {
        params: {
          documentId: docId,
        },
        headers: {
          accept: "application/json",
          "X-API-KEY": "ZTMxN2I1M2EtZjIwOC00Y2Q1LTllZDItNDUzNzc1MWU3MGYy",
        },
      })
      .catch((error) => console.log("error", error));
	})
	.catch(error => console.log(error))
})

app.post("/document-details", async function (req, res) {
	const id = Object.keys(req.body);
  const templateId = id[0];
	await axios
    .post(
      "https://esignatures.io/api/contracts?token=5b0516cf-553f-40b1-8db6-b5177df3bb07",
      {
        template_id: `${templateId}`,
        signers: [
          {
            name: "Damani Turner",
            email: "damani_turner93@yahoo.com",
          },
          {
            name: "Raymond Fowler",
            email: "raymondfowler2.0@gmail.com",
          },
          {
            name: "Brian Turner",
            email: "saturnbflymw@gmail.com",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(async (response) => {
      console.log(response.data);
      // const res = await axios
      //   .post("https://maryswatch.com/custom-mw-webhook", {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   })
      //   .catch((error) => console.log(error));
      // console.log(
      //   res.json({
      //     message: "Success!",
      //     payload: req.payload,
      //     response: response.data,
      //   })
      // );
    })
    .catch((error) => console.log(error));
})

app.post("/create-template", async function (req, res) {
	const amount = Object.keys(req.body);
	const cashPayment = amount[0];
	console.log(cashPayment);
  await axios
    .post(
      "https://esignatures.io/api/templates?token=5b0516cf-553f-40b1-8db6-b5177df3bb07",
      {
        title: "Signature for Cash Payment",
        document_elements: [{ type: "text_header_one", text: `Confirmation of cash payment of amount: $${cashPayment}` }],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then(async (response) => {
      await axios
        .post('http://localhost:4041/document-details', response.data.data.template_id)
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));
});

app.post("/retrieve-customer-accounts", function (req, clientRes) {
	console.log(req.body)
	// const accountNameArray = Object.getOwnPropertyNames(req.body)
	// const dwollaAccountName = accountNameArray[0]
  dwolla
    .get("customers", { limit: 10 })
    .then((response) => {
			const customer = response.body._embedded["customers"].filter(customer => 'Account Admin' == `${customer.firstName} ${customer.lastName}`)
			const customerUrl = customer[0]._links.self.href
			axios.post("http://localhost:4041/retrieve-funding-source", customerUrl)
			.then((internalRes) => {
				const verifiedFundingSources = internalRes.data.filter(fundingSource => fundingSource.status == "verified")
				clientRes.send(verifiedFundingSources)
			});
		})
		.catch((error) => {
			return error
		});
});

app.post("/retrieve-funding-source-balances", function (req, res) {
	for(const fundingSourceUrl of req.body)  {
		dwolla
			.get(`${fundingSourceUrl}/balance`)
			.then((internalRes) =>res.send(internalRes.body.balance.value));
	}
});

app.post("/retrieve-funding-source", function (req, res) {
  const fundingSourceArray = Object.getOwnPropertyNames(req.body);
  const dwollaFundingSource = fundingSourceArray[0];
	console.log(dwollaFundingSource)
  dwolla
    .get(`${dwollaFundingSource}/funding-sources`)
    .then((response) => res.send(response.body._embedded["funding-sources"]));
});



app.post("/micro-deposits", function (req, res) {
  console.log(req.body);
  var fundingSourceUrl = accountFundingSourceUrl;

  dwolla.post(`${fundingSourceUrl}/micro-deposits`, req.body);
});

app.get("/styles/:sheet", function (req, res) {
  res.sendFile(path.join(__dirname, `/static/styles/${req.params.sheet}`));
});

app.post("/tokenUrl", function (req, res) {
  generateClientTokenWithBody(req.body).then((cRes) => {
    res.send({ token: cRes.token });
  });
});

function generateClientToken(action, customerId) {
  const url = `/client-tokens`;
  const body = {
    action: action,
  };

  if (customerId) {
    body._links = {
      customer: {
        href: `${ENVIRONMENT[env]}/customers/${customerId}`,
      },
    };
  }

  return dwolla
    .post(url, body)
    .then((response) => {
      return response.body;
    })
    .catch((error) => {
      return error;
    });
}

function generateClientTokenWithBody(body) {
  const url = `/client-tokens`;

  return dwolla
    .post(url, body)
    .then((response) => {
      return response.body;
    })
    .catch((error) => {
      return error;
    });
}

function createFundingSourceToken() {
  var customerUrl =
    "https://api-sandbox.dwolla.com/customers/cd45110c-b007-4d68-a1a8-962b3d143d11";

  dwolla.post(`${customerUrl}/funding-sources-token`).then((res) => {
    console.log(res.body.token);
  });
}

function createCardFundingSourceToken() {
  var customerUrl =
    "https://api-sandbox.dwolla.com/customers/cd45110c-b007-4d68-a1a8-962b3d143d11";

  dwolla
    .post(`${customerUrl}/card-funding-sources-token`)
    .then((res) => console.log(res.body.token));
}

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);


