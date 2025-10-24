/**
 * Review Sessions Component for PsicoGuía
 * Enhanced with voice integration, adaptive AI, and long-term memory
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, onValue, push, set, serverTimestamp } from 'firebase/database';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Brain, Send, Clock, Star, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

// TODO: Genkit should be called via API routes, not directly in client components
// import { ai } from '@/lib/genkit-config';

interface ReviewMessage {
  id: string;
  sender: string; // 'student' | 'expert'
  senderName: string;
  content: string;
  timestamp: number;
  type: 'message' | 'system';
}

interface ReviewSession {
  id: string;
  topic: string;
  difficulty: string;
  student: string;
  expert: string; // AI expert ID
  status: 'waiting' | 'active' | 'completed';
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  rating?: number;
}

interface ReviewSessionProps {
  sessionId: string;
}

interface UserMemory {
  pastSessions: { topic: string; difficulty: string; rating: number; date: string }[];
  preferences: { style: string; weaknesses: string[]; strengths: string[] };
  currentLevel: number; // 1-5 based on performance
}

const availableTopics = [
  'Psicología Cognitiva',
  'Psicoanálisis',
  'Psicología Social',
  'Neurociencia',
  'Psicología del Desarrollo',
  'Terapia Cognitivo-Conductual',
  'Psicología Clínica',
  'Metodología de la Investigación'
];

const difficulties = [
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' }
];

export function ReviewSessionComponent({ sessionId }: ReviewSessionProps) {
  const [user] = useAuthState(auth);
  const [session, setSession] = useState<ReviewSession | null>(null);
  const [messages, setMessages] = useState<ReviewMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [expertTyping, setExpertTyping] = useState(false);
  const [userMemory, setUserMemory] = useState<UserMemory | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Load user memory and performance data
  useEffect(() => {
    if (!user) return;

    const loadUserMemory = async () => {
      const memoryRef = doc(db, 'userMemory', user.uid);
      const snapshot = await getDoc(memoryRef);

      if (snapshot.exists()) {
        setUserMemory(snapshot.data() as UserMemory);
      } else {
        // Initialize default memory
        const defaultMemory: UserMemory = {
          pastSessions: [],
          preferences: { style: 'visual', weaknesses: [], strengths: [] },
          currentLevel: 1
        };
        await setDoc(memoryRef, defaultMemory);
        setUserMemory(defaultMemory);
      }
    };

    loadUserMemory();
  }, [user]);

  useEffect(() => {
    if (!sessionId || !user) return;

    const sessionRef = ref(`reviewSessions/${sessionId}`);
    const messagesRef = ref(`reviewSessions/${sessionId}/messages`);

    const unsubscribeSession = onValue(sessionRef, (snapshot) => {
      const sessionData = snapshot.val();
      if (sessionData) {
        setSession({ id: sessionId, ...sessionData });
      }
      setIsLoading(false);
    });

    const unsubscribeMessages = onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      if (messagesData) {
        const messagesList = Object.entries(messagesData).map(([id, msg]: [string, any]) => ({
          id,
          ...msg,
        }));
        setMessages(messagesList.sort((a, b) => a.timestamp - b.timestamp));
      }
    });

    return () => {
      unsubscribeSession();
      unsubscribeMessages();
    };
  }, [sessionId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (session && session.status === 'active' && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'student' && !expertTyping) {
        setExpertTyping(true);
        // Use Genkit for sophisticated AI responses
        generateExpertResponse(lastMessage.content);
      }
    }
  }, [session, messages, expertTyping, userMemory]);

  const generateExpertResponse = async (studentMessage: string) => {
    if (!session || !user || !userMemory) return;

    try {
      // TODO: Replace with API route call to genkit
      // For now, using a simple response
      const expertResponse = `Gracias por tu pregunta sobre ${session.topic}. Como experto en este tema a nivel ${session.difficulty}, te puedo ayudar a profundizar en estos conceptos. [Función de AI temporalmente deshabilitada - usar API routes]`;

      const messagesRef = ref(`reviewSessions/${sessionId}/messages`);
      const newMessageRef = push(messagesRef);

      await set(newMessageRef, {
        sender: 'expert',
        senderName: `Dr. ${session.topic.split(' ')[0]} Expert`,
        content: expertResponse,
        timestamp: serverTimestamp(),
        type: 'message',
      });

      // TODO: Update user memory with ML insights when genkit is integrated via API
      // For now, just track the session
      const updatedMemory = {
        ...userMemory,
        pastSessions: [
          ...userMemory.pastSessions,
          {
            topic: session.topic,
            difficulty: session.difficulty,
            rating: 0,
            date: new Date().toISOString(),
          },
        ],
      };

      const memoryRef = doc(db, 'userMemory', user.uid);
      await setDoc(memoryRef, updatedMemory);

    } catch (error) {
      console.error('Error generating expert response:', error);
      // Fallback to simple response
      const fallbackResponse = `Interesante pregunta sobre ${session.topic}. Vamos a profundizar en ${session.difficulty} nivel...`;

      const messagesRef = ref(`reviewSessions/${sessionId}/messages`);
      const newMessageRef = push(messagesRef);

      await set(newMessageRef, {
        sender: 'expert',
        senderName: `Dr. ${session.topic.split(' ')[0]} Expert`,
        content: fallbackResponse,
        timestamp: serverTimestamp(),
        type: 'message',
      });
    } finally {
      setExpertTyping(false);
    }
  };

  const updateUserMemory = async (topic: string, difficulty: string, rating: number) => {
    if (!user || !userMemory) return;

    const updatedMemory = {
      ...userMemory,
      pastSessions: [
        ...userMemory.pastSessions,
        { topic, difficulty, rating, date: new Date().toISOString() }
      ],
      currentLevel: Math.min(5, userMemory.currentLevel + (rating >= 4 ? 0.1 : -0.1))
    };

    const memoryRef = doc(db, 'userMemory', user.uid);
    await setDoc(memoryRef, updatedMemory);
    setUserMemory(updatedMemory);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !session) return;

    const messagesRef = ref(`reviewSessions/${sessionId}/messages`);
    const newMessageRef = push(messagesRef);

    await set(newMessageRef, {
      sender: 'student',
      senderName: user.displayName || 'Student',
      content: newMessage.trim(),
      timestamp: serverTimestamp(),
      type: 'message',
    });

    setNewMessage('');
  };

  const rateSession = async (rating: number) => {
    if (!session) return;

    const sessionRef = ref(`reviewSessions/${sessionId}`);
    await set(sessionRef, {
      ...session,
      rating,
      status: 'completed',
      endedAt: serverTimestamp(),
    });

    await updateUserMemory(session.topic, session.difficulty, rating);
  };

  // Voice integration using Web Speech API
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'es-ES';

    recognitionRef.current.onstart = () => setIsListening(true);
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setNewMessage(transcript);
    };
    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    recognitionRef.current.onend = () => setIsListening(false);

    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window && isVoiceEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  // Speak expert messages automatically
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'expert' && isVoiceEnabled) {
        speakText(lastMessage.content);
      }
    }
  }, [messages, isVoiceEnabled]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading review session...</div>
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Session not found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Sesión de Repaso: {session.topic}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{difficulties.find(d => d.value === session.difficulty)?.label}</Badge>
              <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                {session.status === 'active' ? 'En Progreso' : 'Completada'}
              </Badge>
              {userMemory && (
                <Badge variant="outline">
                  Nivel: {Math.round(userMemory.currentLevel)}/5
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            >
              {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Star className="h-4 w-4" />
            {session.rating && <span>{session.rating}/5</span>}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Messages Area */}
          <ScrollArea className="h-96 w-full border rounded-md p-4">
            <div className="space-y-4">
              {messages.length === 0 && session.status === 'waiting' && (
                <div className="text-center text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Tu experto en {session.topic} se está conectando...</p>
                  <p className="text-sm">Comienza la conversación haciendo una pregunta o usando el micrófono.</p>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg ${
                    message.sender === 'student'
                      ? 'bg-primary text-primary-foreground ml-4'
                      : 'bg-muted mr-4'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{message.senderName}</span>
                      <span className="text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}

              {expertTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg mr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">Dr. Expert</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input with Voice */}
          {session.status === 'active' && (
            <div className="flex space-x-2">
              <Input
                placeholder="Haz una pregunta sobre el tema... (o usa el micrófono)"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button
                variant={isListening ? "destructive" : "outline"}
                onClick={isListening ? stopListening : startListening}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Rating */}
          {session.status === 'completed' && !session.rating && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">¿Cómo calificarías esta sesión?</h4>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    onClick={() => rateSession(star)}
                  >
                    <Star className={`h-4 w-4 ${star <= (session.rating || 0) ? 'fill-current' : ''}`} />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ReviewSessionComponent;
