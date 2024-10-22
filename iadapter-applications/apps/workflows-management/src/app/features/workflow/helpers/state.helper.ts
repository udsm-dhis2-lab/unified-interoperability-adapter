import { Pager } from '../models/pager.model';
import { ProcessAPIResult } from '../models/process.model';
import { TaskAPIResult } from '../models/task.model';
import { WorkflowAPIResult } from '../models/workflow.model';

export function updateInitialWorkflowPagerState(
    initialPagerState: Pager,
    workflowAPIResult: WorkflowAPIResult
): Pager {
    return {
        ...initialPagerState,
        page: workflowAPIResult.page,
        total: workflowAPIResult.total,
        pageSize: workflowAPIResult.pageSize,
    };
}

export function updateInitialProcessPagerState(
    initialPagerState: Pager,
    ProcessAPIResult: ProcessAPIResult
): Pager {
    return {
        ...initialPagerState,
        page: ProcessAPIResult.page,
        total: ProcessAPIResult.total,
        pageSize: ProcessAPIResult.pageSize,
    };
}

export function updateInitialTaskPagerState(
    initialPagerState: Pager,
    taskAPIResult: TaskAPIResult
): Pager {
    return {
        ...initialPagerState,
        page: taskAPIResult.page,
        total: taskAPIResult.total,
        pageSize: taskAPIResult.pageSize,
    };
}
