import {
  AdditiveBlending,
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
} from "three";
import { Stage } from "./Stage";
import vertexShader from "./verts/pointer.vert?raw";
import fragmentShader from "./frags/addVelocity.frag?raw";

export default class AddVelocity {
  private readonly mesh: Mesh<PlaneGeometry, ShaderMaterial>;
  private readonly scene: Scene;

  constructor(
    private readonly stage: Stage,
    private readonly velocity2: WebGLRenderTarget
  ) {
    this.scene = new Scene();
    this.mesh = new Mesh(
      new PlaneGeometry(1, 1),
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: AdditiveBlending,
        uniforms: {
          size: { value: this.stage.pointerSize },
          force: { value: this.stage.pointerForce },
          center: { value: new Vector2() },
        },
      })
    );

    this.scene.add(this.mesh);
  }

  update() {
    this.mesh.material.uniforms.center.value.copy(this.stage.pointer);

    this.stage.renderer.setRenderTarget(this.velocity2);
    this.stage.renderer.render(this.scene, this.stage.camera);
  }
}
