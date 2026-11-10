export const OBJETIVOS = [
  { id: "hipertrofia", label: "Hipertrofia", emoji: "💪", descricao: "Mais proteína" },
  { id: "emagrecimento", label: "Emagrecimento", emoji: "🔥", descricao: "Menos calorias" },
  { id: "equilibrio", label: "Equilíbrio", emoji: "⚖️", descricao: "Balanceado" },
];

export const RESTRICOES = [
  { id: "vegetariano", label: "Vegetariano", emoji: "🥦" },
  { id: "sem-lactose", label: "Sem lactose", emoji: "🥛" },
  { id: "sem-gluten", label: "Sem glúten", emoji: "🌾" },
];

export const TEMPOS = [
  { valor: 15, label: "15 min" },
  { valor: 30, label: "30 min" },
  { valor: 45, label: "45 min" },
  { valor: 60, label: "1 h" },
  { valor: 0, label: "Sem limite" },
];

export const SUGESTOES = [
  "ovo",
  "frango",
  "arroz",
  "feijão",
  "tomate",
  "cebola",
  "alho",
  "batata",
  "batata-doce",
  "queijo",
  "leite",
  "aveia",
  "banana",
  "atum",
  "brócolis",
  "cenoura",
  "macarrão",
  "espinafre",
];

export const DIFICULDADES = ["Fácil", "Média", "Difícil"];

export const LIMITES = {
  maxIngredientes: 30,
  maxTamanhoIngrediente: 60,
  minPorcoes: 1,
  maxPorcoes: 12,
};

/** Itens de despensa que consideramos que todo mundo tem. */
export const BASICOS = ["sal", "pimenta", "pimenta-do-reino", "azeite", "oleo", "agua"];
