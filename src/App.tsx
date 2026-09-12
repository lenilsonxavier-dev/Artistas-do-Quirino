import { useState, useEffect, useRef, KeyboardEvent } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { 
  Volume2, 
  VolumeX, 
  LogOut, 
  Search, 
  ArrowLeft, 
  Gamepad2, 
  Sparkles, 
  Shuffle, 
  Play, 
  CheckCircle,
  HelpCircle,
  ExternalLink,
  Music
} from "lucide-react";
import { desafios, Desafio } from "./data/desafios";
import { jogosOnlineLista, Jogo } from "./data/jogos";
import { JogoForca } from "./components/JogoForca";
import { FaqModal } from "./components/FaqModal";

export default function App() {
  // --- ESTADOS ---
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [activeScreen, setActiveScreen] = useState<string>("splash"); // "splash" | "home" | "museu" | "mural" | "desafiosArte" | "jogosOnline" | "telaJogo" | "webviewScreen"
  const [abaMuseu, setAbaMuseu] = useState<"emaze" | "arts">("emaze");
  const [isFaqOpen, setIsFaqOpen] = useState<boolean>(false);
  
  // Controle de áudio e vídeo
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [somExposicaoAtivo, setSomExposicaoAtivo] = useState<"none" | "emaze">("none");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeJogoUrl, setActiveJogoUrl] = useState<string>("");
  const [activeWebViewType, setActiveWebViewType] = useState<string>("");

  // Refs de áudio e vídeo para controle preciso e seguro
  const curAudioRef = useRef<HTMLAudioElement | null>(null);
  const museuAudioRef = useRef<HTMLAudioElement | null>(null);
  const ambientOscRef = useRef<{ stop: () => void } | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // --- PERSISTÊNCIA E INICIALIZAÇÃO DE SEGURANÇA ---
  useEffect(() => {
    try {
      // Verifica se o aluno já fez login anteriormente neste dispositivo
      const authed = localStorage.getItem("quirino_auth");
      if (authed === "true") {
        setIsAuthorized(true);
      }
    } catch (e) {
      console.warn("localStorage não está acessível:", e);
    }
  }, []);

  // Controlar o áudio do museu quando sair da tela "museu"
  useEffect(() => {
    if (activeScreen !== "museu") {
      pararSomMuseu();
    }
  }, [activeScreen]);

  // Função para limpar áudios em execução quando o componente desmontar
  useEffect(() => {
    return () => {
      pararSomMuseu();
      if (curAudioRef.current) {
        curAudioRef.current.pause();
      }
    };
  }, []);

  // --- LÓGICA DE AUTENTICAÇÃO ---
  const handleLogin = () => {
    if (password === "246") {
      setIsAuthorized(true);
      try {
        localStorage.setItem("quirino_auth", "true");
      } catch (e) {
        console.warn("Não foi possível salvar no localStorage:", e);
      }
      setLoginError("");
    } else {
      setLoginError("Senha incorreta!");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleLogoutFull = () => {
    Swal.fire({
      title: "Sair do Ateliê? 🎨",
      text: "Espero que tenha se divertido! Deseja remover o acesso salvo neste dispositivo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6b6b",
      cancelButtonColor: "#ffcc00",
      confirmButtonText: "Sim, desconectar tudo",
      cancelButtonText: "Apenas fechar",
      background: "#fff9e6"
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          localStorage.removeItem("quirino_auth");
        } catch (e) {
          console.warn("Não foi possível remover do localStorage:", e);
        }
        setIsAuthorized(false);
        setPassword("");
        setActiveScreen("splash");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Apenas recarrega a página ou limpa estados, dependendo da plataforma
        window.location.reload();
      }
    });
  };

  // --- LÓGICA DO SPLASH E VÍDEO (REQUISITO CRÍTICO DE ENTRADA RÁPIDA) ---
  const handleStartApp = () => {
    const video = videoRef.current;
    if (video) {
      // Indicamos que o vídeo de abertura começou a tocar
      setIsPlayingVideo(true);
      
      // Carrega o vídeo somente agora, por demanda, economizando banda de rede crucial na entrada!
      video.load();
      
      video.play()
        .then(() => {
          // Quando terminar, entra no app automaticamente
          video.onended = () => {
            abrirAppDireto();
          };
        })
        .catch((err) => {
          console.log("Autoplay barrado ou falha no vídeo, pulando direto...", err);
          abrirAppDireto();
        });

      // Garantia de Segurança: Se por algum motivo o vídeo travar, após um tempo limite ele pula sozinho
      const timeoutId = setTimeout(() => {
        if (activeScreen === "splash") {
          abrirAppDireto();
        }
      }, 7000); // 7 segundos de redundância máxima

      return () => clearTimeout(timeoutId);
    } else {
      abrirAppDireto();
    }
  };

  const abrirAppDireto = () => {
    setIsPlayingVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setActiveScreen("home");
  };

  // --- CONTROLE DE ÁUDIO GLOBAL E DO MUSEU ---
  const tocarAudio = (nomeArquivo: string) => {
    if (!nomeArquivo) return;
    
    if (curAudioRef.current) {
      curAudioRef.current.pause();
      curAudioRef.current.currentTime = 0;
    }
    
    const audioUrl = `https://cdn.jsdelivr.net/gh/lenilsonxavier-dev/arteeducar@main/sons/${nomeArquivo}.mp3`;
    curAudioRef.current = new Audio(audioUrl);
    curAudioRef.current.play().catch((e) => {
      console.log("Nota: Tentando áudio local se o CDN falhar...", e);
      // fallback local
      curAudioRef.current = new Audio(`sons/${nomeArquivo}.mp3`);
      curAudioRef.current.play().catch((err) => {
        console.log("Falha ao reproduzir áudio:", err);
      });
    });
  };

  const pararSomMuseu = () => {
    if (museuAudioRef.current) {
      museuAudioRef.current.pause();
      museuAudioRef.current.currentTime = 0;
    }
    if (ambientOscRef.current) {
      ambientOscRef.current.stop();
      ambientOscRef.current = null;
    }
    setSomExposicaoAtivo("none");
  };

  const alternarSomPortinari = () => {
    if (somExposicaoAtivo === "emaze") {
      pararSomMuseu();
      return;
    }

    pararSomMuseu();

    const audioUrl = "https://cdn.jsdelivr.net/gh/lenilsonxavier-dev/arteeducar@main/sons/museu.mp3";

    museuAudioRef.current = new Audio(audioUrl);
    museuAudioRef.current.loop = true;

    museuAudioRef.current.play()
      .then(() => {
        setSomExposicaoAtivo("emaze");
      })
      .catch((e) => {
        console.log("Tentando áudio local ou sintetizador para Portinari...", e);
        museuAudioRef.current = new Audio("sons/museu.mp3");
        museuAudioRef.current.loop = true;
        museuAudioRef.current.play()
          .then(() => setSomExposicaoAtivo("emaze"))
          .catch(() => {
            try {
              const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
              if (AudioCtx) {
                const ctx = new AudioCtx();
                let isPlaying = true;

                const playChordLoop = () => {
                  if (!isPlaying) return;
                  const now = ctx.currentTime;
                  const notes = [261.63, 329.63, 392.00, 523.25, 440.00];

                  notes.forEach((freq, idx) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.45);
                    gain.gain.setValueAtTime(0.04, now + idx * 0.45);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.45 + 2.8);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now + idx * 0.45);
                    osc.stop(now + idx * 0.45 + 2.8);
                  });
                };

                playChordLoop();
                const interval = setInterval(playChordLoop, 3500);

                ambientOscRef.current = {
                  stop: () => {
                    isPlaying = false;
                    clearInterval(interval);
                    ctx.close().catch(() => {});
                  }
                };
                setSomExposicaoAtivo("emaze");
              }
            } catch (errSynth) {
              console.log("Erro no sintetizador:", errSynth);
              setSomExposicaoAtivo("none");
            }
          });
      });
  };

  // --- SEÇÃO DE DESAFIOS ---
  const renderDesafiosFiltrados = () => {
    const queryNormalized = searchQuery.toLowerCase();
    return desafios.filter((desafio) => 
      desafio.titulo.toLowerCase().includes(queryNormalized) ||
      desafio.descricao.toLowerCase().includes(queryNormalized)
    );
  };

  const desafioAleatorio = () => {
    const indiceSorteado = Math.floor(Math.random() * desafios.length);
    const desafio = desafios[indiceSorteado];
    
    Swal.fire({
      title: `Desafio #${desafio.numero}`,
      html: `
        <div style="text-align: left; background: #fff9e6; padding: 15px; border-radius: 12px; border: 1px solid #ffcc00;">
          <h4 style="margin-top:0; color:#001858; font-size: 1.15rem;">🎨 <strong>${desafio.titulo}</strong></h4>
          <p style="color:#222; font-size: 0.95rem;"><strong>O que fazer:</strong><br>${desafio.descricao}</p>
          <p style="color:#555; font-size: 0.85rem; margin-bottom:0;"><strong>Objetivo:</strong><br>${desafio.objetivo}</p>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Vou fazer esse! 🎨",
      cancelButtonText: "Sortear outro 🎲",
      confirmButtonColor: "#00ca85",
      cancelButtonColor: "#ffcc00"
    }).then((result) => {
      if (result.isConfirmed) {
        aceitarDesafio(desafio.titulo);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        desafioAleatorio();
      }
    });
  };

  const aceitarDesafio = (titulo: string) => {
    Swal.fire({
      title: "Desafio Aceito!",
      text: `Prepare-se para: ${titulo} 🎨`,
      icon: "success",
      confirmButtonColor: "#00ca85"
    });
  };

  // --- SEÇÃO DE JOGOS & WEBVIEW ---
  const abrirCentralJogos = () => {
    setActiveScreen("jogosOnline");
  };

  const abrirJogo = (jogo: Jogo) => {
    if (jogo.isNative && jogo.id === "forca") {
      setActiveScreen("jogoForca");
    } else {
      setActiveJogoUrl(jogo.link);
      setActiveScreen("telaJogo");
    }
  };

  const fecharJogo = () => {
    setActiveJogoUrl("");
    setActiveScreen("jogosOnline");
  };

  const abrirWebView = (tipo: string) => {
    setActiveWebViewType(tipo);
    setActiveScreen("webviewScreen");
  };

  const fecharWebView = () => {
    setActiveWebViewType("");
    setActiveScreen("home");
  };

  // --- RENDERIZADOR ---
  return (
    <div className="min-h-screen text-[#001858] selection:bg-[#ffde59] selection:text-[#001858]">
      
      {/* 🔐 TELA DE LOGIN (SOBREPOSTA SE NÃO AUTORIZADO) */}
      {!isAuthorized && (
        <div 
          id="login" 
          className="fixed inset-0 bg-gradient-to-br from-[#00ca85] to-[#0099cc] flex flex-col justify-center items-center z-[99999] text-white p-6"
        >
          <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 w-full max-w-md shadow-2xl text-center">
            <h1 className="text-3xl font-bold mb-2">🎨 Pequenos Artistas do Quirino</h1>
            <p className="text-lg opacity-90 mb-6">🔐 Acesso restrito</p>

            <div className="space-y-4">
              <input 
                type="password" 
                id="senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Digite a senha"
                className="w-full p-4 text-center text-xl text-[#001858] bg-white rounded-2xl border-none outline-none focus:ring-4 focus:ring-[#ffcc00] placeholder:text-gray-400 font-sans shadow-inner"
              />

              <button 
                onClick={handleLogin}
                className="w-full py-4 text-xl font-bold rounded-2xl bg-[#ffcc00] text-[#001858] hover:bg-[#ffe066] hover:scale-102 active:scale-98 transition shadow-[0_5px_0_#b38f00] cursor-pointer"
              >
                Entrar 🎨
              </button>

              {loginError && (
                <p id="erro" className="text-[#ffdddd] font-semibold text-sm animate-bounce">
                  {loginError}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========== TELA DE ABERTURA / SPLASH ========== */}
      {isAuthorized && activeScreen === "splash" && (
        <div 
          id="splash" 
          className="fixed inset-0 bg-gradient-to-br from-[#00ca85] to-[#0099cc] flex flex-col justify-center items-center z-[9999] overflow-hidden"
        >
          {/* Vídeo com preload="none" para carregar somente em demanda pelo clique, dando performance de entrada imediata! */}
          <video 
            ref={videoRef}
            id="splash-video" 
            playsInline 
            preload="none"
            className={`absolute inset-0 w-full h-full object-contain bg-[#001858] transition-opacity duration-500 z-0 ${
              isPlayingVideo ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <source src="abertura.mp4" type="video/mp4" />
            <source src="https://raw.githubusercontent.com/lenilsonxavier-dev/arteeducar/main/abertura.mp4" type="video/mp4" />
          </video>

          {/* Fallback de Carregamento e Botão de Entrada */}
          {!isPlayingVideo ? (
            <div id="splash-fallback" className="flex flex-col items-center gap-6 z-10 p-4">
              <div className="text-7xl animate-bounce">🎨</div>
              <div id="status-carregamento" className="text-2xl font-bold text-white tracking-wide">
                Preparando as tintas...
              </div>
              <button 
                id="start-btn" 
                onClick={handleStartApp}
                className="px-10 py-5 text-2xl bg-[#ffcc00] hover:bg-[#ffe066] text-[#001858] hover:scale-105 active:scale-95 transition-all rounded-full cursor-pointer font-bold shadow-[0_6px_0_#b38f00]"
              >
                Entrar no Ateliê! 🖌️
              </button>
            </div>
          ) : (
            /* Botão para pular o vídeo - Resolução da maior reclamação do usuário */
            <button 
              onClick={abrirAppDireto}
              className="absolute top-6 right-6 z-20 px-6 py-3 bg-white/20 hover:bg-white/40 border border-white/30 backdrop-blur-md text-white text-lg font-bold rounded-full transition cursor-pointer flex items-center gap-2"
            >
              Pular Abertura <ArrowLeft className="rotate-180" size={18} />
            </button>
          )}

          {/* Permitir que tocar na tela em qualquer ponto do vídeo pule e entre no app */}
          {isPlayingVideo && (
            <div 
              onClick={abrirAppDireto}
              className="absolute inset-0 z-10 cursor-pointer"
              title="Toque para pular o vídeo de abertura"
            />
          )}
        </div>
      )}

      {/* ========== MENU PRINCIPAL ========== */}
      {isAuthorized && activeScreen === "home" && (
        <div id="home" className="container mx-auto max-w-md px-6 py-12 flex flex-col items-center min-h-screen justify-center space-y-6">
          <h1 className="text-3xl font-extrabold text-[#001858] drop-shadow-sm mb-4">
            🎨 Pequenos Artistas do Quirino
          </h1>
          
          <div className="w-full space-y-4 flex flex-col items-center">
            <button 
              className="w-full max-w-sm py-4 text-xl font-bold rounded-2xl bg-[#ffde59] border-2 border-white text-[#001858] shadow-md hover:brightness-95 active:translate-y-1 transition-all cursor-pointer" 
              onClick={() => abrirWebView("candinhoportinari")}
            >
              🎨 Candinhoportinari
            </button>
            
            <button 
              className="w-full max-w-sm py-4 text-xl font-bold rounded-2xl bg-[#72ddf7] border-2 border-white text-[#001858] shadow-md hover:brightness-95 active:translate-y-1 transition-all cursor-pointer" 
              onClick={() => setActiveScreen("museu")}
            >
              🏛 Museu Virtual
            </button>
            
            <button 
              className="w-full max-w-sm py-4 text-xl font-bold rounded-2xl bg-[#ffb347] border-2 border-white text-[#001858] shadow-md hover:brightness-95 active:translate-y-1 transition-all cursor-pointer" 
              onClick={() => setActiveScreen("mural")}
            >
              🖼️ Mural Virtual
            </button>
            
            <button 
              className="w-full max-w-sm py-4 text-xl font-bold rounded-2xl bg-[#7ee081] border-2 border-white text-[#001858] shadow-md hover:brightness-95 active:translate-y-1 transition-all cursor-pointer" 
              onClick={() => setActiveScreen("desafiosArte")}
            >
              🎲 Desafios de Arte
            </button>
            
            <button 
              className="w-full max-w-sm py-4 text-xl font-bold rounded-2xl bg-[#0b3d91] border-2 border-white text-white shadow-md hover:brightness-95 active:translate-y-1 transition-all cursor-pointer" 
              onClick={abrirCentralJogos}
            >
              🎮 Central de Jogos
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <button 
              type="button"
              className="px-5 py-2.5 rounded-2xl bg-white/90 border-2 border-white text-[#001858] font-bold text-sm shadow-md hover:bg-white active:scale-98 transition flex items-center gap-2 cursor-pointer"
              onClick={() => setIsFaqOpen(true)}
            >
              <HelpCircle size={18} className="text-[#001858]" /> Sobre & FAQ
            </button>
            <button 
              className="btn-sair hover:brightness-95 hover:scale-102 flex items-center justify-center gap-2" 
              onClick={handleLogoutFull}
            >
              <LogOut size={20} /> Sair do Ateliê
            </button>
          </div>
        </div>
      )}

      {/* ========== MUSEU VIRTUAL (LAZY LOAD PARA EVITAR LENTIDÃO NA REDE) ========== */}
      {isAuthorized && activeScreen === "museu" && (
        <div id="museu" className="px-4 py-8 md:px-8 max-w-6xl mx-auto">
          <div className="bg-white/90 backdrop-blur border-4 border-white rounded-[40px] md:rounded-[60px] p-6 shadow-xl space-y-6">
            
            <div className="bg-[#7fc9ff] border-3 border-white p-5 rounded-[40px] flex flex-wrap items-center justify-between gap-4">
              <button 
                className="btn-voltar-menu btn-voltar-azul hover:scale-102 active:scale-98 transition flex items-center gap-2 font-bold px-5 py-2.5 rounded-full text-white bg-[#3c8fe9] shadow-[0_5px_0_#2a63a4] border border-[#b8dcff] cursor-pointer"
                onClick={() => {
                  pararSomMuseu();
                  setActiveScreen("home");
                }}
              >
                <ArrowLeft size={18} /> Voltar
              </button>
              
              <div className="text-center flex-grow md:text-right pr-2">
                <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  🏛️ Museu Virtual: <span className="bg-[#ffdd77] text-[#2b5f8a] border-2 border-white px-3 py-0.5 rounded-full inline-block mt-1 md:mt-0 font-bold">{abaMuseu === "emaze" ? "Cândido Portinari" : "Futuro Ancestral"}</span>
                </h2>
              </div>
            </div>

            {/* SELETOR DE EXPOSIÇÃO (ABAS) */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  pararSomMuseu();
                  setAbaMuseu("emaze");
                }}
                className={`px-5 py-3 rounded-2xl border-2 border-white font-extrabold text-sm md:text-base transition cursor-pointer flex items-center gap-2 shadow-md ${
                  abaMuseu === "emaze"
                    ? "bg-[#ffde59] text-[#001858] scale-102 shadow-amber-500/30"
                    : "bg-[#001858]/10 hover:bg-[#001858]/20 text-[#001858]"
                }`}
              >
                🎨 As Infâncias de Cândido Portinari
              </button>

              <button
                onClick={() => {
                  pararSomMuseu();
                  setAbaMuseu("arts");
                }}
                className={`px-5 py-3 rounded-2xl border-2 border-white font-extrabold text-sm md:text-base transition cursor-pointer flex items-center gap-2 shadow-md ${
                  abaMuseu === "arts"
                    ? "bg-[#ffde59] text-[#001858] scale-102 shadow-amber-500/30"
                    : "bg-[#001858]/10 hover:bg-[#001858]/20 text-[#001858]"
                }`}
              >
                🌿 Futuro Ancestral (Histórias da Floresta)
              </button>
            </div>

            <div className="bg-[#2b6c9e] border-4 md:border-5 border-white p-4 rounded-[40px] shadow-inner">
              {abaMuseu === "emaze" ? (
                <>
                  {/* BARRA DE ÁUDIO EXCLUSIVA: PORTINARI */}
                  <div className="mb-3 bg-[#133c5e] border-2 border-white/20 p-3 rounded-[24px] flex flex-wrap items-center justify-between gap-3 text-white shadow-md">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎨</span>
                      <span className="font-extrabold text-sm md:text-base">
                        Exposição Cândido Portinari
                      </span>
                    </div>

                    <button
                      onClick={alternarSomPortinari}
                      className={`px-4 py-2.5 rounded-xl border-2 border-white font-extrabold text-sm flex items-center gap-2 shadow-md transition cursor-pointer ${
                        somExposicaoAtivo === "emaze"
                          ? "bg-[#ffde59] text-[#001858] animate-pulse"
                          : "bg-[#72ddf7] hover:bg-[#55cde9] text-[#001858]"
                      }`}
                    >
                      {somExposicaoAtivo === "emaze" ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      {somExposicaoAtivo === "emaze" ? "🔇 Pausar Trilha (Infância & Brincadeiras)" : "🔊 Tocar Trilha (Infância & Brincadeiras)"}
                    </button>
                  </div>

                  <div className="relative w-full h-[55vh] md:h-[70vh] rounded-[30px] overflow-hidden bg-[#0a1f3b] flex items-center justify-center border-2 border-white/15">
                    <iframe 
                      src="https://app.emaze.com/@ALFTCCRLT/esta-obra-de-cndido-portinari-chama-se-menino-com" 
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-none"
                    />
                  </div>

                  <div className="mt-5 bg-[#fee5b1] border-2 border-white p-4 rounded-[30px] flex items-center justify-center gap-4 text-[#154256] font-bold text-lg md:text-xl shadow-md">
                    <span className="text-3xl">🎨</span>
                    <p className="italic text-center">
                      “Na minha infância, os meninos brincavam de pião, de bola, de roda. Eu pintei isso tudo.” — Portinari
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-full h-[55vh] md:h-[70vh] rounded-[30px] overflow-hidden bg-[#0a1f3b] flex items-center justify-center border-2 border-white/15">
                    <iframe 
                      src="https://app.emaze.com/@ALCRTOFLO/histrias-da-floresta" 
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-none"
                    />
                  </div>

                  <div className="mt-3 flex justify-end px-2">
                    <a href="https://www.emaze.com" target="_blank" rel="noopener noreferrer" className="inline-block opacity-80 hover:opacity-100 transition">
                      <img src="https://resources.emaze.com/mypres/css/images/embed.png" alt="Powered by emaze" className="h-4 border-none" />
                    </a>
                  </div>

                  <div className="mt-3 bg-[#fee5b1] border-2 border-white p-4 rounded-[30px] flex items-center justify-center gap-4 text-[#154256] font-bold text-base md:text-lg shadow-md">
                    <span className="text-3xl">🌿</span>
                    <p className="text-center font-semibold italic">
                      “Histórias da Floresta & Futuro Ancestral — Arte, natureza e ancestralidade em harmonia.”
                    </p>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========== MURAL VIRTUAL (LAZY LOAD DO PADLET) ========== */}
      {isAuthorized && activeScreen === "mural" && (
        <div id="mural" className="fixed inset-0 flex flex-col bg-[#001858]">
          <div className="h-16 bg-[#001858] flex justify-between items-center px-6 border-b-2 border-[#ffcc00] shadow-md z-10">
            <h2 className="text-white font-bold text-lg">🖼️ Mural Virtual: Artistas do Quirino</h2>
            <button 
              className="btn-voltar-menu btn-voltar-laranja hover:scale-102 active:scale-98 transition flex items-center gap-2 px-5 py-2 rounded-full text-white bg-[#ff9e48] shadow-[0_5px_0_#bf6d26] border border-[#ffdfb8] opacity-100 font-bold cursor-pointer"
              onClick={() => setActiveScreen("home")}
            >
              <ArrowLeft size={16} /> Voltar
            </button>
          </div>
          
          <div className="flex-grow w-full h-full overflow-hidden bg-white">
            {/* O Padlet só é renderizado quando ativado. Libera memória de guias anteriores do celular! */}
            <iframe 
              src="https://padlet.com/embed/lvlhw1rjc22sd338" 
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="camera; microphone; geolocation; clipboard-write; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* ========== DESAFIOS DE ARTE ========== */}
      {isAuthorized && activeScreen === "desafiosArte" && (
        <div id="desafiosArte" className="px-4 py-8 max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button 
              className="btn-voltar-menu btn-voltar-verde hover:scale-102 active:scale-98 transition flex items-center gap-2 px-5 py-2.5 rounded-full text-white bg-[#56b870] shadow-[0_5px_0_#3e8652] border border-[#bcebd0] font-bold cursor-pointer"
              onClick={() => setActiveScreen("home")}
            >
              <ArrowLeft size={18} /> Voltar
            </button>
            <h2 className="text-3xl font-extrabold text-[#001858]">🎲 Desafios de Arte</h2>
            <div className="w-10 h-10" /> {/* Espaçador */}
          </div>

          <button 
            onClick={desafioAleatorio} 
            className="w-full py-4 bg-[#ffcc00] hover:bg-[#ffe066] active:scale-99 border-none rounded-2xl font-bold text-[#001858] text-lg shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Shuffle size={20} /> Sorteie um Desafio Aleatório
          </button>

          {/* Busca por desafios */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="🔍 Procure um desafio..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3.5 pl-12 pr-6 bg-white border-2 border-[#8bd3dd] rounded-full text-base font-sans outline-none focus:ring-2 focus:ring-[#f582ae] shadow-inner"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Grid de Desafios */}
          <div id="desafiosGrid" className="desafios-grid grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2 pb-6">
            {renderDesafiosFiltrados().length > 0 ? (
              renderDesafiosFiltrados().map((d) => (
                <div 
                  key={d.numero} 
                  className="bg-white rounded-3xl p-6 text-left shadow-lg border-l-8 border-[#f582ae] hover:shadow-xl transition-shadow relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <button 
                      onClick={() => tocarAudio(`desafio-${d.numero}`)}
                      className="bg-[#8bd3dd] hover:bg-[#6ec2cf] active:scale-90 text-[#001858] rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition"
                      title="Ouvir desafio"
                    >
                      <Volume2 size={18} />
                    </button>
                    <span className="text-sm font-bold bg-[#fef6e4] text-[#001858] px-3 py-1 rounded-full border border-gray-100">
                      #{d.numero}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-[#001858]">{d.titulo}</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">{d.descricao}</p>
                  
                  <div className="bg-[#fef6e4]/50 p-3 rounded-xl border border-[#fee5b1] mb-5">
                    <small className="text-xs text-gray-800 leading-normal block">
                      <strong>Objetivo:</strong> {d.objetivo}
                    </small>
                  </div>

                  <button 
                    onClick={() => aceitarDesafio(d.titulo)}
                    className="w-full py-2.5 bg-[#00ca85] text-white hover:bg-[#00b375] font-bold rounded-xl transition cursor-pointer text-sm shadow-[0_3px_0_#009c66]"
                  >
                    Fazer este!
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-12 md:col-span-2 bg-white/60 rounded-3xl border border-dashed border-gray-300">
                Nenhum desafio encontrado. 🔍
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========== CENTRAL DE JOGOS ========== */}
      {isAuthorized && activeScreen === "jogosOnline" && (
        <div id="jogosOnline" className="container mx-auto max-w-md px-6 py-12 flex flex-col items-center min-h-screen justify-center space-y-6">
          <h2 className="text-3xl font-extrabold text-[#001858] drop-shadow-sm mb-4">
            🎮 Central de Jogos
          </h2>

          <div id="listaJogosOnline" className="w-full space-y-4">
            {jogosOnlineLista.map((jogo) => (
              <button 
                key={jogo.nome}
                className="botao-app hover:brightness-95 hover:scale-101 flex items-center justify-center gap-2"
                onClick={() => abrirJogo(jogo)}
              >
                <Gamepad2 size={20} /> 🎮 {jogo.nome}
              </button>
            ))}
          </div>

          <button 
            className="botao-app botao-jogos hover:brightness-95 flex items-center justify-center gap-2 max-w-sm mt-6" 
            onClick={() => setActiveScreen("home")}
          >
            <ArrowLeft size={18} /> Voltar ao Menu
          </button>
        </div>
      )}

      {/* ========== TELA JOGO DA FORCA NATIVO ========== */}
      {isAuthorized && activeScreen === "jogoForca" && (
        <JogoForca onVoltar={() => setActiveScreen("jogosOnline")} />
      )}

      {/* ========== TELA JOGO (LAZY LOAD IFRAME DETALHADO E FULLSCREEN PARA CELULAR) ========== */}
      {isAuthorized && activeScreen === "telaJogo" && (
        <div id="telaJogo" className="fixed inset-0 bg-black z-[9999]">
          {/* Botão flutuante redondo para voltar super otimizado para celulares */}
          <button 
            className="absolute top-4 left-4 z-50 bg-[#ffde59] hover:bg-[#ffe066] active:scale-95 text-[#001858] p-3 rounded-full font-bold shadow-lg transition flex items-center justify-center cursor-pointer border-2 border-white"
            onClick={fecharJogo}
            title="Voltar aos Jogos"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="absolute inset-0 w-full h-full bg-black">
            {activeJogoUrl && (
              <iframe 
                id="frameJogo" 
                src={activeJogoUrl}
                className="w-full h-full border-none"
                allow="autoplay; fullscreen; clipboard-write"
              />
            )}
          </div>
        </div>
      )}

      {/* ========== TELA WEBVIEW PORTINARI (LAZY LOAD IFRAME) ========== */}
      {isAuthorized && activeScreen === "webviewScreen" && (
        <div id="webviewScreen" className="fixed inset-0 bg-white z-[9990]">
          {/* Botão flutuante redondo para voltar, sem ocupar espaço de barra */}
          <button 
            className="absolute top-4 left-4 z-50 bg-[#ffde59] hover:bg-[#ffe066] active:scale-95 text-[#001858] p-3 rounded-full font-bold shadow-lg transition flex items-center justify-center cursor-pointer border-2 border-white"
            onClick={fecharWebView}
            title="Voltar ao Menu"
          >
            <ArrowLeft size={22} />
          </button>

          <div className="absolute inset-0 w-full h-full bg-white">
            {activeScreen === "webviewScreen" && activeWebViewType === "candinhoportinari" && (
              <iframe 
                id="webviewFrame" 
                src="https://candinho-20.vercel.app/" 
                className="w-full h-full border-none"
              />
            )}
          </div>
        </div>
      )}

      {/* Modal FAQ & Sobre o Projeto */}
      <FaqModal isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />

    </div>
  );
}
