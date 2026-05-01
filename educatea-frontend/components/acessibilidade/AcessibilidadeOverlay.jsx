"use client";

import { useEffect, useRef } from "react";
import { useAcessibilidade } from "@/context/AcessibilidadeContext";
import { usePathname } from "next/navigation";

export default function AcessibilidadeOverlay() {
  const { settings } = useAcessibilidade();
  const pathname = usePathname();
  
  // Refs para manipular o DOM com máxima performance (60 FPS)
  const lensRef = useRef(null);
  const cloneContainerRef = useRef(null);
  const mascaraRef = useRef(null);
  const guiaRef = useRef(null);
  
  // Guardamos a última posição do mouse para os cálculos matemáticos
  const lastMousePos = useRef({ x: -1000, y: -1000 });

  // ==========================================
  // LÓGICA DE ALINHAMENTO MATEMÁTICO (MOUSE)
  // ==========================================
  const updateOverlayPositions = () => {
    const x = lastMousePos.current.x;
    const y = lastMousePos.current.y;

    // 1. Atualiza a Lupa (Zoom Fiel ao Pixel)
    if (settings.lupa && lensRef.current && cloneContainerRef.current) {
      lensRef.current.style.left = `${x}px`;
      lensRef.current.style.top = `${y}px`;

      const pageX = x + window.scrollX;
      const pageY = y + window.scrollY;

      const leftOffset = 110 - (pageX * 2);
      const topOffset = 110 - (pageY * 2);

      cloneContainerRef.current.style.left = `${leftOffset}px`;
      cloneContainerRef.current.style.top = `${topOffset}px`;
    }

    // 2. Atualiza a Máscara
    if (settings.mascaraLeitura && mascaraRef.current) {
      mascaraRef.current.style.top = `${y}px`;
    }

    // 3. Atualiza o Guia de Leitura
    if (settings.guiaLeitura && guiaRef.current) {
      guiaRef.current.style.top = `${y}px`;
    }
  };

  useEffect(() => {
    // Se nada estiver ligado, não fazemos os cálculos
    if (!settings.mascaraLeitura && !settings.lupa && !settings.guiaLeitura) return;

    const handleMouseMove = (e) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      updateOverlayPositions();
    };

    const handleScroll = () => {
      updateOverlayPositions();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [settings.mascaraLeitura, settings.lupa, settings.guiaLeitura]);

  // ==========================================
  // CLONAGEM DO SITE (PARA A LUPA)
  // ==========================================
  useEffect(() => {
    if (!settings.lupa) {
      if (cloneContainerRef.current) cloneContainerRef.current.innerHTML = "";
      return;
    }

    const original = document.getElementById("site-content");
    
    if (original && cloneContainerRef.current) {
      cloneContainerRef.current.innerHTML = "";
      const clone = original.cloneNode(true);
      clone.id = "site-content-clone"; 
      
      const rect = original.getBoundingClientRect();
      cloneContainerRef.current.style.width = `${rect.width}px`;
      cloneContainerRef.current.style.height = `${original.scrollHeight}px`;
      
      cloneContainerRef.current.appendChild(clone);
      updateOverlayPositions();
    }
  }, [settings.lupa, pathname]);

  // Se tudo estiver desligado, esconde o componente inteiro
  if (!settings.mascaraLeitura && !settings.lupa && !settings.guiaLeitura) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      
      {/* --- MÁSCARA DE LEITURA --- */}
      {settings.mascaraLeitura && (
        <div
          ref={mascaraRef}
          className="fixed left-0 right-0 transition-none"
          style={{
            height: "120px",
            top: "-1000px",
            transform: "translateY(-50%)",
            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.75)",
          }}
        />
      )}

      {/* --- GUIA DE LEITURA (Faixa de Foco Translúcida) --- */}
      {settings.guiaLeitura && (
        <div
          ref={guiaRef}
          className="fixed left-0 right-0 h-[50px] bg-red-500/5 border-y border-t-4 border-red-500/40 border-b-0 backdrop-blur-[1px] transition-none"
          style={{
            top: "-1000px",
            transform: "translateY(-50%)",
          }}
        />
      )}

      {/* --- LUPA REDONDA --- */}
      {settings.lupa && (
        <div
          ref={lensRef}
          className="fixed pointer-events-none rounded-full overflow-hidden bg-white border-[4px] border-[#143A7B] shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
          style={{
            width: "220px",
            height: "220px",
            top: "-1000px",
            left: "-1000px",
            transform: "translate(-50%, -50%)", // Centraliza a lente no mouse
          }}
        >
          <div
            ref={cloneContainerRef}
            className="absolute origin-top-left"
            style={{ transform: "scale(2)" }}
          />
        </div>
      )}

    </div>
  );
}