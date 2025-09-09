
import { DataTypeId } from './Constants.js'

/**
 * 通用类型的矩阵, 按列排列
 */
class Matrix {
    constructor()
    {
        this.elements = [];
        this.ncols = 0;
        this.nrows = 0;
    }

    /**
     * 
     * @returns 元素数量
     */
    num_elements()
    {
        let num = this.ncols * this.nrows;
        if (num != this.elements.length)
            throw RangeError(`${num} != ${this.elements.length}`);
        return num;
    }

    /**
     * 返回矩阵中第 i 行j 列的元素索引
     * @param {int} i 行索引
     * @param {int} j 列索引
     * @returns 元素索引
     */
    idx(i, j)
    {
        if (i >= this.nrows)
            throw RangeError(`行数越界 ${i}:${this.ncols}`);
        if (j >= this.ncols)
            throw RangeError(`列数越界 ${j}:${this.ncols}`);
        return i + j * this.nrows;
    }

    /**
     * 返回矩阵中第 i 行 j 列的元素
     * @param {int} i 行索引
     * @param {int} j 列索引
     * @returns 元素
     */
    get(i, j)
    {
        return this.elements[this.idx(i, j)];
    }

    /**
     * 设置第 i 行第 j 列的元素值为v
     * @param {int} i 行索引
     * @param {int} j 列索引
     * @param {number} v 值
     * @returns 对象本身
     */
    set(i, j, v) {
        this.elements[this.idx(i, j)] = v;
        return this;
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

/**
 * 一个 4x4 的矩阵,初始为单位矩阵,列排列
 * 
 * 目前只支持浮点数, float, double
 */
class Matrix4 extends Matrix {
    constructor(typeid = DataTypeId.FLOAT)
    {
        super();

        switch(typeid) {
            case DataTypeId.FLOAT: {
                this.elements = new Float32Array(16);
                break;
            }
            case DataTypeId.DOUBLE: {
                this.elements = new Float64Array(16);
                break;
            }
            default: {
                throw TypeError("不支持的数据类型");
                break;
            }
        }

        this.typeid = typeid;
        this.ncols = 4;
        this.nrows = 4;

        this.identity();
    }

    /**
     * 设置平移量
     * 
     * @param {number} x 平移向量 x 分量
     * @param {number} y 平移向量 y 分量
     * @param {number} z 平移向量 z 分量
     * @param {number} k 补充齐次 k
     * @returns 矩阵本身
     */
	setPosition( x, y, z, k = 1)
    {
        this.set(0, 3, x);
        this.set(1, 3, y);
        this.set(2, 3, z);
        this.set(3, 3, k);
		return this;
	}

}

export { Matrix4 };

