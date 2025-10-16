import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bot, User, Send, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { CareerDashboard } from './CareerDashboard';

// Define a type for the API response data
interface CareerDashboardData {
  // Define the structure of your dashboard data from the API
  // For now, we'll use `any` as a placeholder.
  [key: string]: any;
}

interface ChatbotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  stream: string;
  marks: string;
  interests: string;
  mood: string;
}

interface Message {
  type: 'bot' | 'user';
  content: string;
}

const postAssessment = async (formData: FormData): Promise<CareerDashboardData> => {
  const { data } = await api.post('/api/chatbot/assessment', formData);
  return data;
};

export function ChatbotDialog({ open, onOpenChange }: ChatbotDialogProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    stream: '',
    marks: '',
    interests: '',
    mood: ''
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      type: 'bot',
      content: "Hi! I'm your AI Career Assistant. I'll help you discover your perfect career path through a quick assessment. Let's start with your name!"
    }
  ]);

  const assessmentMutation = useMutation<CareerDashboardData, Error, FormData>({
    mutationFn: postAssessment,
  });

  const { data: dashboardData, isPending, isError, error } = assessmentMutation;

  const showDashboard = dashboardData !== undefined && !isError;

  const isLoading = isPending;

  const questions = [
    {
      field: 'name' as keyof FormData,
      question: "What's your name?",
      type: 'input',
      placeholder: 'Enter your full name'
    },
    {
      field: 'stream' as keyof FormData,
      question: "What's your academic stream or field of study?",
      type: 'select',
      options: [
        'Computer Science & IT',
        'Engineering',
        'Business & Management',
        'Arts & Humanities',
        'Science & Research',
        'Healthcare & Medicine',
        'Design & Creative Arts'
      ]
    },
    {
      field: 'marks' as keyof FormData,
      question: "What's your current academic performance?",
      type: 'select',
      options: ['90-100%', '80-89%', '70-79%', '60-69%', 'Below 60%']
    },
    {
      field: 'interests' as keyof FormData,
      question: "Tell me about your career interests and goals:",
      type: 'textarea',
      placeholder: 'Describe what excites you professionally...'
    },
    {
      field: 'mood' as keyof FormData,
      question: "How are you feeling about your career journey right now?",
      type: 'select',
      options: ['Excited & Confident', 'Curious & Open', 'Uncertain but Hopeful', 'Overwhelmed', 'Stressed']
    }
  ];

  const handleSubmit = (value: string) => {
    const currentField = questions[step].field;
    const newFormData = { ...formData, [currentField]: value };
    setFormData(newFormData);
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: value }]);
    
    if (step < questions.length - 1) {
      // Move to next question
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: questions[step + 1].question 
        }]);
        setStep(step + 1);
      }, 500);
    } else {
      // Assessment complete
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: `Perfect, ${newFormData.name}! Based on your responses, I'm generating a personalized career roadmap for you. This might take a moment...` 
        }]);
        assessmentMutation.mutate(newFormData);
      }, 500);
    }
  };

  const QuestionForm = () => {
    const currentQuestion = questions[step];
    const [inputValue, setInputValue] = useState('');

    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSubmit(inputValue);
        setInputValue('');
      }
    };

    return (
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {currentQuestion.type === 'input' && (
          <div>
            <Label htmlFor="input">{currentQuestion.question}</Label>
            <Input
              id="input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="mt-2 h-12 px-4"
              autoFocus
            />
          </div>
        )}
        
        {currentQuestion.type === 'textarea' && (
          <div>
            <Label htmlFor="textarea">{currentQuestion.question}</Label>
            <Textarea
              id="textarea"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="mt-2 p-4 min-h-[100px]"
              rows={4}
              autoFocus
            />
          </div>
        )}
        
        {currentQuestion.type === 'select' && (
          <div>
            <Label>{currentQuestion.question}</Label>
            <Select value={inputValue} onValueChange={setInputValue}>
              <SelectTrigger className="mt-2 h-12 px-4">
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full h-12 text-white font-medium"
          style={{ background: 'var(--gradient-assessment)' }}
          disabled={!inputValue.trim()}
        >
          <Send className="h-5 w-5 mr-2" />
          Send
        </Button>
      </form>
    );
  };

  const resetChat = () => {
    setStep(0);
    setFormData({ name: '', stream: '', marks: '', interests: '', mood: '' });
    assessmentMutation.reset();
    setMessages([{
      type: 'bot',
      content: "Hi! I'm your AI Career Assistant. I'll help you discover your perfect career path through a quick assessment. Let's start with your name!"
    }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] w-full max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            AI Career Assistant
          </DialogTitle>
        </DialogHeader>

        {showDashboard ? (
          <div className="flex-1 overflow-y-auto">
            <CareerDashboard dashboardData={dashboardData} onReset={resetChat} />
          </div>
        ) : isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="font-medium text-foreground">Analyzing your profile...</p>
            <p className="text-sm text-muted-foreground">This will just take a moment.</p>
          </div>
        ) : isError ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive" />
            <p className="font-medium text-foreground">Something went wrong</p>
            <p className="text-sm text-destructive">{error.message}</p>
            <Button onClick={resetChat} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-60">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3 animate-fade-in",
                    message.type === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.type === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] p-3 rounded-lg text-sm",
                      message.type === 'bot'
                        ? "bg-muted text-foreground"
                        : "bg-primary text-primary-foreground ml-auto"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-accent" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Question Form */}
            <div className="border-t pt-4">
              <QuestionForm />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}