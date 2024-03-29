#define GLSLIFY 1
uniform sampler2D pressure;
uniform sampler2D velocity;
uniform vec2 cellSize;
uniform float delta;
varying vec2 vUv;

void main(){
  float step = 1.0;

  float p0 = texture2D(pressure, vUv+vec2(cellSize.x * step, 0)).r;
  float p1 = texture2D(pressure, vUv-vec2(cellSize.x * step, 0)).r;
  float p2 = texture2D(pressure, vUv+vec2(0, cellSize.y * step)).r;
  float p3 = texture2D(pressure, vUv-vec2(0, cellSize.y * step)).r;

  vec2 v = texture2D(velocity, vUv).xy;
  vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
  v = v - gradP * delta;
  gl_FragColor = vec4(v, 0.0, 1.0);
}
