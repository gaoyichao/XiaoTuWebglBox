
class MatrixXf {

    /**
     * 一个m行n列的Float32矩阵,初始为单位矩阵
     * @param {int} m 矩阵行数 
     * @param {int} n 矩阵列数
     */
	constructor(m, n) {
        this.elements = new Float32Array(m * n);
        this.ncols = n;
        this.nrows = m;
        this.isRowOrder = false;

        this.identity();
    }

    /**
     * 单位化矩阵
     * 
     * 若矩阵为方阵(nrows == ncols)则返回的是一个单位矩阵
     * 若(nrows != ncols)则只有元素 a_ii == 1
     * 
     * @returns 对象本身
     */
    identity() {
        for (var i = 0; i < this.nrows; i++) {
            for (var j = 0; j < this.ncols; j++) {
                if (this.isRowOrder)
                    this.elements[i * this.ncols + j] = (i == j) ? 1 : 0;
                else
                    this.elements[i + j * this.nrows] = (i == j) ? 1 : 0;
            }
        }

        return this;
    }

    /**
     * 填充矩阵的每个元素
     * @param fArray 填充内容,若为一个number则矩阵中的每个元素都被赋予相同的值
     *                       若为"object"则判定输入的是一个同样大小的矩阵
     * @returns 对象本身
     */
    fill(fArray) {
        if ("number" == typeof fArray) {
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i] = fArray;
            }
        } else if ("object" == typeof fArray) {
            if (this.elements.length != fArray.length) {
                console.log("数据长度不一致!");
                return this;
            }
            for (var i = 0; i < this.elements.length; i++) {
                this.elements[i] = fArray[i];
            }
        }
        return this;
    }

    /**
     * 设置第i行第j列的元素值为v
     * @param {float} v 目标值
     * @param {int} i 行索引
     * @param {int} j 列索引
     * @returns 对象本身
     */
    setElementAt(v, i, j) {
        if (this.isRowOrder)
            this.elements[i*this.ncols + j] = v;
        else
            this.elements[i + j*this.nrows] = v;
        return this;
    }
}

export { MatrixXf };

