import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ActivatedRoute, Router } from '@angular/router';
import { ProcessSummaryComponent } from '../../components/process-summary/process-summary.component';
import { Process } from '../../models/process.model';
import { Observable, of, take } from 'rxjs';
import { WorkflowState } from '../../state/workflow/workflow.state';
import { select, Store } from '@ngrx/store';
import { getCurrentSelectedProcess } from '../../state/workflow/workflow.selectors';
import {
  extractUidFromUrl,
  getUidFromRoute,
} from '../../helpers/workflow.helper';
import { getCurrentUrl } from 'apps/workflows-management/src/app/state/router.selector';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    ProcessSummaryComponent,
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss',
})
export class EditorComponent implements OnInit, AfterViewInit {
  currentSelectedProcess$: Observable<Process | null> = of(null);
  currentWorkflowUid!: string | null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private workflowState: Store<WorkflowState>
  ) {}

  ngAfterViewInit(): void {
    this.currentWorkflowUid = getUidFromRoute(this.route);
  }

  ngOnInit(): void {
    this.currentSelectedProcess$ = this.workflowState.pipe(
      select(getCurrentSelectedProcess)
    );
  }

  onOpenEditor() {
    this.workflowState
      .pipe(select(getCurrentUrl), take(1))
      .subscribe((route: string) => {
        if (route) {
          this.currentWorkflowUid = extractUidFromUrl(route);

          if (this.currentWorkflowUid) {
            // const uid = decodeURIComponent(this.currentWorkflowUid);
            // this.router.navigate([decodeURIComponent('main/code-editor'), uid]);
            this.router.navigate(['/', 'config','code-editor', this.currentWorkflowUid]);
          }
        }
      });
  }
}
