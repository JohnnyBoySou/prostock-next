# ProStock - Sistema de Gestão de Estoque

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

Sistema moderno de gestão de estoque desenvolvido com tecnologias de ponta para gerenciamento eficiente de lojas e produtos.

## 🚀 Tecnologias Utilizadas

### Core Framework
- **[Next.js](https://nextjs.org/) 14.2.16** - Framework React com App Router para aplicações full-stack
- **[React](https://reactjs.org/) 18** - Biblioteca JavaScript para construção de interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/) 5** - Superset do JavaScript com tipagem estática

### Estilização e UI
- **[Tailwind CSS](https://tailwindcss.com/) 3.4.17** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Componentes primitivos acessíveis e não estilizados
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes reutilizáveis construídos com Radix UI e Tailwind CSS
- **[Lucide React](https://lucide.dev/) 0.454.0** - Biblioteca de ícones moderna e customizável
- **[tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) 1.0.7** - Plugin para animações com Tailwind CSS

### Gerenciamento de Estado e Dados
- **[TanStack React Query](https://tanstack.com/query) 5.64.1** - Biblioteca para sincronização de estado do servidor
- **[Axios](https://axios-http.com/) 1.7.9** - Cliente HTTP baseado em promises

### Formulários e Validação
- **[React Hook Form](https://react-hook-form.com/) 7.54.1** - Biblioteca performática para formulários
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers) 3.9.1** - Resolvers de validação para React Hook Form
- **[Zod](https://zod.dev/) 3.24.1** - Schema de validação TypeScript-first

### Componentes e Utilidades
- **[class-variance-authority](https://cva.style/) 0.7.1** - Utilitário para criar variantes de componentes
- **[clsx](https://github.com/lukeed/clsx) 2.1.1** - Utilitário para construção condicional de classNames
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge) 2.5.5** - Merge inteligente de classes Tailwind CSS
- **[cmdk](https://cmdk.paco.me/) 1.0.4** - Command palette rápido e acessível
- **[date-fns](https://date-fns.org/) 2.28.0** - Biblioteca moderna de utilitários para datas

### Componentes Especializados
- **[Embla Carousel](https://www.embla-carousel.com/) 8.5.1** - Carrossel leve e customizável
- **[Vaul](https://vaul.emilkowal.ski/) 0.9.6** - Drawer component não opinionado
- **[Sonner](https://sonner.emilkowal.ski/) 1.7.1** - Toast component opinionado
- **[input-otp](https://input-otp.rodz.dev/) 1.4.1** - Input para códigos OTP acessível
- **[react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) 2.1.7** - Painéis redimensionáveis
- **[react-day-picker](https://react-day-picker.js.org/) 8.10.1** - Seletor de datas flexível
- **[Recharts](https://recharts.org/)** - Biblioteca de gráficos construída com React e D3

### Ferramentas de Desenvolvimento
- **[PostCSS](https://postcss.org/) 8** - Ferramenta para transformar CSS com JavaScript
- **[Autoprefixer](https://autoprefixer.github.io/) 10.4.20** - Plugin PostCSS para adicionar vendor prefixes

## 🏗️ Arquitetura do Projeto

### Estrutura de Diretórios

```
prostock-next/
├── app/                    # App Router (Next.js 13+)
│   ├── api/               # API Routes
│   ├── dashboard/         # Dashboard pages
│   ├── stores/           # Store management pages
│   ├── importar/         # Import functionality
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home/Auth page
│   └── globals.css       # Global styles
├── components/           # Reusable UI components
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
│   ├── api.ts          # API client configuration
│   ├── store.ts        # Store management hooks
│   ├── token.ts        # Authentication hooks
│   └── user.ts         # User management hooks
├── lib/                # Shared utilities
│   ├── provider.tsx    # React Query provider
│   └── utils.ts        # Utility functions
├── public/             # Static assets
│   ├── fonts/         # Custom fonts
│   └── *.svg          # Logo and icons
└── styles/            # Additional stylesheets
```

### Principais Funcionalidades

- **🔐 Autenticação** - Sistema de login com tokens JWT
- **🏪 Gestão Multi-lojas** - Suporte para múltiplas lojas
- **📦 Gestão de Estoque** - Controle completo de produtos e inventário
- **📊 Relatórios** - Dashboard com métricas e análises
- **📥 Importação** - Sistema de importação de dados via CSV
- **📱 Design Responsivo** - Interface adaptável para desktop e mobile

## 🛠️ Instalação e Configuração

### Pré-requisitos

- **Node.js** 18+ 
- **npm** ou **yarn**

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/JohnnyBoySou/prostock-next.git
   cd prostock-next
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   
   Edite o arquivo `.env.local` com suas configurações:
   ```env
   NEXT_PUBLIC_API_URL=https://stock.engenhariadigital.net/api
   ```

4. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o linter ESLint |

## 🔧 Configuração de Desenvolvimento

### ESLint e TypeScript

O projeto está configurado para ignorar erros de build do ESLint e TypeScript durante o desenvolvimento para maior agilidade. Para produção, recomenda-se resolver todos os warnings.

### Otimização de Imagens

As imagens estão configuradas como não otimizadas (`unoptimized: true`) para compatibilidade com diferentes ambientes de deploy.

### Recursos Experimentais

- **webpackBuildWorker**: Build paralelo com workers
- **parallelServerBuildTraces**: Trace paralelo do servidor
- **parallelServerCompiles**: Compilação paralela do servidor

## 🌐 API e Integrações

### Cliente HTTP

O projeto utiliza uma configuração customizada do Axios localizada em `hooks/api.ts`:

- **Base URL**: `https://stock.engenhariadigital.net/api`
- **Autenticação**: Token Bearer automático
- **Interceptors**: Para tratamento de erros e refresh de tokens

### Hooks Personalizados

- **`useToken`**: Gerenciamento de autenticação
- **`useStore`**: Operações de loja
- **`useUser`**: Gerenciamento de usuários

## 🎨 Sistema de Design

### Tema e Cores

O projeto utiliza um sistema de cores customizado definido em `app/colors.ts` e integrado com Tailwind CSS através de variáveis CSS personalizadas.

### Componentes

Todos os componentes UI seguem o padrão shadcn/ui, garantindo:
- **Acessibilidade** via Radix UI
- **Consistência** visual
- **Reutilização** de código
- **Customização** flexível

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é proprietário e confidencial. Todos os direitos reservados.

## 🆘 Suporte

Para suporte técnico ou dúvidas sobre o projeto, entre em contato através dos canais oficiais.

---

**ProStock** - Desenvolvido com ❤️ usando tecnologias modernas para gestão eficiente de estoque.