#define GLSLIFY 1
uniform sampler2D grad;
uniform float opacity;
uniform float time;
uniform float colorChange;
varying vec2 vUv;

void main() {
  vec2 circle = (vUv - 0.5) * 2.0;
  float d = 1.0 - min(length(circle), 1.0);
  d *= d;
  	//	d = step(0.5, d);
	float c = (cos(time * colorChange) + 1.0) * 0.5;
	vec3 col = texture2D(grad, vec2(c, 0.0)).rgb;
	float a = d * opacity;
	gl_FragColor = vec4(col, a);
	//	gl_FragColor = vec4(col, 0.01);
}
