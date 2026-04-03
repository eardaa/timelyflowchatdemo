import { WhatsAppDemo } from "@/components/WhatsAppDemo";
import { TimelyFlowVoiceDemo } from "@/components/VapiDemo";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col lg:flex-row items-center justify-center p-6 md:p-12 lg:p-24 gap-12 lg:gap-24 overflow-hidden relative selection:bg-[#00a884] selection:text-white">
      {/* Background glowing blobs - Performance optimized with radial gradient instead of heavy blur */}
      <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[radial-gradient(circle,rgba(0,168,132,0.15)_0%,transparent_70%)] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[radial-gradient(circle,rgba(17,94,89,0.15)_0%,transparent_70%)] rounded-full" />

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <TimelyFlowVoiceDemo />
      </div>

      <div className="z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-150">
        <WhatsAppDemo />
      </div>
    </main>
  );
}
