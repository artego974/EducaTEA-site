import LegalLayout from "@/components/LegalLayout";

export default function TermosPage() {
  return (
    <LegalLayout title="Termos de Uso" date="21 de Janeiro de 2026">
      <h3>1. Aceitação dos Termos</h3>
      <p>
        Ao baixar, instalar ou utilizar o <strong>EducaTEA</strong> ("o Jogo"), você concorda em cumprir estes 
        Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
      </p>

      <h3>2. Licença de Uso</h3>
      <p>
        Concedemos a você uma licença limitada, não exclusiva e intransferível para uso pessoal e não comercial 
        do software, estritamente de acordo com os termos deste contrato.
      </p>
      <ul>
        <li>Você não pode modificar, descompilar ou realizar engenharia reversa do software.</li>
        <li>Você não pode utilizar o jogo para fins ilícitos ou não autorizados.</li>
        <li>É proibido remover quaisquer avisos de direitos autorais ou propriedade.</li>
      </ul>

      <h3>3. Contas de Usuário</h3>
      <p>
        Para acessar alguns recursos do jogo, você pode precisar criar uma conta. Você é responsável por manter 
        a confidencialidade de suas credenciais de login e por todas as atividades que ocorrem em sua conta.
      </p>

      <h3>4. Propriedade Intelectual</h3>
      <p>
        Todo o conteúdo, design, gráficos, e códigos do EducaTEA são propriedade intelectual exclusiva dos 
        desenvolvedores e estão protegidos pelas leis de direitos autorais do Brasil e tratados internacionais.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 not-prose text-sm text-gray-700 mt-6">
        <strong>Nota importante:</strong> O uso indevido de nossa marca ou conteúdo resultará no bloqueio imediato da conta.
      </div>
    </LegalLayout>
  );
}