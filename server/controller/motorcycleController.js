const prisma = require('../config/prisma');

function toNumberFields(data) {
  return {
    ...data,
    moto_price: data.moto_price ? Number(data.moto_price) : null,
    moto_cc: data.moto_cc ? Number(data.moto_cc) : null,
    moto_weight: data.moto_weight ? Number(data.moto_weight) : null,
    maintenance_cost: data.maintenance_cost ? Number(data.maintenance_cost) : null,
    consumption_rate: data.consumption_rate ? Number(data.consumption_rate) : null,
    moto_type_id: Number(data.moto_type_id), 
    moto_view: data.moto_view !== undefined ? Number(data.moto_view) : 0,
    fuel_size: data.fuel_size ? Number(data.fuel_size) : null
  };
}

// GET /api/motorcycle
exports.list = async (req, res) => {
  try {
    const motorcycles = await prisma.motorcycle.findMany({
      include: { mototype: true } 
    });
    res.json(motorcycles);
  } catch (err) {
    console.error("Motorcycle list error:", err); 
    res.status(500).json({ message: 'Server Error' });
  }
};

// GET /api/motorcycle/:id
exports.get = async (req, res) => {
  try {
    const mc = await prisma.motorcycle.findUnique({
      where: { motorcycle_id: Number(req.params.id) }, 
      include: { mototype: true } // ✅
    });
    if (!mc) return res.status(404).json({ message: 'ไม่พบข้อมูล' });
    res.json(mc);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// POST /api/motorcycle
exports.create = async (req, res) => {
  try {
    let data = req.body;
    if (!data.moto_name || !data.moto_type_id) {
      return res.status(400).json({ message: 'กรอกข้อมูลให้ครบถ้วน' });
    }
    data = toNumberFields(data);

    const newMC = await prisma.motorcycle.create({ data });
    res.json(newMC);
  } catch (err) {
    console.error("Motorcycle Post error:", err); 
    res.status(500).json({ message: 'Server Error', err });
  }
};

// PUT /api/motorcycle/:id
exports.update = async (req, res) => {
  try {
    let data = toNumberFields(req.body);

    const mc = await prisma.motorcycle.update({
      where: { motorcycle_id: Number(req.params.id) }, 
      data
    });
    res.json(mc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', err });
  }
};

// DELETE /api/motorcycle/:id
exports.remove = async (req, res) => {
  try {
    await prisma.motorcycle.delete({
      where: { motorcycle_id: Number(req.params.id) } 
    });
    res.json({ message: 'Delete Success' });
  } catch (err) {
    if (err.code === 'P2003') {
      res.status(409).json({
        message: 'ไม่สามารถลบรถจักรยานยนต์นี้ได้ เนื่องจากมีข้อมูลอื่นที่อ้างอิงอยู่'
      });
    } else {
      res.status(500).json({ message: 'Server Error', error: err });
    }
  }
};
