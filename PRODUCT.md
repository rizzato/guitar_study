# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Estudantes de violão em geral, sem professor ao lado — mas **não iniciantes em teoria**. O público real já domina os fundamentos de harmonia funcional: sabe o que é um voicing, o que são tônica/terça/quinta/sétima, e consegue atribuir graus do acorde a cordas sem que ninguém explique. Confirmado explicitamente pelo usuário em 2026-07-29, revisando uma leitura anterior que assumia o contrário.

Consequência para o design: onboarding, glossário e explicação embutida **não** são requisitos. A tela de configuração pode continuar sendo um formulário direto. O que continua valendo é o oposto — o app não pode afirmar algo musicalmente falso, porque este público percebe.

Duas cenas de uso confirmadas, ambas reais:

- **Instrumento na mão** — celular ou tablet apoiado na estante de partitura. Mãos ocupadas com o violão, tela a ~60cm, toque impreciso e esporádico. Atalhos de teclado não existem nesta cena.
- **Desktop/notebook** — teclado à mão, tela grande, mãos livres. É a cena que os atalhos `←` `→` `Esc` atendem hoje.

O app precisa servir as duas. Qual domina numa dada sessão é escolha do estudante, não do produto.

## Product Purpose

Tornar a harmonia funcional visível e audível **no braço do violão**, e não no papel. O estudante escolhe uma tonalidade e uma configuração de voicing, e percorre os 7 graus do campo harmônico vendo e ouvindo o mesmo grau de três ângulos: o acorde (voicing de 4 vozes), a escala modal correspondente (solfejo) e a tétrade (arpejo).

Sucesso é o estudante conseguir montar e ouvir qualquer grau em qualquer tonalidade sem consultar o app — o app se torna dispensável para aquele conjunto.

## Positioning

Não é um dicionário de acordes nem um gerador de diagramas. Dois mecanismos definem o produto:

1. **O voicing é configurado pelo estudante, não escolhido de um catálogo.** Ele define quais cordas usar e qual intervalo (tônica, terça, quinta, sétima) vive em cada corda. O app resolve a digitação ergonômica dessa escolha, incluindo alerta quando a abertura ultrapassa 5 trastes.
2. **Escala e arpejo são ancorados na posição do acorde montado.** O solfejo modal e o arpejo de tétrade nascem na mesma caixa de posição do voicing configurado, não numa posição canônica arbitrária. Essa ancoragem é o que liga harmonia, escala e arpejo em um único gesto de estudo.

Um app de acordes vizinho não copia isso sem reimplementar a resolução de voicing e a ancoragem de posição.

## Operating Context

- Sessão de prática com o instrumento na mão; o app é o segundo plano, o violão é o primeiro.
- Navegação por grau (I → vii°) é o movimento central da sessão: barra diatônica clicável, setas, atalhos de teclado.
- Áudio é canal de ensino, não enfeite: acorde toca automaticamente ao trocar de grau, com strum defasado; solfejo e arpejo tocam nota a nota com destaque sincronizado no braço.
- Sem conta, sem login, sem backend. Aplicação estática publicada em GitHub Pages.
- Interface em português do Brasil (`lang="pt-BR"`); cifras em notação internacional (`Fmaj7`, `Bb`).

## Capabilities and Constraints

**Confirmado e implementado:**

- 24 tonalidades (12 tônicas × maior/menor); 7 graus por campo; acordes de tétrade (1-3-5-7).
- Voicing de até 4 vozes com atribuição livre de intervalo por corda.
- Seleção de tonalidade por círculo de quintas: maiores, relativas menores e forma do menor em três anéis concêntricos.
- Braço de 17 casas; violão de 6 cordas em afinação padrão (E2 A2 D3 G3 B3 E4).
- Regra ergonômica das 5 casas no acorde, com alerta de tocabilidade quando excedida.
- Solfejo modal de 2 oitavas em padrão estrito 3 notas por corda (3NPS), 15 notas em 5 cordas consecutivas.
- Arpejo de tétrade em 2 oitavas, iniciando na nota mais grave do voicing montado.
- Síntese de áudio via Web Audio API — osciladores e filtro, sem arquivos de samples.
- React 19 + Vite 8, CSS puro, sem dependências de UI.
- Quatro campos harmônicos: **maior**, **menor natural**, **menor harmônica** e **menor melódica** — 24 tonalidades. A menor melódica existe apenas na forma ascendente, porque o solfejo do app é ascendente por construção e nunca desce; a forma descendente é o menor natural e não teria onde aparecer.
- As qualidades de acorde são **derivadas dos intervalos calculados**, não tabeladas por grau. Um trio de semitons (terça, quinta, sétima) determina a tétrade, então a qualidade nunca discorda da escala que a gerou. `test/scales.mjs` trava os 28 graus contra valores conferidos à mão.
- A regra ergonômica das 5 casas vale para **acorde**, onde os dedos são simultâneos. Escala é sequencial e a mão desloca: o solfejo da menor harmônica e da melódica chega a 6 trastes de span, o que é normal e não dispara alerta.

**Limites atuais:**

- A configuração do exercício sobrevive apenas em memória (volta preservada ao sair do exercício), não entre recarregamentos de página.
- Nenhum registro de progresso, histórico ou repetição espaçada.
- Sem modo offline explícito (nenhum service worker).

**Explicitamente indeciso — não assumir em trabalho futuro:**

- Se haverá persistência de configuração entre sessões.
- Se a interface ganha inglês (o nome do produto é inglês, a UI é PT-BR; a inconsistência não foi resolvida).
- Se afinações alternativas ou outros instrumentos entram algum dia.

## Brand Commitments

- Nome: **Guitar Harmony Study**. Subtítulo: "Estudo de Harmonia Funcional no Braço do Violão".
- Vocabulário do domínio em português, já estabelecido na UI e a preservar: Tonalidade, Grau, Tônica, Terça, Quinta, Sétima, Campo Harmônico, Voicing, Solfejo, Arpejo, Tétrade, Traste, Corda, Abertura.
- Cifras e nomes de acorde em notação internacional.

## Evidence on Hand

- `test/verify.mjs` — verificação automatizada de 84 combinações de configuração: 0 erros, traste máximo 17 (dentro do limite do braço). É a única evidência de corretude do projeto.
- Aplicação pública em `https://rizzato.github.io/guitar_study/`.
- `README.md` — descrição funcional completa e atual das três modalidades.

**Ausências que trabalho futuro não pode fabricar:** não há usuários conhecidos, depoimentos, métricas de uso, dados de retenção, validação pedagógica com professores, nem qualquer comparação com produtos concorrentes.

## Product Principles

1. **O braço é a fonte de verdade.** Toda informação teórica existe para ser localizada em cordas e trastes. Abstração que não aterrissa no braço não pertence ao produto.
2. **A ancoragem de posição é inviolável.** Escala e arpejo derivam da posição do voicing que o estudante montou. Reposicionar por conveniência visual quebra o mecanismo central.
3. **Ver e ouvir são o mesmo evento.** Destaque visual e nota soando são sincronizados por definição; nenhum dos dois pode existir sozinho como único canal de ensino.
4. **O estudante configura, o app resolve.** As escolhas musicais são dele; o trabalho ergonômico (digitação, oitava, extensão) é do app — incluindo dizer quando a escolha é impraticável, em vez de escondê-lo.
5. **Nada entre o estudante e a próxima repetição.** O laço trocar-grau → ouvir → tocar é o produto. Qualquer coisa que adicione um passo a esse laço precisa se justificar.

## Accessibility & Inclusion

- O produto precisa ser operável na cena "instrumento na mão": alvos de toque grandes o suficiente para dedos ocupados e imprecisos, e texto legível a distância de estante de partitura. Isso é requisito de produto, não refinamento.
- Áudio não pode ser o único canal de qualquer informação — o app é usado com fone, sem som, e por estudantes com perda auditiva. Todo evento sonoro tem contraparte visual.
- Nenhum padrão formal de acessibilidade (WCAG nível X) foi estabelecido pelo usuário até aqui.
