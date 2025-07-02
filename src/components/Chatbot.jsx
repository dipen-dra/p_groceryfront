import React, { useState, useRef, useEffect, useContext } from 'react';
import { Bot, X, Send, User, Loader2, MessageSquare } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const SERVER_BASE_URL = "http://localhost:8081";

// --- Helper to fetch admin stats ---
const fetchDashboardStats = async (token) => {
    if (!token) return null;
    const { data } = await axios.get(`${SERVER_BASE_URL}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};

// --- Main Chatbot Component ---
export const Chatbot = ({ isVisible, onClose, onConfirmLogout }) => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === 'admin';
    const token = localStorage.getItem('token');
    
    const { data: adminStats } = useQuery({
        queryKey: ['dashboardStatsForChatbot'],
        queryFn: () => fetchDashboardStats(token),
        enabled: isVisible && isAdmin,
        staleTime: 1000 * 60 * 5,
    });

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // --- System Prompts ---
    const baseSystemPrompt = `You are "GrocerBot", a friendly and professional AI assistant for the HamroGrocery application. Your tone is helpful and concise. Current date is ${new Date().toLocaleDateString()}.`;
    
    const adminSystemPrompt = `${baseSystemPrompt} 
    You are assisting an admin. You have access to the latest, real-time store data. When asked about stats, use the provided data below. If a value is '...', it means the data is still loading or unavailable.
    
    --- REAL-TIME DATA ---
    Total Revenue: ₹${adminStats?.totalRevenue?.toFixed(2) || '...'}
    Total Active Orders: ${adminStats?.totalOrders || '...'}
    Total Customers: ${adminStats?.totalCustomers || '...'}
    Top Selling Products: ${adminStats?.topProducts?.map(p => p.name).join(', ') || '...'}
    --- END REAL-TIME DATA ---
    `;

    // =================================================================
    // --- UPDATED USER PROMPT ---
    // I've added the specific knowledge about the website and payment methods here.
    // =================================================================
    const userSystemPrompt = `${baseSystemPrompt} 
    You are assisting a customer. Help them with questions about products, orders, and how to use the site. You cannot see their personal data.
    
    --- SPECIFIC KNOWLEDGE ---
    About Hamro Grocery: "Hamro Grocery is an online grocery shopping website that provides door-to-door delivery services."
    Payment Methods: "We accept two payment methods: Cash on Delivery (COD) and online payments via eSewa."
    --- END SPECIFIC KNOWLEDGE ---
    `;

    // --- Initial Greeting ---
    useEffect(() => {
        if (isVisible) {
            const greeting = {
                role: 'bot',
                text: `Hello, ${user?.fullName || 'there'}! I'm GrocerBot. How can I assist you today?`,
                suggestions: isAdmin 
                    ? ["What's our total revenue?", "Show me top products", "How many customers do we have?"]
                    : ["How do I track my order?", "What are the payment options?", "Tell me about Hamro Grocery"]
            };
            setMessages([greeting]);
        }
    }, [isVisible, isAdmin, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- Gemini API Call ---
    const getGeminiResponse = async (userInput, chatHistory) => {
        setIsLoading(true);
        const systemPrompt = isAdmin ? adminSystemPrompt : userSystemPrompt;
        
        const apiKey = "AIzaSyCwclRjgqGb0Hvc3kcmV7kJGmdSa6p9WMU"; // <-- PASTE YOUR KEY HERE

        if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
            console.error("Chatbot Error: Please add your Gemini API Key in src/components/Chatbot.jsx");
            setIsLoading(false);
            return { role: 'bot', text: "The chatbot is not configured. Please contact the site administrator." };
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
        
        if (userInput.toLowerCase().includes('logout') || userInput.toLowerCase().includes('log out')) {
             onConfirmLogout();
             setIsLoading(false);
             return { role: 'bot', text: "To complete the logout, please confirm in the dialog box that just appeared." };
        }

        const historyForApi = [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Understood. I'm ready to assist." }] },
            ...chatHistory.map(msg => ({
                role: msg.role === 'bot' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            })),
            { role: "user", parts: [{ text: userInput }] }
        ];
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: historyForApi })
            });

            if (!response.ok) {
                const errorBody = await response.json();
                console.error("Gemini API Error Response:", errorBody);
                throw new Error(`API error: ${response.statusText}`);
            }

            const result = await response.json();
            const botResponse = result.candidates[0].content.parts[0].text;
            
            return { role: 'bot', text: botResponse };

        } catch (error) {
            console.error("Gemini API Call Failed:", error);
            return { role: 'bot', text: "I'm having a little trouble connecting. Please try again in a moment." };
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = async (messageText = input) => {
        if (!messageText.trim() || isLoading) return;

        const userMessage = { role: 'user', text: messageText };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');

        const botResponse = await getGeminiResponse(messageText, updatedMessages);
        setMessages(prev => [...prev, botResponse]);
    };
    
    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
        handleSend(suggestion);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-40 border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-green-600 text-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <MessageSquare size={24} />
                    <h3 className="font-bold text-lg">GrocerBot Assistant</h3>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'bot' && <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0"><Bot size={20} className="text-white"/></div>}
                            <div className={`max-w-xs px-4 py-2.5 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-lg'}`}>
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                {msg.suggestions && (
                                    <div className="mt-3 grid grid-cols-1 gap-2">
                                        {msg.suggestions.map((s, i) => (
                                            <button key={i} onClick={() => handleSuggestionClick(s)} className="w-full text-left text-sm text-blue-600 font-semibold p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0"><User size={20} className="text-white"/></div>}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2.5 justify-start">
                            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0"><Bot size={20} className="text-white"/></div>
                            <div className="max-w-xs px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                <Loader2 className="animate-spin text-gray-500" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask me anything..."
                        className="flex-1 w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};