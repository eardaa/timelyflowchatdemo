"use client";

import { useState, useRef, useEffect } from "react";
import { Iphone } from "@/components/ui/iphone";
import { Send, Phone, Video, ChevronLeft, Plus, Camera, Smile, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
    id: string;
    text: string;
    sender: "me" | "other";
    time: string;
    status?: "sent" | "delivered" | "read";
}

export function WhatsAppDemo() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Merhaba! Asistan ile nasıl iletişim kurabilirim?",
            sender: "other",
            time: "10:00",
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isSending]);

    const handleSend = async () => {
        if (!inputText.trim() || isSending) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: "me",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "read"
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputText("");
        setIsSending(true);

        try {
            const response = await fetch("https://hellotimely.app.n8n.cloud/webhook/cb3a0ae6-da8f-4d1d-a544-bbfd6ebd92e9", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: newMessage.text }),
            });

            if (response.ok) {
                const data = await response.json();
                
                let replyText = "";
                const result = Array.isArray(data) ? data[0] : data;

                if (typeof result === "string") {
                    replyText = result;
                } else if (result) {
                    replyText = result.output || result.response || result.message || result.text || JSON.stringify(result);
                }

                if (replyText) {
                    const assistantMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        text: replyText,
                        sender: "other",
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    };
                    setMessages((prev) => [...prev, assistantMessage]);
                }
            }
        } catch (error) {
            console.error("Webhook Error:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="w-[350px] sm:w-[400px] md:w-[434px] shadow-[0_0_40px_rgba(32,44,51,0.5)] rounded-[40px] transform-gpu">
            <Iphone>
                <div className="flex h-full w-full flex-col bg-[#efeae2] dark:bg-[#0b141a] pt-12 pb-[30px] font-sans">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-[#f0f2f5] dark:bg-[#202c33] px-2 py-2 shadow-sm z-10 sticky top-0">
                        <div className="flex items-center gap-1 cursor-pointer">
                            <div className="flex items-center -ml-1 text-[#00a884] dark:text-[#00a884]">
                                <ChevronLeft className="h-7 w-7" />
                            </div>
                            <Avatar className="h-9 w-9 border border-gray-200 dark:border-none">
                                <AvatarImage src="/timelyflownew.jpg" />
                                <AvatarFallback>TF</AvatarFallback>
                            </Avatar>
                            <div className="ml-2">
                                <h3 className="text-[16px] font-medium leading-5 text-[#111b21] dark:text-[#e9edef] overflow-hidden text-ellipsis whitespace-nowrap">TimelyFlow</h3>
                                <p className="text-[12px] text-[#667781] dark:text-[#8696a0] mt-[1px]">online</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5 text-[#54656f] dark:text-[#aebac1] pr-2">
                            <Video className="h-[22px] w-[22px] cursor-pointer hover:text-[#00a884]" />
                            <Phone className="h-[20px] w-[20px] cursor-pointer hover:text-[#00a884]" />
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div ref={scrollRef} className="flex-1 px-4 relative bg-[#efeae2] dark:bg-[#0b141a] overflow-y-auto will-change-scroll overscroll-contain">
                        {/* WhatsApp pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-40 dark:opacity-10 pointer-events-none z-0 bg-repeat"
                            style={{ backgroundImage: "url('https://static.whatsapp.net/rsrc.php/v3/yl/r/rro_BxtZ_w4.png')", backgroundSize: "300px" }}
                        />
                        <div className="flex flex-col gap-[2px] relative z-10 py-4">
                            {/* Date Badge */}
                            <div className="flex justify-center mb-4 mt-2">
                                <span className="bg-white/90 dark:bg-[#182229]/90 text-[#54656f] dark:text-[#8696a0] text-[12px] px-3 py-1 rounded-lg shadow-sm">
                                    BUGÜN
                                </span>
                            </div>

                            {messages.map((msg, index) => {
                                const isFirstInGroup = index === 0 || messages[index - 1].sender !== msg.sender;
                                
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-2" : "mt-[2px]"}`}
                                    >
                                        <div
                                            className={`relative max-w-[85%] rounded-[8px] px-[9px] py-[6px] text-[14.5px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${msg.sender === "me"
                                                    ? "bg-[#d9fdd3] text-[#111b21] dark:bg-[#005c4b] dark:text-[#e9edef]"
                                                    : "bg-white text-[#111b21] dark:bg-[#202c33] dark:text-[#e9edef]"
                                                } ${isFirstInGroup ? (msg.sender === "me" ? "rounded-tr-none" : "rounded-tl-none") : ""}`}
                                        >
                                            {/* Chat Bubble Tail */}
                                            {isFirstInGroup && msg.sender === "me" && (
                                                <div className="absolute top-0 right-[-8px] text-[#d9fdd3] dark:text-[#005c4b]">
                                                    <svg viewBox="0 0 8 13" width="8" height="13" fill="currentColor">
                                                        <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" />
                                                    </svg>
                                                </div>
                                            )}
                                            {isFirstInGroup && msg.sender === "other" && (
                                                <div className="absolute top-0 left-[-8px] text-white dark:text-[#202c33]">
                                                    <svg viewBox="0 0 8 13" width="8" height="13" fill="currentColor">
                                                        <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" transform="matrix(-1 0 0 1 8 0)" />
                                                    </svg>
                                                </div>
                                            )}

                                            <p className="leading-[19px] whitespace-pre-wrap word-break pb-[10px]">
                                                {msg.text}
                                                <span className="inline-block w-[60px]" /> {/* Spacer for time/ticks */}
                                            </p>
                                            
                                            <div className="absolute bottom-[3px] right-[7px] flex items-center gap-1">
                                                <span className="text-[10.5px] text-[#667781] dark:text-[rgba(255,255,255,0.6)]">
                                                    {msg.time}
                                                </span>
                                                {msg.sender === "me" && (
                                                    <CheckCheck className={`h-[14px] w-[14px] ${msg.status === 'read' ? 'text-[#53bdeb]' : 'text-[#667781]'}`} strokeWidth={2.5} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            {isSending && (
                                <div className="flex justify-start mt-2">
                                    <div className="relative max-w-[85%] bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-[8px] rounded-tl-none px-[12px] py-[8px] text-[14.5px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
                                        <div className="absolute top-0 left-[-8px] text-white dark:text-[#202c33]">
                                            <svg viewBox="0 0 8 13" width="8" height="13" fill="currentColor">
                                                <path d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z" transform="matrix(-1 0 0 1 8 0)" />
                                            </svg>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-60">
                                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex items-end gap-2 bg-[#f0f2f5] dark:bg-[#202c33] px-2 py-[8px] z-10 relative">
                        <div className="text-[#54656f] dark:text-[#aebac1] pb-[10px] pl-1 cursor-pointer">
                            <Plus className="h-[26px] w-[26px]" />
                        </div>
                        <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-[24px] flex items-end min-h-[42px] mb-0 pl-3 pr-2 py-1.5 shadow-sm">
                            <Smile className="h-6 w-6 text-[#54656f] dark:text-[#aebac1] shrink-0 mb-[3px] cursor-pointer" />
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Mesaj yazın"
                                className="flex-1 bg-transparent border-none focus:ring-0 outline-none resize-none px-2 max-h-[100px] text-[#111b21] dark:text-[#e9edef] text-[15px] placeholder:text-[#8696a0] leading-[20px] pt-[2px]"
                                rows={1}
                                style={{ minHeight: '24px' }}
                            />
                            {!inputText.trim() && (
                                <Camera className="h-6 w-6 text-[#54656f] dark:text-[#aebac1] shrink-0 mb-[3px] ml-2 cursor-pointer" />
                            )}
                        </div>
                        
                        <div 
                            className="h-[42px] w-[42px] shrink-0 rounded-full flex items-center justify-center bg-[#00a884] text-white cursor-pointer shadow-sm mb-0 transition-transform active:scale-95"
                            onClick={inputText.trim() ? handleSend : undefined}
                        >
                            {inputText.trim() ? (
                                <Send className="h-5 w-5 ml-[2px]" />
                            ) : (
                                <Mic className="h-5 w-5" />
                            )}
                        </div>
                    </div>
                </div>
            </Iphone>
        </div>
    );
}

function Mic(props: any) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M11.999 14.942c2.005 0 3.534-1.53 3.534-3.534v-5.226c0-2.004-1.529-3.534-3.534-3.534-2.004 0-3.534 1.53-3.534 3.534v5.226c0 2.004 1.53 3.534 3.534 3.534zm4.707-3.534c0 2.597-2.11 4.707-4.707 4.707s-4.707-2.11-4.707-4.707h-1.176c0 2.943 2.193 5.4 5.061 5.811v2.969h1.644v-2.969c2.868-.411 5.061-2.868 5.061-5.811h-1.176z"></path>
        </svg>
    );
}