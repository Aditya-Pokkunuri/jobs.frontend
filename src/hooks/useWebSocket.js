import { useState, useEffect, useRef, useCallback } from 'react';
import { WS_BASE_URL } from '../utils/constants';

/**
 * useWebSocket — manages a WebSocket connection with:
 *   - History replay on connect
 *   - Optimistic message sending
 *   - 30-second ping/pong heartbeat to prevent idle disconnects
 *   - Auto-reconnection with exponential backoff (max 3 retries)
 *   - Typing/loading indicator while waiting for AI reply
 */
export const useWebSocket = (sessionId) => {
    const [messages, setMessages] = useState([]);
    const [sessionStatus, setSessionStatus] = useState('active_ai');
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const wsRef = useRef(null);
    const pingRef = useRef(null);
    const retryRef = useRef(0);
    const maxRetries = 3;

    const connect = useCallback(() => {
        if (!sessionId) return;

        const wsUrl = `${WS_BASE_URL}/ws/chat/${sessionId}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WS Connected');
            setIsConnected(true);
            retryRef.current = 0; // reset retry counter on success

            // Heartbeat every 30s
            pingRef.current = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send('__ping__');
                }
            }, 30_000);
        };

        ws.onclose = (event) => {
            console.log('WS Disconnected', event.code);
            setIsConnected(false);
            setIsTyping(false);

            if (pingRef.current) {
                clearInterval(pingRef.current);
                pingRef.current = null;
            }

            // Auto-reconnect if not a deliberate close
            if (event.code !== 1000 && event.code < 4000 && retryRef.current < maxRetries) {
                retryRef.current += 1;
                const delay = Math.min(1000 * Math.pow(2, retryRef.current), 8000);
                console.log(`WS reconnecting in ${delay}ms (attempt ${retryRef.current}/${maxRetries})`);
                setTimeout(connect, delay);
            }
        };

        ws.onerror = (err) => {
            console.error('WS Error:', err);
        };

        ws.onmessage = (event) => {
            // Ignore pong responses
            if (event.data === '__pong__') return;

            let data;
            try {
                data = JSON.parse(event.data);
            } catch {
                return;
            }

            if (data.type === 'history_replay') {
                setMessages(data.messages || []);
                if (data.session_status) {
                    // Normalize status — active_human is deprecated
                    const status = data.session_status === 'active_human' ? 'active_ai' : data.session_status;
                    setSessionStatus(status);
                }
            } else if (data.type === 'ai_reply') {
                setIsTyping(false);
                setMessages((prev) => [...prev, {
                    role: 'assistant',
                    content: data.content,
                    timestamp: new Date().toISOString(),
                }]);
            } else if (data.type === 'system_notification') {
                setMessages((prev) => [...prev, {
                    role: 'system',
                    content: data.content,
                    timestamp: new Date().toISOString(),
                }]);
            } else if (data.type === 'admin_message') {
                setIsTyping(false);
                setMessages((prev) => [...prev, {
                    role: 'admin',
                    content: data.content,
                    timestamp: new Date().toISOString(),
                }]);
            }
        };
    }, [sessionId]);

    useEffect(() => {
        connect();

        return () => {
            retryRef.current = maxRetries; // prevent reconnect on unmount
            if (pingRef.current) {
                clearInterval(pingRef.current);
                pingRef.current = null;
            }
            if (wsRef.current) {
                if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
                    wsRef.current.close(1000); // deliberate close
                }
            }
        };
    }, [connect]);

    const sendMessage = useCallback((text) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            // Optimistic update — show the message immediately
            setMessages((prev) => [...prev, {
                role: 'user',
                content: text,
                timestamp: new Date().toISOString(),
            }]);
            setIsTyping(true); // Show typing indicator while waiting for AI
            wsRef.current.send(text);
        } else {
            console.error('WebSocket not connected');
        }
    }, []);

    return {
        messages,
        sendMessage,
        isConnected,
        isTyping,
        sessionStatus,
    };
};
