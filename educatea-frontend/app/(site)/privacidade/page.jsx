import LegalLayout from "@/components/LegalLayout";

export default function PrivacidadePage() {
  return (
    <LegalLayout title="Política de Privacidade" date="21 de Janeiro de 2026">
      <p className="lead text-lg text-gray-600 dark:text-[#ffd9009f] mb-6">
        Sua privacidade é importante para nós. É política do EducaTEA respeitar a sua privacidade em relação 
        a qualquer informação sua que possamos coletar no site e no jogo.
      </p>

      <h3>1. Informações que Coletamos</h3>
      <p>
        Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. 
        Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.
      </p>
      
      <h4>1.1 Dados fornecidos diretamente</h4>
      <p>
        Podemos coletar seu nome, e-mail e instituição de ensino quando você se cadastra para baixar materiais 
        didáticos ou participar do fórum.
      </p>

      <h3>2. Uso das Informações</h3>
      <p>
        Utilizamos os dados coletados para:
      </p>
      <ul>
        <li>Fornecer e manter nosso serviço;</li>
        <li>Melhorar a experiência do usuário e personalizar o conteúdo;</li>
        <li>Enviar atualizações importantes sobre o projeto;</li>
        <li>Fins acadêmicos e estatísticos (de forma anonimizada).</li>
      </ul>

      <h3>3. Compartilhamento de Dados</h3>
      <p>
        Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando 
        exigido por lei.
      </p>

      <h3>4. Segurança</h3>
      <p>
        Armazenamos os dados coletados pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos 
        dados, protegemos dentro de meios comercialmente aceitáveis para evitar perdas e roubos.
      </p>
    </LegalLayout>
  );
}