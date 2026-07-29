---
name: Guitar Harmony Study
description: Console de estúdio escuro onde o braço do violão é o instrumento e a cor carrega função harmônica
colors:
  bg-void: "#06060f"
  bg-deep: "#0c0c1d"
  bg-surface: "#111128"
  text-primary: "#e8e8f0"
  text-secondary: "#8b8ba8"
  text-muted: "#5a5a78"
  accent-indigo: "#6366f1"
  accent-indigo-lit: "#818cf8"
  tone-tonica: "#f59e0b"
  tone-terca: "#f43f5e"
  tone-quinta: "#06b6d4"
  tone-setima: "#a855f7"
  tone-neutra: "#38bdf8"
  alert-red: "#ef4444"
  alert-red-lit: "#fca5a5"
  wood-deep: "#1a0f08"
  wood-lit: "#3d2415"
  string-brass: "#c9a96e"
  string-steel: "#a3a3a3"
  nut-bone: "#d4d4d8"
  glass-bg: "rgba(17, 17, 40, 0.65)"
  glass-border: "rgba(255, 255, 255, 0.08)"
typography:
  display:
    fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "3.2rem"
    fontWeight: 700
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "2.8rem"
    fontWeight: 700
    letterSpacing: "-0.02em"
  title:
    fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
  body:
    fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
  label:
    fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    letterSpacing: "0.08em"
  measure:
    fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8rem"
    fontWeight: 500
rounded:
  sm: "4px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  2xl: "16px"
  pill: "20px"
  circle: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.accent-indigo}"
    textColor: "#ffffff"
    rounded: "{rounded.xl}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.accent-indigo-lit}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "8px 18px"
  button-ghost-hover:
    textColor: "{colors.text-primary}"
  circle-sector:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.text-secondary}"
    typography: "{typography.measure}"
  circle-sector-active:
    backgroundColor: "{colors.accent-indigo}"
    textColor: "#ffffff"
  mode-tab:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  mode-tab-active:
    backgroundColor: "{colors.accent-indigo}"
    textColor: "#ffffff"
  chip-diatonic:
    backgroundColor: "rgba(255, 255, 255, 0.04)"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  chip-diatonic-active:
    backgroundColor: "rgba(99, 102, 241, 0.15)"
    textColor: "#ffffff"
  card-voice:
    backgroundColor: "rgba(0, 0, 0, 0.3)"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    padding: "12px"
  panel-glass:
    backgroundColor: "{colors.glass-bg}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.2xl}"
    padding: "24px"
  note-dot:
    rounded: "{rounded.circle}"
    size: "28px"
    typography: "{typography.label}"
---

# Design System: Guitar Harmony Study

## Overview

**Creative North Star: "O Console de Estúdio"**

Vidro escuro, ferragem metálica e LEDs coloridos por função. A tela é o painel de um instrumento de estúdio às duas da manhã: superfícies foscas e translúcidas que não competem por atenção, atravessadas por cor apenas onde a cor significa alguma coisa. O braço de madeira no centro é a única superfície orgânica do sistema — tudo ao redor dele é vidro, metal e escuro.

A atmosfera é de **instrumento de precisão**: contido, técnico, silencioso. Nada existe para agradar. Cada elemento na tela ou informa uma posição no braço, ou nomeia uma função harmônica, ou é um controle. Densidade é aceitável; ruído não é. Quando em dúvida entre adicionar clareza e adicionar respiro, este sistema escolhe clareza — mas nunca ao preço de perder a leitura à distância de estante de partitura.

A cor é o mecanismo pedagógico central, não estética. As quatro cores de intervalo (âmbar, rosa, ciano, roxo) ensinam o estudante a reconhecer tônica, terça, quinta e sétima por reflexo visual antes de reconhecê-las por teoria. Diluir esse código é diluir o produto.

**Key Characteristics:**
- Fundo preto liso (#06060f), sem halo ambiente e sem tingimento
- Painéis de vidro fosco (blur 16px) com borda branca a 8% de opacidade
- Quatro cores de intervalo com significado fixo e território delimitado
- Um único acento de UI: índigo (#6366f1), sempre chapado, nunca em gradiente
- Braço de madeira com gradiente de quatro paradas, cordas com calibre e cor decrescentes
- Bolinha de nota como peça pousada: cor chapada, aro escuro, sombra com deslocamento
- Mono (IBM Plex Mono) reservado ao que é medida: traste, corda, coordenada

## Colors

Paleta escura de base fria (índigo-azulada) cortada por quatro acentos saturados de função e uma única superfície quente — a madeira do braço.

### Primary
- **Índigo de Console** (#6366f1): o único acento de interface do sistema. Estado ativo de botão de tonalidade, aba de modo ativa, ponto de progresso do grau atual, anel de foco. Sempre como preenchimento chapado.
- **Índigo Aceso** (#818cf8): variante clara para texto sobre fundo escuro — algarismo romano, badge de grau, corda ligada. É o índigo quando precisa ser lido, não quando precisa ser fundo.

### Secondary
As quatro cores de intervalo. Não são uma paleta decorativa: são um código.

- **Âmbar Tônica** (#f59e0b): grau 1. Texto sobre ela é âmbar quase preto (#451a03).
- **Rosa Terça** (#f43f5e): grau 3. Texto sobre ela é vinho profundo (#4c0519).
- **Ciano Quinta** (#06b6d4): grau 5. Texto sobre ela é petróleo (#083344).
- **Roxo Sétima** (#a855f7): grau 7. Texto sobre ela é ameixa escura (#3b0764).
- **Azul Neutro** (#38bdf8): nota da escala que não pertence à tétrade. Deliberadamente fora da família das quatro — é a cor de "não é acorde".

### Tertiary
- **Madeira Profunda** (#1a0f08) → **Madeira Acesa** (#3d2415): o gradiente do braço, em quatro paradas a 135°. A única superfície quente e orgânica do sistema.
- **Latão de Corda** (#c9a96e): cordas graves (6, 5, 4), entorchadas.
- **Aço de Corda** (#a3a3a3): cordas agudas (3, 2, 1), lisas.
- **Osso de Rastilho** (#d4d4d8): o nut, em gradiente de três paradas.

### Neutral
- **Vazio** (#06060f): fundo do documento.
- **Profundo** (#0c0c1d) e **Superfície** (#111128): camadas de fundo acima do vazio.
- **Texto Primário** (#e8e8f0): valor legível — nome de nota, número de traste, rótulo de controle.
- **Texto Secundário** (#8b8ba8): rótulo de seção, contexto, estado de repouso de controle.
- **Texto Sutil** (#5a5a78): metadados que o estudante lê uma vez e ignora — número de traste no braço, nome do intervalo, dica de teclado no rodapé.

### Alerta
- **Vermelho de Aviso** (#ef4444) e **Vermelho Aceso** (#fca5a5): exclusivos do aviso de tocabilidade quando a abertura passa de 5 trastes. Nenhum outro uso.

### Named Rules

**A Regra do Braço.** As quatro cores de intervalo pertencem ao braço do violão e aos cards de voz. Nenhum botão, aba, chip de navegação ou badge fora desse território pode usá-las. Fora do braço elas são paleta livre; dentro dele são vocabulário e não se toca.

**A Regra da Voz Única.** Índigo é o único acento de interface. Se um elemento precisa chamar atenção e não é uma nota musical, ele é índigo — ou não chama atenção nenhuma.

**A Regra do Contraste Invertido.** Toda cor de intervalo tem um texto próprio, escurecido na mesma matiz (âmbar → #451a03). Nunca use branco ou preto puro sobre uma cor de intervalo.

## Typography

**Fonte de interface:** IBM Plex Sans (com `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, sans-serif), pesos 300 a 700.
**Fonte de medida:** IBM Plex Mono, pesos 400 a 600.

**Caráter:** desenhada para engenharia, não para marca. A Plex tem sotaque próprio nas terminações e nos numerais — o suficiente para o app não parecer um template, longe o bastante do bloco Inter/Geist/Jakarta em que a interface gerada por máquina converge. A personalidade vem do desenho da letra e do contraste de peso, nunca de efeito aplicado ao texto.

### Hierarchy
- **Display** (700, 3.2rem, `-0.02em`): o nome do acorde. É o maior elemento do app por decisão: é a resposta que o estudante procura.
- **Headline** (600, 2.8rem, `-0.02em`): o título do app no cabeçalho. Cai para 2rem abaixo de 768px.
- **Title** (700, 1.5rem): título de painel de configuração.
- **Body** (400, 1rem): valores lidos — nome de nota nos cards, contexto de tonalidade.
- **Label** (600, 0.85rem, `0.08em`, caixa alta): rótulo de seção. É o único uso de caixa alta no sistema.
- **Measure** (Mono, 500, 0.65–0.8rem): número de traste, rótulo de corda solta, coordenada do chip. Tudo que é posição medida no braço.

### Named Rules

**A Regra do Texto Chapado.** Nenhum texto recebe gradiente, brilho, sombra colorida ou preenchimento por imagem, em lugar nenhum, incluindo o título do app e o nome do acorde. Ênfase vem de tamanho, peso e cor sólida. Texto em gradiente é a assinatura mais reconhecível de interface gerada por máquina e este produto não a usa.

**A Regra do Mono Ganho.** Monoespaçada só onde o valor é medida física: traste, corda, coordenada de posição. Nunca como fantasia de "técnico" em rótulo, título ou texto corrido.

**A Regra do Peso 700.** Peso máximo (700) é reservado ao que nomeia uma nota ou um acorde: nome do acorde, nome da nota no card de voz, letra dentro da bolinha, nota do chip. Peso máximo significa "isto é uma altura musical".

## Layout

Container central de largura máxima 1280px com `padding: 24px 32px`, em coluna flex de altura mínima total da viewport — o rodapé é empurrado para baixo por `margin-top: auto`. O painel de configuração é mais estreito (640px), centrado, porque é um formulário e não uma bancada.

A área de exercício empilha seis blocos com `gap: 24px` numa ordem fixa e não negociável: barra de controle → painel de informação do modo → barra de voicing → braço → navegação → barra diatônica. A barra de voicing fica imediatamente acima do braço porque é o que ela altera. O braço é o centro de gravidade vertical; tudo acima dele contextualiza e tudo abaixo dele navega.

O ritmo de espaçamento não é uma escala estrita. Os passos dominantes são 4, 8, 12, 16, 24 e 32px, com valores intermediários (6, 10, 14, 20, 28) usados pontualmente onde o alinhamento óptico pediu. Trabalho novo deve preferir os passos dominantes.

**Responsivo:** existe um único ponto de quebra, em 768px, e ele faz cinco coisas: reduz o padding do container para 16px, reduz o título para 2rem, reduz o nome do acorde para 2.4rem, força os cards de voz em duas colunas fixas e esconde o texto dos botões de navegação (deixando só as setas). Não há tratamento abaixo de 768px além disso.

### Named Rules

**A Regra dos 900px.** O braço nunca comprime. `min-width: 900px` no container e rolagem horizontal no invólucro — 18 colunas de traste em menos que isso deixam de ser legíveis e deixam de ser um braço. Espremer o braço para caber na tela é a única forma garantida de quebrar este produto.

## Elevation & Depth

Sistema de **vidro plano**. Painéis são superfícies translúcidas (`rgba(17, 17, 40, 0.65)` com `backdrop-filter: blur(16px)`) com borda branca a 8% e uma sombra ambiente única e difusa (`0 8px 32px rgba(0, 0, 0, 0.4)`). Não há escala de elevação: todos os painéis vivem no mesmo plano. A separação entre eles vem da borda e do blur, não de altura.

Estado se comunica por **cor chapada, aro e posição** — nunca por brilho. Ativo é preenchimento índigo sólido; nota soando é aro branco de 3px; impraticável é borda e texto vermelhos. Nenhum elemento do sistema emite luz.

### Shadow Vocabulary
- **Ambiente de painel** (`0 8px 32px rgba(0, 0, 0, 0.4)`): a única sombra estrutural. Todo painel de vidro a usa, sem variação.
- **Peça pousada, curta** (`0 2px 6px rgba(0,0,0,0.55)` + aro `0 0 0 1.5px rgba(0,0,0,0.45)`): a bolinha de nota sobre a madeira. O aro é o que a separa do fundo; a sombra é o que a levanta.
- **Peça pousada, longa** (`0 4px 14px rgba(0,0,0,0.45)`): a bolinha da nota que está soando, junto do aro branco.
- **Profundidade do braço** (`inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.4)`): sombra interna que afunda a madeira e sombra externa que a levanta da página. É o único elemento com sombra interna.
- **Relevo de ferragem**: rastilho (`2px 0 6px`) e trastes (`-1px 0 4px` escuro + `1px 0 2px` branco a 10%) usam sombra direcional para simular metal saliente.

### Named Rules

**A Regra da Sombra com Direção.** Toda sombra tem deslocamento e desfoque, porque simula luz vinda de cima. Halo colorido de deslocamento zero é decoração pura — é o "dark glow" que faz interface escura parecer gerada por máquina, e não existe neste sistema.

**A Regra do Vidro Plano.** Todos os painéis vivem no mesmo plano. Não há escala de elevação; a separação vem da borda e do blur, não de altura.

## Shapes

Linguagem de canto arredondado em escala clara: 4px em elementos micro (tecla, barra de rolagem), 8px em controles secundários (botão fantasma, aba, campo de seleção), 10px em controles de escolha (botão de tonalidade, chip diatônico, chip de solfejo), 12px em ações e cards (botão primário, botão de navegação, card de voz), 16px em painéis de vidro. O raio cresce com a superfície: quanto maior o elemento, mais macio o canto.

O braço é a exceção geométrica: `border-radius: 0 4px 4px 0` — canto vivo do lado do rastilho, levemente macio do lado do corpo. É um objeto físico com uma extremidade que encosta em outra peça.

Bordas são sempre de 1px, sempre brancas com opacidade baixa (8% em repouso, 12–20% em hover). Não existe borda colorida fora dos estados de acento e de alerta.

### Named Rules

**A Regra do Círculo Sonoro.** Só o que soa é redondo. Bolinha de nota (28px) e ponto de progresso de grau (10px) são círculos perfeitos. Todo o resto do sistema é retângulo de canto arredondado. Marcadores de casa no braço também são círculos, mas em branco a 12% — eles marcam posição, não som.

## Components

### Buttons
- **Shape:** canto de 12px em ações primárias, 8px em secundárias.
- **Primary** (`Iniciar Exercício`): índigo chapado, texto branco, peso 700, `padding: 14px 32px`. No hover sobe 2px e a seta interna desliza 4px à direita. Sem halo.
- **Ghost** (`Voltar à Configuração`): fundo transparente, borda branca a 12%, texto secundário. No hover ganha fundo branco a 6% e o texto vira primário.
- **Disabled:** opacidade 0.4 e cursor bloqueado. Sem mudança de cor.
- **Todos:** transição `all 0.25s cubic-bezier(0.4, 0, 0.2, 1)`.

### Chips
- **Chip diatônico** (grau do campo harmônico): coluna com algarismo romano acima e cifra abaixo, fundo branco a 4%, borda de vidro, canto 10px, `flex: 1` com mínimo de 70px — os sete graus dividem a largura igualmente.
- **Estado ativo:** fundo índigo a 15%, borda índigo a 40%, e o algarismo romano vira Índigo Aceso. O chip ativo é deliberadamente mais discreto que os outros controles ativos, porque sete deles estão sempre visíveis.
- **Chip de solfejo:** mesma família, coluna de três linhas (número do passo, nota, coordenada em mono), mínimo de 72px em grade auto-fill. Ativo usa índigo chapado e `scale(1.08)`.
- **Círculo de quintas** (seletor de tonalidade): ver componente-assinatura abaixo. Substituiu a grade de botões de tonalidade.

### Barra de Voicing

Fica entre o painel de informação e o braço. Fundo preto a 30%, borda de vidro, canto 12px, `padding: 10px 16px`. Dois grupos de chips rotulados (corda do baixo, grau no baixo) e a família ativa (`drop-2` / `drop-3`) alinhada à direita em mono.

- **Chip:** mínimo de 44px de alvo — a cena "violão na mão" exige dedo ocupado e impreciso. Numeral em mono; o chip de inversão é mais largo e carrega o nome da inversão abaixo do numeral.
- **Indisponível:** combinação sem forma digitável fica `disabled` a 30% de opacidade, com `title` explicando. Desabilitar e dizer por quê é preferível a esconder a opção ou a oferecer uma forma impossível.

### Cards
- **Card de voz** (uma corda do acorde): canto 12px, fundo preto a 30%, borda de vidro, `padding: 12px`, centralizado. Conteúdo em quatro níveis: corda (0.75rem, sutil), nota (1.5rem, peso 700, **na cor do intervalo**), traste (0.8rem, secundário), intervalo (0.7rem, sutil, itálico no detalhe).
- **Hover:** sobe 2px, fundo branco a 8%, sombra `0 4px 14px`.
- **Grade:** `auto-fit` com mínimo de 130px; vira duas colunas fixas abaixo de 768px.

### Inputs
- **Select** (atribuição de intervalo por corda): fundo preto a 50%, borda de vidro, canto 8px, seta SVG embutida como data-URI em Texto Secundário, `appearance: none`.
- **Foco:** borda índigo e anel `0 0 0 2px` em `rgba(99,102,241,0.35)`. Todo controle focável por teclado recebe `outline: 2px solid` índigo com `outline-offset: 2px`.

### Navigation
- **Botões de grau:** fundo branco a 6%, borda de vidro, canto 12px, ícone SVG de 18px que desliza 3px na direção do movimento no hover. Abaixo de 768px o texto some e sobra só o ícone.
- **Indicador central:** algarismo romano em Índigo Aceso (1.3rem, peso 700), separador sutil, tonalidade em secundário.
- **Progresso:** sete pontos de 10px; o ativo vira índigo sólido com `scale(1.3)`.
- **Abas de modo:** grupo segmentado sobre fundo preto a 40% com padding de 4px e canto 12px; a aba ativa recebe índigo chapado e canto 8px. Rótulos são de uma palavra (Acordes · Solfejo · Arpejo), sem ícone.

### O Círculo de Quintas (signature)

Seletor de tonalidade da tela de configuração, e o herói dela: ocupa a largura do painel. Três faixas concêntricas em SVG, separadas por folga angular de 2,2° — nenhuma tem `stroke`, porque 24 traços desenham uma teia que compete com os rótulos.

- **Anel externo** (raio 158–208): as 12 maiores, uma por raio de 30°, Dó no topo, sentido das quintas.
- **Anel do meio** (110–154): a relativa menor de cada raio. Mesma armadura da maior ao lado — é por isso que estão no mesmo raio, e é o que dispensa legenda escrita.
- **Anel interno** (74–106): a forma do menor em três arcos de 120° — `NAT`, `HARM`, `MEL`. Com uma maior ativa ele recua a 45% de opacidade mas segue clicável, levando à relativa menor naquela forma; o anel nunca fica sem resposta.
- **Mostrador central:** tônica em mono 40px mais o nome do campo em caixa alta. É ele que decodifica a abreviação do anel interno, e a razão de não haver texto explicativo ao lado do controle.
- **Foco:** o elemento focável é um `<div>` que envolve o SVG, nunca o SVG nem os setores. O indicador é uma `<circle>` desenhada dentro, porque `outline` de CSS acompanha a caixa do elemento e sairia retangular em volta do círculo. Um único ponto de tabulação; setas percorrem as quintas, ↑↓ alternam maior e menor, 1–3 escolhem a forma.

### O Braço (signature)

O componente que define o produto. Estrutura em três partes horizontais: coluna de rótulos de corda solta (42px), rastilho (8px, gradiente de osso), e a grade de 18 colunas de traste (0 a 17).

- **Madeira:** gradiente de quatro paradas a 135° (#1a0f08 → #2d1a0e → #3d2415 → #2a1609), com sombra interna que a afunda.
- **Cordas:** seis linhas horizontais com calibre decrescente — 4.5px na sexta até 1px na primeira. As três graves são latão (#c9a96e → #8b7340); as três agudas são aço (#d4d4d4 → #737373). O calibre e a cor são informação, não enfeite: o estudante identifica a corda pela espessura.
- **Trastes:** barras verticais de 3px em gradiente cinza-claro-cinza, com sombra dupla para simular relevo metálico. Param 28px antes da base, onde ficam os números.
- **Marcadores:** pontos de 10px em branco a 12% nas casas 3, 5, 7, 9, 12, 15 e 17. A casa 12 recebe dois, separados por 30px, como num braço real.
- **Bolinha de nota:** círculo de 28px na cor do intervalo, letra da nota em peso 700 na cor escurecida correspondente, aro escuro de 1.5px e sombra curta com deslocamento. Aparece com `noteAppear` (0.4s) e cresce para `scale(1.25)` no hover.
- **Estados de solfejo:** nota em repouso fica a 35% de opacidade com saturação reduzida a 0.6. Ao acender: opacidade cheia, `scale(1.25)`, aro branco sólido de 3px. A mudança vem só da transição de 90ms — **o estado aceso não declara `animation`**, e isso é obrigatório: `.note-dot` carrega `animation: noteAppear`, então qualquer `animation` no estado aceso faz o browser reiniciar a entrada ao sair dele, e a nota anterior reaparece crescendo do zero em opacidade cheia.
- **Estado impraticável:** invólucro ganha borda vermelha; todas as bolinhas caem para 50% de opacidade e saturação 0.5.

### Movimento

Duas gramáticas, cada uma com seu domínio:

- **Controles** usam `cubic-bezier(0.4, 0, 0.2, 1)` a 0.2–0.3s. Desaceleração limpa, sem overshoot. Todo botão afunda em `scale(0.97)` ao ser pressionado.
- **Notas** usam `cubic-bezier(0.22, 1, 0.36, 1)` — desaceleração exponencial, de um estado já visível até o destino, **sem overshoot**. Nada estufa e volta: bounce e elástico datam a interface e são a assinatura de movimento mais comum em UI gerada por máquina.
- **Movimento reduzido:** `prefers-reduced-motion: reduce` zera animação e transição em todo o app.

## Do's and Don'ts

### Do:
- **Do** usar as quatro cores de intervalo apenas no braço e nos cards de voz. Fora dali elas são paleta livre; dentro dali são vocabulário fixo.
- **Do** usar índigo (#6366f1) como único acento de interface. Um segundo acento de UI quebra o sistema.
- **Do** dar a toda cor de intervalo o seu texto escurecido de mesma matiz (âmbar → #451a03, rosa → #4c0519, ciano → #083344, roxo → #3b0764).
- **Do** manter `min-width: 900px` no braço e resolver falta de espaço com rolagem horizontal.
- **Do** usar desaceleração exponencial (`cubic-bezier(0.22, 1, 0.36, 1)`) em tudo que representa uma nota, e `cubic-bezier(0.4, 0, 0.2, 1)` em tudo que é controle. Nenhuma das duas ultrapassa o destino.
- **Do** fazer todo botão reagir ao toque: `scale(0.97)` ao pressionar, elevação ou mudança de fundo no hover.
- **Do** escalar o raio com o tamanho da superfície: 8px em controle secundário, 12px em ação, 16px em painel.
- **Do** manter texto legível a distância de estante de partitura — a cena com o instrumento na mão é real.

### Don't:
- **Don't** usar as cores de intervalo em botão, aba, chip de navegação ou badge. Elas ensinam; usá-las como decoração desensina.
- **Don't** aplicar gradiente a texto. Em lugar nenhum, nem no título do app, nem no nome do acorde. Ênfase é peso, tamanho e cor sólida.
- **Don't** preencher botão, chip ou aba com gradiente. Estado ativo é índigo chapado.
- **Don't** usar halo colorido de deslocamento zero (`box-shadow: 0 0 Npx <cor>`). Sombra tem direção; brilho é decoração.
- **Don't** tingir o fundo da página com gradiente radial roxo/índigo. O fundo é preto liso.
- **Don't** usar emoji como ícone de interface. Ícone é SVG inline, 24×24, `stroke="currentColor"`, `strokeWidth 2.5`, pontas arredondadas.
- **Don't** usar easing com overshoot (`cubic-bezier(… 1.56 …)`), bounce ou elástico.
- **Don't** usar Inter, Geist, Plus Jakarta Sans, Space Grotesk ou Poppins. A família é IBM Plex (Sans para interface, Mono para medida).
- **Don't** usar mono como fantasia de "técnico". Só onde o valor é medida física no braço.
- **Don't** criar uma escala de elevação. Todos os painéis vivem no mesmo plano; separação vem de borda e blur.
- **Don't** comprimir o braço para caber numa tela estreita.
- **Don't** usar borda colorida fora dos estados de acento (índigo) e de alerta (vermelho). Bordas são brancas de baixa opacidade.
- **Don't** usar branco ou preto puro sobre uma cor de intervalo.
