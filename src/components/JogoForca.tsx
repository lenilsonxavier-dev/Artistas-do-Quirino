import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Lightbulb, Sparkles, Trophy, RotateCcw, Volume2, HelpCircle, Star, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LISTA_PALAVRAS_FORCA, WordItem, soundEffects } from '../data/forcaData';

interface JogoForcaProps {
  onVoltar: () => void;
}

const LETRAS_ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const JogoForca: React.FC<JogoForcaProps> = ({ onVoltar }) => {
  const [palavraAtual, setPalavraAtual] = useState<WordItem | null>(null);
  const [letrasDitas, setLetrasDitas] = useState<Set<string>>(new Set());
  const [errosCount, setErrosCount] = useState<number>(0);
  const MAX_ERROS = 6;

  const [pontos, setPontos] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [dica1Usada, setDica1Usada] = useState<boolean>(false);
  const [dica2Usada, setDica2Usada] = useState<boolean>(false);

  const [statusJogo, setStatusJogo] = useState<'jogando' | 'vitoria' | 'derrota'>('jogando');
  const [historicoUsados, setHistoricoUsados] = useState<number[]>([]);

  // Inicia uma nova rodada com sorteio sem repetição imediata
  const sortearNovaPalavra = useCallback(() => {
    let indicesDisponiveis = LISTA_PALAVRAS_FORCA.map((_, i) => i).filter(
      (idx) => !historicoUsados.includes(idx)
    );

    if (indicesDisponiveis.length === 0) {
      indicesDisponiveis = LISTA_PALAVRAS_FORCA.map((_, i) => i);
      setHistoricoUsados([]);
    }

    const sortearIndex = indicesDisponiveis[Math.floor(Math.random() * indicesDisponiveis.length)];
    const item = LISTA_PALAVRAS_FORCA[sortearIndex];

    setPalavraAtual(item);
    setHistoricoUsados((prev) => [...prev, sortearIndex]);
    setLetrasDitas(new Set());
    setErrosCount(0);
    setDica1Usada(false);
    setDica2Usada(false);
    setStatusJogo('jogando');
  }, [historicoUsados]);

  // Inicializa o jogo
  useEffect(() => {
    if (!palavraAtual) {
      sortearNovaPalavra();
    }
  }, [palavraAtual, sortearNovaPalavra]);

  // Normaliza string tirando acentos para comparação das letras
  const normalizarTexto = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  };

  // Verifica se a palavra foi completamente descoberta
  const verificarVitoria = useCallback((letrasSet: Set<string>, palavra: string) => {
    const palavraNorm = normalizarTexto(palavra);
    for (let i = 0; i < palavraNorm.length; i++) {
      const char = palavraNorm[i];
      if (char !== " " && char !== "-" && char !== "_" && !letrasSet.has(char)) {
        return false;
      }
    }
    return true;
  }, []);

  // Dispara os efeitos de celebração de vitória (Confetti + Áudio)
  const dispararComemoracao = useCallback(() => {
    soundEffects.playVictory();

    // Explosão de confetes e estrelas coloridas
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffde59', '#ff6b6b', '#34d399', '#6ee7ff', '#a78bfa']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffde59', '#ff6b6b', '#34d399', '#6ee7ff', '#a78bfa']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Trata o palpite de uma letra
  const darPalpite = (letra: string) => {
    if (statusJogo !== 'jogando' || !palavraAtual) return;

    soundEffects.playClick();

    const L = normalizarTexto(letra);
    if (letrasDitas.has(L)) return;

    const novasLetras = new Set(letrasDitas);
    novasLetras.add(L);
    setLetrasDitas(novasLetras);

    const palavraNorm = normalizarTexto(palavraAtual.palavra);
    const acertou = palavraNorm.includes(L);

    if (acertou) {
      soundEffects.playCorrectLetter();

      // Verifica se venceu a rodada
      if (verificarVitoria(novasLetras, palavraAtual.palavra)) {
        setStatusJogo('vitoria');
        setPontos((p) => p + 100 + combo * 20);
        setCombo((c) => c + 1);
        dispararComemoracao();
      }
    } else {
      soundEffects.playWrongLetter();
      const novosErros = errosCount + 1;
      setErrosCount(novosErros);

      if (novosErros >= MAX_ERROS) {
        setStatusJogo('derrota');
        setCombo(0);
        soundEffects.playGameOver();
      }
    }
  };

  // Revela a 1ª letra como dica
  const usarDica1 = () => {
    if (dica1Usada || !palavraAtual || statusJogo !== 'jogando') return;
    soundEffects.playHintSparkle();
    const palavraNorm = normalizarTexto(palavraAtual.palavra);
    const primeiraLetra = palavraNorm[0];
    if (primeiraLetra) {
      darPalpite(primeiraLetra);
    }
    setDica1Usada(true);
  };

  // Revela uma letra aleatória não descoberta
  const usarDica2 = () => {
    if (dica2Usada || !palavraAtual || statusJogo !== 'jogando') return;
    soundEffects.playHintSparkle();
    const palavraNorm = normalizarTexto(palavraAtual.palavra);
    const naoDescobertas = palavraNorm.split("").filter((char) => !letrasDitas.has(char));

    if (naoDescobertas.length > 0) {
      const sorteada = naoDescobertas[Math.floor(Math.random() * naoDescobertas.length)];
      darPalpite(sorteada);
    }
    setDica2Usada(true);
  };

  if (!palavraAtual) return null;

  const palavraNorm = normalizarTexto(palavraAtual.palavra);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001233] via-[#001858] to-[#040926] text-white p-4 md:p-6 flex flex-col items-center justify-between font-sans">
      
      {/* Top Header Controls */}
      <header className="w-full max-w-4xl flex items-center justify-between bg-white/10 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-white/20 shadow-xl mb-4">
        <button
          onClick={() => {
            soundEffects.playClick();
            onVoltar();
          }}
          className="bg-[#ffde59] hover:bg-[#ffe066] text-[#001858] font-extrabold px-4 py-2 rounded-xl flex items-center gap-2 transition hover:scale-105 active:scale-95 shadow-md cursor-pointer"
        >
          <ArrowLeft size={20} /> Voltar aos Jogos
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-amber-400/20 border border-amber-400/40 text-amber-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 text-sm md:text-base">
            <Trophy size={18} className="text-amber-400" />
            <span>{pontos} pts</span>
          </div>

          <div className="bg-purple-400/20 border border-purple-400/40 text-purple-300 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 text-sm md:text-base">
            <Star size={18} className="text-purple-300 fill-purple-300" />
            <span>Combo: x{combo}</span>
          </div>
        </div>
      </header>

      {/* Main Game Layout Grid */}
      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 items-start flex-grow">
        
        {/* Left / Top Side: Artist Easel & Gallows Illustration */}
        <section className="md:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/60 border border-cyan-400/30 px-3 py-1 rounded-full flex items-center gap-1">
              🎨 Lúdico & Educativo
            </span>
            <span className="text-xs font-extrabold text-amber-300 bg-amber-950/60 border border-amber-400/30 px-3 py-1 rounded-full">
              Erros: {errosCount}/{MAX_ERROS}
            </span>
          </div>

          {/* Canvas Illustration SVG (Artist Palette & Easel Character) */}
          <div className="w-full h-56 md:h-64 flex items-center justify-center relative my-2">
            <svg viewBox="0 0 320 260" className="w-full h-full max-w-[280px]">
              {/* Cavalete de Pintura */}
              <path d="M 60 230 L 120 40 L 180 230" stroke="#f59e0b" strokeWidth="8" strokeLinecap="round" fill="none" />
              <path d="M 120 40 L 140 230" stroke="#d97706" strokeWidth="6" strokeLinecap="round" strokeDasharray="4 4" fill="none" />
              <line x1="40" y1="160" x2="200" y2="160" stroke="#f59e0b" strokeWidth="10" strokeLinecap="round" />
              
              {/* Moldura da Tela do Artista */}
              <rect x="70" y="70" width="100" height="85" rx="8" fill="#fffef0" stroke="#001858" strokeWidth="4" />
              <circle cx="95" cy="95" r="12" fill="#ff6b6b" opacity="0.8" />
              <circle cx="125" cy="110" r="18" fill="#34d399" opacity="0.8" />
              <path d="M 80 135 Q 110 115 150 140" stroke="#6ee7ff" strokeWidth="5" fill="none" />

              {/* Suporte da Corda / Pincel Mágico */}
              <path d="M 160 40 L 250 40 L 250 70" stroke="#ffde59" strokeWidth="6" strokeLinecap="round" fill="none" />

              {/* ESTÁGIOS DO DESENHO DO BONECO ARTISTA (0 a 6 erros) */}
              
              {/* 1. Boina de Artista & Cabeça */}
              {errosCount >= 1 && (
                <g className="animate-bounce">
                  <circle cx="250" cy="95" r="22" fill="#ffe0b2" stroke="#ffde59" strokeWidth="3" />
                  {/* Olhos e Sorriso do Boneco */}
                  <circle cx="243" cy="92" r="3" fill="#001858" />
                  <circle cx="257" cy="92" r="3" fill="#001858" />
                  <path d="M 243 103 Q 250 110 257 103" stroke="#001858" strokeWidth="2.5" fill="none" />
                  {/* Boina Vermelha de Pintor */}
                  <path d="M 230 82 Q 250 68 270 82 Q 250 78 230 82 Z" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                  <circle cx="250" cy="74" r="3.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
                </g>
              )}

              {/* 2. Corpo com Avental de Pintura */}
              {errosCount >= 2 && (
                <g>
                  <line x1="250" y1="117" x2="250" y2="175" stroke="#ffe0b2" strokeWidth="6" strokeLinecap="round" />
                  {/* Avental */}
                  <path d="M 240 128 L 260 128 L 265 168 L 235 168 Z" fill="#3b82f6" opacity="0.95" stroke="#ffffff" strokeWidth="2" />
                  {/* Manchinhas de Tinta no Avental */}
                  <circle cx="246" cy="142" r="3" fill="#ffde59" />
                  <circle cx="255" cy="155" r="3.5" fill="#ec4899" />
                </g>
              )}

              {/* 3. Braço Esquerdo segurando a Paleta */}
              {errosCount >= 3 && (
                <g>
                  <line x1="250" y1="132" x2="222" y2="152" stroke="#ffe0b2" strokeWidth="6" strokeLinecap="round" />
                  {/* Paleta de Cores na Mão */}
                  <ellipse cx="216" cy="156" rx="12" ry="9" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="212" cy="153" r="2.5" fill="#ef4444" />
                  <circle cx="218" cy="151" r="2.5" fill="#3b82f6" />
                  <circle cx="220" cy="158" r="2.5" fill="#10b981" />
                </g>
              )}

              {/* 4. Braço Direito segurando o Pincel */}
              {errosCount >= 4 && (
                <g>
                  <line x1="250" y1="132" x2="278" y2="152" stroke="#ffe0b2" strokeWidth="6" strokeLinecap="round" />
                  {/* Pincel */}
                  <line x1="278" y1="152" x2="288" y2="162" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                  <path d="M 288 162 L 292 166" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
                </g>
              )}

              {/* 5. Perna Esquerda com Sapato de Arte */}
              {errosCount >= 5 && (
                <g>
                  <line x1="250" y1="175" x2="232" y2="215" stroke="#ffe0b2" strokeWidth="6" strokeLinecap="round" />
                  <ellipse cx="228" cy="217" rx="9" ry="5" fill="#ffde59" stroke="#ffffff" strokeWidth="1.5" />
                </g>
              )}

              {/* 6. Perna Direita (Forca Completa) */}
              {errosCount >= 6 && (
                <g>
                  <line x1="250" y1="175" x2="268" y2="215" stroke="#ffe0b2" strokeWidth="6" strokeLinecap="round" />
                  <ellipse cx="272" cy="217" rx="9" ry="5" fill="#ffde59" stroke="#ffffff" strokeWidth="1.5" />
                </g>
              )}
            </svg>
          </div>

          {/* Dica da Categoria */}
          <div className="w-full bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-400/30 rounded-2xl p-3 text-center">
            <div className="text-amber-300 font-extrabold text-xs uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
              <Sparkles size={14} /> Categoria
            </div>
            <div className="text-white font-extrabold text-base md:text-lg">
              {palavraAtual.categoria}
            </div>
          </div>
        </section>

        {/* Right / Main Game Controls & Keyboard */}
        <section className="md:col-span-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 flex flex-col justify-between shadow-2xl space-y-5">
          
          {/* Card da Dica Principal */}
          <div className="bg-cyan-950/50 border border-cyan-400/30 rounded-2xl p-4 flex items-start gap-3">
            <div className="p-2 bg-cyan-500/20 border border-cyan-400/40 rounded-xl text-cyan-300 shrink-0 mt-0.5">
              <Lightbulb size={22} className="animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-0.5">
                Pista do Pequeno Artista
              </span>
              <p className="text-white font-semibold text-sm md:text-base leading-snug">
                "{palavraAtual.dica}"
              </p>
            </div>
          </div>

          {/* Área de Exibição das Letras da Palavra */}
          <div className="py-4 bg-black/20 rounded-2xl border border-white/10 p-4 flex flex-wrap items-center justify-center gap-2 md:gap-3 min-h-[90px]">
            {palavraNorm.split("").map((char, index) => {
              const foiRevelada = letrasDitas.has(char) || char === " " || char === "-";

              return (
                <div
                  key={index}
                  className={`w-10 h-12 md:w-12 md:h-14 rounded-xl border-2 flex items-center justify-center text-xl md:text-2xl font-black transition-all transform duration-300 shadow-md ${
                    foiRevelada
                      ? 'bg-gradient-to-b from-amber-300 to-amber-500 border-amber-200 text-[#001858] scale-105 shadow-amber-500/30'
                      : 'bg-white/10 border-white/20 text-transparent'
                  }`}
                >
                  {foiRevelada ? char : '_'}
                </div>
              );
            })}
          </div>

          {/* Botões de Ação de Pistas */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={usarDica1}
              disabled={dica1Usada || statusJogo !== 'jogando'}
              className="flex-1 bg-purple-600/30 hover:bg-purple-600/50 disabled:opacity-40 disabled:cursor-not-allowed border border-purple-400/40 text-purple-200 font-bold px-3 py-2 rounded-xl text-xs md:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <HelpCircle size={16} /> Pista 1 (1ª Letra)
            </button>

            <button
              onClick={usarDica2}
              disabled={dica2Usada || statusJogo !== 'jogando'}
              className="flex-1 bg-cyan-600/30 hover:bg-cyan-600/50 disabled:opacity-40 disabled:cursor-not-allowed border border-cyan-400/40 text-cyan-200 font-bold px-3 py-2 rounded-xl text-xs md:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles size={16} /> Pista 2 (Sorteia)
            </button>

            <button
              onClick={() => {
                soundEffects.playClick();
                sortearNovaPalavra();
              }}
              className="bg-amber-400/20 hover:bg-amber-400/40 border border-amber-400/40 text-amber-200 font-bold px-3 py-2 rounded-xl text-xs md:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw size={16} /> Mudar Palavra
            </button>
          </div>

          {/* Teclado Virtual de Letras */}
          <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 md:gap-2 pt-2">
            {LETRAS_ALFABETO.map((letra) => {
              const estaUsada = letrasDitas.has(letra);
              const estaNaPalavra = palavraNorm.includes(letra);

              let estiloBotao = "bg-white/10 border-white/20 text-white hover:bg-white/25 hover:scale-105 active:scale-95";

              if (estaUsada) {
                if (estaNaPalavra) {
                  estiloBotao = "bg-emerald-500/80 border-emerald-300 text-white shadow-lg shadow-emerald-500/20 scale-95 opacity-90";
                } else {
                  estiloBotao = "bg-rose-500/20 border-rose-500/40 text-rose-300/50 opacity-40 cursor-not-allowed scale-95";
                }
              }

              return (
                <button
                  key={letra}
                  disabled={estaUsada || statusJogo !== 'jogando'}
                  onClick={() => darPalpite(letra)}
                  className={`h-11 md:h-12 rounded-xl border font-black text-base md:text-lg flex items-center justify-center transition-all cursor-pointer ${estiloBotao}`}
                >
                  {letra}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      {/* OVERLAY DE CELEBRAÇÃO / VITÓRIA PARABÉNS! */}
      {statusJogo === 'vitoria' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-[#162241] to-[#001858] border-2 border-amber-400/80 rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden transform animate-scale-up">
            
            <div className="w-20 h-20 bg-amber-400/20 border-2 border-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-300 shadow-lg shadow-amber-500/30 animate-bounce">
              <Award size={44} />
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-amber-300 mb-1 drop-shadow-md">
              Parabéns, Pequeno Artista! 🎉
            </h2>
            <p className="text-cyan-200 font-bold text-sm md:text-base mb-4">
              Você descobriu a palavra mágica: <span className="text-white bg-amber-500/30 px-2 py-0.5 rounded-lg border border-amber-400">{palavraAtual.palavra}</span>
            </p>

            {/* Curiosidade Educativa */}
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-left mb-6 shadow-inner">
              <div className="text-amber-300 font-extrabold text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                <Lightbulb size={16} /> Você Sabia? (Curiosidade da Arte)
              </div>
              <p className="text-white text-sm md:text-base leading-relaxed font-medium">
                {palavraAtual.curiosidade}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  sortearNovaPalavra();
                }}
                className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#001858] font-black text-lg py-3 rounded-2xl transition hover:scale-105 active:scale-95 shadow-xl cursor-pointer flex items-center justify-center gap-2"
              >
                Próxima Palavra 🎨
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY DE FIM DE JOGO / TENTAR NOVAMENTE */}
      {statusJogo === 'derrota' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-[#2a1322] to-[#12050e] border-2 border-rose-500/80 rounded-3xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl relative overflow-hidden transform animate-scale-up">
            
            <div className="w-20 h-20 bg-rose-500/20 border-2 border-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-300 shadow-lg shadow-rose-500/30">
              <RotateCcw size={40} />
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-rose-300 mb-1">
              Quase lá! 🌟
            </h2>
            <p className="text-gray-300 font-semibold text-sm md:text-base mb-2">
              A palavra correta era: <span className="text-amber-300 font-black underline">{palavraAtual.palavra}</span>
            </p>
            <p className="text-xs md:text-sm text-gray-400 mb-5">
              Na arte, errar faz parte do aprendizado! Que tal tentar mais uma vez?
            </p>

            <button
              onClick={() => {
                soundEffects.playClick();
                sortearNovaPalavra();
              }}
              className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:brightness-110 text-white font-black text-lg py-3 rounded-2xl transition hover:scale-105 active:scale-95 shadow-xl cursor-pointer flex items-center justify-center gap-2"
            >
              Tentar Outra Palavra 🎨
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
