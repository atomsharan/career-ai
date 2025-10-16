import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/api';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  skills: string[];
  resources: string[];
  createdAt: string;
  source: 'ai-generated' | 'user-added';
}

interface RoadmapContextType {
  roadmapItems: RoadmapItem[];
  isLoading: boolean;
  error: string | null;
  addRoadmapItem: (item: Omit<RoadmapItem, 'id' | 'createdAt'>) => void;
  updateRoadmapItem: (id: string, updates: Partial<RoadmapItem>) => void;
  deleteRoadmapItem: (id: string) => void;
  generateRoadmapFromChat: (message: string) => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const RoadmapProvider = ({ children }: { children: ReactNode }) => {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load roadmap items from localStorage on mount
  useEffect(() => {
    const savedRoadmap = localStorage.getItem('career-roadmap');
    if (savedRoadmap) {
      try {
        setRoadmapItems(JSON.parse(savedRoadmap));
      } catch (e) {
        console.error('Error loading roadmap from localStorage:', e);
      }
    }
  }, []);

  // Save roadmap items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('career-roadmap', JSON.stringify(roadmapItems));
  }, [roadmapItems]);

  const addRoadmapItem = (item: Omit<RoadmapItem, 'id' | 'createdAt'>) => {
    const newItem: RoadmapItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setRoadmapItems(prev => [...prev, newItem]);
  };

  const updateRoadmapItem = (id: string, updates: Partial<RoadmapItem>) => {
    setRoadmapItems(prev =>
      prev.map(item => item.id === id ? { ...item, ...updates } : item)
    );
  };

  const deleteRoadmapItem = (id: string) => {
    setRoadmapItems(prev => prev.filter(item => item.id !== id));
  };

  const generateRoadmapFromChat = async (message: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the chatbot API to generate roadmap suggestions
      const response = await api.post('/api/chat/ask/', {
        message: `Generate a detailed career roadmap based on: ${message}. Provide specific steps, skills needed, and timeframes.`,
        conversation_id: 'roadmap-generation'
      });
      
      // Parse the AI response and create roadmap items
      // This is a simplified version - you might want to enhance the parsing
      const aiResponse = response.data.reply;
      
      // For now, create a sample roadmap item based on the message
      const roadmapItem: Omit<RoadmapItem, 'id' | 'createdAt'> = {
        title: `Career Path: ${message}`,
        description: aiResponse || `Personalized roadmap for ${message}`,
        status: 'pending',
        priority: 'high',
        estimatedTime: '3-6 months',
        skills: ['Communication', 'Problem Solving', 'Technical Skills'],
        resources: ['Online Courses', 'Mentorship', 'Practice Projects'],
        source: 'ai-generated'
      };
      
      addRoadmapItem(roadmapItem);
    } catch (e) {
      setError('Failed to generate roadmap from chat');
      console.error('Error generating roadmap:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoadmapContext.Provider value={{
      roadmapItems,
      isLoading,
      error,
      addRoadmapItem,
      updateRoadmapItem,
      deleteRoadmapItem,
      generateRoadmapFromChat
    }}>
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = () => {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};
