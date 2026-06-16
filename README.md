# 💬 NerdBI — Frontend

Este projeto foi criado com foco em construir um SaaS real de análise de dados com linguagem natural, aplicando conceitos modernos de desenvolvimento frontend e consolidando boas práticas de arquitetura React 🚀

## 🚀 Objetivo do Projeto

* Colocar em prática conhecimentos avançados em React e TypeScript
* Trabalhar com consumo de APIs REST e cache assíncrono
* Desenvolver uma interface de chat completa, com sessões e histórico
* Aplicar autenticação JWT e fluxos protegidos de navegação
* Criar uma interface responsiva, acessível e consistente com um design system próprio
* Evoluir o produto de forma incremental, com estados de loading, erro e rate limit bem definidos

## 🛠 Funcionalidades

* 👤 Cadastro e autenticação de usuários
* 🔐 Login com JWT Authentication
* 🗄️ Conexão com banco de dados PostgreSQL do próprio usuário (connection string)
* 💬 Chat em linguagem natural com os dados conectados
* 🗂️ Sessões de conversa com histórico, criação e troca entre sessões
* 🧾 Exibição do SQL executado pelo agente de IA, em bloco colapsável
* ⚠️ Tratamento de erros do agente e de rate limit, com mensagens dedicadas e opção de tentar novamente
* 📱 Interface responsiva (desktop e mobile), com sidebar que se transforma em menu hambúrguer
* 🔎 Validações de formulário
* ⚡ Integração completa entre frontend e backend

## 🚨 Limitações conhecidas — leia antes de usar

> Este projeto usa uma cota **gratuita** de IA. Por isso, algumas limitações abaixo são esperadas e não indicam bug.

### 🤖 Modelo de IA gratuito
O agente usa o modelo **Llama 3.3 70B via Groq**, escolhido por ter cota gratuita. Por ser um modelo gratuito (e não um modelo de ponta como GPT-4 ou Claude Opus), ele pode:
- Cometer erros ao interpretar perguntas mais complexas ou ambíguas;
- Atingir o limite de requisições gratuitas em horários de pico, retornando uma mensagem de **rate limit** (a interface já trata esse caso e oferece um botão de "Tentar novamente");
- Variar um pouco a qualidade da resposta entre uma pergunta e outra, mesmo perguntas parecidas.

### 🔌 Connection string do banco — porta obrigatória 6543
Ao conectar seu banco PostgreSQL, **a connection string precisa usar a porta `6543` (transaction pooling / pooler)**, e não a porta padrão `5432`. Isso é necessário porque o agente abre e fecha conexões sob demanda a cada pergunta, e o pooler em modo *transaction* é o que suporta esse padrão de uso sem esgotar as conexões do banco.

Se a porta usada não for `6543`, a tela de conexão vai bloquear o teste/salvamento e orientar a correção.

### 💬 Como perguntar para ter melhores resultados
Por rodar sobre um modelo gratuito, o agente se beneficia de perguntas **claras e detalhadas** (ex: especificar período, nome da tabela/métrica esperada, etc. quando souber). Em alguns casos, principalmente sob alta demanda do modelo gratuito, pode ser necessário **reenviar a mesma pergunta** uma ou duas vezes até obter uma resposta consistente.

## ⚠️ Observações

O projeto ainda está em evolução. Algumas funcionalidades podem receber melhorias e ajustes conforme o produto avança 💡

A ideia é continuar evoluindo o sistema aos poucos, aplicando boas práticas e simulando cada vez mais um ambiente real de desenvolvimento de um SaaS.

## 🧰 Tecnologias Utilizadas

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* TanStack React Query
* React Hook Form
* Zod

🔗 Repositório do backend: 👉 https://github.com/njunior93/nerdbi_backend.git

## ☁️ Deploy

* Frontend hospedado na Vercel
* Backend hospedado na Railway

## 🎨 Interface

A interface principal do NerdBI é um chat com sidebar, no estilo de produtos como o ChatGPT, e não um dashboard tradicional. O usuário conversa com seus próprios dados em português e recebe respostas em texto, acompanhadas do SQL executado.

São três telas principais:

* **Login (`/`)** — autenticação do usuário
* **Conectar banco (`/connect`)** — tela exibida uma única vez, para salvar a connection string do banco do cliente
* **Chat (`/chat`)** — tela principal, onde o usuário passa todo o tempo conversando com seus dados

## 📚 Aprendizados

Durante o desenvolvimento desse projeto pude praticar e fortalecer conhecimentos importantes como:

* Estruturação de componentes reutilizáveis
* Organização de hooks por domínio (auth, sessão, chat, conexão)
* Integração entre frontend e API REST
* Cache e estado assíncrono com React Query
* Responsividade
* Validações com React Hook Form e Zod
* Autenticação de usuários com JWT
* Tratamento de estados de erro e rate limit em produção
* Boas práticas de código

## 🤝 Contribuições

Sinta-se à vontade para:

* Testar a aplicação
* Reportar bugs
* Sugerir melhorias
* Compartilhar feedbacks

Toda contribuição é bem-vinda 💙

## 📎 Links

🔗 Backend: [Link para o Back End](https://github.com/njunior93/nerdbi_backend.git)
🔗 Deploy: [Link para o Deploy da aplicação](https://nerdbi.vercel.app/)

## 👨‍💻 Autor

Desenvolvido por [Natanael Junior](https://www.linkedin.com/in/njunior93/)
