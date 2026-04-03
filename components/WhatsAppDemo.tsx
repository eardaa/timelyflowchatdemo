"use client";

import { useState, useRef, useEffect } from "react";
import { Iphone } from "@/components/ui/iphone";
import { Send, Phone, Video, ChevronLeft, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
    id: string;
    text: string;
    sender: "me" | "other";
    time: string;
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
                console.log("Webhook Response Data:", data);

                // Common n8n patterns: data.output, data.response, data.message, or index 0 if array
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
                <div className="flex h-full w-full flex-col bg-[#efeae2] dark:bg-[#0b141a] pt-14 pb-[30px]">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-[#f0f2f5] dark:bg-[#202c33] px-4 py-3 shadow-sm z-10 sticky top-0 relative">
                        <div className="flex items-center gap-2">
                            <ChevronLeft className="h-6 w-6 text-[#54656f] dark:text-[#aebac1] -ml-2 cursor-pointer" />
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="/timelyflownew.jpg" />
                                <AvatarFallback>TF</AvatarFallback>
                            </Avatar>
                            <div className="ml-1 cursor-pointer">
                                <h3 className="text-[17px] font-medium leading-5 text-[#111b21] dark:text-[#e9edef] overflow-hidden text-ellipsis whitespace-nowrap">TimelyFlow Assistant</h3>
                                <p className="text-[13px] text-[#667781] dark:text-[#8696a0]">online</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-5 text-[#54656f] dark:text-[#aebac1]">
                            <Video className="h-[22px] w-[22px] cursor-pointer" />
                            <Phone className="h-[20px] w-[20px] cursor-pointer" />
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div ref={scrollRef} className="flex-1 px-4 relative bg-[#0b141a] overflow-y-auto will-change-scroll overscroll-contain">
                        {/* WhatsApp pattern overlay */}
                        <div
                            className="absolute inset-0 opacity-10 pointer-events-none z-0"
                            style={{ backgroundImage: "url('https://static.whatsapp.net/rsrc.php/v3/yl/r/rro_BxtZ_w4.png')", backgroundSize: "cover", willChange: "transform" }}
                        />
                        <div className="flex flex-col gap-[6px] relative z-10 py-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`relative max-w-[85%] rounded-[12px] px-[10px] py-[6px] text-[15px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${msg.sender === "me"
                                                ? "bg-[#d9fdd3] text-[#111b21] dark:bg-[#005c4b] dark:text-[#e9edef] rounded-tr-none"
                                                : "bg-white text-[#111b21] dark:bg-[#202c33] dark:text-[#e9edef] rounded-tl-none"
                                            }`}
                                    >
                                        <p className="leading-[20px] pr-10 whitespace-pre-wrap word-break">{msg.text}</p>
                                        <span className="absolute bottom-[4px] right-[10px] text-[11px] text-gray-500 dark:text-[rgba(255,255,255,0.6)]">
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {isSending && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-[#202c33] text-[#111b21] dark:text-[#e9edef] rounded-[12px] rounded-tl-none px-[10px] py-[6px] text-[15px] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] animate-pulse">
                                        <p className="italic text-[13px] opacity-70">Yazıyor...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="flex items-end gap-2 bg-[#f0f2f5] dark:bg-[#202c33] px-3 py-[10px] z-10 relative">
                        <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-3xl flex items-center px-4 py-2 mt-auto">
                            <Input
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                placeholder="Type a message"
                                className="flex-1 border-none bg-transparent h-6 focus-visible:ring-0 text-[#111b21] dark:text-[#e9edef] p-0 text-[15px] placeholder:text-[#8696a0]"
                            />
                        </div>
                        {inputText.trim() ? (
                            <Button
                                size="icon"
                                className="rounded-full bg-[#00a884] dark:bg-[#00a884] hover:bg-[#008f6f] text-white shrink-0 h-[42px] w-[42px] mt-auto absolute bottom-[10px] right-3 transition-transform active:scale-95"
                                onClick={handleSend}
                                disabled={isSending}
                            >
                                <Send className="h-5 w-5 ml-1" />
                            </Button>
                        ) : (
                            <div className="h-[42px] w-[42px] shrink-0 mt-auto rounded-full flex items-center justify-center bg-[#00a884] text-white cursor-pointer transition-transform active:scale-95">
                                <Mic className="h-[22px] w-[22px]" />
                            </div>
                        )}
                    </div>
                </div>
            </Iphone>
        </div>
    );
}

function Mic(props: any) {
    // SVG for mic if Lucide mic isn't optimal
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M11.999 14.942c2.005 0 3.534-1.53 3.534-3.534v-5.226c0-2.004-1.529-3.534-3.534-3.534-2.004 0-3.534 1.53-3.534 3.534v5.226c0 2.004 1.53 3.534 3.534 3.534zm4.707-3.534c0 2.597-2.11 4.707-4.707 4.707s-4.707-2.11-4.707-4.707h-1.176c0 2.943 2.193 5.4 5.061 5.811v2.969h1.644v-2.969c2.868-.411 5.061-2.868 5.061-5.811h-1.176z"></path>
        </svg>
    );
}
