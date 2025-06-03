// ahpTopsis.js
function ahpWeights(matrix) {
  const n = matrix.length;
  const colSums = matrix[0].map((_, j) => matrix.reduce((sum, row) => sum + row[j], 0));
  const norm = matrix.map(row => row.map((v, j) => v / colSums[j]));
  return norm.map(row => row.reduce((a, b) => a + b, 0) / n);
}

// directions: true=benefit(มากดี), false=cost(น้อยดี)
function topsisRank(items, criterias, weights, directions) {
  const matrix = items.map(item => criterias.map(c => Number(item[c])));
  const norm = matrix[0].map((_, j) => Math.sqrt(matrix.reduce((sum, row) => sum + (row[j] ** 2), 0)));
  const normalized = matrix.map(row => row.map((v, j) => v / norm[j]));
  const weighted = normalized.map(row => row.map((v, j) => v * weights[j]));
  const ideal = weighted[0].map((_, j) =>
    directions[j] ? Math.max(...weighted.map(r => r[j])) : Math.min(...weighted.map(r => r[j]))
  );
  const nadir = weighted[0].map((_, j) =>
    directions[j] ? Math.min(...weighted.map(r => r[j])) : Math.max(...weighted.map(r => r[j]))
  );
  const distances = weighted.map(row => ({
    plus: Math.sqrt(row.reduce((sum, v, j) => sum + (v - ideal[j]) ** 2, 0)),
    minus: Math.sqrt(row.reduce((sum, v, j) => sum + (v - nadir[j]) ** 2, 0))
  }));
  const scores = distances.map(d => d.minus / (d.plus + d.minus));
  return items.map((item, i) => ({ ...item, score: scores[i] })).sort((a, b) => b.score - a.score);
}

module.exports = { ahpWeights, topsisRank };
