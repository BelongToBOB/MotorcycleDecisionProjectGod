const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')

// GET /api/admin    (list แอดมินทุกคน)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'admin' }
    })
    res.json(admins)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// GET /api/admin/:id   (ดูแอดมิน 1 คน)
exports.getAdminById = async (req, res) => {
  try {
    const admin = await prisma.user.findUnique({
      where: { id: Number(req.params.id) }
    })
    if (!admin || admin.role !== 'admin') return res.status(404).json({ message: 'Not found' })
    res.json(admin)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// PUT /api/admin/:id   (อัปเดตแอดมิน)
exports.updateAdmin = async (req, res) => {
    try {
      const { username, email, phone, address, picture, password } = req.body;
      const dataToUpdate = { username, email, phone, address, picture };
  
      if (password) {
        const hashPassword = await bcrypt.hash(password, 10);
        dataToUpdate.password = hashPassword;
      }
      await prisma.user.update({
        where: { id: Number(req.params.id) },
        data: dataToUpdate,
      });
      res.send("Update Success");
    } catch (err) {
      res.status(500).json({ message: "Update Failed" });
    }
  };

// DELETE /api/admin/:id   (ลบแอดมิน)
exports.deleteAdmin = async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: Number(req.params.id) }
    })
    res.json({ message: 'ลบสำเร็จ' })
  } catch (err) {
    res.status(400).json({ message: 'ลบไม่สำเร็จ' })
  }
}
