#define GLSLIFY 1
uniform vec2 center;
uniform vec2 size;
varying vec2 vUv;

void main(){
  vUv = uv;
  gl_Position = vec4(position.xy * size + center, 0.0, 1.0);
}
