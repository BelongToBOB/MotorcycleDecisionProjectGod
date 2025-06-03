const prisma = require('../config/prisma');

// GET /api/mototype 
exports.list = async (req, res) => {
  try {
    const types = await prisma.motoType.findMany();
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/mototype/:id 
exports.get = async (req, res) => {
  try {
    const type = await prisma.motoType.findUnique({
      where: { id: Number(req.params.id) }
    });
    if (!type) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(type);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/mototype 
exports.create = async (req, res) => {
  try {
    const { moto_type_name, picture } = req.body;
    if (!moto_type_name) return res.status(400).json({ message: 'กรุณาระบุชื่อประเภท' });

    const newType = await prisma.motoType.create({
      data: { moto_type_name, picture }
    });
    res.json(newType);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/mototype/:id 
exports.update = async (req, res) => {
  try {
    const { moto_type_name, picture } = req.body;
    if (!moto_type_name) return res.status(400).json({ message: 'กรุณาระบุชื่อประเภท' });

    const updated = await prisma.motoType.update({
      where: { id: Number(req.params.id) },
      data: { moto_type_name, picture }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// DELETE /api/mototype/:id 
exports.remove = async (req, res) => {
  try {
    await prisma.motoType.delete({
      where: { id: Number(req.params.id) }
    });
    res.json({ message: 'Delete Success' });
  } catch (err) {
    if (err.code === 'P2003') {
      res.status(409).json({
        message: 'ไม่สามารถลบประเภทนี้ได้ เนื่องจากมีรถจักรยานยนต์ที่ใช้ประเภทนี้อยู่'
      });
    } else {
      res.status(500).json({ message: 'Server Error', error: err });
    }
  }
}
