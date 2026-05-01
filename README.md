![Banner do Projeto](/public/images/logos/TextLogo.webp)

> *Transformando a educação inclusiva através da tecnologia e da gamificação.*

---

## O que é o EducaTEA?

O **EducaTEA** é uma plataforma educacional criada para ajudar professores, tutores, psicólogos e outros profissionais da educação a aprenderem, na prática, como incluir alunos com **Transtorno do Espectro Autista (TEA)** em sala de aula.

O projeto surgiu de um dado preocupante: dados do MEC (2023) apontam que **94% dos professores brasileiros** não possuem capacitação específica para a inclusão escolar, enquanto o CDC indica que **1 em cada 31 crianças** recebe diagnóstico de autismo. O EducaTEA nasceu para reduzir esse abismo.

No coração da plataforma está um **Serious Game** — um jogo com propósito educativo real. Nele, o educador assume o papel de uma professora em uma nova escola e enfrenta situações do cotidiano que exigem decisões pedagógicas estratégicas. Diferente de leituras ou apostilas, o conhecimento aqui é **vivenciado**, com feedback imediato baseado em evidências.

Este repositório contém a versão 2.0 da aplicação, que une uma interface informativa, uma comunidade de troca de experiências e a experiência gamificada principal.

---

## Para quem é o EducaTEA?

O site e o jogo foram pensados para diferentes perfis. Na hora do cadastro, você escolhe o que melhor te descreve:

| Perfil | Quem é |
|--------|--------|
| **Professor** | Docentes que atuam ou querem atuar com alunos TEA |
| **Tutor** | Profissionais de apoio escolar |
| **AEE** | Professores do Atendimento Educacional Especializado |
| **Psicólogo** | Profissionais de saúde que acompanham alunos |
| **Estudante** | Quem está aprendendo sobre inclusão |
| **Pessoa TEA** | Pessoas com diagnóstico de autismo (níveis 1, 2 ou 3) |
| **Senac RS** | Membros da comunidade Senac de São Leopoldo |
| **Admin / Dev** | Equipe do projeto |

Você pode ter mais de um perfil — basta selecionar as tags que representam quem você é durante o cadastro.

---

## 🎮 Funcionalidades Principais

- **Serious Game Narrativo:** O jogador assume o papel de um docente em uma nova escola, enfrentando desafios reais de inclusão.
- **Mecânica de Escolhas:** Cada decisão impacta o progresso do aluno e a dinâmica da sala de aula.
- **Feedback em Tempo Real:** Uma barra de progresso visual indica o nível de inclusão baseado nas escolhas feitas pelo usuário.
- **Portal de Informações:** Central de conteúdo teórico sobre o TEA.
- **Comunidade:** Feed de publicações onde profissionais compartilham vivências e estratégias.

---

## 📸 Demonstração

Abaixo, algumas capturas de tela da interface e do jogo:

| Tela Inicial do Portal | Interface do Jogo (Narrativa) |
|:---:|:---:|
| ![Thumbnail Site](https://via.placeholder.com/500x300?text=Screenshot+Portal+EducaTEA) | ![Thumbnail Jogo](https://via.placeholder.com/500x300?text=Gameplay+do+Serious+Game) |

| Comunidade de Professores | Barra de Progresso de Inclusão |
|:---:|:---:|
| ![Thumbnail Forum](https://via.placeholder.com/500x300?text=Interface+da+Comunidade) | ![Thumbnail Feedback](https://via.placeholder.com/500x300?text=Feedback+de+Escolhas) |

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 16 + React 19 |
| Estilização | Tailwind CSS 4 |
| Animações | Framer Motion |
| Backend | Node.js + Express 4 |
| ORM | TypeORM |
| Banco de dados | MySQL |
| Auth | JWT + bcrypt |
| Linguagem backend | TypeScript |

---

## Páginas do site

### Página inicial (`/`)

A página de entrada do EducaTEA. Ela está dividida em seções que você pode navegar pelo menu do topo:

- **Apresentação** — Conheça o projeto, sua missão e o problema que ele resolve.
- **Feiras** — Veja onde o EducaTEA já foi apresentado em eventos e feiras de inovação.
- **Trabalhos** — Acesse o artigo científico, o pitch do projeto e os resultados alcançados.
- **Comunidade** — Uma prévia do feed com os posts mais recentes.
- **Equipe** — Conheça os desenvolvedores e orientadores que construíram o projeto.

O botão **JOGAR** no topo da página leva diretamente para o Serious Game.

---

### Comunidade (`/comunidade`)

O espaço de troca da plataforma, pensado como um **feed de publicações** onde toda a comunidade pode participar.

**O que você pode fazer:**

- **Ler posts** de outros usuários sem precisar de conta
- **Publicar** sua própria experiência, dúvida ou ideia (precisa estar logado)
- **Curtir** posts que você achou úteis ou inspiradores
- **Responder** posts abrindo a thread completa da conversa
- **Buscar** por palavras-chave ou nome de autor

**Filtros disponíveis:**

| Filtro | O que mostra |
|--------|-------------|
| **Recentes** | Posts do mais novo para o mais antigo |
| **Em alta** | Posts com mais curtidas e respostas |
| **Senac** | Posts que mencionam Senac |
| **Professores** | Posts com conteúdo pedagógico |
| **Personalizar** | Para filtros futuros e personalizados |

---

### Criar Post (`/criar-post`)

Página para publicar na comunidade. Você pode escrever um texto, escolher o destino (Comunidade ou Fórum) e adicionar uma imagem (até 5MB).

> Só usuários com conta podem criar posts.

---

### Meus Posts (`/meus-posts`)

Área pessoal onde você vê tudo que já publicou. Daqui é possível editar o texto ou a imagem de qualquer post, excluí-los e ver curtidas e respostas recebidas.

---

### Meu Perfil (`/perfil`)

Sua página pública dentro da plataforma. Aqui você pode trocar seu avatar, editar seu nome, informar seu país e ver suas tags.

---

### Configurações (`/configuracoes`)

Área de segurança da conta — por aqui você altera sua senha.

---

### Notícias (`/noticias`)

Artigos e publicações sobre o projeto, inclusão e TEA.

---

## Funcionalidades do site

### Criar uma conta

1. Clique no ícone de usuário no canto superior direito (ou no botão "Entrar / Cadastrar" no menu mobile)
2. Escolha **"Criar nova conta"**
3. **Passo 1:** Preencha nome, e-mail e senha
4. **Passo 2:** Escolha um avatar e selecione suas tags (seu perfil na comunidade)
5. Pronto! Você já está logado e pode participar da comunidade

### Fazer login

1. Clique no ícone de usuário
2. Escolha **"Entrar"**
3. Informe e-mail e senha cadastrados

### Menu do usuário (logado)

Ao clicar no seu avatar no canto superior direito, um menu aparece com:

- **Meu Perfil** — editar suas informações
- **Meus Posts** — ver e gerenciar publicações
- **Configurações** — trocar senha
- **Sair** — encerrar a sessão

---

## Chatbot

No canto inferior direito da tela há um botão para conversar com o **chatbot** do EducaTEA. Ele está disponível para visitantes e usuários logados e pode tirar dúvidas sobre o projeto. Ao encerrar a conversa, você pode avaliar o atendimento de Péssimo a Excelente.

---

## Acessibilidade

O EducaTEA foi construído pensando em **diferentes formas de acessar o conteúdo**. No canto inferior direito da tela há um botão de acessibilidade com diversas opções:

| Recurso | O que faz |
|---------|-----------|
| **Alto contraste** | Aumenta o contraste de cores para facilitar a leitura |
| **Modo escuro** | Deixa o site com fundo escuro e texto claro |
| **Espaçamento de texto** | Aumenta o espaço entre linhas e letras |
| **Parar animações** | Desativa animações que podem causar desconforto |
| **Cursor gigante** | Torna o cursor do mouse muito maior e mais visível |
| **Fonte legível** | Troca a fonte por uma versão mais fácil de ler |
| **Destacar links** | Sublinha e destaca todos os links da página |
| **Daltonismo** | Ajusta as cores para Tritanopia, Protanopia ou Deuteranopia |
| **Zoom** | Aumenta ou diminui o tamanho de todo o conteúdo |
| **Leitor de texto** | Lê o texto em voz alta ao passar o mouse |
| **Máscara de leitura** | Escurece o resto da tela para focar em uma linha |
| **Lupa** | Amplia a área ao redor do cursor |
| **Guia de leitura** | Exibe uma linha horizontal que acompanha o mouse |
| **Teclado virtual** | Exibe um teclado na tela |

Você também pode salvar combinações de configurações como **presets** — por exemplo, um conjunto pensado para pessoas com TDAH, dislexia, baixa visão ou para idosos.

---

## Idiomas

O site está disponível em três idiomas, trocáveis pelo seletor no menu:

- 🇧🇷 **Português (pt-BR)**
- 🇺🇸 **English (en-US)**
- 🇪🇸 **Español (es-ES)**

---

## O Projeto Senac

O EducaTEA foi desenvolvido no **Senac de São Leopoldo (RS)** como um projeto de inovação social. Ele participou de feiras e eventos, foi alvo de um artigo científico e conta com um pitch que explica a proposta completa — ambos disponíveis na seção **Trabalhos** da página inicial.

---

## 🚀 Possíveis melhorias futuras

- **IA no chatbot** — integrar um modelo de linguagem (ex: Claude ou GPT) para que o chatbot responda dúvidas sobre TEA e inclusão de forma inteligente e contextualizada, em vez de respostas fixas.
- **Sistema de certificados** — emitir certificados digitais ao usuário após concluir o Serious Game, tornando a plataforma válida como formação complementar para educadores.
- **Recuperação de senha por e-mail** — implementar fluxo de reset de senha via link enviado ao e-mail cadastrado, eliminando a necessidade de contato manual com a equipe.

---

## Dúvidas frequentes

**Preciso de conta para usar o site?**
Não. Você pode explorar a página inicial, ler a comunidade, ver as notícias e usar o chatbot sem criar uma conta. A conta é necessária para publicar, curtir e acessar seu perfil.

**Posso usar o jogo sem conta?**
O botão JOGAR leva para o acesso ao Serious Game. Verifique na seção de acesso do jogo se é necessário login.

**Esqueci minha senha. O que faço?**
No momento o site não possui recuperação automática de senha por e-mail. Entre em contato com a equipe do projeto ou crie uma nova conta.

**Meus posts ficam visíveis para todo mundo?**
Sim. Posts na Comunidade e no Fórum são públicos — qualquer visitante pode ler, mesmo sem conta.

**Como excluo minha conta?**
Entre em contato com a equipe do projeto. A exclusão de conta não está disponível diretamente no site ainda.
