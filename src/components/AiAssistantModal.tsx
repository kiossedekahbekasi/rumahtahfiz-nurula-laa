import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { Bot, X, Send, Sparkles, User, RefreshCw, MessageSquare } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecommendedPackage?: (packageName: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectRecommendedPackage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-0',
      sender: 'ai',
      text: "Assalamu'alaikum Warahmatullahi Wabarakatuh! Saya Ustadz AI, asisten virtual Kios Sedekah & Rumah Tahfizh Al-Qur'an. Ada yang bisa saya bantu terkait berkah sedekah sembako, perhitungan zakat, atau pendaftaran santri hari ini?",
      timestamp: 'Baru saja',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    "Apa keutamaan sedekah beras untuk hafiz Qur'an?",
    "Rekomendasi paket sembako sedekah budget 100 ribu?",
    "Bagaimana syarat beasiswa santri yatim di Rumah Tahfizh?",
    "Berapa zakat mal jika punya tabungan 20 juta?",
  ];

  const handleSend = async (textToSend?: string) => {
    const msgText = textToSend || inputMessage;
    if (!msgText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: msgText,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      // Form history for context
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText, history }),
      });

      const data = await res.json();
      const replyText = data.text || data.fallback || "Mohon maaf, terjadi kendala sinyal. Silakan coba pertanyaan lainnya.";

      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: ChatMessage = {
        id: 'ai-err-' + Date.now(),
        sender: 'ai',
        text: "Afwan, sambungan ke server sedang terbatas. Sedekah sembako terbaik dapat Anda pilih langsung dari menu Paket Sedekah Kios kami. Semoga Allah memberkahi niat mulia Anda!",
        timestamp: 'Baru saja',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white w-full max-w-xl h-[600px] rounded-2xl flex flex-col shadow-2xl border border-emerald-700 overflow-hidden animate-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 bg-emerald-950 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold text-xl shadow">
              🕌
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center space-x-1.5">
                <span>Ustadz Kios AI</span>
                <span className="bg-emerald-800 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Powered by Gemini
                </span>
              </h3>
              <p className="text-[11px] text-emerald-300">Konsultasi Zakat, Infaq Sembako & Rumah Tahfizh</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/80">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${
                m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-amber-400 text-emerald-950'
                    : 'bg-emerald-800 text-amber-300 border border-emerald-700'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-emerald-950 font-medium rounded-tr-none'
                    : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <span
                  className={`block text-[9px] text-right mt-1 ${
                    m.sender === 'user' ? 'text-emerald-950/70' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-emerald-300 text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800 w-fit">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              <span>Ustadz AI sedang mengetik jawaban...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 bg-slate-900 border-t border-slate-800 overflow-x-auto whitespace-nowrap flex space-x-2 no-scrollbar">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-emerald-200 border border-slate-700 text-[11px] font-medium flex-shrink-0 transition-colors"
            >
              💬 {prompt}
            </button>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-3 bg-emerald-950 border-t border-emerald-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tanyakan hukum sedekah sembako, zakat, atau tahfizh..."
            className="flex-1 bg-slate-900 text-white placeholder-slate-400 text-xs px-4 py-2.5 rounded-xl border border-emerald-800 focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputMessage.trim()}
            className="p-2.5 rounded-xl bg-amber-400 text-emerald-950 hover:bg-amber-300 disabled:opacity-50 font-bold shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
