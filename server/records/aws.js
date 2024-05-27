require("dotenv").config();
const AWS = require("aws-sdk");
const Podcast = require("../db/models/Podcast");
const dbConnect = require("../db/db");
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESSKEY,
  secretAccessKey: process.env.AWS_SECRETKEY,
});

const s3 = new AWS.S3();
const bucketName = "myawschatpod";

async function listObjects() {
  try {
    const data = await s3.listObjects({ Bucket: bucketName }).promise();
    return data.Contents;
  } catch (error) {
    console.error("Error listing objects:", error);
    throw error;
  }
}

async function main() {
  try {
    await dbConnect();
    const s3Objects = await listObjects();
    for (let i = 0; i < s3Objects.length; i++) {
      const query = s3Objects[i].Key.split("/")[1].split(".")[0];
      const updatedPodcast = await Podcast.findOneAndUpdate(
        {
          podindex: query,
        },
        {
          transcript: `https://myawschatpod.s3.eu-north-1.amazonaws.com/${s3Objects[i].Key}`,
        },
        { new: true }
      );
      if (updatedPodcast)
        console.log(`Transcript URL added to podcast ${updatedPodcast.title}`);
      else console.log(`Podcast with podindex ${query} not found`);
    }
    console.log("Transcript URLs updated successfully.");
  } catch (error) {
    console.log("omain function error", error);
  }
}

main();
