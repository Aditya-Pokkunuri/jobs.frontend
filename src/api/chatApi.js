import api from './client';

// Create a new chat session, optionally linked to a specific job
export const createChatSession = async (jobId = null) => {
    const body = {};
    if (jobId) body.job_id = jobId;
    const response = await api.post('/chat/sessions', body);
    return response.data;
};

// Get session info
export const getChatSession = async (sessionId) => {
    const response = await api.get(`/chat/sessions/${sessionId}`);
    return response.data;
};

// Get all sessions for current user
export const getMySessions = async () => {
    const response = await api.get('/chat/my-sessions');
    return response.data;
};
