import { Stage } from "./Stage";
import { MathUtils, Vector2 } from "three";

import { createNoise2D, NoiseFunction2D } from "simplex-noise";

export class FakePointer {
  private readonly noise: NoiseFunction2D;

  public readonly pointer = new Vector2();
  public size = 1.25;
  public opacity = 3;
  public force = 3;

  constructor(private readonly stage: Stage) {
    this.noise = createNoise2D();
  }

  update(time: number) {
    const { aspect } = this.stage;
    const speed = 0.0003;
    const t = time * speed;

    this.size = 1.25 + (Math.sin(t) + 1) * 0.5;

    const elapsed = MathUtils.lerp(0.9, 1, this.stage.elapsed);
    const x = this.noise(0, t) * elapsed;
    const y = (this.noise(1, t) * elapsed) / aspect;

    this.pointer.set(x, y);
  }
}
