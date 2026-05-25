import LegalLayout from "@/components/LegalLayout";
import { Scale, XCircle, User, Tag, AlertTriangle } from "lucide-react";

function ProhibitionCard({ title, children }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40 not-prose">
      <div className="shrink-0 w-9 h-9 rounded-xl bg-red-100 dark:bg-red-400/10 flex items-center justify-center">
        <XCircle size={16} className="text-red-500 dark:text-red-400" />
      </div>
      <div>
        <h4 className="font-bold text-red-900 dark:text-red-200 text-sm mb-1">{title}</h4>
        <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed m-0">{children}</p>
      </div>
    </div>
  );
}

function SectionCard({ icon: Icon, title, children }) {
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

export default function TermosPage() {
  return (
    <LegalLayout title="Termos de Uso" date="21 de Janeiro de 2026">

      <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#1A3879]/5 dark:bg-blue-400/5 border border-[#1A3879]/10 dark:border-blue-400/10 not-prose mb-6">
        <Scale size={20} className="text-[#1A3879] dark:text-blue-400 shrink-0" />
        <p className="text-sm text-gray-600 dark:text-gray-300 m-0">
          Ao baixar, instalar ou utilizar o <strong>EducaTEA</strong>, você concorda em cumprir
          estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não
          deverá utilizar nossos serviços.
        </p>
      </div>

      <h3>1. Aceitação dos Termos</h3>
      <p>
        Ao utilizar o <strong>EducaTEA</strong> ("o Jogo"), você reconhece ter lido, compreendido
        e concordado com todos os termos e condições descritos neste documento.
      </p>

      <h3>2. Licença de Uso</h3>
      <p>
        Concedemos a você uma licença limitada, não exclusiva e intransferível para uso pessoal e não
        comercial do software, estritamente de acordo com os termos deste contrato.
      </p>

      <div className="space-y-3 my-6 not-prose">
        <ProhibitionCard title="Modificação e engenharia reversa proibidas">
          Você não pode modificar, descompilar ou realizar engenharia reversa do software.
        </ProhibitionCard>
        <ProhibitionCard title="Uso ilegal ou não autorizado">
          Você não pode utilizar o jogo para fins ilícitos ou não autorizados.
        </ProhibitionCard>
        <ProhibitionCard title="Remoção de avisos de propriedade">
          É proibido remover quaisquer avisos de direitos autorais ou propriedade intelectual.
        </ProhibitionCard>
      </div>

      <h3>3. Contas de Usuário</h3>

      <SectionCard icon={User} title="Responsabilidade da conta">
        Para acessar alguns recursos do jogo, você pode precisar criar uma conta. Você é responsável
        por manter a confidencialidade de suas credenciais de login e por todas as atividades que
        ocorrem em sua conta.
      </SectionCard>

      <h3>4. Propriedade Intelectual</h3>

      <SectionCard icon={Tag} title="Conteúdo protegido">
        Todo o conteúdo, design, gráficos e códigos do EducaTEA são propriedade intelectual exclusiva
        dos desenvolvedores e estão protegidos pelas leis de direitos autorais do Brasil e tratados
        internacionais.
      </SectionCard>

      <div className="flex gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 not-prose mt-6">
        <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 dark:text-amber-300 m-0">
          <strong>Nota importante:</strong> O uso indevido de nossa marca ou conteúdo resultará no
          bloqueio imediato da conta.
        </p>
      </div>

    </LegalLayout>
  );
}
