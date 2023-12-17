const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("Does not support WebGL");
}

function renderShape(exerciseNumber) {
  switch (exerciseNumber) {
    case 1:
      drawTriangle();
      break;
    case 2:
      drawTriangleWithGradient();
      break;
    case 3:
      drawPoints();
      break;
    case 4:
      drawPointsWithPointCoord();
      break;
  }
}

renderShape(1);

function drawTriangle() {
  const vertices = new Float32Array([0.0, 0.5, -0.8, -1.0, 0.8, -1.0]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  vertexBuffer.itemSize = 2;
  vertexBuffer.numberOfItems = 3;

  const vsSource = `
        attribute vec2 coordinates;
        void main(void) {
            gl_Position = vec4(coordinates, 0.0, 1.0);
        }
    `;

  const fsSource = `
        void main(void) {
            gl_FragColor = vec4(0.5, 0.6, 0.9, 1.0);
        }
    `;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(
    shaderProgram.vertexPositionAttribute,
    vertexBuffer.itemSize,
    gl.FLOAT,
    false,
    0,
    0
  );
  gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numberOfItems);
}

function drawTriangleWithGradient() {
  const vertices = new Float32Array([0.0, 0.5, -0.8, -1.0, 0.8, -1.0]);
  const triangleColors = new Float32Array([
    1.0, 0.6, 0.3, 1.0, 0.2, 0.4, 0.5, 1.0, 0.9, 0.2, 1.0, 0.7,
  ]);
  const triangleVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const triangleColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangleColors, gl.STATIC_DRAW);

  const vsSource = `
        attribute vec2 coordinates;
        attribute vec4 color;
        varying vec4 vColor;
        void main(void) {
            gl_Position = vec4(coordinates, 0.0, 1.0);
            vColor = color;
        }
    `;

  const fsSource = `
        precision mediump float;
        varying vec4 vColor;
        void main(void) {
            gl_FragColor = vColor;
        }
    `;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  const vertexPosition = gl.getAttribLocation(shaderProgram, "coordinates");
  gl.enableVertexAttribArray(vertexPosition);

  const vertexColor = gl.getAttribLocation(shaderProgram, "color");
  gl.enableVertexAttribArray(vertexColor);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
  gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
  gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function drawPoints() {
  const pointVertices = new Float32Array([0.0, 0.5, -0.8, -0.8, 0.8, -0.8]);

  const pointVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, pointVertices, gl.STATIC_DRAW);

  const vsSource = `
        attribute vec2 coordinates;
        uniform float uAspectRatio;
        void main(void) {
            gl_Position = vec4(coordinates * vec2(1.0, uAspectRatio), 0.0, 1.0);
            gl_PointSize = 20.0;
        }
    `;

  const fsSource = `
        precision mediump float;
        void main(void) {
            gl_FragColor = vec4(1.0, 0.4, 1.0, 0.4);
        }
    `;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  const vertexPosition = gl.getAttribLocation(shaderProgram, "coordinates");
  gl.enableVertexAttribArray(vertexPosition);

  const aspectRatioLocation = gl.getUniformLocation(
    shaderProgram,
    "uAspectRatio"
  );
  const canvasAspectRatio = gl.canvas.width / gl.canvas.height;
  gl.uniform1f(aspectRatioLocation, canvasAspectRatio);

  gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexBuffer);
  gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.POINTS, 0, 3);
}

function drawPointsWithPointCoord() {
  const pointVertices = new Float32Array([0.0, 0.5, -0.8, -0.8, 0.8, -0.8]);

  const pointVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, pointVertices, gl.STATIC_DRAW);

  const vsSource = `
        attribute vec2 aVertexPosition;
        void main() {
            gl_Position = vec4(aVertexPosition, 0.0, 1.0);
            gl_PointSize = 100.0; 
        }
    `;

  const fsSource = `
        void main() {
            if (gl_PointCoord.x < 0.25) {
                gl_FragColor = vec4(0.3, 0.2, 1.0, 0.3);
            } else {
                gl_FragColor = vec4(0.7, 1.0, 0.3, 1.0);
            }
        }
    `;

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vsSource);
  gl.compileShader(vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fsSource);
  gl.compileShader(fragmentShader);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);

  const vertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPosition);
  gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexBuffer);
  gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.POINTS, 0, 3);
}
