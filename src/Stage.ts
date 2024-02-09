import { Fluid } from "./Fluid";
import {
  MathUtils,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
} from "three";
import { App } from "./App";
import { FakePointer } from "./FakePointer";

export class Stage {
  private readonly fluid: Fluid;
  private readonly fakePointer: FakePointer;
  private readonly movement = new Vector2();

  public readonly pointer = new Vector2();
  public readonly devicePointer = new Vector2();
  public readonly lastPointer = new Vector2();
  public readonly pointerSize = new Vector2();
  public readonly pointerForce = new Vector2();
  public readonly renderer: WebGLRenderer;
  public readonly scene: Scene;
  public readonly camera: PerspectiveCamera;
  public readonly dpr: number;

  public width = 0;
  public height = 0;
  public left = 0;
  public top = 0;
  public hFov = 1;
  public vFov = 1;
  public aspect = 1;
  public elapsed = 1.2;
  public pointerOpacity = 0.4;
  public landscape = false;
  public pointerMix = 1;
  public pointerMixTarget = 1;
  public fluidDecay = 0.99;
  public delta = 1 / 60;

  constructor(
    private readonly node: HTMLElement,
    private readonly app: App
  ) {
    this.scene = new Scene();
    this.camera = new PerspectiveCamera();
    this.camera.position.z = 10;
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });

    this.fakePointer = new FakePointer(this);

    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    this.renderer.autoClear = false;
    this.renderer.setClearColor(0x000000);
    this.dpr = this.renderer.getPixelRatio();

    this.node.appendChild(this.renderer.domElement);
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("touchstart", this.onTouchMove.bind(this));
    document.addEventListener("touchmove", this.onTouchMove.bind(this), {
      passive: false,
    });

    this.fluid = new Fluid(this);

    const observer = new ResizeObserver(this.resize.bind(this));
    observer.observe(this.node);

    this.resize();
  }

  resize() {
    const { left, top, width, height } = this.node.getBoundingClientRect();
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.landscape = width > height;

    this.aspect = this.width / this.height;
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    this.camera.position.z =
      ((1 / this.camera.aspect) * this.camera.getFocalLength()) /
      this.camera.getFilmHeight();

    this.vFov =
      (this.camera.position.z * this.camera.getFilmHeight()) /
      this.camera.getFocalLength();
    this.hFov = this.vFov * this.camera.aspect;

    this.fluid.resize();
  }

  onTouchMove(event: TouchEvent) {
    this.pointerMixTarget = 1;
    const { clientX, clientY } = event.touches[0];
    this.onMove(clientX, clientY);
  }

  onMouseMove(event: MouseEvent) {
    this.pointerMixTarget = 1;
    const { x, y } = event;
    this.onMove(x, y);
  }

  onMove(x: number, y: number) {
    const left = ((x - this.left) / this.width) * 2 - 1;
    const top = -((y - this.top) / this.height) * 2 + 1;
    this.devicePointer.set(left, top);
  }

  update(time: number) {
    this.pointerMixTarget *= 0.995;
    this.pointerMix += (this.pointerMixTarget - this.pointerMix) * 0.01;
    this.pointer.lerpVectors(
      this.fakePointer.pointer,
      this.devicePointer,
      this.pointerMix
    );
    this.movement.subVectors(this.pointer, this.lastPointer);
    this.lastPointer.copy(this.pointer);

    this.delta = MathUtils.lerp(1 / 180, 1 / 60, this.pointerMix);
    this.fluidDecay = MathUtils.lerp(0.995, 0.99, this.pointerMix);
    this.pointerOpacity =
      MathUtils.lerp(this.fakePointer.opacity, 4, this.pointerMix) *
      this.movement.length();
    this.pointerForce
      .copy(this.movement)
      .multiplyScalar(
        MathUtils.lerp(this.fakePointer.force, 2, this.pointerMix)
      );

    const size = MathUtils.lerp(this.fakePointer.size, 1.25, this.pointerMix);
    this.pointerSize.set(
      this.landscape ? size / this.aspect : size,
      this.landscape ? size : size * this.aspect
    );

    this.fluid.update(time);
    this.fakePointer.update(time);
    this.renderer.render(this.scene, this.camera);
  }

  get isDesktop() {
    return this.app.isDesktop;
  }

  get fluidMap() {
    return this.fluid.outputTexture;
  }
}
