import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "MOOVE - Busca Inteligente de Imóveis",
  description: "Descreva o imóvel dos seus sonhos. A gente busca por você.",
  openGraph: {
    title: "MOOVE - Busca Inteligente de Imóveis",
    description: "Descreva o imóvel dos seus sonhos. A gente busca por você.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-brand-light text-gray-800">
        {children}
      </body>
    </html>
  );
}
