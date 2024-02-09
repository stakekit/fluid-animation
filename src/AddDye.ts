import {
  AdditiveBlending,
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  WebGLRenderTarget,
} from "three";
import { Stage } from "./Stage";

import vertexShader from "./verts/pointer.vert?raw";
import fragmentShader from "./frags/addDye.frag?raw";

const TIME_OFFSET = Math.random() * 20000;

export default class AddDye {
  public readonly mesh: Mesh<PlaneGeometry, ShaderMaterial>;
  private readonly scene: Scene;

  constructor(private readonly stage: Stage) {
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
          opacity: { value: this.stage.pointerOpacity },
          colorChange: { value: 0.0005 },
          grad: { value: null },
          size: { value: this.stage.pointerSize },
          center: { value: this.stage.pointer },
        },
      })
    );

    this.scene.add(this.mesh);
  }

  setTexture(texture: Texture) {
    this.mesh.material.uniforms.grad.value = texture;
  }

  update(time: number, dye: WebGLRenderTarget) {
    this.mesh.material.uniforms.time.value = TIME_OFFSET + time;
    this.mesh.material.uniforms.opacity.value = this.stage.pointerOpacity;

    this.stage.renderer.setRenderTarget(dye);
    this.stage.renderer.render(this.scene, this.stage.camera);
    this.stage.renderer.setRenderTarget(null);
  }
}
