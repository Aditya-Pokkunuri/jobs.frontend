import api from './client';

/**
 * Mock Interview API calls for Seekers.
 */

export const startMockInterview = async (jobId) => {
    const response = await api.post('/mock-interviews/start', { job_id: jobId });
    return response.data;
};

export const submitMockInterview = async (interviewId, answers) => {
    const response = await api.post(`/mock-interviews/${interviewId}/submit`, { answers });
    return response.data;
};

export const getMyMockInterviews = async () => {
    const response = await api.get('/mock-interviews/my');
    return response.data;
};

export const getMockInterviewDetails = async (interviewId) => {
    const response = await api.get(`/mock-interviews/${interviewId}`);
    return response.data;
};

export const requestExpertReview = async (interviewId) => {
    const response = await api.post(`/mock-interviews/${interviewId}/request-review`);
    return response.data;
};
