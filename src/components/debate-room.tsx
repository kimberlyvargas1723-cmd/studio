/**
 * Debate Room Component for PsicoGuía
 * Real-time collaborative learning through Firebase Realtime Database
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, onValue, push, set, serverTimestamp } from 'firebase/database';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Send, ThumbsUp, ThumbsDown } from 'lucide-react';

interface DebateMessage {
  id: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: number;
  reactions: { [key: string]: number };
  type: 'message' | 'system';
}

interface DebateRoom {
  id: string;
  topic: string;
  description: string;
  createdBy: string;
  createdAt: number;
  isActive: boolean;
  participants: { [userId: string]: { name: string; joinedAt: number } };
}

interface DebateRoomProps {
  roomId: string;
}

export function DebateRoomComponent({ roomId }: DebateRoomProps) {
  const [user] = useAuthState(auth);
  const [room, setRoom] = useState<DebateRoom | null>(null);
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to room data
  useEffect(() => {
    if (!roomId || !user) return;

    const roomRef = ref(`debateRooms/${roomId}`);
    const messagesRef = ref(`debateRooms/${roomId}/messages`);

    const unsubscribeRoom = onValue(roomRef, (snapshot) => {
      const roomData = snapshot.val();
      if (roomData) {
        setRoom({ id: roomId, ...roomData });
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
      unsubscribeRoom();
      unsubscribeMessages();
    };
  }, [roomId, user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join room
  useEffect(() => {
    if (user && room) {
      const participantsRef = ref(`debateRooms/${roomId}/participants/${user.uid}`);
      set(participantsRef, {
        name: user.displayName || 'Anonymous',
        joinedAt: serverTimestamp(),
      });
    }
  }, [user, room, roomId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !room) return;

    const messagesRef = ref(`debateRooms/${roomId}/messages`);
    const newMessageRef = push(messagesRef);

    await set(newMessageRef, {
      sender: user.uid,
      senderName: user.displayName || 'Anonymous',
      content: newMessage.trim(),
      timestamp: serverTimestamp(),
      reactions: {},
      type: 'message',
    });

    setNewMessage('');
  };

  const addReaction = async (messageId: string, reactionType: string) => {
    if (!user) return;

    const reactionRef = ref(`debateRooms/${roomId}/messages/${messageId}/reactions/${reactionType}`);
    // This would need to be implemented with transactions for proper incrementing
    // For now, just update the local state
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: {
                ...msg.reactions,
                [reactionType]: (msg.reactions[reactionType] || 0) + 1,
              },
            }
          : msg
      )
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading debate room...</div>
        </CardContent>
      </Card>
    );
  }

  if (!room) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Room not found</div>
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
              <MessageCircle className="h-5 w-5" />
              {room.topic}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {room.description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <Users className="h-3 w-3 mr-1" />
              {Object.keys(room.participants || {}).length} participants
            </Badge>
            <Badge variant={room.isActive ? 'default' : 'secondary'}>
              {room.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Messages Area */}
          <ScrollArea className="h-96 w-full border rounded-md p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {message.senderName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{message.content}</p>
                    </div>
                  </div>

                  {/* Reactions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addReaction(message.id, 'thumbsUp')}
                      className="h-6 px-2"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      {message.reactions.thumbsUp || 0}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => addReaction(message.id, 'thumbsDown')}
                      className="h-6 px-2"
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      {message.reactions.thumbsDown || 0}
                    </Button>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Participants List */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Participants</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(room.participants || {}).map(([userId, participant]) => (
                <Badge key={userId} variant="outline">
                  {participant.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DebateRoomComponent;
