import {
  AdditiveBlending,
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  WebGLRenderTarget,
} from "three";
import { Stage } from "./Stage";
import vertexShader from "./verts/pointer.vert?raw";
import fragmentShader from "./frags/addDye.frag?raw";

import { createNoise2D, NoiseFunction2D } from "simplex-noise";

const TIME_OFFSET = Math.random() * 20000;

export default class AddDye {
  public readonly mesh: Mesh<PlaneGeometry, ShaderMaterial>;
  private readonly scene: Scene;
  private readonly noise: NoiseFunction2D;

  constructor(private readonly stage: Stage) {
    this.noise = createNoise2D();
    this.scene = new Scene();
    this.mesh = new Mesh(
      new PlaneGeometry(1, 1),
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: AdditiveBlending,
        uniforms: {
          time: { value: 0 },
          opacity: { value: 1 },
          colorChange: { value: 0.0008 },
          grad: { value: null },
          size: { value: new Vector2(0.25, 0.25) },
          center: { value: new Vector2() },
        },
      })
    );

    this.scene.add(this.mesh);
  }

  setTexture(texture: Texture) {
    this.mesh.material.uniforms.grad.value = texture;
  }

  update(time: number, dye: WebGLRenderTarget) {
    const { landscape, aspect } = this.stage;
    const t = time * 0.00125;

    const dimension = landscape ? 0.35 : 0.75;
    const x = this.noise(0, t) * dimension;
    const y = this.noise(1, t) * dimension * aspect;

    const size = landscape ? 1.25 : 2;

    this.mesh.material.uniforms.time.value = TIME_OFFSET + time;
    this.mesh.material.uniforms.opacity.value = (1 - this.stage.elapsed) * 0.1;
    this.mesh.material.uniforms.center.value.set(x, y);
    this.mesh.material.uniforms.size.value.set(
      landscape ? size / aspect : size,
      landscape ? size : size * aspect
    );

    this.stage.renderer.setRenderTarget(dye);
    this.stage.renderer.render(this.scene, this.stage.camera);
    this.stage.renderer.setRenderTarget(null);
  }
}
