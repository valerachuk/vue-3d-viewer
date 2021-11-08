import { multiplyMatrices } from '@math-services';

export class MatrixContext {
  static get Identity () {
    return new MatrixContext([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  constructor (columnMajorArray) {
    this.columnMajorArray = columnMajorArray;
    this.ROWS = 4;
    this.COLUMNS = 4;
  }

  toRowMajor () {
    const columnMajorArray = [];
    for (let i = 0; i < this.COLUMNS; i++) {
      for (let j = 0; j < this.ROWS; j++) {
        columnMajorArray[j + i * this.ROWS] = this.getAt(j, i);
      }
    }
    return columnMajorArray;
  }

  getAt (column, row) {
    return this.columnMajorArray[row + column * this.ROWS];
  }

  setAt (column, row, value) {
    this.columnMajorArray[row + column * this.ROWS] = value;
  }

  multiply (matrixB) {
    ({ columnMajorArray: this.columnMajorArray } = multiplyMatrices(this, matrixB));
  }

  premultiply (matrixA) {
    ({ columnMajorArray: this.columnMajorArray } = multiplyMatrices(matrixA, this));
  }
}
