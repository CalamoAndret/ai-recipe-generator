import "./globals.css";

const titulo = "AI Recipe Generator · Receitas com IA a partir do que você tem em casa";
const descricao =
  "Informe os ingredientes que você tem e receba 3 receitas personalizadas por IA, com macros por porção, fotos dos pratos, favoritos e lista de compras automática.";

// Na Vercel, VERCEL_PROJECT_PRODUCTION_URL é definida automaticamente.
const urlBase = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(urlBase),
  title: {
    default: titulo,
    template: "%s · AI Recipe Generator",
  },
  description: descricao,
  applicationName: "AI Recipe Generator",
  authors: [{ name: "Cálamo Andret" }],
  creator: "Cálamo Andret",
  keywords: ["receitas", "inteligência artificial", "macros", "nutrição", "Next.js", "Gemini", "Claude"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: titulo,
    description: descricao,
    siteName: "AI Recipe Generator",
  },
  twitter: {
    card: "summary",
    title: titulo,
    description: descricao,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#059669",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
