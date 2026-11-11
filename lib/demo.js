import { usuarioTem } from "./ingredientes";

/**
 * Receitas de exemplo para o MODO DEMONSTRAÇÃO (sem chave de API).
 * Quantidades em `qtd` são para `porcoesBase` e são escaladas para as porções pedidas.
 * Macros são por porção.
 */
const RECEITAS_DEMO = [
  {
    nome: "Omelete de espinafre e queijo",
    termoBuscaImagem: "spinach omelette",
    descricao: "Omelete macia e rica em proteína, pronta em minutos para qualquer refeição.",
    tempoMinutos: 12,
    dificuldade: "Fácil",
    porcoesBase: 1,
    objetivos: ["hipertrofia", "equilibrio"],
    tags: ["vegetariano", "sem-gluten"],
    macros: { calorias: 320, proteina: 24, carboidratos: 4, gordura: 23 },
    ingredientes: [
      { nome: "ovos", qtd: 3, unidade: "unidades" },
      { nome: "espinafre", qtd: 1, unidade: "xícara" },
      { nome: "queijo muçarela", qtd: 30, unidade: "g" },
      { nome: "cebola", qtd: 0.25, unidade: "unidade" },
      { nome: "sal", quantidade: "a gosto" },
      { nome: "azeite", qtd: 1, unidade: "colher (chá)" },
    ],
    passos: [
      "Bata os ovos com uma pitada de sal até ficarem homogêneos.",
      "Refogue a cebola picada no azeite por 2 minutos e junte o espinafre até murchar.",
      "Despeje os ovos na frigideira em fogo baixo e espalhe bem.",
      "Quando as bordas firmarem, adicione o queijo, dobre ao meio e sirva.",
    ],
    dica: "Tampe a frigideira nos últimos minutos para o queijo derreter sem queimar a omelete.",
  },
  {
    nome: "Frango grelhado com arroz e brócolis",
    termoBuscaImagem: "grilled chicken rice broccoli",
    descricao: "O clássico prato de quem treina: proteína magra, carboidrato e vegetal.",
    tempoMinutos: 30,
    dificuldade: "Fácil",
    porcoesBase: 2,
    objetivos: ["hipertrofia", "equilibrio"],
    tags: ["sem-lactose", "sem-gluten"],
    macros: { calorias: 520, proteina: 45, carboidratos: 55, gordura: 11 },
    ingredientes: [
      { nome: "peito de frango", qtd: 300, unidade: "g" },
      { nome: "arroz", qtd: 1, unidade: "xícara" },
      { nome: "brócolis", qtd: 1, unidade: "maço pequeno" },
      { nome: "alho", qtd: 2, unidade: "dentes" },
      { nome: "limão", qtd: 1, unidade: "unidade" },
      { nome: "sal", quantidade: "a gosto" },
      { nome: "azeite", qtd: 1, unidade: "colher (sopa)" },
    ],
    passos: [
      "Tempere o frango com alho amassado, suco de limão e sal; deixe descansar 10 minutos.",
      "Cozinhe o arroz com o dobro de água e uma pitada de sal.",
      "Grelhe o frango em frigideira quente com azeite, 5 a 6 minutos de cada lado.",
      "Cozinhe o brócolis no vapor por 4 minutos, até ficar verde vivo.",
      "Fatie o frango e monte o prato com arroz e brócolis.",
    ],
    dica: "Bata o frango com um martelo de carne para deixar a espessura uniforme e ele não ressecar.",
  },
  {
    nome: "Salada morna de grão-de-bico",
    termoBuscaImagem: "chickpea salad",
    descricao: "Leve, cheia de fibras e saciedade, perfeita para o almoço.",
    tempoMinutos: 15,
    dificuldade: "Fácil",
    porcoesBase: 2,
    objetivos: ["emagrecimento", "equilibrio"],
    tags: ["vegetariano", "sem-lactose", "sem-gluten"],
    macros: { calorias: 340, proteina: 14, carboidratos: 42, gordura: 12 },
    ingredientes: [
      { nome: "grão-de-bico cozido", qtd: 2, unidade: "xícaras" },
      { nome: "tomate", qtd: 2, unidade: "unidades" },
      { nome: "cebola roxa", qtd: 0.5, unidade: "unidade" },
      { nome: "pepino", qtd: 1, unidade: "unidade" },
      { nome: "salsinha", qtd: 2, unidade: "colheres (sopa)" },
      { nome: "limão", qtd: 1, unidade: "unidade" },
      { nome: "azeite", qtd: 1, unidade: "colher (sopa)" },
      { nome: "sal", quantidade: "a gosto" },
    ],
    passos: [
      "Aqueça o grão-de-bico em uma frigideira com metade do azeite por 3 minutos.",
      "Pique tomate, pepino e cebola em cubos pequenos.",
      "Misture tudo em uma tigela com salsinha, limão, o restante do azeite e sal.",
      "Sirva ainda morno.",
    ],
    dica: "Deixe a cebola de molho no limão por 5 minutos para suavizar o sabor.",
  },
  {
    nome: "Bowl de atum com batata-doce",
    termoBuscaImagem: "tuna bowl",
    descricao: "Bowl colorido com carboidrato de baixo índice glicêmico e proteína prática.",
    tempoMinutos: 25,
    dificuldade: "Fácil",
    porcoesBase: 2,
    objetivos: ["hipertrofia", "emagrecimento"],
    tags: ["sem-lactose", "sem-gluten"],
    macros: { calorias: 430, proteina: 32, carboidratos: 48, gordura: 11 },
    ingredientes: [
      { nome: "atum em lata", qtd: 2, unidade: "latas" },
      { nome: "batata-doce", qtd: 400, unidade: "g" },
      { nome: "cenoura", qtd: 1, unidade: "unidade" },
      { nome: "milho", qtd: 0.5, unidade: "xícara" },
      { nome: "folhas verdes", qtd: 2, unidade: "xícaras" },
      { nome: "azeite", qtd: 1, unidade: "colher (sopa)" },
      { nome: "sal", quantidade: "a gosto" },
    ],
    passos: [
      "Corte a batata-doce em cubos e cozinhe em água com sal por 12 minutos.",
      "Rale a cenoura e escorra o atum e o milho.",
      "Monte o bowl com folhas, batata-doce, cenoura, milho e atum.",
      "Finalize com azeite e uma pitada de sal.",
    ],
    dica: "Asse a batata-doce cozida por 5 minutos na airfryer para deixá-la crocante por fora.",
  },
  {
    nome: "Sopa de legumes com lentilha",
    termoBuscaImagem: "lentil soup",
    descricao: "Sopa nutritiva e reconfortante que rende bem e congela muito bem.",
    tempoMinutos: 35,
    dificuldade: "Fácil",
    porcoesBase: 4,
    objetivos: ["emagrecimento", "equilibrio"],
    tags: ["vegetariano", "sem-lactose", "sem-gluten"],
    macros: { calorias: 260, proteina: 14, carboidratos: 40, gordura: 5 },
    ingredientes: [
      { nome: "lentilha", qtd: 1, unidade: "xícara" },
      { nome: "cenoura", qtd: 2, unidade: "unidades" },
      { nome: "batata", qtd: 2, unidade: "unidades" },
      { nome: "cebola", qtd: 1, unidade: "unidade" },
      { nome: "alho", qtd: 2, unidade: "dentes" },
      { nome: "tomate", qtd: 1, unidade: "unidade" },
      { nome: "azeite", qtd: 1, unidade: "colher (sopa)" },
      { nome: "sal", quantidade: "a gosto" },
    ],
    passos: [
      "Refogue cebola e alho no azeite até dourar.",
      "Junte tomate, cenoura e batata em cubos e refogue por 3 minutos.",
      "Adicione a lentilha lavada e 1,5 litro de água.",
      "Cozinhe por 25 minutos em fogo médio, até a lentilha ficar macia. Acerte o sal.",
    ],
    dica: "Bata metade da sopa no liquidificador e volte à panela para deixá-la cremosa sem creme de leite.",
  },
  {
    nome: "Macarrão ao sugo com manjericão",
    termoBuscaImagem: "spaghetti tomato basil",
    descricao: "Molho de tomate fresco e caseiro, simples e cheio de sabor.",
    tempoMinutos: 20,
    dificuldade: "Fácil",
    porcoesBase: 2,
    objetivos: ["equilibrio"],
    tags: ["vegetariano", "sem-lactose"],
    macros: { calorias: 450, proteina: 14, carboidratos: 80, gordura: 9 },
    ingredientes: [
      { nome: "macarrão", qtd: 200, unidade: "g" },
      { nome: "tomate", qtd: 4, unidade: "unidades" },
      { nome: "alho", qtd: 2, unidade: "dentes" },
      { nome: "manjericão", qtd: 1, unidade: "punhado" },
      { nome: "azeite", qtd: 1, unidade: "colher (sopa)" },
      { nome: "sal", quantidade: "a gosto" },
    ],
    passos: [
      "Cozinhe o macarrão em água fervente com sal até ficar al dente.",
      "Doure o alho no azeite e junte os tomates picados.",
      "Cozinhe o molho por 10 minutos, amassando os tomates.",
      "Misture o macarrão ao molho e finalize com manjericão fresco.",
    ],
    dica: "Reserve meia xícara da água do cozimento e use para dar liga ao molho.",
  },
  {
    nome: "Tofu salteado com legumes",
    termoBuscaImagem: "tofu stir fry",
    descricao: "Salteado rápido no estilo oriental, colorido e rico em proteína vegetal.",
    tempoMinutos: 20,
    dificuldade: "Média",
    porcoesBase: 2,
    objetivos: ["hipertrofia", "emagrecimento", "equilibrio"],
    tags: ["vegetariano", "sem-lactose", "sem-gluten"],
    macros: { calorias: 310, proteina: 22, carboidratos: 18, gordura: 17 },
    ingredientes: [
      { nome: "tofu firme", qtd: 300, unidade: "g" },
      { nome: "brócolis", qtd: 1, unidade: "xícara" },
      { nome: "cenoura", qtd: 1, unidade: "unidade" },
      { nome: "pimentão", qtd: 1, unidade: "unidade" },
      { nome: "molho de soja sem glúten (tamari)", qtd: 2, unidade: "colheres (sopa)" },
      { nome: "alho", qtd: 2, unidade: "dentes" },
      { nome: "gengibre", qtd: 1, unidade: "colher (chá)" },
      { nome: "azeite", qtd: 1, unidade: "colher (sopa)" },
    ],
    passos: [
      "Seque o tofu com papel-toalha e corte em cubos.",
      "Doure o tofu no azeite em frigideira bem quente e reserve.",
      "Salteie alho, gengibre e os legumes cortados em tiras por 4 minutos.",
      "Volte o tofu à frigideira, adicione o tamari e misture por 1 minuto.",
    ],
    dica: "Pressione o tofu sob um peso por 15 minutos antes para ele ficar ainda mais crocante.",
  },
  {
    nome: "Panqueca de banana com aveia",
    termoBuscaImagem: "banana pancakes",
    descricao: "Panqueca sem açúcar e sem farinha branca, ótima para o café da manhã.",
    tempoMinutos: 10,
    dificuldade: "Fácil",
    porcoesBase: 1,
    objetivos: ["hipertrofia", "equilibrio"],
    tags: ["vegetariano", "sem-lactose"],
    macros: { calorias: 350, proteina: 16, carboidratos: 45, gordura: 11 },
    ingredientes: [
      { nome: "banana", qtd: 1, unidade: "unidade" },
      { nome: "ovos", qtd: 2, unidade: "unidades" },
      { nome: "aveia", qtd: 3, unidade: "colheres (sopa)" },
      { nome: "canela", quantidade: "a gosto" },
      { nome: "óleo de coco", qtd: 1, unidade: "colher (chá)" },
    ],
    passos: [
      "Amasse a banana com um garfo até virar um purê.",
      "Misture os ovos, a aveia e a canela.",
      "Unte uma frigideira antiaderente e despeje porções da massa.",
      "Doure por 2 minutos de cada lado e sirva com frutas.",
    ],
    dica: "Use aveia certificada sem glúten se precisar evitar glúten.",
  },
];

function formatarQtd(n) {
  const arred = Math.round(n * 4) / 4;
  const inteiro = Math.floor(arred);
  const frac = arred - inteiro;
  const fracTxt = { 0.25: "¼", 0.5: "½", 0.75: "¾" }[frac] ?? "";
  if (inteiro === 0) return fracTxt || "¼";
  return `${inteiro}${fracTxt ? " " + fracTxt : ""}`;
}

// Singular -> plural das unidades usadas nas receitas de exemplo.
const PLURAIS = {
  unidade: "unidades",
  dente: "dentes",
  lata: "latas",
  xícara: "xícaras",
  "colher (chá)": "colheres (chá)",
  "colher (sopa)": "colheres (sopa)",
  "maço pequeno": "maços pequenos",
  punhado: "punhados",
};
const SINGULARES = Object.fromEntries(Object.entries(PLURAIS).map(([s, p]) => [p, s]));

/** Quantidade escalada + unidade concordando em número ("1 dente", "1 ½ xícaras", "½ unidade"). */
function formatarQuantidade(qtd, unidade) {
  const arred = Math.round(qtd * 4) / 4 || 0.25;
  const singular = SINGULARES[unidade] ?? unidade;
  const plural = PLURAIS[singular] ?? unidade;
  return `${formatarQtd(qtd)} ${arred > 1 ? plural : singular}`;
}

/**
 * Escolhe 3 receitas de exemplo compatíveis com os filtros
 * e marca o que o usuário já tem em casa.
 */
export function gerarReceitasDemo({ ingredientes, objetivo, tempoMax, restricoes, porcoes }) {
  const compativeis = RECEITAS_DEMO.filter((r) => restricoes.every((res) => r.tags.includes(res)));
  const base = compativeis.length ? compativeis : RECEITAS_DEMO;

  const pontuadas = base.map((r) => {
    const encontrados = r.ingredientes.filter((i) => usuarioTem(i.nome, ingredientes)).length;
    let pontos = encontrados * 3;
    if (r.objetivos.includes(objetivo)) pontos += 4;
    if (tempoMax && r.tempoMinutos <= tempoMax) pontos += 5;
    return { r, pontos };
  });

  pontuadas.sort((a, b) => b.pontos - a.pontos);

  return pontuadas.slice(0, 3).map(({ r }) => {
    const fator = porcoes / r.porcoesBase;
    return {
      nome: r.nome,
      descricao: r.descricao,
      tempoMinutos: r.tempoMinutos,
      dificuldade: r.dificuldade,
      porcoes,
      macros: r.macros,
      ingredientes: r.ingredientes.map((i) => ({
        nome: i.nome,
        quantidade: i.quantidade ?? formatarQuantidade(i.qtd * fator, i.unidade),
        temEmCasa: usuarioTem(i.nome, ingredientes),
      })),
      passos: r.passos,
      dica: r.dica,
      termoBuscaImagem: r.termoBuscaImagem,
    };
  });
}
