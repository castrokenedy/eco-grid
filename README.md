# ⚡ EcoGrid — Plataforma Inteligente de Monitoramento Energético

![EcoGrid Banner](https://img.shields.io/badge/EcoGrid-Gestão%20Energética-22c55e?style=for-the-badge&logo=lightning&logoColor=white)
![Status](https://img.shields.io/badge/Status-MVP%20Ativo-22c55e?style=for-the-badge)
![Curso](https://img.shields.io/badge/Curso-ADS-2dd4bf?style=for-the-badge)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Online-38bdf8?style=for-the-badge)

> Plataforma SaaS corporativa para monitoramento e gestão inteligente de energia elétrica.  
> Dashboards em tempo real, automação IoT e relatórios de eficiência energética.

---

## 🌐 Demo ao vivo

**👉 [Acesse o EcoGrid aqui](https://castrokenedy.github.io/ecogrid/)**

> Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub após publicar via GitHub Pages.

---

## 📋 Sobre o Projeto

O **EcoGrid** é um Projeto Integrador desenvolvido no curso de **Análise e Desenvolvimento de Sistemas**, com o objetivo de criar uma plataforma web funcional para monitoramento e gestão energética corporativa.

### Problema que resolve
- ❌ Alto desperdício energético por falta de controle
- ❌ Ausência de monitoramento centralizado
- ❌ Tomada de decisão sem dados reais
- ❌ Contas de energia crescendo sem mecanismo de contenção

### Solução proposta
- ✅ Dashboard analítico em tempo real
- ✅ KPIs de consumo, economia e eficiência
- ✅ Gestão centralizada de dispositivos
- ✅ Alertas automáticos de anomalias
- ✅ Relatórios e comparativos históricos

---

## 🗂️ Estrutura do Projeto

```
ecogrid/
├── index.html          # Landing page + Dashboard preview
├── css/
│   └── style.css       # Estilos completos (dark theme, responsivo)
├── js/
│   └── main.js         # Lógica, gráficos e interatividade
├── assets/             # Imagens e ícones (se houver)
├── README.md           # Este arquivo
└── .gitignore
```

---

## 🚀 Como rodar localmente

### Opção 1 — Abrir direto no navegador
1. Faça o clone do repositório:
```bash
git clone https://github.com/SEU-USUARIO/ecogrid.git
cd ecogrid
```
2. Abra o arquivo `index.html` no seu navegador.

### Opção 2 — Usar extensão Live Server (VS Code)
1. Instale a extensão **Live Server** no VS Code
2. Clique com botão direito em `index.html` → **Open with Live Server**

### Opção 3 — Python HTTP Server
```bash
python -m http.server 8080
# Acesse: http://localhost:8080
```

---

## 🌐 Publicar no GitHub Pages

1. Faça push do projeto para um repositório público no GitHub
2. Vá em **Settings → Pages**
3. Em **Branch**, selecione `main` e pasta `/` (root)
4. Clique em **Save**
5. Aguarde alguns minutos — o link ficará disponível em:  
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia | Finalidade |
|--------|-----------|------------|
| Frontend | HTML5 + CSS3 | Estrutura e estilização |
| Interatividade | JavaScript (ES6+) | Lógica e animações |
| Gráficos | Chart.js 4 | Dashboards analíticos |
| Tipografia | Google Fonts (Syne + DM Sans) | Design moderno |
| Deploy | GitHub Pages | Hospedagem gratuita |
| Banco (futuro) | PostgreSQL + Supabase | Persistência de dados |
| Backend (futuro) | Node.js + Express | API RESTful |
| IoT (futuro) | MQTT + ESP32 | Integração com hardware |

---

## 📊 Funcionalidades da Interface

### Landing Page
- [x] Hero section com animações
- [x] Seção de problema
- [x] Seção de solução com fluxograma interativo
- [x] Seção de benefícios
- [x] Preview interativo do dashboard
- [x] Stack tecnológico
- [x] CTA final
- [x] Responsivo (mobile, tablet, desktop)

### Dashboard Preview
- [x] KPIs: consumo atual, economia, dispositivos, alertas
- [x] Gráfico de consumo das últimas 24h
- [x] Gráfico de distribuição por setor (Doughnut)
- [x] Tab de Analytics com barras + linha
- [x] Tab de Gestão de Dispositivos (tabela)
- [x] Contadores animados
- [x] Sidebar de navegação simulada

---

## 🗺️ Roadmap

| Fase | Status | Descrição |
|------|--------|-----------|
| Fase 1 — MVP | ✅ Concluída | Protótipos, dashboard, landing page, documentação |
| Fase 2 — Backend | 🔜 Planejada | API REST, banco de dados, autenticação |
| Fase 3 — IoT | 🔜 Planejada | Integração ESP32, MQTT, sensores reais |
| Fase 4 — Automação | 🔜 Planejada | Regras automáticas, alertas por e-mail/push |
| Fase 5 — SaaS | 🔜 Planejada | Multitenancy, expansão HubControl |

---

## 👥 Equipe

| Nome | Função |
|------|--------|
| [Nome 1] | Desenvolvimento Frontend |
| [Nome 2] | Documentação Técnica |
| [Nome 3] | Design e Prototipação |
| [Nome 4] | Banco de Dados e Arquitetura |

---

## 📄 Documentação

- 📋 [Documentação Técnica (PDF)](./docs/eco_grid_documentacao_tecnica.pdf)
- 🎨 [Protótipos (Readdy)](https://readdy.cc/preview/abcc31fe-7527-4a8d-a38d-ad01b46c9a96/10596731/)

---

## 🎓 Informações Acadêmicas

- **Curso:** Análise e Desenvolvimento de Sistemas
- **Disciplina:** Projeto Integrador Empresarial (PIE)
- **Instituição:** [Nome da Instituição]
- **Ano:** 2026

---

## 📝 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte do Projeto Integrador Empresarial.

---

<p align="center">
  Desenvolvido com ⚡ pela equipe <strong>EcoGrid</strong>
</p>
