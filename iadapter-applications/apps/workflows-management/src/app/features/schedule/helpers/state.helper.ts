import { Pager } from '../models/pager.model';
import { ScheduleAPIResult } from '../models/schedule.model';

export function updateInitialSchedulePagerState(
    initialPagerState: Pager,
    ScheduleAPIResult: ScheduleAPIResult
): Pager {
    return {
        ...initialPagerState,
        page: ScheduleAPIResult.page,
        total: ScheduleAPIResult.total,
        pageSize: ScheduleAPIResult.pageSize,
    };
}
