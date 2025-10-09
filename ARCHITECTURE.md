# Arquitetura - Dahua Connect Hub Frontend

## Visão Geral

Este documento descreve as decisões arquiteturais (ADRs - Architecture Decision Records) do frontend do Dahua Connect Hub, um gateway de integração web para conectar sistemas diversos à plataforma Dahua Technology.

---

## ADR-001: Escolha do Framework - React + TypeScript + Vite

**Data**: 2024

**Status**: ✅ Aceito

**Contexto**

Necessidade de desenvolver uma aplicação web moderna, performática e com desenvolvimento ágil para gerenciar integrações entre sistemas.

**Decisão**

Utilizar **React 18** com **TypeScript** e **Vite** como build tool.

**Justificativa**

- **React 18**: 
  - Ecosistema maduro e vasta comunidade
  - Hooks modernos para gerenciamento de estado
  - Performance otimizada com Concurrent Features
  
- **TypeScript**: 
  - Tipagem estática previne erros em tempo de desenvolvimento
  - Melhor IntelliSense e DX (Developer Experience)
  - Facilita manutenção e refatoração
  
- **Vite**: 
  - HMR (Hot Module Replacement) extremamente rápido
  - Build otimizado com Rollup
  - Suporte nativo a TypeScript e JSX

**Consequências**

✅ Positivas:
- Desenvolvimento rápido com HMR
- Código type-safe reduz bugs em produção
- Onboarding facilitado (stack popular)

⚠️ Negativas:
- Curva de aprendizado inicial com TypeScript
- Build size pode aumentar com dependências

**Alternativas Consideradas**
- Next.js: Descartado por não precisar de SSR
- Vue.js: Descartado por preferência da equipe por React
- Create React App: Descartado por performance inferior do Vite

---

## ADR-002: Sistema de Componentes - shadcn/ui (Radix UI + Tailwind)

**Data**: 2024

**Status**: ✅ Aceito

**Contexto**

Necessidade de componentes UI modernos, acessíveis e customizáveis sem lock-in de biblioteca.

**Decisão**

Utilizar **shadcn/ui** - componentes baseados em Radix UI estilizados com Tailwind CSS.

**Justificativa**

- **Ownership Total**: Componentes copiados para o projeto (não são dependência npm)
- **Acessibilidade**: Radix UI segue WAI-ARIA
- **Customização**: Controle total sobre estilo e comportamento
- **Tailwind Integration**: Styling consistente e utilitário
- **TypeScript First**: Todos componentes tipados

**Consequências**

✅ Positivas:
- Zero vendor lock-in
- Customização sem limites
- Bundle size controlado (tree-shaking)
- Componentes acessíveis out-of-the-box

⚠️ Negativas:
- Updates manuais dos componentes
- Mais arquivos no repositório

**Alternativas Consideradas**
- Material UI: Descartado por bundle size e dificuldade de customização
- Ant Design: Descartado por opinionated demais
- Chakra UI: Descartado por preferência de Tailwind

---

## ADR-003: Autenticação JWT com Context API

**Data**: 2024

**Status**: ✅ Aceito

**Contexto**

Necessidade de autenticação stateless, com informações do usuário disponíveis globalmente na aplicação.

**Decisão**

Implementar autenticação baseada em **JWT** armazenado em **localStorage**, com gerenciamento de estado via **React Context API**.

**Arquitetura**

```typescript
┌─────────────┐
│ LoginForm   │
│             │
│  credentials│
└──────┬──────┘
       │
       ↓ POST /login
┌─────────────────┐
│   Backend API   │
│  Returns JWT    │
└────────┬────────┘
         │
         ↓ JWT
┌──────────────────┐
│  AuthContext     │
│  - Decode JWT    │
│  - Store token   │
│  - Expose user   │
└────────┬─────────┘
         │
         ↓ userData
┌──────────────────┐
│  Components      │
│  - useAuth()     │
│  - userData      │
│  - company       │
└──────────────────┘
```

**JWT Payload**
```json
{
  "id": "user-id",
  "email": "user@email.com",
  "name": "User Name",
  "company": "stralog", // ou "intercomm"
  "exp": 1234567890
}
```

**Interceptors Axios**
```typescript
// Request: Adiciona token
config.headers.Authorization = `Bearer ${token}`

// Response: Remove token em 401
if (error.response.status === 401) {
  localStorage.removeItem('token')
}
```

**Justificativa**

- Stateless: Backend não precisa gerenciar sessões
- Escalável: Funciona com múltiplas instâncias do backend
- Multi-tenancy: Campo `company` identifica cliente
- Auto-refresh: Validação de `exp` no client-side

**Consequências**

✅ Positivas:
- Implementação simples e eficaz
- Não precisa de estado global complexo (Redux, Zustand)
- Token facilmente compartilhado entre tabs (localStorage)

⚠️ Negativas:
- Vulnerável a XSS (mitigado por sanitização de inputs)
- Não persiste entre clear browser data
- Logout não invalida token no backend

**Segurança**
- ✅ HTTPS obrigatório em produção
- ✅ Tokens com expiração curta
- ✅ Sanitização de inputs
- ⚠️ Considerar httpOnly cookies para maior segurança (ADR futuro)

---

## ADR-004: Arquitetura em Camadas (Service → Hook → Component)

**Data**: 2024

**Status**: ✅ Aceito

**Contexto**

Necessidade de separação de responsabilidades, facilitar testes e manutenção do código.

**Decisão**

Implementar arquitetura em 3 camadas: **Service Layer**, **Hook Layer** e **Component Layer**.

**Diagrama de Fluxo**

```
┌─────────────────────────────────────────┐
│          Component Layer                │
│  (UI, Eventos, Renderização)           │
│                                         │
│  const { data, loading } = useInbounds()│
│  <InboundTable data={data} />           │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│           Hook Layer                    │
│  (Estado, Lógica de Negócio)           │
│                                         │
│  const [data, setData] = useState()     │
│  const result = await service.get()     │
│  return { data, loading, error }        │
└─────────────────┬───────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────┐
│          Service Layer                  │
│  (Comunicação API, Transformação Data) │
│                                         │
│  export const inboundService = {        │
│    getInboundFiles: async () => {...}   │
│  }                                      │
└─────────────────┬───────────────────────┘
                  │
                  ↓
           ┌──────────────┐
           │  Backend API │
           └──────────────┘
```

**Responsabilidades**

1. **Service Layer** (`src/services/`)
   - Chamadas HTTP (Axios)
   - Transformação de dados
   - Tratamento de erros HTTP
   - Tipagem de requests/responses

2. **Hook Layer** (`src/hooks/`)
   - Gerenciamento de estado local
   - Lógica de negócio
   - Side effects (useEffect)
   - Exposição de métodos (refresh, paginate)

3. **Component Layer** (`src/pages/`, `src/components/`)
   - Renderização UI
   - Eventos de usuário
   - Composição de componentes
   - Mínima lógica (apenas apresentação)

**Exemplo Completo - Inbound**

```typescript
// 1. Service Layer
// src/services/inbound.service.ts
export const inboundService = {
  getInboundFiles: async (page: number, limit: number): Promise<InboundList> => {
    const response = await api.get(`/api/v1/inbound?page=${page}&limit=${limit}`)
    return response.data
  }
}

// 2. Hook Layer
// src/hooks/useInbounds.ts
export const useInbounds = (initialPage = 1, initialLimit = 50) => {
  const [data, setData] = useState<InboundList | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchInbounds = async () => {
    setLoading(true)
    const result = await inboundService.getInboundFiles(page, limit)
    setData(result)
    setLoading(false)
  }
  
  useEffect(() => { fetchInbounds() }, [page])
  
  return { data, loading, error, goToPage, refresh }
}

// 3. Component Layer
// src/pages/inbound/Inbound.tsx
export default function Inbound() {
  const { data, loading, error, goToPage } = useInbounds()
  
  return (
    <InboundTable 
      data={data} 
      loading={loading} 
      error={error}
      onPageChange={goToPage}
    />
  )
}
```

**Justificativa**

- **Testabilidade**: Cada camada pode ser testada isoladamente
- **Reusabilidade**: Hooks podem ser usados em múltiplos componentes
- **Manutenibilidade**: Mudanças em API afetam apenas Service Layer
- **Separação de Responsabilidades**: Cada camada tem propósito claro

**Consequências**

✅ Positivas:
- Código organizado e previsível
- Fácil onboarding de novos devs
- Refatoração segura
- Testes unitários simplificados

⚠️ Negativas:
- Mais arquivos (overhead inicial)
- Pode parecer over-engineering em features simples

---

## ADR-005: Multi-Tenancy - Suporte a Múltiplos Clientes (Stralog e Intercomm)

**Data**: Outubro 2025

**Status**: ✅ Aceito

**Contexto**

O sistema precisa suportar diferentes clientes (Stralog e Intercomm) com comportamentos e interfaces distintos, compartilhando a mesma base de código.

**Decisão**

Implementar **multi-tenancy baseado em campo `company`** do JWT, com renderização condicional e endpoints dinâmicos.

**Arquitetura**

```typescript
┌─────────────────────────────────────────────┐
│              Login                          │
│  User seleciona: "Stralog" ou "Intercomm"  │
└─────────────────────┬───────────────────────┘
                      │
                      ↓ company: "stralog" | "intercomm"
┌─────────────────────────────────────────────┐
│           Backend Auth                      │
│  JWT.sign({ ..., company: "stralog" })      │
└─────────────────────┬───────────────────────┘
                      │
                      ↓ JWT with company
┌─────────────────────────────────────────────┐
│          AuthContext                        │
│  userData.company = "stralog" | "intercomm" │
└─────────────────────┬───────────────────────┘
                      │
          ┌───────────┴────────────┐
          ↓                        ↓
┌──────────────────┐      ┌─────────────────┐
│  UI Condicional  │      │ Endpoints       │
│                  │      │ Dinâmicos       │
│  {company !==    │      │                 │
│   'intercomm' && │      │ company ===     │
│   <Column />}    │      │  'intercomm' ?  │
└──────────────────┘      │  /intercomm/... │
                          │  : /stralog/... │
                          └─────────────────┘
```

**Diferenças entre Clientes**

| Feature | Stralog | Intercomm |
|---------|---------|-----------|
| **Endpoint Process** | `/api/v1/inbound/stralog/process` | `/api/v1/inbound/intercomm/process` |
| **Campo `invoiceRequested`** | ✅ Sim | ❌ Não |
| **Coluna "Invoice Requested"** | ✅ Visível | ❌ Oculta |
| **Campos Retornados** | Todos | Sem `invoiceRequested` |

**Implementação**

**1. Login com Company**
```typescript
// src/components/LoginForm.tsx
<Select name="company">
  <SelectItem value="stralog">Stralog</SelectItem>
  <SelectItem value="intercomm">Intercomm</SelectItem>
</Select>
```

**2. Endpoints Dinâmicos**
```typescript
// src/services/inbound.service.ts
processScan: async (company?: string) => {
  const endpoint = company === 'intercomm' 
    ? '/api/v1/inbound/intercomm/process'
    : '/api/v1/inbound/stralog/process'
  
  return await api.post(endpoint)
}
```

**3. UI Condicional**
```typescript
// src/pages/inbound/components/InboundTable.tsx
{company !== 'intercomm' && (
  <TableHead>Invoice Requested</TableHead>
)}

{company !== 'intercomm' && (
  <TableCell>{getBooleanBadge(item.invoiceRequested)}</TableCell>
)}
```

**4. Interface TypeScript**
```typescript
// src/interfaces/inbound/inbound.ts
export interface InboundItem {
  processId: string
  sourceFileName: string
  invoiceRequested?: boolean  // ⚠️ OPCIONAL - apenas Stralog
  invoiceReceived: boolean
  invoiceToStralog: boolean
  invoiceToIntercomm: boolean
  // ...
}
```

**Regras de Implementação**

1. ✅ **SEMPRE usar lowercase**: `"stralog"` e `"intercomm"` (nunca UPPERCASE)
2. ✅ **Company sempre opcional**: `company?: string` (pode ser undefined)
3. ✅ **Condicional negativa para Intercomm**: `company !== 'intercomm'` (Stralog é default)
4. ✅ **Tipagem permissiva**: Campos específicos de cliente devem ser opcionais
5. ✅ **Passar company via props**: De AuthContext → Page → Components

**Fluxo de Dados**

```typescript
// 1. AuthContext expõe company
const { userData } = useAuth()
const company = userData?.company // "stralog" | "intercomm" | undefined

// 2. Page passa para componentes
<InboundTable company={company} />
<RunScanModal company={company} />

// 3. Componentes usam condicionalmente
{company !== 'intercomm' && <StralogOnlyFeature />}

// 4. Services recebem company
await inboundService.processScan(company)
```

**Justificativa**

- **Single Codebase**: Evita duplicação de código
- **Escalável**: Fácil adicionar novos clientes
- **Type-Safe**: TypeScript garante tipos corretos
- **Manutenível**: Mudanças centralizadas

**Consequências**

✅ Positivas:
- Código compartilhado reduz bugs
- Onboarding de novo cliente é rápido
- Mantém consistência visual entre clientes
- Backend controla dados por JWT (seguro)

⚠️ Negativas:
- Componentes podem ficar complexos com muitas condições
- Difícil testar todos os cenários de multi-tenancy
- Risco de mostrar dados errados se condicional falhar

**Mitigações**
- ✅ Testes específicos por cliente
- ✅ TypeScript força tipagem correta
- ✅ Backend sempre valida company do JWT (não confia no frontend)

**Evolução Futura**

Se número de clientes crescer (>3), considerar:
- **ADR futuro**: Strategy Pattern ou Feature Flags
- Componentes separados por cliente (`/stralog/InboundTable`, `/intercomm/InboundTable`)
- Config-driven UI (JSON define campos/colunas por cliente)

---

## ADR-006: Paginação Server-Side

**Data**: 2024

**Status**: ✅ Aceito

**Contexto**

Listagens de inbound/outbound/products podem ter milhares de registros. Carregar tudo de uma vez impacta performance.

**Decisão**

Implementar **paginação server-side** com controle de estado no frontend.

**Implementação**

```typescript
// Hook gerencia página atual e limit
const [page, setPage] = useState(1)
const [limit, setLimit] = useState(50)

// Busca dados quando página muda
useEffect(() => {
  fetchData(page, limit)
}, [page, limit])

// Backend retorna pagination metadata
interface InboundList {
  data: InboundItem[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Componente renderiza controles
<Pagination>
  <PaginationPrevious onClick={() => goToPage(page - 1)} />
  <PaginationLink onClick={() => goToPage(n)}>{n}</PaginationLink>
  <PaginationNext onClick={() => goToPage(page + 1)} />
</Pagination>
```

**Justificativa**

- Performance: Carrega apenas dados necessários
- UX: Resposta rápida mesmo com milhares de registros
- Backend controla: Validação de página/limit

**Consequências**

✅ Positivas:
- Aplicação escalável
- Menor uso de memória
- Tempo de resposta consistente

⚠️ Negativas:
- Estado adicional no frontend
- Não funciona offline

---

## ADR-007: Tratamento de Erros Centralizado com Axios Interceptors

**Data**: 2024

**Status**: ✅ Aceito

**Contexto**

Necessidade de tratamento consistente de erros HTTP em toda aplicação.

**Decisão**

Utilizar **Axios Interceptors** para tratamento global de erros, com handling específico por componente quando necessário.

**Implementação**

```typescript
// Global: Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Redirecionar para login
    }
    return Promise.reject(error)
  }
)

// Específico: Componente
try {
  await service.action()
} catch (err: unknown) {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosError = err as AxiosError
    if (axiosError.response?.status === 422) {
      // Tratar erro específico
    }
  }
  setError(err instanceof Error ? err.message : 'Generic error')
}
```

**Justificativa**

- **Global**: 401 sempre remove token (segurança)
- **Local**: Componentes decidem como mostrar erro ao usuário
- **Type-safe**: Verificação de tipo antes de acessar propriedades

---

## Padrões de Código

### Estrutura de Componente Padrão

```typescript
// 1. Imports (ordem: React → Libs → UI → Local)
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"
import { useAuth } from "@/contexts/authContexts"
import type { MyInterface } from "@/interfaces/my-interface"

// 2. Interface de Props
interface MyComponentProps {
  data: MyData
  onAction: () => void
}

// 3. Helpers/Utils internos (opcional)
const formatDate = (date: string) => new Date(date).toLocaleDateString()

// 4. Componente
export default function MyComponent({ data, onAction }: MyComponentProps) {
  // 4.1 Hooks (ordem: context → state → effects)
  const { userData } = useAuth()
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    // ...
  }, [])
  
  // 4.2 Handlers
  const handleClick = () => {
    // ...
  }
  
  // 4.3 Renders condicionais (opcional)
  if (loading) return <Loader />
  
  // 4.4 JSX
  return (
    <div>
      {/* ... */}
    </div>
  )
}
```

### Nomenclatura

- **Componentes**: `PascalCase` - `InboundTable.tsx`
- **Hooks**: `camelCase + use prefix` - `useInbounds.ts`
- **Services**: `camelCase + .service suffix` - `inbound.service.ts`
- **Interfaces**: `PascalCase + descritivo` - `InboundTableProps`
- **Handlers**: `handle + Evento` - `handleClick`, `handleSubmit`
- **Booleans**: `is/has/should + Estado` - `isLoading`, `hasError`

---

## Decisões Futuras (To-Do)

### ADR-008: State Management Global (Pendente)

**Contexto**: Se complexidade crescer, Context API pode não ser suficiente.

**Opções**:
- Zustand (leve, fácil)
- Redux Toolkit (robusto, verbose)
- Jotai (atômico, moderno)

**Critérios de Decisão**:
- Quando houver >5 contexts diferentes
- Quando houver estado compartilhado complexo entre páginas

### ADR-009: Internacionalização (Pendente)

**Contexto**: Suporte a múltiplos idiomas.

**Opções**:
- react-i18next
- react-intl

### ADR-010: Testes (Pendente)

**Contexto**: Garantir qualidade e evitar regressões.

**Opções**:
- Vitest + React Testing Library (unit)
- Playwright/Cypress (E2E)

---

## Diagrama de Arquitetura Geral

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                    │
│                                                         │
│  ┌───────────────────────────────────────────────────┐ │
│  │              Pages & Components                   │ │
│  │  (UI, Events, Conditional Rendering)              │ │
│  └───────────────────────┬───────────────────────────┘ │
│                          │                             │
│  ┌───────────────────────▼───────────────────────────┐ │
│  │              Custom Hooks                         │ │
│  │  (State, Business Logic, Side Effects)            │ │
│  └───────────────────────┬───────────────────────────┘ │
│                          │                             │
│  ┌───────────────────────▼───────────────────────────┐ │
│  │              Services                             │ │
│  │  (API Calls, Data Transformation)                 │ │
│  └───────────────────────┬───────────────────────────┘ │
│                          │                             │
│  ┌───────────────────────▼───────────────────────────┐ │
│  │       Axios Instance (Interceptors)               │ │
│  │  - Add Bearer Token                               │ │
│  │  - Handle 401 (Remove Token)                      │ │
│  └───────────────────────┬───────────────────────────┘ │
└──────────────────────────┼───────────────────────────────┘
                           │
                           │ HTTP/REST
                           │
┌──────────────────────────▼───────────────────────────────┐
│                   Backend API                            │
│                                                          │
│  - JWT Authentication                                    │
│  - Multi-tenancy (company field)                        │
│  - Business Logic                                        │
│  - Database                                              │
└──────────────────────────────────────────────────────────┘
```

---

## Referências

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Guide](https://vitejs.dev/guide/)
- [JWT.io](https://jwt.io/)

---

## Changelog de Arquitetura

| Data | ADR | Mudança | Autor |
|------|-----|---------|-------|
| Out/2025 | ADR-005 | Multi-tenancy Stralog/Intercomm | Leo Benevenuto |
| 2024 | ADR-001 a ADR-004 | Arquitetura inicial | Time Dahua |

---

**Última Atualização**: Outubro 2025

