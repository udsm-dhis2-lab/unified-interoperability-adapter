import { Workflow } from '../../workflow/models/workflow.model';
import { Task } from './task.model';

export interface ScheduleAPIResult {
  page: number;
  total: number;
  pageSize: number;
  schedules: Schedule[];
}

export interface Schedule {
  id: string;
  created: string;
  updated: string;
  name: string;
  description: string;
  createdBy?: CreatedBy;
  updatedBy?: UpdatedBy;
  status?: string;
}

export interface Schedule {
  id: string;
  created: string;
  updated: string;
  name: string;
  description: string;
  status?: string;
  cron?: string;
  nextRun?: string;
  createdBy?: CreatedBy;
  workflow?: Workflow;
  checked: boolean;
  expand: boolean;
  disabled?: boolean;
  error?: string;
  parameters: any;
  task?: Task
}

export interface ScheduleTable {
  id: string;
  created: string;
  updated: string;
  code: string;
  name: string;
  description: string;
  status?: string;
  cron?: string;
  createdBy?: CreatedBy;
  workflow?: Workflow;
  checked: boolean;
  expand: boolean;
  disabled?: boolean;
  error?: string;
  parameters: any;
  nextRun?: string;
  task?: Task
}

export interface ScheduleFormCreate {
  name: string;
  description: string;
}

export interface DeleteResponse {
  message: string;
}

export interface CreatedBy {
  id: string;
  created: string;
  updated: string;
  lastLogin: string;
  username: string;
  dp: string;
  name: string;
  active: boolean;
}

export interface UpdatedBy {
  id: string;
  created: string;
  updated: string;
  lastLogin: string;
  username: string;
  dp: string;
  name: string;
  active: boolean;
}

export interface CreatedBy {
  id: string;
  created: string;
  updated: string;
  lastLogin: string;
  username: string;
  dp: string;
  name: string;
  active: boolean;
}
