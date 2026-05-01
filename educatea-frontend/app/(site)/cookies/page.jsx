import LegalLayout from "@/components/LegalLayout";
import { Cookie, UserCheck, LogIn, ToggleLeft, Info } from "lucide-react";

function CookieCard({ icon: Icon, title, children }) {
  return (
    <div className="flex gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-zinc-700/40 border border-gray-100 dark:border-zinc-700 not-prose">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#1A3879]/10 dark:bg-blue-400/10 flex items-center justify-center">
        <Icon size={18} className="text-[#1A3879] dark:text-blue-400" />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed m-0">{children}</p>
      </div>
    </div>
  );
}

export default function CookiesPage() {
  return (
    <LegalLayout title="Política de Cookies" date="21 de Janeiro de 2026">

      <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#1A3879]/5 dark:bg-blue-400/5 border border-[#1A3879]/10 dark:border-blue-400/10 not-prose mb-6">
        <Cookie size={20} className="text-[#1A3879] dark:text-blue-400 flex-shrink-0" />
        <p className="text-sm text-gray-600 dark:text-gray-300 m-0">
          Como é prática comum em quase todos os sites profissionais, o EducaTEA utiliza cookies para
          melhorar sua experiência de navegação. Esta página explica o que coletamos, como usamos e
          por que às vezes precisamos armazenar essas informações.
        </p>
      </div>

      <h3>O que são cookies?</h3>
      <p>
        Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um
        site. Eles permitem que o site lembre suas preferências e ações ao longo do tempo, tornando
        sua experiência mais fluida e personalizada.
      </p>

      <h3>Como usamos os cookies</h3>
      <p>
        Utilizamos cookies para garantir o funcionamento essencial da plataforma e para melhorar sua
        experiência. Na maioria dos casos, não é possível desativá-los sem comprometer funcionalidades
        importantes do site.
      </p>

      <h3>Cookies que utilizamos</h3>

      <div className="space-y-3 my-6 not-prose">
        <CookieCard icon={UserCheck} title="Cookies de conta">
          Quando você cria uma conta, usamos cookies para gerenciar o processo de cadastro e
          administração geral do perfil. Eles são removidos quando você encerra sua sessão.
        </CookieCard>

        <CookieCard icon={LogIn} title="Cookies de login">
          Ao fazer login, armazenamos um token de sessão que evita que você precise se autenticar
          a cada nova página visitada. Esse cookie expira automaticamente ao sair ou após inatividade
          prolongada.
        </CookieCard>

        <CookieCard icon={ToggleLeft} title="Cookies de preferências">
          Salvamos suas preferências de idioma e acessibilidade (como modo escuro, zoom e tipo de
          fonte) para que suas configurações sejam mantidas entre visitas.
        </CookieCard>
      </div>

      <h3>Desativando cookies</h3>
      <p>
        Você pode impedir o armazenamento de cookies ajustando as configurações do seu navegador.
        Consulte a seção de ajuda do seu navegador para saber como fazer isso. Esteja ciente de que
        desativar cookies pode afetar o funcionamento do EducaTEA e de outros sites que você visita.
      </p>

      <div className="flex gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 not-prose mt-6">
        <Info size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300 m-0">
          O EducaTEA não utiliza cookies de rastreamento de terceiros para fins publicitários.
          Todos os cookies empregados têm finalidade exclusivamente funcional.
        </p>
      </div>

    </LegalLayout>
  );
}
