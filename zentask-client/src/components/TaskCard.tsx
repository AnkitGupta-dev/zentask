// src/components/TaskCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Trash2, Edit, GripVertical } from 'lucide-react';
import { Task } from '@/types/task';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  // Make the sortable item use the numeric id as string
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id.toString() });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // safe date checks
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <Card
      // attach the ref so dnd-kit knows this element is the sortable item
      ref={setNodeRef}
      style={style}
      className={`task-card cursor-default hover:scale-[1.02] transition-transform ${
        task.status === 'todo' ? 'status-todo' :
        task.status === 'inprogress' ? 'status-inprogress' :
        'status-done'
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2">
              {task.title}
            </h3>
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {task.description}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 ml-2">
            {/* Drag handle: attach dnd-kit attributes/listeners here only */}
            <div
              {...attributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded hover:bg-muted/50 cursor-grab"
              title="Drag"
              aria-hidden
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onEdit(task);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-100 transition-opacity text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                // small confirm to avoid accidental deletes
                const ok = window.confirm('Delete this task?');
                if (ok) onDelete(task.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
  variant="secondary"
  className={`text-xs ${priorityColors[task.priority || 'medium']}`}
>
  {(task.priority || 'medium').charAt(0).toUpperCase() + (task.priority || 'medium').slice(1)}
</Badge>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span className={isOverdue ? 'text-destructive font-medium' : ''}>
              {formatDate(task.dueDate)}
            </span>
            {isOverdue && <Clock className="h-3 w-3 text-destructive ml-1" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;