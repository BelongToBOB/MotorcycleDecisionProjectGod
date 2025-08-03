const prisma = require('../config/prisma');

exports.overview = async (req, res) => {
  try {
    const histories = await prisma.recommendhistory.findMany({});
    const types = await prisma.mototype.findMany();
    const typeMap = {};
    types.forEach(t => typeMap[t.id] = t.moto_type_name);

    // เตรียมตัวแปรนับ
    const typeCount = {}, brandCount = {}, priceCount = {}, modelCount = {};
    const ccCount = {}, fuelCount = {}, fuelSizeCount = {}, maintenanceCount = {};

    for (const h of histories) {
      if (h.selectedType) typeCount[h.selectedType] = (typeCount[h.selectedType] || 0) + 1;

      let criteria = {};
      try { criteria = JSON.parse(h.criteria); } catch {}

      // นับทุก criteria field
      if (criteria.brand) brandCount[criteria.brand] = (brandCount[criteria.brand] || 0) + 1;
      if (criteria.price) priceCount[criteria.price] = (priceCount[criteria.price] || 0) + 1;
      if (criteria.cc) ccCount[criteria.cc] = (ccCount[criteria.cc] || 0) + 1;
      if (criteria.fuel) fuelCount[criteria.fuel] = (fuelCount[criteria.fuel] || 0) + 1;
      if (criteria.fuel_size) fuelSizeCount[criteria.fuel_size] = (fuelSizeCount[criteria.fuel_size] || 0) + 1;
      if (criteria.maintenance) maintenanceCount[criteria.maintenance] = (maintenanceCount[criteria.maintenance] || 0) + 1;

      let result = [];
      try { result = JSON.parse(h.result); } catch {}
      if (Array.isArray(result) && result.length > 0) {
        const best = result[0];
        if (best && best.moto_name) modelCount[best.moto_name] = (modelCount[best.moto_name] || 0) + 1;
      }
    }

    // top 5 models
    const topModels = Object.entries(modelCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([model, count]) => ({ model, count }));

    // top 10 latest
    const latest = histories
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(h => ({
        id: h.id,
        userId: h.userId,
        selectedType: typeMap[h.selectedType] || h.selectedType,
        criteria: (() => { try { return JSON.parse(h.criteria) } catch { return {} } })(),
        createdAt: h.createdAt
      }));

    // แปลงประเภท
    const typeCountNamed = {};
    for (const [tid, count] of Object.entries(typeCount)) {
      typeCountNamed[typeMap[tid] || tid] = count;
    }

    res.json({
      topModels,
      typeCount: typeCountNamed,
      brandCount,
      priceCount,
      ccCount,
      fuelCount,
      fuelSizeCount,
      maintenanceCount,
      latest
    });
  } catch (err) {
    console.error('Statistic error', err);
    res.status(500).json({ message: "Server Error" });
  }
};
