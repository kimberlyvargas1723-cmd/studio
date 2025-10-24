/**
 * Debate Rooms List Component
 * Browse and join active debate rooms
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, onValue, push, set, serverTimestamp } from 'firebase/database';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Plus, Users, Clock } from 'lucide-react';
import DebateRoomComponent from './debate-room';

interface DebateRoom {
  id: string;
  topic: string;
  description: string;
  createdBy: string;
  createdAt: number;
  isActive: boolean;
  participants: { [userId: string]: { name: string; joinedAt: number } };
}

export function DebateRoomsList() {
  const [user] = useAuthState(auth);
  const [rooms, setRooms] = useState<DebateRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoomTopic, setNewRoomTopic] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');

  // Subscribe to debate rooms
  useEffect(() => {
    const roomsRef = ref('debateRooms');

    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const roomsData = snapshot.val();
      if (roomsData) {
        const roomsList = Object.entries(roomsData)
          .map(([id, room]: [string, any]) => ({ id, ...room }))
          .filter((room: DebateRoom) => room.isActive) // Only show active rooms
          .sort((a: DebateRoom, b: DebateRoom) => b.createdAt - a.createdAt);
        setRooms(roomsList);
      } else {
        setRooms([]);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const createRoom = async () => {
    if (!newRoomTopic.trim() || !user) return;

    const roomsRef = ref('debateRooms');
    const newRoomRef = push(roomsRef);

    await set(newRoomRef, {
      topic: newRoomTopic.trim(),
      description: newRoomDescription.trim(),
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      isActive: true,
      participants: {
        [user.uid]: {
          name: user.displayName || 'Anonymous',
          joinedAt: serverTimestamp(),
        },
      },
    });

    setNewRoomTopic('');
    setNewRoomDescription('');
    setIsCreateDialogOpen(false);
  };

  if (selectedRoom) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setSelectedRoom(null)}
          className="mb-4"
        >
          ← Back to Rooms
        </Button>
        <DebateRoomComponent roomId={selectedRoom} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Debate Rooms</h2>
          <p className="text-muted-foreground">
            Join collaborative discussions on psychology topics
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Room
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Debate Room</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Topic</label>
                <Input
                  placeholder="e.g., Theories of Personality"
                  value={newRoomTopic}
                  onChange={(e) => setNewRoomTopic(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe the debate topic..."
                  value={newRoomDescription}
                  onChange={(e) => setNewRoomDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createRoom} disabled={!newRoomTopic.trim()}>
                  Create Room
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground">
          Loading debate rooms...
        </div>
      ) : rooms.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Debate Rooms</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to start a discussion!
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Room
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {room.topic}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {room.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {Object.keys(room.participants || {}).length} participants
                      </span>
                    </div>
                    <Badge variant={room.isActive ? 'default' : 'secondary'}>
                      {room.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(room.createdAt).toLocaleDateString()}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setSelectedRoom(room.id)}
                  >
                    Join Discussion
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default DebateRoomsList;
