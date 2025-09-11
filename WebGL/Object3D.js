

class Attribute {

    /**
     * 构造一个 attribute，渲染时对应一个 vbo
     * 
     * @param {Array|TypedArray} array 数据列表
     * @param {int} item_size 每项的元素数量
     * @param {string} type 数据类型 float? int?
     */
    constructor(array, item_size, type)
    {
        Attribute.prototype.isAttribute = true;

        if (!type in Attribute.creator)
            throw TypeError(`Attribute: 不支持的数据类型 ${type}`);
        this.type = type;

        if (!ArrayBuffer.isView(array)) {
            this.array = Attribute.creator[type](array);
        } else {
            this.array = array;
        }

		this.item_size = item_size;
		this.count = array.length / item_size;
        this.length = array.length;

        this.vbo = null;
    }

    static creator = {
        float: function(array) {
            return new Float32Array(array);
        }
    }
}

class Object3D {

    /**
     * 实例计数
     */
    static instance_count = 0;

    #id;


    constructor(name)
    {
        Object3D.prototype.isObject3D = true;

        // 名字可能不唯一
        this.name = (name !== undefined) ? name : '';
        this.#id = Object3D.instance_count;
        Object3D.instance_count++;

        this.attributes = {};
        this.render = null;
        this.vao = null;
    }

    get id()
    {
        return this.#id;
    }

    /**
     * 设置属性
     * @param {string} name 属性名称
     * @param {TypedArray} array 数据列表
     * @param {int} item_size 每项的元素数量
     * @param {string} type 数据类型 float? int?
     * @returns 实例本身
     */
    setAttribute(name, array, item_size, type)
    {
        this.attributes[name] = new Attribute(array, item_size, type);
        return this;
    }

}


export { Attribute, Object3D };


