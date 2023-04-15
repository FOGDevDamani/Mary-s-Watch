const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");
const Client = require("dwolla-v2").Client;
var cors = require("cors");

import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": CLIENT_ID,
      "PLAID-SECRET": SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

const app = express();
const port = 4042;


app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("src"));

app.get("/", function (req, res) {
  res.send(`listening on port ${port}`);
});

app.post("/plaid_exchange", (req, res) => {
  var public_token = req.body.public_token;

  return plaidClient
    .itemPublicTokenExchange({ public_token })
    .then((tokenResponse) => tokenResponse.access_token)
    .then((accessToken) => plaidClient.accountsGet({ accessToken }))
    .then((accountsResponse) => console.log(accountsResponse.accounts))
    .catch((error) => {
      const err = error.response.data;

      // Indicates plaid API error
      console.error("/exchange token returned an error", {
        error_type: err.error_type,
        error_code: err.error_code,
        error_message: err.error_message,
        display_message: err.display_message,
        documentation_url: err.documentation_url,
        request_id: err.request_id,
      });

      // Inspect error_type to handle the error in your application
      switch (err.error_type) {
        case "INVALID_REQUEST":
          // ...
          break;
        case "INVALID_INPUT":
          // ...
          break;
        case "RATE_LIMIT_EXCEEDED":
          // ...
          break;
        case "API_ERROR":
          // ...
          break;
        case "ITEM_ERROR":
          // ...
          break;
        default:
        // fallthrough
      }

      res.sendStatus(500);
    });
});
