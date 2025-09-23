import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TaskBoard from '@/components/TaskBoard';
import AddTaskModal from '@/components/AddTaskModal';
import Navbar from '@/components/Navbar';
import { Task, CreateTaskData } from '@/types/task';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error("Fetch tasks error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks from backend.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (taskData: CreateTaskData) => {
    try {
      await api.post('/tasks', { ...taskData, status: "todo" });
      await fetchTasks(); // reload after add
      toast({
        title: "Success",
        description: "Task created successfully!",
      });
    } catch (error) {
      console.error("Create task error:", error);
      toast({
        title: "Error",
        description: "Failed to create task.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      await api.put(`/tasks/${taskId}`, updates);
      await fetchTasks(); // reload after update
      toast({
        title: "Success",
        description: "Task updated successfully!",
      });
    } catch (error) {
      console.error("Update task error:", error);
      toast({
        title: "Error",
        description: "Failed to update task.",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsAddModalOpen(true);
  };

  const handleEditSubmit = async (taskData: CreateTaskData) => {
    if (!editingTask) return;
    await handleUpdateTask(editingTask.id, taskData);
    setEditingTask(null);
    setIsAddModalOpen(false);
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      await fetchTasks(); // reload after delete
      toast({
        title: "Success",
        description: "Task deleted successfully!",
      });
    } catch (error) {
      console.error("Delete task error:", error);
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive",
      });
    }
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingTask(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.name || "User"}!
            </h1>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="gradient-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        <TaskBoard
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />

        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSubmit={editingTask ? handleEditSubmit : handleAddTask}
          editingTask={editingTask}
        />
      </div>
    </div>
  );
};

export default Dashboard;