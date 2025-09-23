// src/components/TaskBoard.tsx
import React from "react";
import { Task, TaskStatus } from "@/types/task";
import TaskCard from "./TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DndContext,
  DragEndEvent,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface TaskBoardProps {
  tasks: Task[];
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "To Do", color: "bg-todo" },
  { id: "inprogress", title: "In Progress", color: "bg-inprogress" },
  { id: "done", title: "Done", color: "bg-done" },
];

const Column: React.FC<{
  columnId: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
}> = ({ columnId, title, color, tasks, onEditTask, onDeleteTask }) => {
  // Register column itself as droppable
  const { setNodeRef } = useDroppable({ id: columnId });

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {tasks.length}
          </Badge>
        </div>
        <div className={`h-1 rounded-full ${color}`} />
      </CardHeader>

      <CardContent>
        {/* Column droppable area */}
        <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[200px]">
          <SortableContext
            id={columnId}
            items={tasks.map((t) => t.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task) => (
              <div key={task.id} className="group">
                <TaskCard
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              </div>
            ))}
          </SortableContext>

          {/* Always leave a drop zone at bottom */}
          <div className="flex-1 h-10 border-2 border-dashed border-transparent hover:border-muted rounded-lg transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
};

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onUpdateTask,
  onEditTask,
  onDeleteTask,
}) => {
  // sensors (optional but makes dragging smoother)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over) return;

  const taskId = Number(active.id);

  // If over is a column → use it directly
  // If over is a task → use its containerId
  const overData: any = over.data?.current;
  const containerId =
    overData?.sortable?.containerId || over.id;

  if (!["todo", "inprogress", "done"].includes(containerId)) return;

  const newStatus = containerId as TaskStatus;

  const task = tasks.find((t) => t.id === taskId);
  if (!task || task.status === newStatus) return;

  onUpdateTask(taskId, { status: newStatus });
};

  const getTasksByStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <Column
            key={col.id}
            columnId={col.id}
            title={col.title}
            color={col.color}
            tasks={getTasksByStatus(col.id)}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default TaskBoard;