import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from 'recharts';
import { TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { Task } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

const COLORS = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#3b82f6',
};

const Analytics: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
      calculateAnalytics(response.data);
    } catch (error) {
      console.error("Analytics fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks for analytics.",
        variant: "destructive",
      });
    }
  };

  const calculateAnalytics = (tasks: Task[]) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;

    const completionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    const priorityCounts = { high: 0, medium: 0, low: 0 };
    tasks.forEach(t => {
      priorityCounts[t.priority || 'medium']++;
    });

    const tasksByPriority = Object.entries(priorityCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: COLORS[name as keyof typeof COLORS],
    }));

    // Weekly progress (Mon-Sun)
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyProgressMap: Record<string, { day: string; completed: number; created: number }> = {};
    days.forEach(d => {
      weeklyProgressMap[d] = { day: d, completed: 0, created: 0 };
    });

    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 6);

    tasks.forEach(task => {
      const created = new Date(task.createdAt!);
      const updated = new Date(task.updatedAt!);

      if (created >= oneWeekAgo && created <= now) {
        const day = days[created.getDay()];
        weeklyProgressMap[day].created++;
      }
      if (task.status === 'done' && updated >= oneWeekAgo && updated <= now) {
        const day = days[updated.getDay()];
        weeklyProgressMap[day].completed++;
      }
    });

    const weeklyProgress = days.map(d => weeklyProgressMap[d]);

    setAnalyticsData({
      completionRate,
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      tasksByPriority,
      weeklyProgress,
    });
  };

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { title: 'Total Tasks', value: analyticsData.totalTasks, icon: <CheckCircle className="h-5 w-5 text-primary" />, color: 'text-primary' },
    { title: 'Completed', value: analyticsData.completedTasks, icon: <CheckCircle className="h-5 w-5 text-success" />, color: 'text-success' },
    { title: 'In Progress', value: analyticsData.inProgressTasks, icon: <Clock className="h-5 w-5 text-warning" />, color: 'text-warning' },
    { title: 'Todo', value: analyticsData.todoTasks, icon: <AlertCircle className="h-5 w-5 text-muted-foreground" />, color: 'text-muted-foreground' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your productivity and task completion trends
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className="p-2 bg-muted rounded-lg">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Completion Rate + Priority */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-success mb-2">{analyticsData.completionRate}%</div>
                <p className="text-sm text-muted-foreground">Great job! You're staying on track.</p>
                <div className="mt-4 bg-muted rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-success to-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analyticsData.completionRate}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 shadow-soft">
            <CardHeader>
              <CardTitle>Tasks by Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.tasksByPriority}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.tasksByPriority.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                {analyticsData.tasksByPriority.map((item: any, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}: {item.value}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
            <p className="text-sm text-muted-foreground">Track your task completion and creation patterns</p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="hsl(var(--success))" strokeWidth={3} dot={{ fill: "hsl(var(--success))", r: 4 }} name="Completed Tasks" />
                  <Line type="monotone" dataKey="created" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", r: 4 }} name="Created Tasks" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;