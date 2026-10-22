# Eco Grid — Entrega completa do frontend (Parte 2)

## Escopo e propriedade
Esta contribuição implementa a interface de dashboard do PIE ADS 4º período. Mantém inalterados `apps/api`, `packages/contracts`, `packages/simulator`, `packages/analytics` e `apps/web/src/features/analytics`. O módulo de análises/relatórios permanece a cargo do integrante 3.

## Funcionalidades do frontend
- Layout responsivo com menu lateral, cabeçalho, indicação do ambiente demonstrativo e navegação entre módulos.
- Visão geral: consumo registrado, custo estimado, cobertura de leituras, quantidade de equipamentos.
- Gráfico SVG acessível de consumo por dia UTC.
- Gráfico de barras horizontais de energia acumulada por equipamento.
- Inventário com nome, ambiente, potência nominal (W), consumo no período (kWh) e origem simulada.
- Histórico com gráfico e tabela diária.
- Indicadores de média diária, potência nominal total e leituras ausentes.
- Filtros por ambiente, data inicial/final exclusiva e tarifa fictícia, com validação de 31 dias.
- Estados de carregamento, falha de API, ausência de dados e cobertura parcial; botão de nova tentativa.
- Sem dependências de bibliotecas gráficas adicionais.

## Integração real com a base simulada
O frontend usa os endpoints já existentes:
- `GET /api/v1/environments`
- `GET /api/v1/devices?environmentId=...`
- `GET /api/v1/readings?from=...&to=...&environmentId=...`
- `GET /api/v1/summary?from=...&to=...&environmentId=...&tariffBrlPerKWh=...`

As agregações dos gráficos são realizadas sobre leituras recebidas da API, e não sobre números hardcoded. A API usa SQLite com seed fictícia.

## Executar e verificar
Requer Node.js 24.
```bash
git switch feature/dashboard-pie-semestre
npm ci
npm run db:seed
npm run check
npm test
npm run build
npm run dev
```
Abrir http://localhost:5173. Existe também o workflow `.github/workflows/frontend-ci.yml` para verificação automatizada no GitHub.

## Roteiro de apresentação
1. Mostrar aviso de dados simulados e explicar a arquitetura React → Fastify → SQLite.
2. Apresentar os quatro KPIs e a diferença entre kW (potência) e kWh (energia).
3. Navegar entre visão geral, equipamentos e histórico.
4. Filtrar por laboratório e observar a atualização dos gráficos e da tabela.
5. Alterar a tarifa fictícia e demonstrar a atualização do custo estimado.
6. Selecionar período sem leituras para demonstrar tratamento de ausência de dados.
7. Desligar a API local para demonstrar o estado de erro e o botão de nova tentativa.
8. Explicar que relatórios CSV e alertas pertencem ao módulo do outro integrante.

## Critérios de aceite
- O painel exibe resultados consistentes com `/api/v1/summary` e `/api/v1/readings`.
- A interface é utilizável em celular e desktop, com tabelas roláveis.
- Acessibilidade básica: navegação por teclado, estados de carregamento/erro, tabelas com cabeçalhos, gráficos com rótulos textuais.
- O grupo revisa o PR e executa `npm run check`, `npm test` e `npm run build` antes do merge.
- Não há alegação de economia real, monitoramento ao vivo ou controle físico de dispositivos.

## Limitações explícitas
Os dados são fictícios, com intervalo padrão 12–19/10/2026 UTC. O custo é kWh × tarifa fictícia, não fatura real. Não há linha de base validada para percentual de economia. O frontend não altera dispositivos nem fornece login. Não foi feito deploy público da API.

## Evidências
Código versionado, commits da branch e Pull Request #2. Testes unitários das agregações em `EnergyCharts.test.ts`. Execução efetiva do pipeline precisa ser conferida na aba Actions antes da aprovação.
