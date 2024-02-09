import { Stage } from "./Stage";
import { Fluid } from "./Fluid";
import {
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderTarget,
} from "three";
import vertexShader from "./verts/face.vert?raw";
import fragmentShader from "./frags/divergence.frag?raw";

export class Divergence {
  private readonly scene: Scene;
  private readonly geometry: PlaneGeometry;
  private readonly plane: Mesh;
  public readonly material: ShaderMaterial;

  constructor(
    readonly fluid: Fluid,
    private readonly stage: Stage,
    private readonly velocity2: WebGLRenderTarget,
    private readonly divergence: WebGLRenderTarget
  ) {
    this.scene = new Scene();
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        size: { value: fluid.size },
        cellSize: { value: fluid.cellSize },
        delta: { value: this.stage.delta },
        velocity: { value: this.velocity2.texture },
      },
    });
    this.geometry = new PlaneGeometry(2, 2);
    this.plane = new Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  update() {
    this.material.uniforms.delta.value = this.stage.delta;

    this.stage.renderer.setRenderTarget(this.divergence);
    this.stage.renderer.render(this.scene, this.stage.camera);
    this.stage.renderer.setRenderTarget(null);
  }
}
