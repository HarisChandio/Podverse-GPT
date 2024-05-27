const express = require("express");
const router = express.Router();
const z = require("zod");
const { User } = require( "../db/models/User");
const { Podcast } = require("../db/models/Podcast");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {authMiddleware }= require("../middleware/auth");


const signupBody = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

router.post("/signup", async (req, res) => {
  console.log(
    "Signup Route",
    req.body.username,
    req.body.email,
    req.body.password
  )
  try {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Email already taken / wrong inputs",
      });
    }

    const existingUser = await User.findOne({ username: req.body.username });

    if (existingUser)
      return res.status(411).json({
        message: "User already Exists",
      });

    //const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const userId = user._id;

    
    const token = jwt.sign({ userId }, process.env.JWT_SECRET);

    return res.status(200).json({
      message: "User created Successfully",
      token: token,
      username: user.username,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while sign up, server error",
    });
  }
});

const signinBody = z.object({
  email: z.string(),
  password: z.string(),
});

router.post("/signin", async (req, res) => {
  console.log("Signin Route", req.body.email, req.body.password);
  try {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Incorrect Inputs",
      });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    // const passwordMatch = await bcrypt.compare(
    //   req.body.password,
    //   user.password
    // );
    if (user.password != req.body.password)
      return res.status(401).json({ message: "Password not correct" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      message: "logged In",
      token: token,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while loggin in, Server error",
    });
  }
});

const updateBody = z.object({
  password: z.string().optional(),
  username: z.string().optional(),
});

router.put("/user", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) return res.status(411).json({ message: "Wrong Input" });
  console.log(req.userId);
  await User.findByIdAndUpdate(req.userId, req.body);
  res.json({
    message: "Updated successfully",
  });
});



module.exports = router;
