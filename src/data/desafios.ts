export interface Desafio {
  numero: number;
  titulo: string;
  descricao: string;
  objetivo: string;
}

export const desafios: Desafio[] = [
  { numero: 1, titulo: "Desenho às Cegas", descricao: "Fechem os olhos e tentem desenhar um objeto simples (copo, casa, flor). Depois comparem os resultados com quem fez o desafio com você.", objetivo: "Estimular criatividade e percepção sem pressão estética." },
  { numero: 2, titulo: "Cores Musicais", descricao: "Ouça músicas diferentes (alegre, triste, calma, agitada). Desenhe e pinte o que sentir em cada música.", objetivo: "Expressar emoções através das cores." },
  { numero: 3, titulo: "Retrato Maluco", descricao: "Em dupla: observe as características da pessoa e desenhe de forma divertida ou fantástica. No final, comparem os desenhos.", objetivo: "Desenvolver observação e humor." },
  { numero: 4, titulo: "Escultura com Material Reciclado", descricao: "Use papéis, garrafas, caixas ou sucata. Crie esculturas criativas em 20 minutos.", objetivo: "Estimular consciência ambiental e criatividade tridimensional." },
  { numero: 5, titulo: "Pintura com Objetos Inusitados", descricao: "Em vez de pincéis, use cotonetes, esponjas, folhas ou até tampas de garrafa. Crie uma pintura colaborativa com outras pessoas.", objetivo: "Explorar texturas e técnicas alternativas." },
  { numero: 6, titulo: "Desenho de Memória", descricao: "Olhe rapidamente uma imagem (um objeto, quadro famoso ou cena simples) por 15 segundos. Depois desenhe o que lembrar", objetivo: "Exercitar memória visual e atenção." },
  { numero: 7, titulo: "Arte com dobraduras", descricao: "Faça uma dobradura simples (avião, barco, chapéu) e depois personalize com desenho ou pintura.", objetivo: "Estimular coordenação motora e personalização criativa." },
  { numero: 8, titulo: "Linha contínua", descricao: "Desenhe sem levantar o lápis do papel, criando a imagem com uma única linha.", objetivo: "Estimular fluidez e desapego ao perfeito." },
  { numero: 9, titulo: "Pintura com as mãos", descricao: "Em vez de pincéis, use apenas as mãos e dedos para criar uma obra.", objetivo: "Explorar sensações táteis e liberdade criativa." },
  { numero: 10, titulo: "Escultura humana", descricao: "Posicione-se como uma escultura viva para que alguém observe e desenhe a cena.", objetivo: "Unir teatro e artes visuais, estimulando observação." },
  { numero: 11, titulo: "Jogo das emoções em cores", descricao: "Pense em uma emoção (alegria, tristeza, raiva, calma) e a represente apenas com cores e formas abstratas.", objetivo: "Trabalhar expressão emocional e subjetiva." },
  { numero: 12, titulo: "Teatro da natureza", descricao: "Montar pequenas encenações usando elementos naturais (galhos, folhas)", objetivo: "Integrar teatro e natureza na criação artística." },
  { numero: 13, titulo: "Personagem de fantasia", descricao: "Invente um personagem fantástico, desenhe, dê nome e poderes.", objetivo: "Estimular criatividade e design de personagens." },
  { numero: 14, titulo: "Retrato estilo cartum", descricao: "Desenhe uma pessoa como se ela fosse personagem de desenho animado.", objetivo: "Estimular humor, caricatura e simplificação artística." },
  { numero: 15, titulo: "Arte com recortes geométricos", descricao: "Monte uma obra apenas com triângulos, quadrados e círculos coloridos.", objetivo: "Estimular composição visual e criatividade com limitações." },
  { numero: 16, titulo: "Teatro ilustrado", descricao: "Em grupo de amigos ou amigas, uns inventam uma cena teatral e outros ilustram a cena em cartazes.", objetivo: "Integrar artes visuais e teatro." },
  { numero: 17, titulo: "Escultura de papel amassado", descricao: "Amasse uma folha de papel e transforme o formato em uma mini-escultura (animal, objeto ou rosto).", objetivo: "Estimular improviso e olhar criativo sobre formas simples." },
  { numero: 18, titulo: "Cartão criativo", descricao: "Faça um cartão artístico, com uma mensagem para dar a alguém especial.", objetivo: "Incentivar expressão afetiva através da arte." },
  { numero: 19, titulo: "Máscara da personalidade", descricao: "Crie uma máscara de papel ou papelão que represente como você se vê.", objetivo: "Autoconhecimento, criatividade e expressão simbólica." },
  { numero: 20, titulo: "Arte com pontilhismo", descricao: "Crie uma imagem apenas com pontos coloridos,use lápis de cor ou canetinha.", objetivo: "Explorar paciência, técnica e cor." },
  { numero: 21, titulo: "Pintura de emojis", descricao: "Escolha um emoji e recrie em versão artística, com tinta, lápis ou colagem.", objetivo: "Aproximar a arte do universo digital." },
  { numero: 22, titulo: "Mapa da imaginação", descricao: "Desenhe um mapa inventado: uma cidade mágica, uma ilha fantástica, um reino flutuante e seus personagens que os habitam.", objetivo: "Desenvolver narrativa visual e imaginação espacial." },
  { numero: 23, titulo: "Cenas com objetos aleatórios", descricao: "Você é um ator, uma atriz! Escolha um objeto e faça uma cena sobre tristeza, alegria, amor, ou saudade.", objetivo: "Unir artes visuais e teatro, estimulando narrativa criativa." },
  { numero: 24, titulo: "História em 3 cenas", descricao: "Crie uma pequena sequência de 3 quadros que contem uma história curta!.", objetivo: "Desenvolver síntese narrativa e criatividade." },
  { numero: 25, titulo: "Arte com música ao vivo", descricao: "Enquanto uma música toca, desenhe ou pinte sem parar, deixando o ritmo guiar a obra.", objetivo: "Conectar ritmo musical e expressão artística." },
  { numero: 26, titulo: "Ritmo das cores", descricao: "Dance rápido com a cor vermelha. Pule com o amarelo. Rede com o verde. Dance lento com o azul. Faça cartões com as cores e sorteie seu ritmo!.", objetivo: "Associar cores a movimentos e emoções." },
  { numero: 27, titulo: "Dança do objeto invisível", descricao: "Dance imaginando que segura um objeto que o seu companheiro vai inventar: uma caixa pesada, um balão, uma pena, imaginem o que quiser leve e pesado!.", objetivo: "Estimular imaginação e expressão corporal." },
  { numero: 28, titulo: "Movimento que cresce", descricao: "Comece a dançar mexendo um dedo, agora a mão, depois o braço e por último o corpo todo.", objetivo: "Explorar consciência corporal e expansão de movimento." },
  { numero: 29, titulo: "Pintar o ar", descricao: "Dançando desenhe um círculo grande com o corpo, depois uma linha reta, por último uma estrela.", objetivo: "Conectar movimento e formas geométricas." },
  { numero: 30, titulo: "Missão de dança", descricao: "Missão 1, sobreviva na selva dançando. Missão 2: fuja do vulcão. Missão 3: explore o espaço sideral.", objetivo: "Estimular criatividade narrativa através da dança." }
];
