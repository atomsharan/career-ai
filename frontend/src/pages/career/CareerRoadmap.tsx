import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, Circle, Lock, Plus, Trash2, Edit, Clock, Target, BookOpen, ExternalLink } from 'lucide-react';
import { useRoadmap } from '@/contexts/RoadmapContext';
import { useNavigate } from 'react-router-dom';

const CareerRoadmap = () => {
  const navigate = useNavigate();
  const { roadmapItems, addRoadmapItem, updateRoadmapItem, deleteRoadmapItem, generateRoadmapFromChat } = useRoadmap();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    estimatedTime: '',
    skills: [] as string[],
    resources: [] as string[]
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Circle className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const handleAddItem = () => {
    if (newItem.title && newItem.description) {
      addRoadmapItem({
        ...newItem,
        status: 'pending',
        source: 'user-added'
      });
      setNewItem({
        title: '',
        description: '',
        priority: 'medium',
        estimatedTime: '',
        skills: [],
        resources: []
      });
      setIsAddingItem(false);
    }
  };

  const handleGenerateFromChat = () => {
    const message = prompt('What career path or skill would you like a roadmap for?');
    if (message) {
      generateRoadmapFromChat(message);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Your Career Roadmap</h1>
            <p className="text-muted-foreground text-lg">Personalized learning path tailored to your goals</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateFromChat}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
            >
              <Target className="h-4 w-4 mr-2" />
              Generate from AI
            </Button>
            <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Roadmap Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={newItem.title}
                      onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                      placeholder="e.g., Learn React Advanced Patterns"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder="Describe what you want to learn or achieve..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Priority</label>
                      <select
                        value={newItem.priority}
                        onChange={(e) => setNewItem({...newItem, priority: e.target.value as 'high' | 'medium' | 'low'})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Estimated Time</label>
                      <Input
                        value={newItem.estimatedTime}
                        onChange={(e) => setNewItem({...newItem, estimatedTime: e.target.value})}
                        placeholder="e.g., 2-3 months"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddItem} className="flex-1">
                      Add Item
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {roadmapItems.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No roadmap items yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your career path by adding items or asking our AI mentor for suggestions.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setIsAddingItem(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
                <Button variant="outline" onClick={handleGenerateFromChat}>
                  <Target className="h-4 w-4 mr-2" />
                  Ask AI Mentor
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {roadmapItems.map((item, index) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      {getStatusIcon(item.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{item.title}</h3>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('-', ' ')}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(item.priority)}>
                            {item.priority} priority
                          </Badge>
                          {item.source === 'ai-generated' && (
                            <Badge variant="outline" className="text-purple-600 border-purple-200">
                              AI Generated
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {item.estimatedTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {item.estimatedTime}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {item.skills.length} skills
                          </div>
                          <div className="flex items-center gap-1">
                            <ExternalLink className="h-4 w-4" />
                            {item.resources.length} resources
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateRoadmapItem(item.id, {
                          status: item.status === 'completed' ? 'pending' : 
                                  item.status === 'in-progress' ? 'completed' : 'in-progress'
                        })}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRoadmapItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {item.skills.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-2">Skills to Learn:</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {item.resources.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Resources:</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.resources.map((resource, resourceIndex) => (
                          <Badge key={resourceIndex} variant="secondary" className="text-xs">
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Need personalized guidance?</h3>
            <p className="text-muted-foreground mb-4">
              Our AI mentor can help you create a customized roadmap based on your goals and current skills.
            </p>
            <Button 
              onClick={() => navigate('/chatbot')}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
            >
              <Target className="h-4 w-4 mr-2" />
              Ask AI Mentor
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CareerRoadmap;