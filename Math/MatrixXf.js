
class MatrixXf {

    /**
     * 一个m行n列的Float32矩阵,初始为单位矩阵,列排列
     * @param {int} m 矩阵行数 
     * @param {int} n 矩阵列数
     */
	constructor(m, n)
    {
        this.elements = new Float32Array(m * n);
        this.ncols = n;
        this.nrows = m;
        this.isRowOrder = false;

        this.identity();
    }

    /**
     * 返回矩阵中第 i 行，j 列的元素索引
     * @param {int} i 
     * @param {int} j 
     */
    idx(i, j)
    {
        return i + j * this.nrows;
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
                this.elements[this.idx(i, j)] = (i == j) ? 1 : 0;
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
        this.elements[this.idx(i, j)] = v;
        return this;
    }

    /**
     * 以矩阵的形式打印
     */
    printMatrix() {
        let str = "";
        for (let i = 0; i < this.nrows; i++) {
            let rowStr = '';
            for (let j = 0; j < this.ncols; j++) {
                // 计算当前元素在数组中的索引
                let index = i + j * this.nrows;
                rowStr += this.elements[index] + '\t'; 
            }
            str  += rowStr + "\n";
        }
        console.log(str);
    }
}

export { MatrixXf };

