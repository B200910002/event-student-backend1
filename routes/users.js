const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/middleware');
const { User, userSchema } = require('../models/User.model');
const { Role, roleSchema } = require('../models/UserRole.model');

/* GET users listing. */
router.get('/', protect, async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

router.get('/roles', async (req, res, next) => {
  const roles = await Role.find();
  res.status(200).json(roles);
})

/* POST users listing. */
router.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, role, password } = req.body;
    const token = await User.register(firstName, lastName, email, phone, role, password);
    res.status(201).json({ token });
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

router.post("/upload-picture", protect, (req, res, next) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were upload.");
  }

  sampleFile = req.files.photo;
  uploadPath = process.cwd() + "/public/images/" + sampleFile.name;

  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
    res.send(process.env.LOCAL_HOST_PORT + "public/images/" + sampleFile.name);
  });
});

/* PUT users listing. */
router.put("/edit/:userId", protect, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, profile, email, phone, about } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, profile, email, phone, about },
      { new: true }
    );
    res.status(200).json(user);
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
    res.status(400).json({ error: e.message });
  }
});

/* PATCH users listing. */
router.delete("/:userId", protect, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const repsonse = await User.findByIdAndDelete(userId);
    res.status(200).json(repsonse);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
});

module.exports = router;
