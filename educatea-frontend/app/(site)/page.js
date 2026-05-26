"use client"; // 1. Obrigatório porque usamos hooks (useLanguage)

// 2. Novos imports necessários
import { useLanguage } from "@/context/LanguageContext";
import LoadingScreen from "@/components/LoadingScreen"; // Certifique-se de ter criado este componente

// Seus imports existentes
import CookieBanner from "@/components/CookieBanner";
import Fair from "@/components/Fair";
import FairLogos from "@/components/FairLogos";
import Forum from "@/components/Forum";
import GameCard from "@/components/GameCard";
import MainContent from "@/components/MainContent";
import Searches from "@/components/Searches";
import Slider from "@/components/Slider";
import Team from "@/components/Team";
import TeaSection from "@/components/TeaSection";
import { useUser } from "@/context/UserContext";

export default function Home() {
  // 3. Buscamos o estado de carregamento do contexto
  const { isLoading } = useLanguage(); 




  
  // 4. Bloqueio de segurança: Se estiver lendo o localStorage, mostra o Loading
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 5. Se já carregou, mostra o site normal
  return (
    <div className="z-0">

      <CookieBanner />
      <MainContent />
      <TeaSection />
      <section className="relative bg-gradient-to-br from-[#0B1623] to-[#050B14] flex flex-col gap-20 items-center justify-center py-15">
        <GameCard />
        <Fair />
        <FairLogos />
        <Searches />
        <Slider />
        <div className="absolute w-full h-[300px] bottom-0 bg-white dark:bg-zinc-800 dark:border-b-white border-b z-0"></div>
      </section>
      <Forum />
      <Team />
    </div>
  );
}