import { Stage } from "./Stage";
import { Advection } from "./Advection";
import {
  FloatType,
  HalfFloatType,
  Texture,
  TextureLoader,
  Vector2,
  WebGLRenderTarget,
} from "three";
import AddVelocity from "./AddVelocity";
import { Divergence } from "./Divergence";
import { Poisson } from "./Poisson";
import { Pressure } from "./Pressure";
import { Dye } from "./Dye";
import { Output } from "./Output";
import AddDye from "./AddDye";
import StartDye from "./StartDye";

const RESOLUTION = 0.25;

export const GRADIENT =
  "data:image/png;base64,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";

export class Fluid {
  private readonly advection: Advection;
  private readonly addVelocity: AddVelocity;
  private readonly divergence: Divergence;
  private readonly poisson: Poisson;
  private readonly pressure: Pressure;
  private readonly startDye: StartDye;
  private readonly addDye: AddDye;
  private readonly dye: Dye;
  private readonly output: Output;
  private readonly renderTargets: {
    velocity1: WebGLRenderTarget;
    velocity2: WebGLRenderTarget;
    divergence: WebGLRenderTarget;
    pressure1: WebGLRenderTarget;
    pressure2: WebGLRenderTarget;
    dye1: WebGLRenderTarget;
    dye2: WebGLRenderTarget;
  };

  private step = 0;

  public outputTexture: Texture | null = null;
  public size = new Vector2();
  public cellSize = new Vector2();

  constructor(private readonly stage: Stage) {
    this.setSize();

    this.renderTargets = {
      velocity1: this.createRenderTarget(),
      velocity2: this.createRenderTarget(),
      divergence: this.createRenderTarget(),
      pressure1: this.createRenderTarget(),
      pressure2: this.createRenderTarget(),
      dye1: this.createRenderTarget(),
      dye2: this.createRenderTarget(),
    };

    this.startDye = new StartDye(this.stage);
    this.advection = new Advection(
      this,
      stage,
      this.renderTargets.velocity1,
      this.renderTargets.velocity2
    );
    this.addVelocity = new AddVelocity(
      this.stage,
      this.renderTargets.velocity2
    );
    this.addDye = new AddDye(this.stage);
    this.divergence = new Divergence(
      this,
      this.stage,
      this.renderTargets.velocity2,
      this.renderTargets.divergence
    );
    this.dye = new Dye(
      this,
      this.stage,
      this.renderTargets.dye1,
      this.renderTargets.dye2,
      this.renderTargets.velocity2
    );

    this.poisson = new Poisson(
      this,
      this.stage,
      this.renderTargets.divergence,
      this.renderTargets.pressure1,
      this.renderTargets.pressure2
    );

    this.pressure = new Pressure(
      this,
      stage,
      this.renderTargets.velocity1,
      this.renderTargets.velocity2,
      this.renderTargets.pressure1
    );

    this.output = new Output(stage);

    this.resize();
    this.load();
  }

  async load() {
    const texture = await new TextureLoader().loadAsync(GRADIENT);
    this.startDye.setTexture(texture);
    this.addDye.setTexture(texture);
  }

  createRenderTarget(): WebGLRenderTarget {
    const type = /(iPad|iPhone|iPod)/g.test(navigator.userAgent)
      ? HalfFloatType
      : FloatType;
    return new WebGLRenderTarget(this.size.x, this.size.y, {
      type,
    });
  }

  setSize() {
    const width = Math.round(RESOLUTION * this.stage.width);
    const height = Math.round(RESOLUTION * this.stage.height);

    const cellWidth = 1 / width;
    const cellHeight = 1 / height;

    this.cellSize.set(cellWidth, cellHeight);
    this.size.set(width, height);
  }

  resize() {
    this.setSize();
    Object.values(this.renderTargets).forEach((renderTarget) =>
      renderTarget.setSize(this.size.x, this.size.y)
    );
    this.output.resize();
  }

  update(time: number) {
    this.step++;
    const sign = this.step % 2 === 0;

    if (this.stage.elapsed < 1) {
      this.startDye.update(
        time,
        sign ? this.renderTargets.dye1 : this.renderTargets.dye2
      );
    }
    this.advection.update();
    this.addVelocity.update();
    this.addDye.update(
      time,
      sign ? this.renderTargets.dye1 : this.renderTargets.dye2
    );
    this.divergence.update();
    this.poisson.update();
    this.pressure.update(this.poisson.pressure);

    this.dye.update(
      sign ? this.renderTargets.dye1 : this.renderTargets.dye2,
      sign ? this.renderTargets.dye2 : this.renderTargets.dye1
    );

    this.outputTexture = sign
      ? this.renderTargets.dye2.texture
      : this.renderTargets.dye1.texture;

    this.output.update(this.outputTexture);
    this.output.update(this.renderTargets.dye1.texture);
  }
}
