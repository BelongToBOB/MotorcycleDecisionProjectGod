const prisma = require('../config/prisma');

// สำหรับ User ส่งข้อความ
exports.create = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, tel, content } = req.body;
    if (!name || !email || !content) return res.status(400).json({ message: 'Missing required fields' });

    const msg = await prisma.message.create({
      data: { name, email, tel, content, userId }
    });
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ message: 'Send failed', err });
  }
};

// สำหรับแอดมิน ดู message ทั้งหมด
exports.list = async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Load failed', err });
  }
};

// สำหรับแอดมินลบ message
exports.remove = async (req, res) => {
  try {
    await prisma.message.delete({ where: { id: Number(req.params.id) } });
    res.send("Delete Success");
  } catch (err) {
    res.status(500).json({ message: "Delete Failed" });
  }
};
