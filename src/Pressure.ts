import { Fluid } from "./Fluid";
import { Stage } from "./Stage";
import {
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderTarget,
} from "three";
import vertexShader from "./verts/face.vert?raw";
import fragmentShader from "./frags/pressure.frag?raw";

export class Pressure {
  private readonly scene: Scene;
  private readonly geometry: PlaneGeometry;
  private readonly plane: Mesh;
  public readonly material: ShaderMaterial;

  constructor(
    private readonly fluid: Fluid,
    private readonly stage: Stage,
    private readonly velocity1: WebGLRenderTarget,
    private readonly velocity2: WebGLRenderTarget,
    private readonly pressure: WebGLRenderTarget
  ) {
    this.scene = new Scene();
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        cellSize: {
          value: this.fluid.cellSize,
        },
        velocity: {
          value: this.velocity2.texture,
        },
        pressure: {
          value: this.pressure.texture,
        },
        delta: { value: this.stage.delta },
      },
    });
    this.geometry = new PlaneGeometry(2, 2);
    this.plane = new Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  update(pressure: WebGLRenderTarget) {
    this.material.uniforms.delta.value = this.stage.delta;

    this.material.uniforms.pressure.value = pressure.texture;
    this.stage.renderer.setRenderTarget(this.velocity1);
    this.stage.renderer.render(this.scene, this.stage.camera);
    this.stage.renderer.setRenderTarget(null);
  }
}
