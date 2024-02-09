#define GLSLIFY 1
uniform sampler2D diffuse;
uniform float amount;
uniform float smoothAmount;
uniform float elapsed;
uniform vec2 resolution;

varying vec2 vUv;

float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float random(vec2 p) {
  vec2 K1 = vec2(
    23.14069263277926, // e^pi (Gelfond's constant)
		2.665144142690225 // 2^sqrt(2) (Gelfond\u2013Schneider constant)
	);
	return fract(cos(dot(p, K1)) * 12345.6789);
}

vec3 black = vec3(0.0);

void main() {
  vec4 color = texture2D(diffuse, vUv);
	vec2 uvRandom = vUv;
	float aspect = resolution.y / resolution.x;
	vec2 center = (vUv * 2.0 - 1.0) * vec2(1.0, resolution.y / resolution.x);

	float d = sdCircle(center, elapsed);
	float c = smoothstep(0.0, smoothAmount, d);

	uvRandom.y *= random(vec2(uvRandom.y));
	color.rgb += random(uvRandom) * 0.0; // add background noise

	gl_FragColor = vec4(mix(color.rgb, black, c), amount);
}
