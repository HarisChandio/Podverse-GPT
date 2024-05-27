const mongoose = require("mongoose");

const podcastSchema = new mongoose.Schema({
  podindex: {type: String, required: true},
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  transcript: { type: String },
  summary: { type: String },
  img: { type: String, required: true },
  mp3: { type: String, required: true },
  duration: { type: Number },
  published: {type: Number},
});

const Podcast = mongoose.model("Podcasts", podcastSchema);

module.exports = {Podcast};
