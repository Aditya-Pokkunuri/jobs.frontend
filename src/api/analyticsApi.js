import api from './client';

export const getMarketIntelligence = async () => {
    const response = await api.get('/analytics/market');
    return response.data;
};
