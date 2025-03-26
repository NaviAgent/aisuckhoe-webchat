// components/ChatSessionForm.js

import { ChatSession } from '@prisma/client';
import { useState } from 'react';

export default function ChatSessionForm(chatSession: ChatSession) {
  const [formData, setFormData] = useState(chatSession || {});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const method = chatSession ? 'PUT' : 'POST';
    const url = chatSession ? `/api/chatSessions/${chatSession.id}` : '/api/chatSessions';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      // Handle success
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} />
      <button type="submit">Save</button>
    </form>
  );
}