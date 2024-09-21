const { User, validate } = require("../Models/user");

const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

const registerRouter = router.post("/register", async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(400)
      .send("User using that email already exists. Please sign in instead");
  } else {
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
      });
      await user.save();
      return res.status(201).json(user);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
});

const loginRouter = router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate the request body
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }

    // Compare the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid email or password");
    }

    // Generate JWT token
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the token to the client
    res.status(200).send({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = { registerRouter, loginRouter };
