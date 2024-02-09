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
import fragmentShader from "./frags/dye.frag?raw";

export class Dye {
  private readonly scene: Scene;
  private readonly geometry: PlaneGeometry;
  private readonly plane: Mesh;
  public readonly material: ShaderMaterial;

  constructor(
    readonly fluid: Fluid,
    private readonly stage: Stage,
    private readonly dye1: WebGLRenderTarget,
    readonly dye2: WebGLRenderTarget,
    private readonly velocity: WebGLRenderTarget
  ) {
    this.scene = new Scene();
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        size: { value: fluid.size },
        cellSize: { value: fluid.cellSize },
        dye: { value: this.dye1.texture },
        velocity: { value: this.velocity.texture },
        decay: { value: this.stage.fluidDecay },
        delta: { value: this.stage.delta },
      },
    });
    this.geometry = new PlaneGeometry(2, 2);
    this.plane = new Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  update(
    renderTargetIn: WebGLRenderTarget,
    renderTargetOut: WebGLRenderTarget
  ) {
    this.material.uniforms.dye.value = renderTargetIn.texture;
    this.material.uniforms.delta.value = this.stage.delta;
    this.material.uniforms.decay.value = this.stage.fluidDecay;

    this.stage.renderer.setRenderTarget(renderTargetOut);
    this.stage.renderer.render(this.scene, this.stage.camera);
    this.stage.renderer.setRenderTarget(null);
  }
}
