// src/components/profile-avatar.tsx
'use client';
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, User, Edit } from 'lucide-react';
import { useStorage } from '@/firebase';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ProfileAvatarProps = {
  uid: string;
  currentAvatarUrl?: string | null;
};

export function ProfileAvatar({ uid, currentAvatarUrl }: ProfileAvatarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { storage, firestore } = useStorage();
  const { toast } = useToast();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !storage || !firestore) return;

    setIsLoading(true);

    try {
      // 1. Crear referencia en Storage
      const avatarRef = storageRef(storage, `avatars/${uid}/${file.name}`);
      
      // 2. Subir el archivo
      const snapshot = await uploadBytes(avatarRef, file);
      
      // 3. Obtener la URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 4. Actualizar el documento del usuario en Firestore
      const userDocRef = doc(firestore, 'users', uid);
      await setDoc(userDocRef, { avatarUrl: downloadURL }, { merge: true });

      toast({
        title: '¡Avatar Actualizado!',
        description: 'Tu nueva foto de perfil ha sido guardada.',
      });

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        variant: 'destructive',
        title: 'Error al subir avatar',
        description: error.message || 'No se pudo actualizar tu foto de perfil.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative group">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <Avatar
        className="h-12 w-12 border-2 border-primary cursor-pointer transition-opacity group-hover:opacity-75"
        onClick={handleAvatarClick}
      >
        <AvatarImage src={currentAvatarUrl ?? undefined} alt="Avatar de usuario" />
        <AvatarFallback>
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <User />
          )}
        </AvatarFallback>
      </Avatar>
       <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={handleAvatarClick}>
            <Edit className="text-white h-5 w-5" />
      </div>
    </div>
  );
}
