const prisma = require('../config/prisma');

// สำหรับ User ส่งข้อความ
exports.create = async (req, res) => {
  try {
    console.log("📩 message body:", req.body); 
    console.log("👤 user:", req.user);         
    const user_id = req.user.user_id; 
    const { name, email, tel, content } = req.body;
    if (!name || !email || !content) return res.status(400).json({ message: 'Missing required fields' });

    const msg = await prisma.message.create({
      data: { name, email, tel, content, user_id } // 🔁 ใช้ user_id
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
      include: { user: true } // ✅ ไม่มีอะไรต้องเปลี่ยน
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Load failed', err });
  }
};

// สำหรับแอดมินลบ message
exports.remove = async (req, res) => {
  try {
    await prisma.message.delete({
      where: { message_id: Number(req.params.id) } // 🔁 เปลี่ยน id → message_id ถ้าใน schema ปรับแล้ว
    });
    res.send("Delete Success");
  } catch (err) {
    res.status(500).json({ message: "Delete Failed" });
  }
};
