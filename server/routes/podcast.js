const { Podcast } = require("../db/models/Podcast");
const router = require("express").Router();
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  console.log(filter);
  console.log("bulk hit")
  try {

    const podcasts = await Podcast.find({
      $or: [
        {
          title: {
            $regex: filter,
            $options: "i",
          },
        },
        {
          author: {
            $regex: filter,
            $options: "i",
          },
        },
        {
          description: {
            $regex: filter,
            $options: "i",
          },
        },
      ],
    });
    return res.status(200).json({
      podcast: podcasts.map((pod)=>(
        {

          _id: pod._id,
          title: pod.title,
          description: pod.description,
          author: pod.author,
          mp3: pod.mp3,
          image: pod.img,
          aws_id: pod.podindex
        }
      ))
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
