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
import fragmentShader from "./frags/poisson.frag?raw";

const ITERATIONS = 16;

export class Poisson {
  private readonly scene: Scene;
  private readonly material: ShaderMaterial;
  private readonly geometry: PlaneGeometry;
  private readonly plane: Mesh;
  public pressure: WebGLRenderTarget;

  constructor(
    private readonly fluid: Fluid,
    private readonly stage: Stage,
    private readonly divergence: WebGLRenderTarget,
    private readonly pressure1: WebGLRenderTarget,
    private readonly pressure2: WebGLRenderTarget
  ) {
    this.scene = new Scene();
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        cellSize: {
          value: this.fluid.cellSize,
        },
        divergence: {
          value: this.divergence.texture,
        },
        pressure: {
          value: this.pressure1.texture,
        },
      },
    });
    this.pressure = this.pressure2;
    this.geometry = new PlaneGeometry(2, 2);
    this.plane = new Mesh(this.geometry, this.material);
    this.scene.add(this.plane);
  }

  update() {
    let pressureIn, pressureOut;

    for (let i = 0; i < ITERATIONS; i++) {
      if (i % 2 === 0) {
        pressureIn = this.pressure1;
        pressureOut = this.pressure2;
      } else {
        pressureIn = this.pressure2;
        pressureOut = this.pressure1;
      }

      this.material.uniforms.pressure.value = pressureIn.texture;
      this.pressure = pressureOut;
      this.stage.renderer.setRenderTarget(pressureOut);
      this.stage.renderer.render(this.scene, this.stage.camera);
      this.stage.renderer.setRenderTarget(null);
    }
  }
}
