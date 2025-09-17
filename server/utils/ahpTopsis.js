// ahp and Topsis

function ahpWeights(matrix) {
  const n = matrix.length;

  const columnSums = [];
  for (let col = 0; col < n; col++) {
    let sum = 0;
    for (let row = 0; row < n; row++) {
      sum += matrix[row][col]; 
    }
    columnSums.push(sum);
  }

  const normalizedMatrix = [];
  for (let row = 0; row < n; row++) {
    const normalizedRow = [];
    for (let col = 0; col < n; col++) {
      const normalizedValue = matrix[row][col] / columnSums[col];
      normalizedRow.push(normalizedValue);
    }
    normalizedMatrix.push(normalizedRow);
  }

  const weights = [];
  for (let row = 0; row < n; row++) {
    const rowSum = normalizedMatrix[row].reduce((sum, val) => sum + val, 0);
    const average = rowSum / n;
    weights.push(average);
  }

  return weights; 
}


// directions: true=benefit(มากดี), false=cost(น้อยดี)
function topsisRank(items, criterias, weights, directions) {
  const numItems = items.length;
  const numCriteria = criterias.length;

  const matrix = [];
  for (let i = 0; i < numItems; i++) {
    const row = [];
    for (let j = 0; j < numCriteria; j++) {
      const value = Number(items[i][criterias[j]]);
      row.push(value);
    }
    matrix.push(row);
  }

  const normFactors = [];
  for (let j = 0; j < numCriteria; j++) {
    let sumSquares = 0;
    for (let i = 0; i < numItems; i++) {
      sumSquares += matrix[i][j] ** 2;
    }
    normFactors[j] = Math.sqrt(sumSquares);
  }

  const normalizedMatrix = [];
  for (let i = 0; i < numItems; i++) {
    const row = [];
    for (let j = 0; j < numCriteria; j++) {
      row.push(matrix[i][j] / normFactors[j]);
    }
    normalizedMatrix.push(row);
  }

  const weightedMatrix = [];
  for (let i = 0; i < numItems; i++) {
    const row = [];
    for (let j = 0; j < numCriteria; j++) {
      row.push(normalizedMatrix[i][j] * weights[j]);
    }
    weightedMatrix.push(row);
  }

  const ideal = [];
  const nadir = [];

  for (let j = 0; j < numCriteria; j++) {
    const column = weightedMatrix.map(row => row[j]);
    if (directions[j]) {
      ideal[j] = Math.max(...column); // benefit → มากดี
      nadir[j] = Math.min(...column);
    } else {
      ideal[j] = Math.min(...column); // cost → น้อยดี
      nadir[j] = Math.max(...column);
    }
  }

  const scores = [];

  for (let i = 0; i < numItems; i++) {
    let plusDist = 0;
    let minusDist = 0;

    for (let j = 0; j < numCriteria; j++) {
      plusDist += (weightedMatrix[i][j] - ideal[j]) ** 2;
      minusDist += (weightedMatrix[i][j] - nadir[j]) ** 2;
    }

    plusDist = Math.sqrt(plusDist);
    minusDist = Math.sqrt(minusDist);

    const score = minusDist / (plusDist + minusDist);
    scores.push(score);
  }

  const result = items.map((item, i) => ({
    ...item,
    score: scores[i]
  }));

  result.sort((a, b) => b.score - a.score); // เรียงจากมาก → น้อย

  return result;
}


module.exports = { ahpWeights, topsisRank };
