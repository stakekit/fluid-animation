import { Stage } from "./Stage";

export class App {
  private readonly stage: Stage;

  public pointerX = 0;
  public pointerY = 0;

  public scrollY = 0;
  public isDesktop = false;

  constructor(element: HTMLElement) {
    this.update = this.update.bind(this);

    const mq = window.matchMedia("(min-width:1024px)");
    mq.addEventListener("change", () => (this.isDesktop = mq.matches));
    this.isDesktop = mq.matches;

    this.stage = new Stage(element, this);

    this.init();
  }

  async init(): Promise<void> {
    requestAnimationFrame(this.update);
    document.body.addEventListener(
      "pointermove",
      this.onPointerMove.bind(this)
    );
  }

  onPointerMove(event: PointerEvent) {
    this.pointerX = event.x;
    this.pointerY = event.y;
  }

  update(time: number): void {
    requestAnimationFrame(this.update);

    this.stage.update(time);
  }
}
