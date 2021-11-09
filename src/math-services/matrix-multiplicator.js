import { MatrixContext } from '@math-services';

function computeElementAt (matrixContextA, matrixContextB, i, j) {
  let sum = 0;
  for (let r = 0; r < matrixContextA.COLUMNS; r++) {
    sum += matrixContextA.getAt(i, r) * matrixContextB.getAt(r, j);
  }
  return sum;
}

export function multiplyMatrices (matrixContextA, matrixContextB) {
  const resultMatrixContext = new MatrixContext([]);

  for (let i = 0; i < matrixContextA.ROWS; i++) {
    for (let j = 0; j < matrixContextB.COLUMNS; j++) {
      resultMatrixContext.setAt(i, j, computeElementAt(matrixContextA, matrixContextB, i, j));
    }
  }

  return resultMatrixContext;
}
