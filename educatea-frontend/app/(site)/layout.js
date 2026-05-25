import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
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
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${dmSans.className} z-0 relative antialiased`}
        suppressHydrationWarning
      >
        <UserProvider>
          <LanguageProvider>
            <AcessibilidadeProvider>
              <ToastProvider>
                <svg aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
                  <defs>
                    <filter id="daltonismo-protanopia">
                      <feColorMatrix type="matrix" values="
                        1     0     0     0 0
                        0     1     0     0 0
                        0.4  -0.4   1     0 0
                        0     0     0     1 0
                      " />
                    </filter>
                    <filter id="daltonismo-deuteranopia">
                      <feColorMatrix type="matrix" values="
                        1     0     0     0 0
                        0     1     0     0 0
                       -0.4   0.4   1     0 0
                        0     0     0     1 0
                      " />
                    </filter>
                    <filter id="daltonismo-tritanopia">
                      <feColorMatrix type="matrix" values="
                        1     0     0.7   0 0
                        0     1    -0.7   0 0
                        0     0     1     0 0
                        0     0     0     1 0
                      " />
                    </filter>
                  </defs>
                </svg>
                <Header />
                <ScrollToTop />
                <div id="site-content" className="min-h-screen pt-[12dvh] lg:pt-[13dvh]">
                  {children}
                </div>
                <div className="z-40 fixed right-5 bottom-10">
                  <ChatbotWidget />
                  <AcessibilidadeWidget />
                </div>
                <Footer />
              </ToastProvider>
            </AcessibilidadeProvider>
          </LanguageProvider>
        </UserProvider>
      </body>
    </html>
  );
}
