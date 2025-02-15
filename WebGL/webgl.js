/**
 * @file webgl的一些学习笔记和封装
 * @author 高乙超 <gaoyichao2013@126.com>
 */

import { Utils } from './Utils.js'


var _gl_type_map_ = {
    "float": WebGLRenderingContext.FLOAT,
    "array_buffer": WebGLRenderingContext.ARRAY_BUFFER
};



/**
 * WebGL 渲染器
 */
class WebGLRenderer {
    domElement = null;
    gl = null;
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

        let gl = canvas.getContext("webgl");
        if (!gl)
            throw new Error("不支持 webgl");

        this.domElement = canvas;
        this.gl = gl;
        this.setSize(width, height);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    width()  { return this.domElement.width; }
    height() { return this.domElement.height; }

    /**
     * 设定画布大小
     * @param {int} width 
     * @param {int} height 
     */
    setSize(width, height) {
        let canvas = this.domElement;
        let gl = this.gl;

        canvas.width = width;
        canvas.height = height;
        // 涂满画布
        gl.viewport(0, 0, canvas.width, canvas.height);
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
        return this.createProgramFromSource(vertexSource, fragmentSource);
    }

    /**
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
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
        return vBuffer;
    }

    /**
     * 启用一个 ARRAY_BUFFER 对象
     * 
     * @param {WebGLRenderingContext.WebGLBuffer} vbo 顶点缓存对象
     */
    useArrayBuffer(vbo) {
        let gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
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
        let attr = gl.getAttribLocation(program, attrib);
        gl.vertexAttribPointer(attr, itemSize, _gl_type_map_[type], false, stride, offset)
        gl.enableVertexAttribArray(attr);
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


}

export { WebGLRenderer };

