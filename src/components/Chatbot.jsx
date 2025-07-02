import React, { useState, useRef, useEffect, useContext } from 'react';
import { Bot, X, Send, User, Loader2, MessageSquare, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../auth/AuthContext';
import { useQuery, useQueries } from '@tanstack/react-query';
import axios from 'axios';

const SERVER_BASE_URL = "http://localhost:8081";

// --- API Helper to fetch all backend data ---
const fetchData = async (endpoint, token) => {
    if (!token) return null;
    const { data } = await axios.get(`${SERVER_BASE_URL}/api${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    // The API response structure varies, so we handle it here
    if (endpoint === '/admin/users') return data.data;
    if (endpoint.includes('/orders')) return data.orders || data.history;
    return data;
};

// --- Main Chatbot Component ---
export const Chatbot = ({ isVisible, onClose, onConfirmLogout, cartItems = [] }) => {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === 'admin';
    const token = localStorage.getItem('token');
    
    // --- STATE FOR FALLBACK MODE ---
    const [isApiRateLimited, setIsApiRateLimited] = useState(false);
    const rateLimitCooldownTimer = useRef(null);

    const results = useQueries({
        queries: [
            { queryKey: ['chatbot_dashboardStats'], queryFn: () => fetchData('/dashboard/stats', token), enabled: isVisible && isAdmin },
            { queryKey: ['chatbot_all_orders'], queryFn: () => fetchData('/orders', token), enabled: isVisible && isAdmin },
            { queryKey: ['chatbot_users'], queryFn: () => fetchData('/admin/users', token), enabled: isVisible && isAdmin },
            { queryKey: ['chatbot_products'], queryFn: () => fetchData('/products', token), enabled: isVisible },
            { queryKey: ['chatbot_categories'], queryFn: () => fetchData('/categories', token), enabled: isVisible },
            { queryKey: ['chatbot_my_orders'], queryFn: () => fetchData('/orders/myorders', token), enabled: isVisible && !isAdmin }
        ],
    });

    const [ dashboardStatsResult, allOrdersResult, usersResult, productsResult, categoriesResult, myOrdersResult ] = results;
    const isLoadingData = results.some(result => result.isLoading);

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoadingResponse, setIsLoadingResponse] = useState(false);
    const messagesEndRef = useRef(null);

    const baseSystemPrompt = `You are "GrocerBot", an expert AI assistant for the HamroGrocery application. Your tone is professional, helpful, and concise. Current date is ${new Date().toLocaleDateString()}.`;
    
    const adminSystemPrompt = `${baseSystemPrompt}
    You are assisting an admin and have access to a full, real-time snapshot of the application's database. When asked about "bookings", treat it as a synonym for "orders".
    --- DATABASE SNAPSHOT ---
    Dashboard Stats: Total Revenue: ₹${dashboardStatsResult.data?.totalRevenue?.toFixed(2) || '...'}, Total Active Orders: ${dashboardStatsResult.data?.totalOrders || '...'}, Total Customers: ${dashboardStatsResult.data?.totalCustomers || '...'}
    Product List (${productsResult.data?.length || 0} items): ${productsResult.data?.map(p => `- Name: ${p.name}, Price: ₹${p.price}, Stock: ${p.stock}, Category: ${p.category?.name}`).join('\n') || '...'}
    Category List (${categoriesResult.data?.length || 0} items): ${categoriesResult.data?.map(c => `- ${c.name}`).join('\n') || '...'}
    All Orders (${allOrdersResult.data?.length || 0} items): ${allOrdersResult.data?.map(o => `- OrderID: #${o._id.slice(-6)}, Customer: ${o.customer?.fullName}, Status: ${o.status}, Amount: ₹${o.amount}, Date: ${new Date(o.createdAt).toLocaleDateString()}`).join('\n') || '...'}
    User List (${usersResult.data?.length || 0} items): ${usersResult.data?.map(u => `- Name: ${u.fullName}, Email: ${u.email}, Joined: ${new Date(u.createdAt).toLocaleDateString()}`).join('\n') || '...'}
    --- END SNAPSHOT ---
    `;

    const userSystemPrompt = `${baseSystemPrompt} 
    You are assisting a customer named ${user?.fullName}. You have access to public store data, this specific user's personal order history, and their current shopping cart. It is safe and correct to share this information with them because it is THEIR data. 
    --- PUBLIC KNOWLEDGE ---
    - About Hamro Grocery: "Hamro Grocery is an online grocery shopping website that provides door-to-door delivery services."
    - Payment Methods: "We accept two payment methods: Cash on Delivery (COD) and online payments via eSewa."
    - Product List (${productsResult.data?.length || 0} items):
      ${productsResult.data?.map(p => `- Name: ${p.name}, Price: ₹${p.price}, Stock: ${p.stock}, Category: ${p.category?.name}`).join('\n') || '...'}
    --- END PUBLIC KNOWLEDGE ---
    --- THIS USER'S PERSONAL DATA ---
    Current Shopping Cart (${cartItems.length} items):
    ${cartItems.map(item => `- Item: ${item.name}, Quantity: ${item.quantity}, Price: ₹${item.price}`).join('\n') || 'The cart is empty.'}
    Order History (${myOrdersResult.data?.length || 0} orders):
    ${myOrdersResult.data?.map(o => `- OrderID: #${o._id.slice(-6)}, Status: ${o.status}, Amount: ₹${o.amount}, Payment Method: ${o.paymentMethod}, Date: ${new Date(o.createdAt).toLocaleDateString()}`).join('\n') || 'This user has not placed any orders yet.'}
    --- END PERSONAL DATA ---
    `;

    useEffect(() => {
        if (isVisible) {
            const greetingText = `Hello, ${user?.fullName || 'there'}! I'm GrocerBot. How can I assist you today?`;
            const suggestions = isAdmin 
                ? ["Summarize today's performance.", "Which products are low on stock?", "List all pending orders."]
                : ["What's in my cart?", "What's the status of my last order?", "Do you have apples in stock?"];
            
            setMessages([{ role: 'bot', text: greetingText, suggestions }]);
        }
        return () => clearTimeout(rateLimitCooldownTimer.current);
    }, [isVisible, isAdmin, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    // --- "NORMAL BOT" FALLBACK LOGIC ---
    const getNormalBotResponse = (userInput) => {
        const lowerInput = userInput.toLowerCase();
        
        if (lowerInput.includes('logout')) {
            onConfirmLogout();
            return { role: 'bot', text: "Please confirm in the dialog box to log out." };
        }
        if (lowerInput.includes('track') || lowerInput.includes('status')) {
            return { role: 'bot', text: "You can view your order history and status in the 'My Orders' section of your dashboard." };
        }
        if (lowerInput.includes('payment')) {
            return { role: 'bot', text: "We accept Cash on Delivery (COD) and online payments via eSewa." };
        }
        if (lowerInput.includes('hamro grocery') || lowerInput.includes('about')) {
             return { role: 'bot', text: "Hamro Grocery is an online grocery shopping website that provides door-to-door delivery services." };
        }
        
        // This is the message for when the rate limit is first hit.
        if (userInput === "RATE_LIMIT_HIT") {
            return { role: 'bot', text: "I'm experiencing high traffic right now. My AI capabilities are temporarily limited, but I can still help with basic questions. Full service will resume in about a minute." };
        }

        return { role: 'bot', text: "My AI functions are currently busy. I can only handle basic questions about payments, order tracking, or logging out right now. Please try again shortly." };
    };

    const getGeminiResponse = async (userInput, chatHistory) => {
        setIsLoadingResponse(true);
        const systemPrompt = isAdmin ? adminSystemPrompt : userSystemPrompt;
        const apiKey = "AIzaSyCwclRjgqGb0Hvc3kcmV7kJGmdSa6p9WMU"; // <-- PASTE YOUR KEY HERE

        if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
            setIsLoadingResponse(false);
            return { role: 'bot', text: "The chatbot is not configured. Please contact the site administrator." };
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
        
        if (userInput.toLowerCase().includes('logout') || userInput.toLowerCase().includes('log out')) {
             onConfirmLogout();
             setIsLoadingResponse(false);
             return { role: 'bot', text: "Action required. Please confirm in the dialog box to complete the logout." };
        }

        const historyForApi = [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "Understood. I have all the necessary data and I'm ready to assist." }] },
            ...chatHistory.map(msg => ({ role: msg.role === 'bot' ? 'model' : 'user', parts: [{ text: msg.text }] })),
            { role: "user", parts: [{ text: userInput }] }
        ];
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: historyForApi })
            });

            if (response.status === 429) {
                console.warn("Gemini API rate limit hit. Switching to fallback mode.");
                setIsApiRateLimited(true);
                rateLimitCooldownTimer.current = setTimeout(() => {
                    setIsApiRateLimited(false);
                    console.log("Fallback mode ended. Gemini API is active again.");
                    setMessages(prev => [...prev, { role: 'bot', text: "Good news! My full AI capabilities have been restored."}]);
                }, 60000); 
                return getNormalBotResponse("RATE_LIMIT_HIT");
            }

            if (!response.ok) throw new Error(`API error: ${response.statusText}`);
            
            const result = await response.json();
            const botResponse = result.candidates[0].content.parts[0].text;
            return { role: 'bot', text: botResponse };
        } catch (error) {
            console.error("Gemini API Call Failed:", error);
            return { role: 'bot', text: "I'm having a little trouble connecting. Please try again in a moment." };
        } finally {
            setIsLoadingResponse(false);
        }
    };

    const handleSend = async (messageText = input) => {
        if (!messageText.trim() || isLoadingResponse) return;
        const userMessage = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        let botResponse;
        if (isApiRateLimited) {
            botResponse = getNormalBotResponse(messageText);
        } else {
            botResponse = await getGeminiResponse(messageText, [...messages, userMessage]);
        }
        
        setMessages(prev => [...prev, botResponse]);
    };
    
    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
        handleSend(suggestion);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-40 border border-gray-200">
            <div className="flex items-center justify-between p-4 bg-green-600 text-white rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <MessageSquare size={24} />
                    <h3 className="font-bold text-lg">GrocerBot Assistant</h3>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {isApiRateLimited && (
                <div className="p-2 bg-yellow-100 text-yellow-800 text-xs text-center font-semibold flex items-center justify-center gap-2">
                    <ShieldAlert size={14} /> Limited AI Mode Active
                </div>
            )}

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'bot' && <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0"><Bot size={20} className="text-white"/></div>}
                            <div className={`max-w-xs px-4 py-2.5 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-lg' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-lg'}`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
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
                    {(isLoadingResponse || isLoadingData) && (
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
                    <button onClick={() => handleSend()} disabled={isLoadingResponse || !input.trim()} className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};