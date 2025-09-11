/**
 * @file webgl2的一些学习笔记和封装
 * @author 高乙超 <gaoyichao2013@126.com>
 */

import { Utils } from './Utils.js'
import { Attribute, Object3D } from './Object3D.js'

var _gl_type_map_ = {
    "float": WebGL2RenderingContext.FLOAT,
    "array_buffer": WebGL2RenderingContext.ARRAY_BUFFER
};

/**
 * WebGL2 渲染器
 */
class WebGL2Renderer {
    /**
     * 网页中的 canvas 对象
     */
    domElement = null;
    /**
     * WebGL 渲染上下文
     */
    gl = null;
    /**
     * GPU 中的渲染程序
     */
    program = null;

    /**
     * 构造函数
     */
    constructor(parameters = {}) {
        const {
            canvas = Utils.createCanvas("逗你玩"),
            width = 300,
            height = 300
        } = parameters;

        let gl = canvas.getContext("webgl2");
        if (!gl)
            throw new Error("不支持 webgl2");

        this.domElement = canvas;
        this.gl = gl;
        this.setSize(width, height);


        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /**
     * 画布宽度
     */
    width()  { return this.domElement.width; }
    /**
     * 画布高度
     */
    height() { return this.domElement.height; }
    /**
     * 设定画布大小
     * @param {int} width 画布宽度
     * @param {int} height 画布高度
     */
    setSize(width, height) {
        let canvas = this.domElement;
        let gl = this.gl;
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    /**
     * 用指定颜色清空画布
     * @param {float} r [0, 1]
     * @param {float} g [0, 1]
     * @param {float} b [0, 1]
     * @param {float} a [0, 1]
     */
    clearColor(r = 0.0, g = 0.0, b = 0.0, a = 1.0) {
        let gl = this.gl;
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    /**
     * 创建编译链接之后的渲染程序
     * @param {WebGLShader} vshader 编译之后的顶点着色器 Vertex Shader
     * @param {WebGLShader} fshader 编译之后的片元着色器 Fragment Shader
     * @return 渲染程序对象
     */
    createProgram(vshader, fshader) {
        let gl = this.gl;
        let program = gl.createProgram();
        if (!program)
            throw new Error('无法创建渲染程序');

        gl.attachShader(program, vshader);
        gl.attachShader(program, fshader);
        gl.linkProgram(program);

        let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!linked) {
            let error = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            gl.deleteShader(fshader);
            gl.deleteShader(vshader);
            throw new Error('链接错误: ' + error);
        }
        this.program = program;
        return program; 
    }

    /**
     * 创建编译链接之后的渲染程序
     * @param {string} vshader 顶点着色器源代码
     * @param {string} fshader 片元着色器源代码
     */
    createProgramFromSource(vshader, fshader) {
        let gl = this.gl;
        let vertexShader = Utils.createShader(gl, gl.VERTEX_SHADER, vshader);
        let fragmentShader = Utils.createShader(gl, gl.FRAGMENT_SHADER, fshader);

        if (!vertexShader || !fragmentShader)
            return null;

        return this.createProgram(vertexShader, fragmentShader);
    }

    /**
     * 创建编译链接之后的渲染程序
     * @param {string} vshader 顶点着色器源码链接
     * @param {string} fshader 片元着色器源码链接
     */
    createProgramFromUrl(vshader, fshader) {
        let vertexSource = Utils.loadShaderSource(vshader);
        let fragmentSource = Utils.loadShaderSource(fshader);

        console.log(vertexSource);
        console.log(fragmentSource);
        return this.createProgramFromSource(vertexSource, fragmentSource);
    }
    /*
     * 绑定数据@data到WebGL缓存，创建一个vbo对象
     *
     * @param data 缓存数据
     * @return WebGL缓存对象
     */
    bindArrayBuffer(data) {
        let gl = this.gl;
        let vBuffer = gl.createBuffer();

        if (!vBuffer)
            return null;

        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return vBuffer;
    }

    /**
     * 激活属性，创建一个 vao 对象
     * 
     * @param attrib 属性名称
     * @param itemSize 属性占用数据数量
     * @param type 数据类型, float?
     * @param stride 0 = move forward size * sizeof(type) each iteration to get the next position
     * @param offset start at the beginning of the buffer
     */
    activateAttribute(attrib, itemSize, type, stride = 0, offset = 0) {
        let gl = this.gl;
        let program = this.program;
        gl.useProgram(program);

        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        let location = gl.getAttribLocation(program, attrib);
        gl.vertexAttribPointer(location, itemSize, _gl_type_map_[type], false, stride, offset)
        gl.enableVertexAttribArray(location);
        return vao;
    }

    /**
     * 获取 shader 中所有 attribute 变量
     */
    getAllAtributes()
    {
        let gl = this.gl;
        let program = this.program;

        let num = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        let attr = {};

        for (let i = 0; i < num; i++) {
            let info = gl.getActiveAttrib(program, i);
            if (!info)
                continue;
            let location = gl.getAttribLocation(program, info.name);
            attr[info.name] = {
                idx: i,
                info: info,
                location: location
            };
        }
        return attr;
    }


    /**
     * 设置 uniform 变量
     * @param {string} name 变量名称 
     * @param {list} value 变量值
     */
    uniform4fv(name, value)
    {
        let gl = this.gl;
        let program = this.program;
        gl.useProgram(program);

        let offsetLoc = gl.getUniformLocation(program, name);
        gl.uniform4fv(offsetLoc, value);
    }

    /**
     * 设置 uniform 矩阵
     * @param {string} name 变量名称
     * @param {Float32Array} value 按列存储的 4x4 的矩阵
     */
    uniformMatrix4fv(name, value)
    {
        let gl = this.gl;
        let program = this.program;
        gl.useProgram(program);

        let offsetLoc = gl.getUniformLocation(program, name);
        gl.uniformMatrix4fv(offsetLoc, false, value);
    }

    drawArrays(vao, type, count = 3, offset = 0) {
        let gl = this.gl;
        let program = this.program;

        gl.useProgram(program);
        gl.bindVertexArray(vao);
        gl.drawArrays(type, offset, count);
    }


    /**
     * 渲染一个 3D 模型
     * @param {Object3D} obj 3D 模型对象
     */
    drawObject3D(obj)
    {
        if (null === obj.render)
            obj.render = this;

        if (obj.render !== this)
            throw ReferenceError("渲染器错误!!!");

        if (!'pos' in obj.attributes) {
            throw RangeError(`${obj.name}:${obj.id} 不存在 pos 属性`);
        }

        if (null == obj.vao) {
            obj.vao = this.gl.createVertexArray();
            this.gl.bindVertexArray(obj.vao);

            for (const attr_name in obj.attributes) {
                let attr = obj.attributes[attr_name];
                
                if (null == attr.vbo) {
                    attr.vbo = this.bindArrayBuffer(attr.array);
                }

                if (null == attr.vbo)
                    throw ReferenceError(`渲染器错误! 未构造 ${obj.name}:${obj.id} 的 vao/vbo 对象`);

                let location = this.gl.getAttribLocation(this.program, attr_name);
                this.gl.vertexAttribPointer(location, attr.item_size, _gl_type_map_[attr.type], false, 0, 0);
                this.gl.enableVertexAttribArray(location);
            }
        }

        this.gl.bindVertexArray(obj.vao);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, obj.attributes.pos.count);
    }



}


export { WebGL2Renderer };

