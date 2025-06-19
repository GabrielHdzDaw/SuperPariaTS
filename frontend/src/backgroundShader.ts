let mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = window.innerHeight - e.clientY; // Invertir Y para GL
});

export function startShaderBackground(fragShaderSrc: string) {
  const canvas = document.createElement('canvas');
  canvas.id = 'shader-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.prepend(canvas);

  const context = canvas.getContext('webgl');
  if (!context) throw new Error('WebGL no soportado');
  const gl = context as WebGLRenderingContext;

  function compileShader(source: string, type: number): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) throw new Error('No se pudo crear el shader');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(log || 'Shader compile error');
    }
    return shader;
  }

  function createProgram(vs: WebGLShader, fs: WebGLShader): WebGLProgram {
    const program = gl.createProgram();
    if (!program) throw new Error('No se pudo crear el programa');
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(log || 'Program link error');
    }
    return program;
  }

  function setupCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  setupCanvas();
  window.addEventListener('resize', setupCanvas);

  const vertexShader = compileShader(`
    attribute vec4 position;
    void main() {
      gl_Position = position;
    }
  `, gl.VERTEX_SHADER);

  const fragmentShader = compileShader(fragShaderSrc, gl.FRAGMENT_SHADER);
  const program = createProgram(vertexShader, fragmentShader);
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1
  ]), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, 'position');
  if (position === -1) throw new Error('No se encontró el atributo "position"');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const iResolution = gl.getUniformLocation(program, 'iResolution');
  const iTime = gl.getUniformLocation(program, 'iTime');
  const iMouse = gl.getUniformLocation(program, 'iMouse');
  if (!iResolution) throw new Error('No se localizó iResolution');
  if (!iTime) console.warn('iTime no se encontró; asegúrate de que se usa en el shader');
  if (!iMouse) console.warn('iMouse no se encontró; asegúrate de que se usa en el shader');

  function render(time: number) {
    gl.uniform3f(iResolution, canvas.width, canvas.height, 1.0);
    gl.uniform1f(iTime, time * 0.001);
    gl.uniform2f(iMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
