export interface Jogo {
  id?: string;
  nome: string;
  link: string;
  isNative?: boolean;
}

export const jogosOnlineLista: Jogo[] = [
  { id: "forca", nome: "✏️ Jogo da Forca da Arte", link: "#forca", isNative: true },
  { nome: "🐦 Corvos", link: "https://arteeducar.vercel.app/jogos/corvos" },
  { nome: "🌌 Noite Estrelada", link: "https://arteeducar.vercel.app/jogos/noite-estrelada" },
  { nome: "🎨 Dalí", link: "https://arteeducar.vercel.app/jogos/dali" },
  { nome: "🧒 Candinho", link: "https://candinhojogo.vercel.app/" }
];
