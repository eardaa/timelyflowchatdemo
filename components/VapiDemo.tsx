"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Mic, Loader2, Square, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";

export function TimelyFlowVoiceDemo() {
    const vapiRef = useRef<Vapi | null>(null);
    const [callStatus, setCallStatus] = useState<"inactive" | "connecting" | "active">("inactive");
    const [error, setError] = useState<string | null>(null);

    // Initialize Vapi client once
    useEffect(() => {
        if (!vapiRef.current) {
            vapiRef.current = new Vapi("ce77ca81-69b3-4c16-af95-2ceb377cf3b7");
        }

        const vapi = vapiRef.current;

        const onCallStart = () => {
            setCallStatus("active");
            setError(null);
        };

        const onCallEnd = () => {
            setCallStatus("inactive");
        };

        const onError = (e: any) => {
            console.error("Vapi Error", e);
            setCallStatus("inactive");
            setError("Görüşme sırasında bir hata oluştu. Lütfen tekrar deneyin.");
        };

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("error", onError);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("error", onError);
            // We don't stop the call here to allow for fast refresh, 
            // but we ensure listeners are removed.
        };
    }, []);

    const handleToggleCall = useCallback(() => {
        if (!vapiRef.current) return;

        if (callStatus === "inactive") {
            setError(null);
            setCallStatus("connecting");
            vapiRef.current.start("5b643095-bee4-472a-8618-0ca20919ec37");
        } else {
            vapiRef.current.stop();
        }
    }, [callStatus]);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/60 border border-zinc-800 backdrop-blur-md rounded-[32px] shadow-[0_0_40px_rgba(0,168,132,0.15)] space-y-6 w-[350px] sm:w-[400px] h-[600px] text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00a884]/20 via-transparent to-transparent opacity-60"></div>

            <div className="relative z-10 w-full flex flex-col items-center flex-1 justify-center h-full">

                {/* Pulsing Avatar Area */}
                <div
                    className={`group mx-auto w-32 h-32 mb-8 relative flex items-center justify-center rounded-full border cursor-pointer transition-colors ${callStatus === "active"
                            ? "bg-[#00a884]/10 border-[#00a884]/50 hover:bg-[#00a884]/20"
                            : error 
                                ? "bg-red-500/10 border-red-500/30"
                                : "bg-zinc-800/80 border-zinc-700/50 hover:bg-zinc-800"
                        }`}
                    onClick={handleToggleCall}
                >
                    {callStatus === "active" && (
                        <>
                            <div className="absolute inset-0 bg-[#00a884] rounded-full animate-ping opacity-30"></div>
                            <div className="absolute inset-2 bg-[#00a884]/20 rounded-full animate-pulse"></div>
                        </>
                    )}

                    {callStatus === "connecting" ? (
                        <Loader2 className="h-10 w-10 text-[#00a884] animate-spin" />
                    ) : callStatus === "active" ? (
                        <Mic className="h-10 w-10 text-[#00a884] drop-shadow-[0_0_15px_rgba(0,168,132,0.8)] animate-pulse" />
                    ) : error ? (
                        <AlertCircle className="h-10 w-10 text-red-500" />
                    ) : (
                        <Mic className="h-10 w-10 text-[#00a884] opacity-80" />
                    )}
                </div>

                <h2 className="text-2xl font-bold text-white mb-3">TimelyFlow Voice Assistant</h2>
                <p className="text-zinc-400 text-[15px] mb-10 leading-relaxed px-4 min-h-[3rem]">
                    {error 
                        ? error
                        : callStatus === "active"
                            ? "Asistan dinliyor, lütfen konuşmaya başlayın..."
                            : callStatus === "connecting"
                                ? "Asistana bağlanılıyor..."
                                : "Sizinle konuşabilen, yapay zeka destekli akıllı telefon asistanınız."}
                </p>

                <Button
                    className={`w-full max-w-[280px] h-[52px] font-medium text-[16px] rounded-full transition-all hover:-translate-y-0.5 ${callStatus === "inactive"
                            ? "bg-[#00a884] hover:bg-[#008f6f] text-white shadow-[0_4px_14px_0_rgba(0,168,132,0.39)] hover:shadow-[0_6px_20px_rgba(0,168,132,0.23)]"
                            : "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50"
                        }`}
                    onClick={handleToggleCall}
                    disabled={callStatus === "connecting"}
                >
                    {callStatus === "inactive" ? (
                        "Görüşmeyi Başlat"
                    ) : callStatus === "connecting" ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Bağlanıyor...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Square className="h-4 w-4 fill-current" />
                            Aramayı Sonlandır
                        </div>
                    )}
                </Button>
            </div>

            <div className="relative z-10 text-[13px] text-zinc-500 w-full pt-4 border-t border-zinc-800/80">
                WebRTC üzerinden gerçek zamanlı görüşme yapılır. Mikrofon izni gereklidir.
            </div>
        </div>
    );
}
