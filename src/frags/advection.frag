#define GLSLIFY 1
uniform sampler2D velocity;
uniform vec2 size;
uniform float delta;

varying vec2 vUv;

void main() {
  vec2 ratio = max(size.x, size.y) / size;
	vec2 spot_new = vUv;
	vec2 vel_old = texture2D(velocity, vUv).xy;
	// back trace
	vec2 spot_old = spot_new - vel_old * delta * ratio;
	vec2 vel_new1 = texture2D(velocity, spot_old).xy;

	// forward trace
	vec2 spot_new2 = spot_old + vel_new1 * delta * ratio;

	vec2 error = spot_new2 - spot_new;

	vec2 spot_new3 = spot_new - error / 2.0;
	vec2 vel_2 = texture2D(velocity, spot_new3).xy;

	// back trace 2
	vec2 spot_old2 = spot_new3 - vel_2 * delta * ratio;
	vec2 newVel2 = texture2D(velocity, spot_old2).xy * 0.997;
	gl_FragColor = vec4(newVel2, 0.0, 1.0);
}
