#define GLSLIFY 1
varying vec2 vUv;

void main(){
  vUv = vec2(0.5)+(position.xy)*0.5;

  gl_Position = vec4(position, 1.0);
}
