#define GLSLIFY 1
uniform vec2 force;
uniform vec2 center;
uniform vec2 scale;
varying vec2 vUv;

void main(){
  vec2 circle = (vUv - 0.5) * 2.0;
  float d = 1.0 - min(length(circle), 1.0);
  d *= d;
  gl_FragColor = vec4(force, 0.0, d);
}
