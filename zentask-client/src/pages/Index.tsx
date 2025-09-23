import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout, BarChart3, Zap, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen gradient-subtle">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                <Layout className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              ZenTask
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your productivity with our intuitive task management dashboard. 
              Organize, track, and complete your goals with zen-like clarity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gradient-primary hover:opacity-90 transition-opacity text-lg px-8">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything you need to stay productive</h2>
          <p className="text-muted-foreground text-lg">
            Powerful features designed to help you focus on what matters most
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-medium border-0">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Layout className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Kanban Boards</h3>
              <p className="text-muted-foreground">
                Organize your tasks with intuitive drag-and-drop boards. 
                Visualize your workflow from todo to done.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-0">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics</h3>
              <p className="text-muted-foreground">
                Track your productivity with detailed analytics and insights. 
                See your progress and identify areas for improvement.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-medium border-0">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Built for speed and efficiency. Add, edit, and manage tasks 
                without any lag or complexity.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to boost your productivity?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of users who have transformed their workflow with ZenTask
            </p>
            <Link to="/register">
              <Button size="lg" className="gradient-primary hover:opacity-90 transition-opacity text-lg px-8">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
