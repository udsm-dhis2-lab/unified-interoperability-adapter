import { Pager } from '../models/pager.model';
import { WorkflowAPIResult } from '../models/workflow.model';

export function updateInitialPagerState(
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
