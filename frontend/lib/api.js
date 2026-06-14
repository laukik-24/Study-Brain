import { supabase } from './supabaseClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const getAuthHeaders = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    console.error("AUTH ERROR: No active session found. Please log in again.");
    return null;
  }

  return {
    'Authorization': `Bearer ${session.access_token}`
  };
};

export const checkHealth = async () => {
  try {
    const res = await fetch(`${API_URL}/health`, {
      method: 'GET',
    });
    return res.ok;
  } catch (err) {
    return false;
  }
};

export const askQuestion = async (question) => {
  const headers = await getAuthHeaders();
  if (!headers) throw new Error('Not authenticated');

  const res = await fetch(`${API_URL}/api/query/`, {
    method: 'POST',
    headers: {
        ...headers,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question })
  });
  
  if (!res.ok) throw new Error('Failed to fetch answer');
  return res.json();
};

export const uploadDocument = async (file, docName, docType) => {
    const headers = await getAuthHeaders();
    if (!headers) throw new Error('Not authenticated. Please log in.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('doc_name', docName);
    formData.append('doc_type', docType);

    const res = await fetch(`${API_URL}/api/upload/`, {
        method: 'POST',
        headers: headers,
        body: formData
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Upload failed');
    }
    return res.json();
};
