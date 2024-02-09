#define GLSLIFY 1
uniform sampler2D pressure;
uniform sampler2D divergence;
uniform vec2 cellSize;
varying vec2 vUv;

void main(){
  // poisson equation
  float p0 = texture2D(pressure, vUv+vec2(cellSize.x * 2.0,  0)).r;
  float p1 = texture2D(pressure, vUv-vec2(cellSize.x * 2.0, 0)).r;
  float p2 = texture2D(pressure, vUv+vec2(0, cellSize.y * 2.0 )).r;
  float p3 = texture2D(pressure, vUv-vec2(0, cellSize.y * 2.0 )).r;
  float div = texture2D(divergence, vUv).r;

  float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
  gl_FragColor = vec4(newP);
}
