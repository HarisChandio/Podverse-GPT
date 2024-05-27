require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors')
app.use(cors())
app.use(express.json());
const userRouter = require("./routes/user");
const podRouter = require("./routes/podcast")
const { dbConnect } = require("./db/db");
const PodcastIndexClient = require("podcastdx-client");
const {Podcast} = require("./db/models/Podcast");
const {User} = require("./db/models/User");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/podcast", podRouter)

app.listen(3001, async () => {
  await dbConnect();
  console.log("server running on port 3000");
});
