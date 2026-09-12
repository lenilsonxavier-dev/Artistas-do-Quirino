export interface FaqItem {
  id: number;
  pergunta: string;
  resposta: string;
  categoria?: string;
}

export const faqData: FaqItem[] = [
  {
    id: 1,
    pergunta: "1. O que é o Pequenos Artistas do Quirino?",
    resposta: "O Pequenos Artistas do Quirino é um ambiente digital de aprendizagem voltado aos Anos Iniciais do Ensino Fundamental. O projeto integra Arte, cultura digital, metodologias ativas, patrimônio artístico e Inteligência Artificial, reunindo módulos interativos como o assistente Candinho, o Museu Virtual, a Central de Jogos, o Mural Virtual e os Desafios de Arte. Seu objetivo é tornar o ensino de Arte mais investigativo, criativo, significativo e colaborativo."
  },
  {
    id: 2,
    pergunta: "2. O que é o Candinho?",
    resposta: "O Candinho é uma IA educacional conversacional híbrida, especializada em Arte, criada para atuar como assistente de aprendizagem das crianças e apoio pedagógico ao professor. Ele dialoga, responde a dúvidas, propõe investigações e estimula a ampliação do repertório artístico e cultural dos estudantes. Sua arquitetura combina processamento de linguagem natural, curadoria pedagógica e uma base de dados estruturada a partir da pesquisa do professor."
  },
  {
    id: 3,
    pergunta: "3. O Candinho substitui o professor ou funciona sozinho?",
    resposta: "Não. O professor é o mediador essencial de todo o processo. Ele define a intencionalidade pedagógica, os objetivos de aprendizagem, a seleção das obras, a avaliação e a contextualização de cada atividade. A tecnologia atua como amplificadora do diálogo e da investigação: o professor orienta e valida o universo conceitual, e a IA oferece uma interface interativa e acessível para o estudante explorar esse conhecimento."
  },
  {
    id: 4,
    pergunta: "4. De onde vêm as informações e conhecimentos do Candinho?",
    resposta: "A base de conhecimentos é orientada pelo currículo e pelos livros didáticos de Arte adotados pela Rede Municipal de Ensino de Osasco, integrados à pesquisa do professor e a fontes de acervos culturais e institucionais. O conteúdo abrange artistas, movimentos, técnicas, história da arte, cultura popular brasileira, patrimônio e cidadania digital, assegurando que as respostas estejam sempre alinhadas à prática pedagógica da sala de aula."
  },
  {
    id: 5,
    pergunta: "5. O projeto é gratuito? Quanto custou para ser desenvolvido?",
    resposta: "O acesso é totalmente gratuito para estudantes, professores e famílias. O projeto foi desenvolvido de forma autoral pelo próprio docente, sem contratação de empresas externas nem repasse de verbas privadas. Os custos materiais resumem-se aos recursos regulares de conectividade e eletricidade, somados às horas de pesquisa, curadoria, programação e testes pedagógicos. O investimento financeiro direto foi nulo, viabilizado pelo trabalho autoral docente."
  },
  {
    id: 6,
    pergunta: "6. O projeto pode ser considerado ecológico?",
    resposta: "O projeto adota práticas de sustentabilidade digital. Ao priorizar experiências interativas, telas compartilhadas e acervos virtuais, reduz-se substancialmente a necessidade de impressões em papel e materiais descartáveis. Contudo, não se afirma impacto ambiental nulo, pois servidores, conexões de internet e dispositivos eletrônicos demandam consumo de energia. O compromisso do projeto é com a redução responsável de resíduos físicos e a conscientização sobre o uso consciente das tecnologias digitais."
  },
  {
    id: 7,
    pergunta: "7. Como o projeto lida com direitos autorais e imagens das obras de arte?",
    resposta: "O projeto segue o princípio de que disponibilidade na internet não equivale a livre uso. A seleção de imagens prioriza: 1) Domínio público e programas Open Access de acervos institucionais (como o Art Institute of Chicago e o The Met); 2) Repositórios educativos com verificação de licença (como o Wikimedia Commons, com checagem individual); e 3) Pesquisa institucional e acervos de referência (como o Projeto Portinari e a WikiArt), com verificação de direitos caso a caso antes de qualquer incorporação ao aplicativo."
  },
  {
    id: 8,
    pergunta: "8. O projeto ensina apenas Arte?",
    resposta: "Não. A Arte é o eixo articulador, mas a proposta é essencialmente interdisciplinar. A investigação de uma única obra pode articular conteúdos de História, Geografia, Ciências, Língua Portuguesa e Matemática. Além dos conteúdos curriculares, a experiência fomenta competências socioemocionais e contemporâneas: pensamento crítico, raciocínio investigativo, colaboração, autoria e letramento digital ético."
  },
  {
    id: 9,
    pergunta: "9. Qual é o principal diferencial do Pequenos Artistas do Quirino e do Candinho?",
    resposta: "O diferencial não é simplesmente levar tecnologia ou IA para a sala de aula, mas subordiná-las à intencionalidade pedagógica. A tecnologia não é adotada como fim, mas como meio: o Candinho não foi criado para entregar respostas prontas ou pensar pela criança, mas para provocá-la a observar, perguntar, formular hipóteses e criar sua própria produção artística com protagonismo e autonomia."
  },
  {
    id: 10,
    pergunta: "10. Como o Google AI Studio ajuda a manter o projeto e qual a contribuição da conta de desenvolvedor?",
    resposta: "O Google AI Studio atua como a espinha dorsal tecnológica do projeto. Proporciona: 1) Hospedagem em nuvem de alta disponibilidade (Cloud Run), garantindo que o app esteja sempre online para qualquer navegador; 2) Inteligência contextual com modelos Gemini, permitindo que o Candinho compreenda a linguagem infantil e responda com clareza didática; 3) A conta de desenvolvedor viabilizou autonomia autoral ao professor para criar, testar e publicar sem custos de terceirização, usufruindo de infraestrutura de ponta e mantendo a gratuidade total para a escola pública."
  }
];
