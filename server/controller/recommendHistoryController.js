const prisma = require('../config/prisma');

exports.create = async (req, res) => {
  try {
    // ต้อง login, req.user.id จาก auth middleware
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // จาก frontend ส่งมาทั้งหมด
    const { selectedType, priority, criteria, result } = req.body;
    if (!priority || !criteria || !result) return res.status(400).json({ message: 'Missing data' });

    // เก็บเป็น stringified JSON (เพื่อง่ายต่อการอ่าน/สถิติ)
    const history = await prisma.recommendHistory.create({
      data: {
        userId,
        selectedType: selectedType ? Number(selectedType) : null,
        priority: JSON.stringify(priority),
        criteria: JSON.stringify(criteria),
        result: JSON.stringify(result)
      }
    });
    res.status(201).json(history);
  } catch (err) {
    console.error('SAVE HISTORY ERROR:', err);
    res.status(500).json({ message: 'Server Error', err });
  }
};

/**
 * ดึงประวัติของ user คนเดียว
 * GET /api/history/mine
 */
exports.listMine = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const histories = await prisma.recommendHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    // parse JSON กลับเป็น object
    res.json(histories.map(h => ({
      ...h,
      priority: JSON.parse(h.priority),
      criteria: JSON.parse(h.criteria),
      result: JSON.parse(h.result)
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server Error', err });
  }
};

/**
 * ดึงทั้งหมด (admin เท่านั้น)
 * GET /api/history
 */
exports.listAll = async (req, res) => {
  try {
    // คุณอาจจะต้องเช็ค role ตรงนี้ (ถ้าเป็น admin)
    const histories = await prisma.recommendHistory.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(histories.map(h => ({
      ...h,
      priority: JSON.parse(h.priority),
      criteria: JSON.parse(h.criteria),
      result: JSON.parse(h.result)
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server Error', err });
  }
};
