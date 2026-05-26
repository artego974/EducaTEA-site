import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import ChatbotWidget from "@/components/chatbot/ChatbotWidget";
import AcessibilidadeWidget from "@/components/acessibilidade/AcessibilidadeWidget";
import { LanguageProvider } from "@/context/LanguageContext";
import favicon from "./favicon.ico";
import { UserProvider } from "@/context/UserContext";
import { AcessibilidadeProvider } from "@/context/AcessibilidadeContext";
import { ToastProvider } from "@/context/ToastContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "EducaTEA",
  description: "Plataforma educacional EducaTEA",
  icons: { icon: favicon.src },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <UserProvider>
        <LanguageProvider>
          <AcessibilidadeProvider>
            <ToastProvider>
              <body className={`${dmSans.className} z-0 relative antialiased`}>
                <Header />
                <div id="site-content" className="min-h-screen pt-[13dvh]">
                  {children}
                </div>
                <div className="z-40 fixed right-5 bottom-10">
                  <ChatbotWidget />
                  <AcessibilidadeWidget />
                </div>
                <Footer />
              </body>
            </ToastProvider>
          </AcessibilidadeProvider>
        </LanguageProvider>
      </UserProvider>
    </html>
  );
}
