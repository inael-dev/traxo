# Traxo

> **Treine. Supere. Evolua.**
> A ficha de treino digital para academias que querem sair do papel.

Traxo é um SaaS B2B para academias de ginástica. O dono da academia assina, o personal monta as fichas, o aluno abre no celular e registra cada série. Simples assim.

---

## Personas

| Role | Quem é | O que faz |
|---|---|---|
| **SuperAdmin** | Inael (fundador) | Gerencia todas as academias, planos, cobrança e suporte |
| **Admin** | Dono / gestor da academia | Configura a academia, convida personais e alunos, acompanha métricas |
| **Personal** | Profissional de EF | Monta fichas, ajusta cargas, monitora evolução dos alunos |
| **Aluno** | Quem treina | Acessa a própria ficha, registra séries e acompanha histórico |

---

## Fluxo de Onboarding da Academia

### Entrada pelo site (futuro, automatizado)
1. Dono acessa **traxo.app** e clica em "Quero para minha academia"
2. Preenche nome da academia, CNPJ/CPF e escolhe o plano
3. Paga via cartão de crédito (recorrência mensal)
4. Sistema cria o tenant da academia e envia credenciais de Admin por e-mail
5. Acesso liberado na hora

### Entrada manual (MVP — via SuperAdmin)
1. SuperAdmin cadastra a academia no painel interno
2. Gera o link exclusivo da academia: `traxo.app/convite/academia-xyz`
3. Envia o link pro dono

### Cadastro dos alunos
- **Via link público:** Dono/personal compartilha link de convite no grupo do WhatsApp da academia → aluno clica, se cadastra com nome + número de WhatsApp (sem precisar de e-mail), conta criada instantaneamente
- **Via personal:** Personal abre o painel, digita nome + número do aluno e cria a conta manualmente em segundos — ideal pra academias onde o personal já tem o WhatsApp de todo mundo

---

## White-Label por Academia

Cada academia tem sua identidade dentro do app:

- Logo própria no header e splash screen
- Nome da academia exibido no app
- Cor de destaque configurável (alinhada à identidade visual da academia)
- URL personalizada: `traxo.app/academia-xyz` ou subdomínio futuro `academia-xyz.traxo.app`

---

## Funcionalidades por Role

### SuperAdmin
- [ ] Dashboard geral: academias ativas, MRR, churn, alunos totais
- [ ] Criar / suspender / reativar academias
- [ ] Ver logs de uso por tenant
- [ ] Ajustar planos e limites manualmente
- [ ] Painel de cobrança (ver status de pagamentos)

### Admin (Academia)
- [ ] Configurar perfil da academia (logo, cor, nome)
- [ ] Gerar e revogar links de convite
- [ ] Cadastrar personais e alunos manualmente
- [ ] Visualizar painel de alunos ativos/inativos
- [ ] Ver histórico de treinos de qualquer aluno
- [ ] Receber alerta quando limite do plano estiver próximo

### Personal
- [ ] Ver lista de alunos vinculados
- [ ] Criar ficha de treino por aluno (treinos A/B/C ou estrutura livre)
- [ ] Definir exercícios, séries, repetições, carga e descanso
- [ ] Clonar fichas entre alunos
- [ ] Acompanhar evolução de carga ao longo do tempo
- [ ] Editar fichas existentes

### Aluno
- [ ] Acessar ficha do dia (baseada na grade semanal definida pelo personal)
- [ ] Registrar séries concluídas com carga usada
- [ ] Timer de descanso automático entre séries
- [ ] Ver detalhes do exercício (GIF de execução, grupos musculares)
- [ ] Histórico completo de treinos com duração e séries
- [ ] Ver evolução de carga por exercício (gráfico futuro)

---

## Planos e Preços

| Plano | Preço | Alunos incluídos | Personais | Suporte |
|---|---|---|---|---|
| **Starter** | R$89/mês | até 60 | até 2 | E-mail |
| **Pro** | R$159/mês | até 200 | até 6 | E-mail + WhatsApp |
| **Plus** | R$249/mês | Ilimitado | Ilimitado | Prioritário |

### Cobrança automática por uso (overage)
- Se a academia ultrapassar o limite de alunos do plano, o sistema **não bloqueia** — cobra automaticamente o excedente na próxima fatura
- Taxa de overage: **R$1,50 por aluno adicional/mês**
- Admin recebe notificação ao atingir 80% do limite com opção de upgrade
- Upgrade de plano é imediato, cobrança proporcional (pro-rata)

### Desconto anual
- Pagamento anual: **2 meses grátis** (equivale a ~17% de desconto)

---

## Roadmap

### Fase 0 — MVP Interno (atual)
- [x] App funcional para uso pessoal
- [x] Fichas A/B/C com exercícios, séries e cargas
- [x] Registro de séries com timer de descanso
- [x] Histórico de treinos
- [x] Persistência no banco de dados (Neon + Drizzle)
- [x] PWA instalável no celular

### Fase 1 — MVP Multi-tenant (próximo)
- [ ] Sistema de autenticação (NextAuth ou Clerk)
  - Login com número de WhatsApp (OTP via SMS/WhatsApp)
  - Login com e-mail/senha para Admin e Personal
- [ ] Modelo de dados multi-tenant (isolamento por academia)
- [ ] Painel Admin da academia
- [ ] Painel do Personal com gestão de alunos
- [ ] Link de convite com código único por academia
- [ ] White-label: logo e cor por academia
- [ ] SuperAdmin básico (criar/gerenciar academias)

### Fase 2 — Cobrança e Automação
- [ ] Integração com Stripe (cartão de crédito recorrente)
- [ ] Planos com limites e overage automático
- [ ] E-mail de boas-vindas automatizado
- [ ] Notificação de limite de alunos próximo
- [ ] Self-service: academia se cadastra e paga sozinha no site
- [ ] Dashboard financeiro no SuperAdmin (MRR, churn, novos clientes)

### Fase 3 — Produto
- [ ] Notificações push (lembrete de treino do dia)
- [ ] Gráfico de evolução de carga por exercício
- [ ] Comentários do personal na ficha do aluno
- [ ] Ficha livre (personal monta exercício por exercício, sem estrutura A/B/C)
- [ ] Exportar relatório de evolução do aluno em PDF
- [ ] App nativo (React Native) — se tração justificar

### Fase 4 — Escala
- [ ] Subdomínio personalizado por academia (`minhaacademia.traxo.app`)
- [ ] API pública para integração com sistemas de gestão (Acad.me, etc.)
- [ ] Marketplace de fichas (personais vendem fichas prontas)
- [ ] Programa de indicação (academia indica outra, ganha desconto)

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16 App Router, React 19, Tailwind CSS 4 |
| Backend | Next.js Server Actions, API Routes |
| Banco de dados | PostgreSQL (Neon serverless) |
| ORM | Drizzle ORM |
| Autenticação | Clerk ou NextAuth.js (a definir) |
| Pagamentos | Stripe (recorrência + overage) |
| Notificações | WhatsApp Business API (Z-API ou Twilio) |
| Deploy | Vercel |
| PWA | Service Worker + Web App Manifest |

---

## Modelo de Dados (multi-tenant)

```
tenants (academias)
  └── users (admin, personal, aluno) — isolados por tenant
        └── workout_configs (fichas A/B/C por aluno)
              └── workout_sessions (treinos realizados)
                    └── session_sets (séries registradas)

tenant_plans (plano contratado, limite de alunos, data renovação)
tenant_branding (logo, cor, nome exibido)
invite_links (código único, expira em X dias, max usos)
```

---

## Por que Traxo?

As academias de bairro faturam em média **R$10.500/mês** com 150 alunos. A ficha de papel tem custo oculto real: tempo do personal, fichas perdidas, sem histórico, sem dados. Traxo cobra **1,5% desse faturamento** e entrega profissionalização imediata. O personal vende mais, o aluno fica mais tempo, a academia retém melhor.

O mercado só em Fortaleza tem **3.000–4.000 academias**. Converter 2% = **R$4.770 MRR**. Converter 10% = **R$23.850 MRR**. Sem sair da cidade.

---

## Dev Setup

```bash
# Instalar dependências
npm install

# Variáveis de ambiente
cp .env.example .env.local
# Preencher DATABASE_URL e INAEL_USER_ID

# Rodar migrations
./node_modules/.bin/drizzle-kit migrate

# Seed inicial
./node_modules/.bin/tsx lib/db/seed.ts

# Dev server
npm run dev
```

---

*Traxo — construído em Fortaleza, CE.*
