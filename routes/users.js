const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');
const { User, userSchema } = require('../models/User.model');

/* GET users listing. */
router.get('/', protect, async (req, res, next) => {
  const users = await User.find();
  res.send(users);
});

/* POST users listing. */
router.post('/register', async (req, res, next) => {
  try {
    const { firstname, lastName, email, phone, password } = req.body;
    const response = await User.register(firstname, lastName, email, phone, password);
    res.status(201).json("Register successfully you can login now");
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await User.login(email, password);
    res.status(200).json({ token });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

/* PUT users listing. */
router.put("/edit", protect, async (req, res, next) => {
  try {

    res.status(200).json({ token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

/* PATCH users listing. */
router.patch("/change-password", protect, async (req, res, next) => {
  try {
    const { oldPassword, newPassword, repeatNewPassword } = req.body;
    const repsonse = await User.changePassword(
      req.user,
      oldPassword,
      newPassword,
      repeatNewPassword
    );
    res.status(200).json(repsonse);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

module.exports = router;
