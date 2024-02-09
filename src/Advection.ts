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
import fragmentShader from "./frags/advection.frag?raw";

export class Advection {
  private readonly scene: Scene;
  private readonly geometry: PlaneGeometry;
  private readonly plane: Mesh;
  public readonly material: ShaderMaterial;

  constructor(
    readonly fluid: Fluid,
    private readonly stage: Stage,
    private readonly velocity1: WebGLRenderTarget,
    private readonly velocity2: WebGLRenderTarget
  ) {
    this.scene = new Scene();
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        size: { value: fluid.size },
        cellSize: { value: fluid.cellSize },
        velocity: { value: this.velocity1.texture },
        delta: { value: this.stage.delta },
      },
    });
    this.geometry = new PlaneGeometry(2, 2);
    this.plane = new Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  update() {
    this.material.uniforms.delta.value = this.stage.delta;
    this.stage.renderer.setRenderTarget(this.velocity2);
    this.stage.renderer.render(this.scene, this.stage.camera);
    this.stage.renderer.setRenderTarget(null);
  }
}
