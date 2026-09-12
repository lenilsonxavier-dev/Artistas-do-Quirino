import React, { useState } from "react";
import { X, HelpCircle, ChevronDown, ChevronUp, Sparkles, BookOpen } from "lucide-react";
import { faqData } from "../data/faqData";

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
  const [openItem, setOpenItem] = useState<number | null>(1);

  if (!isOpen) return null;

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#fef6e4] border-4 border-white rounded-[32px] max-w-2xl w-full shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="bg-[#001858] p-5 text-white flex items-center justify-between border-b-2 border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffde59] text-[#001858] flex items-center justify-center font-bold shadow-md">
              <HelpCircle size={24} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black leading-tight flex items-center gap-2">
                FAQ – Candinho: do pincel ao pixel
              </h2>
              <p className="text-xs md:text-sm text-[#ffde59] font-medium">
                Pequenos Artistas do Quirino • Documentação & Diretrizes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition cursor-pointer text-white"
            title="Fechar FAQ"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lista de Perguntas (Scrollable) */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-3 flex-1">
          <div className="bg-white/80 border border-[#fee5b1] rounded-2xl p-3.5 mb-4 flex items-center gap-3 text-sm text-[#001858]">
            <Sparkles className="text-[#ff9900] shrink-0" size={20} />
            <p className="font-medium">
              Conheça as diretrizes pedagógicas, estrutura tecnológica e fundamentação do nosso ambiente digital de aprendizagem.
            </p>
          </div>

          {faqData.map((item) => {
            const isExpanded = openItem === item.id;
            return (
              <div 
                key={item.id}
                className="bg-white border-2 border-[#fee5b1] rounded-2xl shadow-sm transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 font-bold text-[#001858] hover:bg-[#fff9ed] transition cursor-pointer"
                >
                  <span className="text-sm md:text-base leading-snug flex items-center gap-2">
                    <BookOpen size={16} className="text-[#00ca85] shrink-0" />
                    {item.pergunta}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#f0f4ff] flex items-center justify-center shrink-0 text-[#001858]">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 text-[#2d3748] text-sm md:text-base leading-relaxed border-t border-[#fee5b1]/50 bg-[#fffdfa]">
                    <p className="whitespace-pre-line">{item.resposta}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-white border-t border-[#fee5b1] flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
          <span>EMEIEF Osvaldo Quirino Simões • Osasco-SP</span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#001858] text-white hover:bg-[#0a277a] rounded-full font-bold transition text-xs shadow-md cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
