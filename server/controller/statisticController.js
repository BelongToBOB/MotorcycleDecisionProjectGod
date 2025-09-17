const prisma = require("../config/prisma");

exports.overview = async (req, res) => {
  try {
    const histories = await prisma.recommendhistory.findMany({
      include: { user: true }, // ✅ ดึง user มาด้วย
    });

    const types = await prisma.mototype.findMany();
    const typeMap = {};
    types.forEach((t) => (typeMap[t.moto_type_id] = t.moto_type_name));

    // ตัวนับ
    const typeCount = {},
      brandCount = {},
      priceCount = {},
      modelCount = {};

    for (const h of histories) {
      if (h.selectedType) {
        typeCount[h.selectedType] = (typeCount[h.selectedType] || 0) + 1;
      }

      let criteria = {};
      try {
        criteria = JSON.parse(h.criteria);
      } catch {}

      if (criteria.brand)
        brandCount[criteria.brand] = (brandCount[criteria.brand] || 0) + 1;
      if (criteria.price)
        priceCount[criteria.price] = (priceCount[criteria.price] || 0) + 1;

      // ✅ result เก็บเป็น array → ดึง index 0
      let result = [];
      try {
        result = JSON.parse(h.result);
      } catch {}
      if (Array.isArray(result) && result.length > 0) {
        const best = result[0];
        if (best?.moto_name) {
          modelCount[best.moto_name] = (modelCount[best.moto_name] || 0) + 1;
        }
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
      .map((h) => {
        let criteria = {};
        let result = [];
        try {
          criteria = JSON.parse(h.criteria);
        } catch {}
        try {
          result = JSON.parse(h.result);
        } catch {}
        return {
          history_id: h.history_id,
          user: h.user ? { username: h.user.username } : null, // ✅ ดึง username ด้วย
          selectedType: typeMap[h.selectedType] || h.selectedType,
          criteria,
          result,
          createdAt: h.createdAt,
        };
      });

    // แปลง type
    const typeCountNamed = {};
    for (const [tid, count] of Object.entries(typeCount)) {
      typeCountNamed[typeMap[tid] || tid] = count;
    }

    res.json({
      topModels,
      typeCount: typeCountNamed,
      brandCount,
      priceCount,
      latest,
    });
  } catch (err) {
    console.error("Statistic error", err);
    res.status(500).json({ message: "Server Error" });
  }
};
