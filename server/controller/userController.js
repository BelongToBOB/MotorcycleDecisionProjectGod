const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.listUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'user' },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        enable: true,
        picture: true,
        phone: true
      }
    });
    res.json(users);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        gender: true,
        birthDate: true,
        occupation: true,
        role: true,
        enable: true,
        picture: true,
        phone: true,
        address: true
      }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { username, firstName, lastName, email, gender, birthDate, phone, occupation, address, picture, password } = req.body;
    const dataToUpdate = { username, firstName, lastName, email, gender, phone, occupation, address, picture };

    if (birthDate) dataToUpdate.birthDate = new Date(birthDate);
    if (password) dataToUpdate.password = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: dataToUpdate,
    });
    res.send("Update Success");
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Update Failed" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.send("Delete Success");
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Delete Failed" });
  }
};

exports.me = async (req, res) => {
  try {
    const userId = req.user?.id; // <-- ต้องมี req.user.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        gender: true,
        birthDate: true,
        occupation: true,
        role: true,
        enable: true,
        picture: true,
        phone: true,
        address: true
      }
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("ME Error", err);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.updatePicture = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // อัปโหลดไฟล์ไป Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_pics'
    });

    // เอา url ที่ได้มา save ใน db
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { picture: result.secure_url }
    });

    res.json({ picture: result.secure_url });
  } catch (err) {
    console.error("Update picture error:", err);
    res.status(500).json({ message: 'Upload failed', err });
  }
};




