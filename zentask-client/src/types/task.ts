// src/types/task.ts
export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: number;
  title: string;
  description?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  status: TaskStatus;
  dueDate?: string | null; // ISO string or null
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
}

export type CreateTaskData = {
  title: string;
  description?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string | null; // '' or ISO or null
  status?: TaskStatus;
};