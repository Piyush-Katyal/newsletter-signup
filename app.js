const express = require("express");
// require('dotenv').config({path: 'test.env'});
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/"+ process.env.MAILCHIMP_LIST_ID;

    var options = {
        method: "POST",
        auth: process.env.MAILCHIMP_API_KEY_AUTH
    }

    const rqst = https.request(url, options, function (response) {
        response.on("data", function (data) {
            var statusCode = response.statusCode;
            if (200<=statusCode & statusCode<=299){
                res.sendFile(__dirname + "/success.html");
            }
            else{
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });

    rqst.write(jsonData);
    rqst.end();
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is online at port : " + process.env.PORT);
});
