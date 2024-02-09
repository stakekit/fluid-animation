import { Stage } from "./Stage";
import { MathUtils, ShaderMaterial, Texture, Vector2 } from "three";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import vertexShader from "./verts/output.vert?raw";
import fragmentShader from "./frags/output.frag?raw";

export class Output {
  private readonly fsQuad: FullScreenQuad;
  private readonly material: ShaderMaterial;
  private startScale = 0;
  private endScale = 1;

  constructor(private readonly stage: Stage) {
    this.fsQuad = new FullScreenQuad();

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      depthWrite: false,
      uniforms: {
        diffuse: { value: null },
        amount: { value: 0.1 },
        smoothAmount: { value: 0.3 },
        elapsed: { value: this.startScale },
        resolution: { value: new Vector2() },
      },
    });
    this.fsQuad.material = this.material;
  }

  resize() {
    const aspect = this.stage.width / this.stage.height;
    const { isDesktop, width, dpr } = this.stage;

    this.startScale = isDesktop ? 0.3 / aspect : 0.65;
    this.endScale = (isDesktop ? aspect : 1 / aspect) + 0.25;

    this.stage.renderer.getDrawingBufferSize(
      this.material.uniforms.resolution.value
    );
    this.material.uniforms.elapsed.value = MathUtils.lerp(
      this.startScale,
      this.endScale,
      this.stage.elapsed
    );
    this.material.uniforms.smoothAmount.value = 200 / (width * dpr);
  }

  update(texture: Texture) {
    this.material.uniforms.elapsed.value = MathUtils.lerp(
      this.startScale,
      this.endScale,
      this.stage.elapsed
    );
    this.material.uniforms.diffuse.value = texture;
    this.fsQuad.render(this.stage.renderer);
  }
}
