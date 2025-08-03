const prisma = require('../config/prisma');

exports.create = async (req, res) => {
  try {
    const user_id = req.user?.user_id; 
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

    const { selectedType, priority, criteria, result } = req.body;
    if (!priority || !criteria || !result) return res.status(400).json({ message: 'Missing data' });

    const history = await prisma.recommendhistory.create({
      data: {
        user_id,
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
    const user_id = req.user?.user_id;
    if (!user_id) return res.status(401).json({ message: 'Unauthorized' });

    const histories = await prisma.recommendhistory.findMany({
      where: { user_id },
      orderBy: { createdAt: 'desc' }
    });

    res.json(histories.map(h => ({
      ...h,
      priority: JSON.parse(h.priority),
      criteria: JSON.parse(h.criteria),
      result: JSON.parse(h.result)
    })));
  } catch (err) {
    // console.error('ERROR in /mine:', err);
    res.status(500).json({ message: 'Server Error', err });
  }
};

/**
 * ดึงทั้งหมด (admin เท่านั้น)
 * GET /api/history
 */
exports.listAll = async (req, res) => {
  try {
    const histories = await prisma.recommendhistory.findMany({
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
