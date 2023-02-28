const express = require("express");
const app = express();
const https = require("https");
const port = 3000;
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", (req, res) => {
  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  var jsonData = JSON.stringify(data);
  const url = "https://us13.api.mailchimp.com/3.0/lists/286b9777a4";
  const options = {
    method: "POST",
    auth: "linneszyx1:505546821bfe883b02f5fd7e0c1b54ac-us13",
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});
app.post("/failure", (req, res) => {
  res.redirect("/");
});
app.listen(process.env.PORT || port, () => console.log(`App listening on port ${port}!`));
