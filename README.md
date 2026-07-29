# 🎸 Guitar Harmony Study

Uma aplicação web interativa desenvolvida em **React** e **Vite** para estudo prático de **Harmonia Funcional**, **Voicings de Acordes**, **Solfejo de Escalas Modais** e **Arpejos de Tétrades** no braço do violão (estendido até 17 casas).

🔗 **Acesse a aplicação online**: [https://rizzato.github.io/guitar_study/](https://rizzato.github.io/guitar_study/)

---

## 🌟 Funcionalidades Principais

### 1. 🎸 Modo Harmonia (Voicings de Acordes Diatônicos)
- **Condução de Vozes Diatônica (Voice Leading)**: Movimente voicings de 4 vozes passo a passo pelos 7 graus do campo harmônico maior em todas as 12 tonalidades.
- **Configuração Personalizada de Cordas e Intervalos**: Escolha o conjunto de 4 cordas (ex: cordas `6, 5, 4, 3`) e atribua livremente os intervalos em cada corda (**Tônica**, **Terça**, **Quinta** e **Sétima**).
- **Otimização de Extensão (Regra das 5 Casas)**: Algoritmo ergonômico que calcula a melhor disposição dos dedos. Se a distância ultrapassar 5 trastes, um alerta de tocabilidade é exibido e as notas no braço são suavizadas.
- **Preferência por Notas Compactas**: Prioriza posições nas casas superiores (próximas à 12ª casa) sobre saltos desproporcionais para cordas soltas.
- **Persistência de Configuração**: O estado do exercício é salvo em memória ao retornar à tela de configuração.

---

### 2. 🎼 Modo Solfejo da Escala (2 Oitavas - Strict 3NPS)
- **Solfejo Modal de 2 Oitavas**: Exibe a escala de 15 notas do modo grego correspondente ao grau ativo (ex: *Grau II = Modo Dórico*, *Grau V = Modo Mixolídio*).
- **Padrão Estrito 3 Notas por Corda (3NPS)**: Distribuição ergonômica de exatamente 3 notas por corda em 5 cordas consecutivas, garantindo um fluxo ascendente contínuo e sem estourar as 17 casas do braço.
- **Ancoragem à Posição do Acorde**: A escala de solfejo é gerada na mesma caixa de posição (shape) em que o acorde em estudo é montado.
- **Visualização Semi-Transparente e Áudio Encadeado**: As notas iniciam semi-transparentes e acendem com animação ao serem tocadas pelo botão **🔊 Tocar Solfejo** ou ao serem clicadas.

---

### 3. 🎹 Modo Arpejo do Acorde (Tétrade em 2 Oitavas)
- **Solfejo da Tétrade (1 • 3 • 5 • 7)**: Isola exclusivamente as notas da tétrade do acorde ativo em 2 oitavas ascendentes.
- **Início na Nota mais Grave**: Começa a sequência exatamente na nota mais grave do acorde montado na mesma posição do braço.
- **Botão de Áudio Dedicado (🔊 Tocar Arpejo)**: Reproduz a tétrade nota por nota com destaque em tempo real nas bolinhas do braço e nos chips de grau.

---

### 🔊 Motor de Áudio Integrado (Web Audio API)
- **Sintetizador Realista de Violão**: Síntese áudio com osciladores de harmônicos e envelope de filtro passabaixas sem dependência de arquivos de áudio pesados.
- **Strum Automático de Acordes**: Toca o acorde com uma leve defasagem natural entre as cordas (dedilhado/rasqueado) ao mudar de grau.
- **Interatividade Total**: Clique nos cards de voz, notas do braço ou chips de solfejo/arpejo para ouvir o som da nota individual em tempo real.

---

### ⌨️ Navegação e Atalhos de Teclado
- <kbd>&rarr;</kbd> **Seta Direita**: Avança para o próximo grau do campo harmônico (ex: $I \to II \to III$).
- <kbd>&larr;</kbd> **Seta Esquerda**: Retorna ao grau anterior.
- <kbd>Esc</kbd> **Escape**: Voltar à tela de configuração do exercício.
- **Barra Diatônica Interativa**: Troca instantânea de grau clicando nos chips romanos ($I$, $ii$, $iii$, $IV$, $V7$, $vi$, $vii^\circ$).

---

## 🛠️ Tecnologias Utilizadas

- **Core**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Áudio**: Web Audio API (AudioContext, GainNode, BiquadFilterNode)
- **Estilização**: Vanilla CSS3 (Design escuro moderno `#06060f`, Glassmorphism, Braço de madeira com marcadores 3, 5, 7, 9, 12, 15 e 17)
- **Deploy**: GitHub Pages

---

## 🚀 Como Rodar o Projeto Localmente

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/rizzato/guitar_study.git
   cd guitar_study
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. Acesse no navegador: `http://localhost:5173/`

---

## 📦 Build e Publicação

Para gerar o bundle de produção:
```bash
npm run build
```

Para publicar no GitHub Pages:
```bash
npm run deploy
```

---

 Desenvolvido para auxílio no estudo prático de violão e harmonia funcional.
