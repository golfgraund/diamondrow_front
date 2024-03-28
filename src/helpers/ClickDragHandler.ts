type ClickMoveHandler = (x: number, y: number) => void;

type ClickHandler = (clientX: number, clientY: number) => void;

export class ClickDragHandler {
  private readonly startHandler: ClickHandler;

  private readonly moveHandler: ClickMoveHandler;

  private readonly endHandler: ClickHandler;

  private readonly target: HTMLElement;

  private dragging: boolean;

  private originX: number;

  private originY: number;

  private finger: number;

  private active: boolean;

  public constructor(
    target: HTMLElement,
    onStart: ClickHandler,
    onMove: ClickMoveHandler,
    onEnd: ClickHandler,
  ) {
    this.target = target;
    this.startHandler = onStart;
    this.moveHandler = onMove;
    this.endHandler = onEnd;
    this.dragging = false;
    this.originX = 0;
    this.originY = 0;
    this.finger = -1;
    this.active = false;
  }

  public attach() {
    if (!this.active) {
      this.mouseDown = this.mouseDown.bind(this);
      this.mouseMove = this.mouseMove.bind(this);
      this.mouseUp = this.mouseUp.bind(this);
      this.target.addEventListener('mousedown', this.mouseDown, { passive: true });
      window.addEventListener('mousemove', this.mouseMove, { passive: true });
      window.addEventListener('mouseup', this.mouseUp, { passive: true });

      this.touchStart = this.touchStart.bind(this);
      this.touchMove = this.touchMove.bind(this);
      this.touchEnd = this.touchEnd.bind(this);
      this.target.addEventListener('touchstart', this.touchStart, { passive: true });
      window.addEventListener('touchmove', this.touchMove, { passive: true });
      window.addEventListener('touchend', this.touchEnd, { passive: true });
      window.addEventListener('touchcancel', this.touchEnd, { passive: true });

      this.active = true;
    }
  }

  public detach() {
    if (this.active) {
      this.target.removeEventListener('mousedown', this.mouseDown);
      window.removeEventListener('mousemove', this.mouseMove);
      window.removeEventListener('mouseup', this.mouseUp);
      this.target.removeEventListener('touchstart', this.touchStart);
      window.removeEventListener('touchmove', this.touchMove);
      window.removeEventListener('touchend', this.touchEnd);
      window.removeEventListener('touchcancel', this.touchEnd);
      this.active = false;
    }
  }

  private handleStart(x: number, y: number) {
    this.originX = x;
    this.originY = y;
    this.dragging = true;
    this.startHandler(x, y);
    this.moveHandler(0, 0);
  }

  private handleMove(x: number, y: number) {
    this.moveHandler(x - this.originX, y - this.originY);
  }

  private handleEnd(x: number, y: number) {
    this.originX = 0;
    this.originY = 0;
    this.dragging = false;
    this.endHandler(x, y);
  }

  private mouseDown(ev: MouseEvent) {
    if (ev.button === 0 && !this.dragging) {
      this.handleStart(ev.clientX, ev.clientY);
    }
  }

  private mouseMove(ev: MouseEvent) {
    if (this.dragging) {
      this.handleMove(ev.clientX, ev.clientY);
    }
  }

  private mouseUp(ev: MouseEvent) {
    if (ev.button === 0 && this.dragging) {
      this.handleEnd(ev.clientX, ev.clientY);
    }
  }

  private touchStart(ev: TouchEvent) {
    if (!this.dragging && this.finger === -1) {
      const t = this.findTouch(ev);
      if (t) {
        this.finger = t.identifier;
        this.handleStart(t.clientX, t.clientY);
      }
    }
  }

  private touchMove(ev: TouchEvent) {
    if (this.dragging && this.finger !== -1) {
      const t = this.findTouch(ev, this.finger);
      if (t) {
        this.handleMove(t.clientX, t.clientY);
      }
    }
  }

  private touchEnd(ev: TouchEvent) {
    if (this.dragging && this.finger !== -1) {
      const t = this.findTouch(ev, this.finger);
      if (t) {
        this.finger = -1;
        this.handleEnd(t.clientX, t.clientY);
      }
    }
  }

  private findTouch(ev: TouchEvent, id: number | null = null) {
    for (let i = 0; i < ev.changedTouches.length; i++) {
      if (id === null || ev.changedTouches[i].identifier === id) {
        return ev.changedTouches[i];
      }
    }

    return null;
  }
}
