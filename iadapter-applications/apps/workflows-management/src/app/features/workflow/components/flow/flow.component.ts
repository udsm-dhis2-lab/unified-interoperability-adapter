/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  NgFlowchart,
  NgFlowchartCanvasDirective,
  NgFlowchartModule,
  NgFlowchartStepComponent,
} from '@joelwenzel/ng-flowchart';

export type NestedData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nested: any;
};

@Component({
  selector: 'app-flow',
  standalone: true,
  imports: [CommonModule, NgFlowchartModule],
  templateUrl: './flow.component.html',
  styleUrl: './flow.component.scss',
})
export class FlowComponent
  extends NgFlowchartStepComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(NgFlowchartCanvasDirective)
  nestedCanvas!: NgFlowchartCanvasDirective;

  @ViewChild('canvasContent')
  stepContent!: ElementRef<HTMLElement>;

  callbacks: NgFlowchart.Callbacks = {
    afterRender: () => {
      this.canvas.reRender(true);
    },
  };

  options: NgFlowchart.Options = {
    stepGap: 40,
    rootPosition: 'TOP_CENTER',
    zoom: {
      mode: 'DISABLED',
    },
    dragScroll: ['RIGHT'],
    manualConnectors: true,
  };

  constructor() {
    super();
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.addAlternateClass();
  }

  // add nested-alt class to alternate nested flows for better visibility
  addAlternateClass(): void {
    const parentCanvasWrapperClasses = (
      this.canvas.viewContainer.element.nativeElement as HTMLElement
    )?.parentElement?.classList;
    if (
      parentCanvasWrapperClasses?.contains('nested-flow-step') &&
      !parentCanvasWrapperClasses.contains('nested-alt')
    ) {
      this.nativeElement.classList.add('nested-alt');
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override shouldEvalDropHover(
    coords: number[],
    stepToDrop: NgFlowchart.Step
  ): boolean {
    const canvasRect: any =
      this.stepContent.nativeElement.getBoundingClientRect();
    return !this.areCoordsInRect(coords, canvasRect);
  }

  override toJSON() {
    const json = super.toJSON();
    return {
      ...json,
      data: {
        ...this.data,
        nested: this.nestedCanvas.getFlow().toObject(),
      },
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override canDrop(dropEvent: NgFlowchart.DropTarget): boolean {
    return true;
  }

  override canDeleteStep(): boolean {
    return true;
  }

  override async onUpload(data: NestedData) {
    if (!this.nestedCanvas) {
      return;
    }
    await this.nestedCanvas.getFlow().upload(data.nested);
  }

  // private areCoordsInRect(coords: number[], rect: Partial<DOMRect>): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private areCoordsInRect(coords: number[], rect: any): boolean {
    return (
      this.isNumInRange(coords[0], rect.left, rect.left + rect.width) &&
      this.isNumInRange(coords[1], rect.top, rect.top + rect.height)
    );
  }

  private isNumInRange(num: number, start: number, end: number): boolean {
    return num >= start && num <= end;
  }
}
