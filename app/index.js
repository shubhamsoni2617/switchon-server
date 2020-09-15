const express = require("express");
require("./mongoose");
const cors = require("cors");
const path = require("path");
const errorHandlers = require("./handlers/errorHandlers");
const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());
app.use(express.static("../switchon-client/build"));

app.use(require("./routes/user"));
app.use(require("./routes/form"));
app.use(function (req, res) {
  res.sendFile(path.join(__dirname, "../../switchon-client/build/index.html"));
});
app.use(errorHandlers.notFound);
app.use(errorHandlers.mongoseErrors);
if (process.env.ENV === "DEVELOPMENT") {
  app.use(errorHandlers.developmentErrors);
} else {
  app.use(errorHandlers.productionErrors);
}

const server = app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

require("./socket")(server);
