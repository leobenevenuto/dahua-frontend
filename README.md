# Dahua Connect Hub - Frontend

Gateway de Integração da Dahua para conectar diversos sistemas através de API Rest e SFTP.

## Sobre o Projeto

O Dahua Connect Hub é um sistema web moderno desenvolvido para facilitar a integração entre diversos sistemas e a plataforma Dahua Technology. O frontend oferece uma interface intuitiva para gerenciar integrações, monitorar conexões e administrar o gateway.

## Tecnologias Utilizadas

- **React 18** - Biblioteca para construção da interface
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes de interface modernos
- **React Router** - Roteamento do lado cliente
- **React Hook Form** - Gerenciamento de formulários
- **Lucide React** - Ícones SVG

## Requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

## Instalação e Execução

1. Clone o repositório:
```bash
git clone <URL_DO_REPOSITORIO>
```

2. Entre no diretório do projeto:
```bash
cd dahua-frontend
```

3. Instale as dependências:
```bash
npm install
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:8080`

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run build:dev` - Cria o build em modo desenvolvimento
- `npm run lint` - Executa o linter ESLint
- `npm run preview` - Visualiza o build de produção

## Estrutura do Projeto

```
src/
├── components/         # Componentes React reutilizáveis
│   ├── ui/            # Componentes base (shadcn/ui)
│   ├── AppSidebar.tsx # Barra lateral principal
│   ├── LoginForm.tsx  # Formulário de login
│   └── MainLayout.tsx # Layout principal
├── pages/             # Páginas da aplicação
│   ├── Dashboard.tsx  # Painel principal
│   ├── Index.tsx      # Página inicial
│   └── ProductRegistration.tsx
├── hooks/             # Custom hooks React
├── lib/              # Utilitários e configurações
└── assets/           # Imagens e recursos estáticos
```

## Funcionalidades

- ✅ Sistema de autenticação
- ✅ Dashboard administrativo
- ✅ Interface responsiva
- ✅ Navegação intuitiva
- ✅ Componentes modernos e acessíveis
- 🔄 Registro de produtos (em desenvolvimento)
- 🔄 Monitoramento de integrações (em desenvolvimento)

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto é propriedade da Dahua Technology.
