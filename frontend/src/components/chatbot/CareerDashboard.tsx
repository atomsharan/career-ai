import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Briefcase, GraduationCap, Users, TrendingUp } from 'lucide-react';

interface CareerDashboardProps {
  // Replace `any` with the actual type of your dashboard data
  dashboardData: any;
  onReset: () => void;
}

export function CareerDashboard({ dashboardData, onReset }: CareerDashboardProps) {
  // In a real app, you would use the `dashboardData` prop to render dynamic content.
  // For now, we'll keep the mock structure.

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Your Personalized Career Dashboard</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Based on your assessment, here's what we recommend for you:
        </p>
      </div>

      {/* Recommended Career Path */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Top Career Match
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Software Engineer</h4>
              <p className="text-xs text-muted-foreground">95% Match</p>
            </div>
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Perfect Fit
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Learning Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-secondary" />
            Recommended Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Python Programming</span>
              <span>0%</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Web Development</span>
              <span>0%</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Data Structures</span>
              <span>0%</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Job Opportunities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            Available Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Junior Developer Positions</span>
              <Badge variant="secondary" className="text-xs">25 Jobs</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Internship Programs</span>
              <Badge variant="secondary" className="text-xs">12 Available</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={onReset}
        variant="outline" 
        className="w-full text-sm"
      >
        Take Assessment Again
      </Button>
    </div>
  );
}