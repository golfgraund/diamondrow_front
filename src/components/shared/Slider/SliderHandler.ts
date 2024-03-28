import { ClickDragHandler } from '@/helpers/ClickDragHandler';
import { easeOutCubic } from '@/helpers/Easings';
import { FrameHandler } from '@/helpers/FrameHandler';

export class SliderHandler {
  private static readonly handlers: SliderHandler[] = [];

  private static resizeObserver: ResizeObserver;

  private static frameHandler: FrameHandler;

  private readonly wrapper: HTMLDivElement;

  private readonly parent: HTMLDivElement;

  private readonly scrollHandler: ClickDragHandler;

  private readonly progressHandler: (pos: number) => void;

  private readonly childWidth: number[];

  private readonly childOffset: number[];

  private width: number;

  private fullWidth: number;

  private offset: number;

  private offsetOrigin: number;

  private allowClick: boolean;

  private dragging: boolean;

  private prevScrollOffset: number;

  private magnet: number;

  private magnetFrom: number;

  private magnetTo: number;

  private inertia: number;

  private activeIndex: number;

  private progress: number;

  private readonly spaceBetween: number;

  public constructor(
    wrapper: HTMLDivElement,
    parent: HTMLDivElement,
    updateProgress: (idx: number) => void,
    spaceBetween?: number,
  ) {
    this.wrapper = wrapper;
    this.parent = parent;
    this.childWidth = [];
    this.childOffset = [];
    this.offset = 0;
    this.offsetOrigin = 0;
    this.width = 0;
    this.allowClick = true;
    this.prevScrollOffset = 0;
    this.inertia = 0;
    this.magnet = 0;
    this.magnetFrom = 0;
    this.magnetTo = 0;
    this.fullWidth = 0;
    this.dragging = false;
    this.activeIndex = 0;
    this.progress = 0;
    this.spaceBetween = spaceBetween || 0;
    this.progressHandler = updateProgress;

    this.scrollHandler = new ClickDragHandler(
      this.wrapper,
      this.dragStart.bind(this),
      this.dragMove.bind(this),
      this.dragEnd.bind(this),
    );
    this.scrollHandler.attach();
    this.handleClick = this.handleClick.bind(this);
    this.handlePrevent = this.handlePrevent.bind(this);
    this.wrapper.addEventListener('click', this.handleClick, {
      capture: true,
    });
    this.wrapper.addEventListener('dragstart', this.handlePrevent, {
      capture: true,
    });
    this.wrapper.addEventListener('contextmenu', this.handlePrevent, {
      capture: true,
    });

    SliderHandler.register(this);
  }

  public detach() {
    this.scrollHandler.detach();
    this.wrapper.removeEventListener('click', this.handleClick);
    this.wrapper.removeEventListener('dragstart', this.handlePrevent);
    this.wrapper.removeEventListener('contextmenu', this.handlePrevent);
    SliderHandler.unregister(this);
  }

  public nextSlide() {
    const maxSlide = this.detectMaxSlide();
    if (this.activeIndex < maxSlide) {
      this.activeIndex++;
      this.magnet = 1;
      this.magnetFrom = this.offset;
      this.magnetTo = this.childOffset[this.activeIndex];
    }
  }

  public nextBlock() {
    const maxSlide = this.detectMaxSlide();
    if (this.activeIndex < maxSlide) {
      this.activeIndex = Math.min(maxSlide, this.activeIndex + 20);
      this.magnet = 1;
      this.magnetFrom = this.offset;
      this.magnetTo = this.childOffset[this.activeIndex];
    }
  }

  public prevSlide() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.magnet = 1;
      this.magnetFrom = this.offset;
      this.magnetTo = this.childOffset[this.activeIndex];
    }
  }

  public prevBlock() {
    const maxSlide = this.detectMaxSlide();
    if (this.activeIndex <= maxSlide) {
      this.activeIndex = Math.max(0, this.activeIndex - 20);
      this.magnet = 1;
      this.magnetFrom = this.offset;
      this.magnetTo = this.childOffset[this.activeIndex];
    }
  }

  public setActiveSlide(idx: number) {
    const maxSlide = this.detectMaxSlide();
    if (this.activeIndex < maxSlide) {
      this.activeIndex = Math.max(0, idx);
      this.magnet = 1;
      this.magnetFrom = this.offset;
      this.magnetTo = this.childOffset[this.activeIndex];
    }
  }

  /**
   * Обновление размеров враппера/детей
   */
  public realign() {
    const { width: wrapWidth, height: wrapHeight } = this.wrapper.getBoundingClientRect()!;
    const { width: parentWidth, height: parentHeight } = this.parent.getBoundingClientRect()!;

    const oldWidth = this.childWidth.reduce((prev, current) => prev + current, 0);
    this.width = parentWidth;
    this.fullWidth = wrapWidth;

    this.childWidth.length = 0;
    this.childOffset.length = 0;
    this.childWidth.push(
      ...Array.from(this.wrapper.children).map(
        (elem) => elem.getBoundingClientRect().width + this.spaceBetween,
      ),
    );
    let pos = 0;
    for (const off of this.childWidth) {
      this.childOffset.push(pos);
      pos += off;
    }

    if (oldWidth > 0 && wrapWidth > 0) {
      this.offset = (this.offset / oldWidth) * wrapWidth;
    }

    if (wrapHeight !== parentHeight) {
      this.parent.style.height = `${wrapHeight}px`;
    }
    this.updateOffset();
  }

  private updateOffset() {
    const maxOffset = this.childOffset[this.detectMaxSlide()];
    if (maxOffset) {
      const prg = this.offset / maxOffset;
      if (prg !== this.progress) {
        this.progress = prg;
        this.progressHandler(prg);
      }
    }

    this.wrapper.style.transform = `translateX(${this.offset * -1}px)`;
  }

  private dragStart() {
    this.allowClick = true;
    this.dragging = true;
    this.offsetOrigin = this.offset;
    this.prevScrollOffset = 0;
    this.inertia = 0;
  }

  private dragMove(x: number) {
    this.offset = this.clampOffset(this.offsetOrigin - x);
    this.activeIndex = this.detectIndex(this.offset);

    this.inertia += (x - this.prevScrollOffset) * 0.2;
    this.prevScrollOffset = x;

    this.updateOffset();
    if (Math.abs(x) > 5) {
      this.allowClick = false;
    }
  }

  private dragEnd() {
    this.dragging = false;
  }

  private handleClick(ev: Event) {
    if (!this.allowClick) {
      ev.preventDefault();
      ev.stopPropagation();

      return false;
    }
  }

  private handlePrevent(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();

    return false;
  }

  private frameUpdate(delta: number) {
    let { offset } = this;

    this.inertia *= 0.9 ** delta;
    if (Math.abs(this.inertia) < 0.001) {
      this.inertia = 0;
    }

    if (this.magnet > 0) {
      this.magnet = Math.max(this.magnet - 0.04 * delta, 0);
      offset =
        this.magnetTo + (this.magnetFrom - this.magnetTo) * (1.0 - easeOutCubic(1.0 - this.magnet));
    } else if (!this.dragging) {
      if (this.inertia === 0) {
        let needScroll = true;
        for (const off of this.childOffset) {
          if (offset === off) {
            this.activeIndex = this.detectIndex(this.offset);
            needScroll = false;
            break;
          }
        }
        if (needScroll) {
          this.magnet = 1;
          this.magnetFrom = this.offset;
          this.magnetTo = this.detectNearestOffset(this.offset);
          this.activeIndex = this.detectIndex(this.magnetTo);
        }
      } else {
        this.activeIndex = this.detectIndex(offset);
        offset -= this.inertia;
      }
    }

    offset = this.clampOffset(offset);
    if (offset !== this.offset) {
      this.offset = offset;
      this.updateOffset();
    }
  }

  private detectNearestOffset(offset: number) {
    let pos = 0;
    for (const w of this.childWidth) {
      if (pos + w > offset) {
        let target = pos;
        if ((offset - pos) / w > 0.5) {
          target += w;
        }

        return target;
      }
      pos += w;
    }

    return 0;
  }

  private detectIndex(offset: number) {
    for (let i = 0; i < this.childOffset.length; i++) {
      if (offset >= this.childOffset[i] && offset < this.childOffset[i] + this.childWidth[i]) {
        return i;
      }
    }

    return 0;
  }

  private detectMaxSlide() {
    return Math.max(
      this.childOffset.findIndex((off) => this.fullWidth - off < this.width),
      0,
    );
  }

  private clampOffset(offset: number) {
    if (this.fullWidth <= this.width) {
      return 0;
    }

    return Math.max(Math.min(offset, this.childOffset[this.detectMaxSlide()]), 0);
  }

  private static register(handler: SliderHandler) {
    if (this.handlers.length === 0) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const en of entries) {
          for (const hn of this.handlers) {
            if (hn.wrapper === en.target || hn.parent === en.target) {
              hn.realign();
              break;
            }
          }
        }
      });
      this.frameHandler = new FrameHandler((delta) => {
        for (const hn of this.handlers) {
          hn.frameUpdate(delta);
        }
      });
      this.frameHandler.start();
    }
    this.resizeObserver.observe(handler.wrapper, {
      box: 'border-box',
    });
    this.resizeObserver.observe(handler.parent, {
      box: 'border-box',
    });
    this.handlers.push(handler);
  }

  private static unregister(handler: SliderHandler) {
    this.resizeObserver.unobserve(handler.wrapper);
    this.resizeObserver.unobserve(handler.parent);
    this.handlers.splice(this.handlers.indexOf(handler), 1);
    if (this.handlers.length === 0) {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      if (this.frameHandler) {
        this.frameHandler.stop();
      }
    }
  }
}
