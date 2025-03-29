'use client';
import React, { useEffect, useState } from 'react';
import useChatStore from '@/store/useChatStore';
import { useFirebase } from '@/store/useFirebase';
import Loading from '../ui/loading';
import ChatWindow from './ChatWindow';

interface ChatWrapperProps {
  chatId: string;
}

export default function ChatWrapper({ chatId }: ChatWrapperProps) {
  const { user: firebaseUser, signInFirebase } = useFirebase()
  const { isLoading, fetchChatHistory } = useChatStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseUser) {
      signInFirebase()
    }
  }, [firebaseUser]);

  useEffect(() => {
    fetchChatHistory(chatId);
  }, [chatId]);

  return (
    <div>
      {error && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <p>{error}</p>
            <button onClick={() => setError(null)} style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Close</button>
          </div>
        </div>
      )}

      {isLoading ? <Loading /> : <ChatWindow key={chatId} chatId={chatId}></ChatWindow>}
    </div>
  );
}
