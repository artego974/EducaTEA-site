import LegalLayout from "@/components/LegalLayout";
import { Shield, Eye, User, Share2, Lock, CheckCircle } from "lucide-react";

function DataCard({ icon: Icon, title, children }) {
  return (
    <div className="flex gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-zinc-700/40 border border-gray-100 dark:border-zinc-700 not-prose">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-[#1A3879]/10 dark:bg-blue-400/10 flex items-center justify-center">
        <Icon size={18} className="text-[#1A3879] dark:text-blue-400" />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{title}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed m-0">{children}</p>
      </div>
    </div>
  );
}

export default function PrivacidadePage() {
  return (
    <LegalLayout title="Política de Privacidade" date="21 de Janeiro de 2026">

      <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#1A3879]/5 dark:bg-blue-400/5 border border-[#1A3879]/10 dark:border-blue-400/10 not-prose mb-6">
        <Shield size={20} className="text-[#1A3879] dark:text-blue-400 shrink-0" />
        <p className="text-sm text-gray-600 dark:text-gray-300 m-0">
          Sua privacidade é importante para nós. É política do EducaTEA respeitar a sua privacidade em relação
          a qualquer informação sua que possamos coletar no site e no jogo.
        </p>
      </div>

      <h3>1. Informações que Coletamos</h3>
      <p>
        Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço.
        Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.
      </p>

      <div className="space-y-3 my-6 not-prose">
        <DataCard icon={User} title="Dados de cadastro">
          Nome, e-mail e instituição de ensino coletados ao se cadastrar para baixar materiais
          didáticos ou participar do fórum.
        </DataCard>
        <DataCard icon={Eye} title="Dados de uso">
          Informações sobre como você utiliza a plataforma, coletadas para melhoria contínua
          da experiência de navegação.
        </DataCard>
      </div>

      <h3>2. Uso das Informações</h3>
      <p>Utilizamos os dados coletados para as seguintes finalidades:</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 not-prose">
        {[
          "Fornecer e manter nosso serviço",
          "Melhorar a experiência do usuário e personalizar o conteúdo",
          "Enviar atualizações importantes sobre o projeto",
          "Fins acadêmicos e estatísticos (de forma anonimizada)",
        ].map((item) => (
          <div key={item} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-700/40 border border-gray-100 dark:border-zinc-700">
            <CheckCircle size={16} className="text-[#1A3879] dark:text-blue-400 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
          </div>
        ))}
      </div>

      <h3>3. Compartilhamento de Dados</h3>

      <div className="flex gap-3 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40 not-prose my-4">
        <Share2 size={18} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
        <p className="text-sm text-green-800 dark:text-green-300 m-0">
          Não compartilhamos informações de identificação pessoal publicamente ou com terceiros,
          exceto quando exigido por lei.
        </p>
      </div>

      <h3>4. Segurança</h3>

      <DataCard icon={Lock} title="Armazenamento protegido">
        Armazenamos os dados coletados pelo tempo necessário para fornecer o serviço solicitado.
        Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis para
        evitar perdas e roubos.
      </DataCard>

    </LegalLayout>
  );
}
