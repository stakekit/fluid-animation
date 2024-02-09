#define GLSLIFY 1
uniform sampler2D velocity;
uniform float delta;
uniform vec2 cellSize;
varying vec2 vUv;

void main(){
  float x0 = texture2D(velocity, vUv-vec2(cellSize.x, 0)).x;
  float x1 = texture2D(velocity, vUv+vec2(cellSize.x, 0)).x;
  float y0 = texture2D(velocity, vUv-vec2(0, cellSize.y)).y;
  float y1 = texture2D(velocity, vUv+vec2(0, cellSize.y)).y;
  float divergence = (x1-x0 + y1-y0) / 2.0;

  gl_FragColor = vec4(divergence / delta);
}
