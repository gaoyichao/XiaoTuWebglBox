/**
 * @file webgl2的一些学习笔记和封装
 * @author 高乙超 <gaoyichao2013@126.com>
 */

class Utils {
    /**
     * @brief 创建一个画布
     */
    static createCanvas(id = "") {
        let cv = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
        cv.id = id;
        cv.style.display = 'block';
        return cv;
    }

    /**
     * 创建着色器
     * 
     * @param gl GL上下文 
     * @param type 着色器类型 VERTEX_SHADER? FRAGMENT_SHADER?
     * @param source 着色器程序字符串
     * @return 渲染着色器对象, 创建失败返回 null
     */
    static createShader(gl, type, source) {
        let shader = gl.createShader(type);
        if (!shader)
            throw new Error('无法创建着色器');
    
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
    
        let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            let info = '语法错误: ' + gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error(info);
        }
    
        return shader;
    }

    /**
     * 加载着色器文件
     * @param {string} url 着色器文件链接
     * @returns 着色器源码
     */
    static loadShaderSource(url) {
        let req = new XMLHttpRequest();
        req.open('GET', url, false);

        try {
            req.send();
        } catch (error) {
            throw new Error("无法加载着色器:" + url);
        }

        return req.responseText;
    }
}

export { Utils };

