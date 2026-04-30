"use client";

import { useState, useRef, useEffect } from "react";
import { Iphone } from "@/components/ui/iphone";
import { Send, Phone, Video, ChevronLeft, Plus, Camera, CheckCheck, Sticker, Signal, Wifi, BatteryFull } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
    id: string;
    text: string;
    sender: "me" | "other";
    time: string;
    status?: "sent" | "delivered" | "read";
}

export function WhatsAppDemo() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // WhatsApp's new iOS tint color
    const tintColor = "#00A884";

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
            const response = await fetch("https://mainrendvia.app.n8n.cloud/webhook/556d2cc7-4524-4bfe-827f-2e461b3abb94", {
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
                <div className="flex h-full w-full flex-col bg-[#E5E5EA] dark:bg-[#000000] font-sans">
                    {/* Header - iOS Style */}
                    <div className="flex flex-col bg-[#f6f6f6]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-md z-10 sticky top-0 border-b border-gray-200/50 dark:border-gray-800/50">
                        {/* Fake iOS Status Bar */}
                        <div className="flex justify-between items-end px-8 pt-[14px] pb-[8px] w-full text-black dark:text-white h-[54px]">
                            <span className="text-[15px] font-semibold tracking-tight leading-none mb-[2px]">9:41</span>
                            <div className="flex items-center gap-1.5 mb-[1px]">
                                <Signal className="w-[16px] h-[16px]" strokeWidth={2.5} />
                                <Wifi className="w-[16px] h-[16px]" strokeWidth={2.5} />
                                <BatteryFull className="w-[23px] h-[23px] -mr-1" strokeWidth={2} />
                            </div>
                        </div>

                        {/* WhatsApp Header Content */}
                        <div className="flex items-center justify-between px-1 pt-1 pb-2.5">
                            <div className="flex items-center cursor-pointer">
                                <div className="flex items-center text-[#00A884]">
                                    <ChevronLeft className="h-8 w-8 -mr-1" strokeWidth={2} />
                                </div>
                                <Avatar className="h-[38px] w-[38px] ml-1">
                                    <AvatarImage src="/timelyflownew.jpg" />
                                    <AvatarFallback>TF</AvatarFallback>
                                </Avatar>
                                <div className="ml-2.5 flex flex-col justify-center">
                                    <h3 className="text-[16px] font-semibold tracking-tight text-black dark:text-white leading-5">TimelyFlow</h3>
                                    <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-[1px]">çevrimiçi</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 text-[#00A884] pr-4">
                                <Video className="h-[24px] w-[24px] cursor-pointer" strokeWidth={1.5} />
                                <Phone className="h-[22px] w-[22px] cursor-pointer" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div ref={scrollRef} className="flex-1 px-3 relative bg-[#efeae2] dark:bg-[#0b141a] overflow-y-auto will-change-scroll overscroll-contain">
                        {/* WhatsApp iOS pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-[0.45] dark:opacity-[0.15] pointer-events-none z-0 bg-repeat mix-blend-multiply dark:mix-blend-overlay"
                            style={{ backgroundImage: "url('https://static.whatsapp.net/rsrc.php/v3/yl/r/rro_BxtZ_w4.png')", backgroundSize: "350px" }}
                        />
                        <div className="flex flex-col gap-[2px] relative z-10 py-4">
                            {/* Date Badge iOS style */}
                            <div className="flex justify-center mb-4 mt-2">
                                <span className="bg-[#f0f0f0] dark:bg-[#1c1c1e] text-gray-500 dark:text-gray-400 text-[11px] font-medium px-3 py-1 rounded-lg">
                                    Bugün
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
                                            className={`relative max-w-[80%] px-[12px] py-[7px] text-[15px] shadow-[0_1px_1px_rgba(0,0,0,0.05)] ${msg.sender === "me"
                                                ? "bg-[#e2ffc7] dark:bg-[#005c4b] text-black dark:text-white rounded-[14px]"
                                                : "bg-white dark:bg-[#202c33] text-black dark:text-white rounded-[14px]"
                                                } ${isFirstInGroup ? (msg.sender === "me" ? "rounded-tr-[4px]" : "rounded-tl-[4px]") : ""}`}
                                        >
                                            {/* Chat Bubble Tail - iOS Style (Top Corner) */}
                                            {isFirstInGroup && msg.sender === "me" && (
                                                <div className="absolute top-0 right-[-6px] text-[#e2ffc7] dark:text-[#005c4b]">
                                                    <svg viewBox="0 0 11 13" width="11" height="13" fill="currentColor">
                                                        <path d="M11 0C8.5 0 6 0 4.5 0C3 0 1 1 0 3C2 3 5 5 5 13C5 7 8 1.5 11 0Z" />
                                                    </svg>
                                                </div>
                                            )}
                                            {isFirstInGroup && msg.sender === "other" && (
                                                <div className="absolute top-0 left-[-6px] text-white dark:text-[#202c33]">
                                                    <svg viewBox="0 0 11 13" width="11" height="13" fill="currentColor">
                                                        <path d="M0 0C2.5 0 5 0 6.5 0C8 0 10 1 11 3C9 3 6 5 6 13C6 7 3 1.5 0 0Z" />
                                                    </svg>
                                                </div>
                                            )}

                                            <p className="leading-[21px] whitespace-pre-wrap word-break pb-[8px]">
                                                {msg.text}
                                                <span className="inline-block w-[65px]" />
                                            </p>

                                            <div className="absolute bottom-[4px] right-[8px] flex items-center gap-1">
                                                <span className="text-[11px] text-[#8e8e93] dark:text-[rgba(255,255,255,0.5)]">
                                                    {msg.time}
                                                </span>
                                                {msg.sender === "me" && (
                                                    <CheckCheck className={`h-[15px] w-[15px] ${msg.status === 'read' ? 'text-[#34B7F1]' : 'text-[#8e8e93]'}`} strokeWidth={2.5} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            {isSending && (
                                <div className="flex justify-start mt-2">
                                    <div className="relative max-w-[80%] bg-white dark:bg-[#202c33] text-black dark:text-white rounded-[14px] rounded-tl-[4px] px-[14px] py-[10px] text-[15px] shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                                        <div className="absolute top-0 left-[-6px] text-white dark:text-[#202c33]">
                                            <svg viewBox="0 0 11 13" width="11" height="13" fill="currentColor">
                                                <path d="M0 0C2.5 0 5 0 6.5 0C8 0 10 1 11 3C9 3 6 5 6 13C6 7 3 1.5 0 0Z" />
                                            </svg>
                                        </div>
                                        <div className="flex items-center gap-1.5 opacity-50">
                                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Input Area - Current iOS Style */}
                    <div className="flex items-end gap-2 bg-[#f6f6f6] dark:bg-[#1c1c1e] px-2 pt-[8px] pb-[38px] z-10 relative border-t border-gray-200/60 dark:border-gray-800/60">
                        <div className="text-[#00A884] pb-[7px] pl-1 cursor-pointer">
                            <Plus className="h-[28px] w-[28px]" strokeWidth={2} />
                        </div>
                        <div className="flex-1 bg-white dark:bg-[#2c2c2e] border border-gray-300/60 dark:border-gray-700 rounded-[20px] flex items-end min-h-[36px] mb-[3px] pl-3 pr-2 py-[5px]">
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Mesaj..."
                                className="flex-1 bg-transparent border-none focus:ring-0 outline-none resize-none px-1 max-h-[100px] text-black dark:text-white text-[16px] placeholder:text-gray-400 leading-[22px]"
                                rows={1}
                                style={{ minHeight: '22px' }}
                            />
                            <Sticker className="h-[22px] w-[22px] text-[#00A884] shrink-0 mb-[1px] ml-1 cursor-pointer" strokeWidth={1.5} />
                        </div>

                        <div className="flex items-center gap-3 pb-[7px] pr-2">
                            {!inputText.trim() ? (
                                <>
                                    <Camera className="h-[26px] w-[26px] text-[#00A884] cursor-pointer" strokeWidth={1.5} />
                                    <Mic className="h-[26px] w-[26px] text-[#00A884] cursor-pointer" />
                                </>
                            ) : (
                                <div
                                    className="h-[32px] w-[32px] rounded-full flex items-center justify-center bg-[#00A884] text-white cursor-pointer mb-[1px]"
                                    onClick={handleSend}
                                >
                                    <Send className="h-[16px] w-[16px] ml-[2px]" strokeWidth={2.5} />
                                </div>
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