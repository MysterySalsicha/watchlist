# WATCHLIST — Especificação Técnica Completa
## Para desenvolvimento com Claude CLI / Agentes de IA

---

## 1. VISÃO GERAL DO PROJETO

**Nome do App:** Watchlist  
**Versão alvo:** 1.0.0  
**Plataforma primária:** PWA (Progressive Web App) — roda como APK no Android via instalação "Adicionar à tela inicial", funciona 100% offline após primeira carga  
**Tecnologia:** HTML5 + CSS3 + JavaScript ES2022 puro (sem frameworks, sem bundler, sem Node.js em runtime)  
**Banco de dados:** IndexedDB (via idb library v8) + localStorage para configurações  
**APIs externas:** Jikan v4 (MyAnimeList unofficial, sem auth) + TMDB v3 (chave gratuita do usuário)  
**Idioma padrão da interface:** Português (Brasil)  

### Objetivo
App pessoal de watchlist de mídias (anime, séries, filmes, cartoons) que:
- Funciona como APK no Android (instalável via navegador Chrome)
- Salva todos os dados localmente no dispositivo (funciona sem internet após primeira carga)
- Integra com MyAnimeList (via Jikan) e TMDB para buscar informações automaticamente
- Permite gerenciar o progresso de episódios de forma rápida
- Visual dark elegante, focado em mobile-first

---

## 2. STACK TÉCNICA

### Frontend
- **HTML5** — arquivo único `index.html` (tudo em um arquivo para facilitar distribuição)
- **CSS3** — custom properties (variáveis CSS), flexbox, grid, sem Tailwind, sem Bootstrap
- **JavaScript** — ES2022 puro, módulos inline, sem TypeScript, sem React, sem Vue
- **Fontes** — `Syne` (display/títulos, peso 700-800) + `Inter` (corpo, peso 300-600) via Google Fonts

### Banco de Dados Local
- **IndexedDB** via biblioteca `idb` (CDN: `https://cdn.jsdelivr.net/npm/idb@8/build/umd.js`)
- **Stores:**
  - `items` — lista pessoal de mídias
  - `config` — configurações do app (API keys, preferências)
- **localStorage** — fallback de config e cache leve

### APIs Externas
- **Jikan API v4** — `https://api.jikan.moe/v4` — gratuita, sem auth, CORS aberto
- **TMDB API v3** — `https://api.themoviedb.org/3` — gratuita, requer API Key do usuário
- **TMDB Image CDN** — `https://image.tmdb.org/t/p/w500{poster_path}` (poster) e `https://image.tmdb.org/t/p/w780{backdrop_path}` (background)

### PWA / APK
- `manifest.json` inline via `<link rel="manifest">` ou data URI
- Service Worker para cache offline (Cache API)
- `theme-color` = `#08090f`
- `display: standalone`
- Ícones: emoji 🎬 como ícone SVG gerado inline

---

## 3. DESIGN SYSTEM

### Paleta de Cores (CSS Custom Properties)
```css
:root {
  /* Backgrounds */
  --bg:   #08090f;   /* fundo global */
  --c1:   #0d0e1a;   /* superfície card */
  --c2:   #141526;   /* superfície secundária */
  --c3:   #1c1d30;   /* superfície terciária / hover */

  /* Bordas */
  --b1: rgba(255,255,255,.06);   /* borda padrão */
  --b2: rgba(255,255,255,.12);   /* borda hover */
  --b3: rgba(255,255,255,.22);   /* borda ativa */

  /* Texto */
  --t1: #eaebf7;   /* texto primário */
  --t2: #9496bf;   /* texto secundário */
  --t3: #555680;   /* texto muted */

  /* Cores de acento */
  --green:  #36ffa0;   /* cor primária / dublado / progresso */
  --gbg:    rgba(54,255,160,.08);
  --gbrd:   rgba(54,255,160,.30);

  --orange: #ff8c5a;   /* legendado / aviso */
  --obg:    rgba(255,140,90,.08);
  --obrd:   rgba(255,140,90,.30);

  --blue:   #5ab4ff;   /* gêneros / info */
  --purple: #a47eff;   /* começar / não comecei */
  --amber:  #ffc84a;   /* ficar de olho / quase acabando */
  --pink:   #ff6fa8;   /* badge nova temporada */
  --red:    #ff4d4d;   /* deletar */
}
```

### Tipografia
- **Título do app / Seções / Tabs:** `Syne` 700-800, letter-spacing negativo (-0.02em)
- **Tags/badges:** `Syne` 700, letter-spacing 0.04-0.08em, uppercase
- **Corpo / inputs / metadados:** `Inter` 400-500
- **Tamanhos base:**
  - Logo: 19-20px
  - Título de card: 13px, font-weight 600
  - Metadados: 11px, color var(--t3)
  - Tag: 9.5-10px, font-weight 700
  - Tabs: 11px, Syne, weight 700

### Raios e Espaçamentos
```css
--radius-card:   16px;
--radius-modal:  22px;
--radius-input:  11px;
--radius-btn:    10-12px;
--radius-tag:    20px (pill);
```

### Efeito Ambient Glow (background do body)
```css
body::before {
  content: '';
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(ellipse 65% 40% at 90% -5%, rgba(54,255,160,.04), transparent 70%),
    radial-gradient(ellipse 55% 35% at 5% 100%, rgba(90,180,255,.03), transparent 70%);
}
```

### Glassmorphism (header e tabs sticky)
```css
background: rgba(8,9,15,.88);
backdrop-filter: blur(16px);
-webkit-backdrop-filter: blur(16px);
```

---

## 4. ESTRUTURA DO ARQUIVO HTML

```
index.html
├── <head>
│   ├── meta charset, viewport (user-scalable=no)
│   ├── PWA meta tags (mobile-web-app-capable, theme-color)
│   ├── manifest link (inline data URI)
│   └── Google Fonts (Syne + Inter)
├── <style> (todo o CSS inline)
├── <body>
│   ├── #app (z-index:1 para ficar acima do ambient)
│   │   ├── .hdr (header sticky, z-index:60)
│   │   ├── .tabs-wrap (tabs sticky, z-index:50)
│   │   └── .content (painéis das abas)
│   │
│   ├── Overlays / Bottom Sheets (modais)
│   │   ├── #ovl-search   — busca + seleção de fonte
│   │   ├── #ovl-detail   — detalhes da mídia
│   │   ├── #ovl-flow     — configurar add (ep, dub, etc.)
│   │   ├── #ovl-manual   — adicionar sem API
│   │   └── #ovl-settings — API keys
│   │
│   ├── .fab (botão de inject flutuante)
│   └── .toast (notificação temporária)
│
└── <script> (todo o JS inline)
    ├── Constantes e estado global
    ├── IndexedDB (init + CRUD)
    ├── Jikan API helpers
    ├── TMDB API helpers
    ├── Render Engine (cards + sections + panels)
    ├── Action handlers (advEp, toggleDone, del)
    ├── Modal controllers
    ├── Flow controller (add to watchlist)
    ├── Manual add
    ├── Bulk inject
    └── Init
```

---

## 5. COMPONENTES DE UI

### 5.1 Header
```
[Logo: Watch|list]          [⚙ ícone]  [+ Adicionar (verde)]
```
- **Sticky** no topo, `z-index: 60`
- **Glassmorphism** aplicado
- Altura: ~57px com padding 14px vertical
- Logo: `Syne 800`, `Watch` em `var(--t1)`, `list` em `var(--green)`
- Botão **+ Adicionar**: fundo `var(--green)`, texto `#000`, `Syne 700`, ícone `+` SVG 15x15px
- Botão **⚙**: ícone 38x38px, `var(--c1)`, border `var(--b1)`

### 5.2 Tabs (abas horizontais com scroll)
Abas (em ordem):
1. Todas
2. Em andamento
3. Nova temporada
4. Não comecei
5. Ficar de olho
6. Terminados
7. Só dublados
8. Prioridades
9. Próx. de acabar

- **Sticky** abaixo do header, `z-index: 50`, `top: 57px`
- Glassmorphism aplicado
- Scroll horizontal sem scrollbar visível (`scrollbar-width: none`)
- Aba inativa: `Syne 700 11px`, cor `var(--t3)`, border-bottom 2px transparent
- Aba ativa: cor `var(--green)`, border-bottom 2px `var(--green)`
- Badge de count: pequena pill `Syne 700 10px`, `var(--c2)`, borda `var(--b1)` — quando ativa: fundo `var(--gbg)`, verde
- Altura da aba: 50px

### 5.3 Card de Mídia (layout HORIZONTAL)
```
┌─────────────────────────────────────────────────────┐
│ [POSTER]  Título do Anime (2 linhas max)     [✓][◻][✕]│
│  68px     Gênero 1 · Gênero 2                        │
│   full    [Dub PT-BR] [Continuar]                    │
│  height   Ep 8/12 · T1                    67%        │
│           ███████░░░░░░  (barra de progresso)        │
│           4 eps restantes                            │
└─────────────────────────────────────────────────────┘
```

**Dimensões:**
- Min-height: 96px (sem progresso) | ~115px (com progresso)
- Poster: `width: 68px`, `height: 100%` do card, `object-fit: cover`, `object-position: center top`
- Borda left especial `2px solid rgba(54,255,160,.45)` quando dublado (`is-dub`)

**Poster / fallback:**
- Se tem imagem: `<img>` com `referrerpolicy="no-referrer"`, `onerror` mostra fallback
- Fallback: div com fundo gradiente diagonal + ícone 🎬 (opacity 0.3) + iniciais do título em `Syne 800` cor `var(--t3)`

**Body (coluna direita):**
- Título: `Inter 600 13px`, cor `var(--t1)`, `-webkit-line-clamp: 2`
- Gêneros: `11px var(--t3)`, até 2 gêneros separados por ` · `
- Tags: pill com borda colorida (ver seção 5.4)
- Progresso (só quando `ep > 0 && tot > 0`):
  - Row: `Ep X/Y · T1` à esquerda | `XX%` à direita (cor verde se dub, laranja se leg)
  - Track: `height: 3px`, `background: var(--c3)`, fill com gradiente
  - Fill dub: `linear-gradient(90deg, var(--green), #7fffc4)`
  - Fill leg: `linear-gradient(90deg, var(--orange), #ffb07c)`
  - Fill done: `var(--t3)`
  - Remaining: `font-size: 10px` — normal=`var(--t3)`, ≤5=`var(--amber)`, ≤2=`var(--pink) font-weight:600`, =0=`var(--green)` "✓ Temporada completa"

**Quick Actions (aparecem no hover, escondidas em repouso):**
- 3 botões `28x28px`, `border-radius: 7px`, posicionados à direita com overlay gradient escuro
- `✓` (check verde no hover) — +1 episódio
- `◻` (amber no hover) — toggle concluído
- `✕` (vermelho no hover) — remover

**Badge no poster** (opcional):
- Posição: `top: 5px, left: 5px`, z-index: 2
- Tipos: `b-s` (rosa, nova temp.), `b-w` (verde, completo), `b-e` (amber, a vir)
- Estilo: `Syne 700 8px uppercase`, `border-radius: 20px`

### 5.4 Tags (pills)

| Nome | Classe | Cor texto | Border | Background |
|------|--------|-----------|--------|------------|
| Dublado PT-BR | `.t-dub` | `var(--green)` | `var(--gbrd)` | `var(--gbg)` |
| Legendado | `.t-leg` | `var(--orange)` | `var(--obrd)` | `var(--obg)` |
| Continuar | `.t-cont` | `var(--blue)` | `rgba(90,180,255,.3)` | `rgba(90,180,255,.07)` |
| A seguir | `.t-seg` | `#7ee8a2` | `rgba(126,232,162,.3)` | `rgba(126,232,162,.07)` |
| Começar | `.t-com` | `var(--purple)` | `rgba(164,126,255,.3)` | `rgba(164,126,255,.07)` |
| Assistir de novo | `.t-nov` | `var(--amber)` | `rgba(255,200,74,.3)` | `rgba(255,200,74,.07)` |
| Terminado | `.t-done` | `var(--t3)` | `rgba(85,86,128,.25)` | `rgba(85,86,128,.06)` |

### 5.5 Seção (agrupador de cards)
```
NOME DA SEÇÃO ─────────────────────────── [N]
```
- Label: `Syne 700 9.5px`, `letter-spacing: .18em`, `uppercase`, `var(--t3)`
- Linha: `flex: 1`, `height: 1px`, `var(--b1)`
- Count badge: `Syne 700 10px`, pill `var(--c1)`, `var(--t3)`, borda `var(--b1)`

### 5.6 Bottom Sheet / Modal

**Overlay:** `position: fixed; inset: 0; z-index: 100`, fundo `rgba(0,0,0,.72)`, `backdrop-filter: blur(10px)`

**Sheet:**
- Mobile: `border-radius: 22px 22px 0 0`, `max-height: 92vh`, âncora na base
- Desktop (≥600px): `border-radius: 22px`, centralizado, `max-height: 88vh`
- Drag handle: `40px × 4px`, `var(--b2)`, `border-radius: 99px`, visível só em mobile

---

## 6. MODAIS / SHEETS

### 6.1 Modal de Busca (`#ovl-search`)

**Seletor de fonte:**
```
┌─────────────────┐  ┌─────────────────┐
│  🎌              │  │  🎬              │
│  MyAnimeList    │  │  TMDB           │
│  Anime·Manga·OVA│  │  Filmes·Séries  │
└─────────────────┘  └─────────────────┘
```
- Grid 2 colunas
- Estado padrão: Jikan selecionado
- Quando selecionado: `border: 1px solid var(--gbrd)`, `background: var(--gbg)`
- TMDB sem key: exibe aviso amber "Configure a API Key em ⚙ Configurações"

**Campo de busca:**
```
[input: Nome em pt, en, jp...]  [Buscar]
```
- Input: `border-radius: 12px 0 0 12px`, sem border-right
- Botão: `background: var(--green)`, `color: #000`, `Syne 700`, `border-radius: 0 12px 12px 0`
- Enter no input dispara busca

**Lista de resultados:**
```
┌──────────────────────────────────────┐
│ [Poster]  Título                     │
│  46×62px  Anime · 2024 · 12 eps · ⭐8.4│
│           [Ação] [Fantasia]          │
├──────────────────────────────────────┤
│ [Poster]  Título 2                   │
│  ...                                 │
└──────────────────────────────────────┘
```
- Poster: `46×62px`, `border-radius: 8px`, `object-fit: cover`
- Título: `Inter 500 13px`, truncado com ellipsis
- Meta: `11px var(--t3)`, linha única com separadores ` · `
- Tags de gênero: `9.5px var(--blue)`, pill pequena
- Estado de loading: spinner animado CSS + texto
- Estado vazio: mensagem orientativa

**Botão "Adicionar manualmente":** link-button na base, borda dashed

### 6.2 Modal de Detalhes (`#ovl-detail`)

Layout do conteúdo:
```
┌─────────────────────────────────────────────┐
│  [COVER BACKDROP — 210px height]        [✕] │
│  gradiente escuro sobre a imagem            │
├──────────────────────────────────────────────│
│  [POSTER]  Título do Anime                  │
│  88×126px  Subtítulo / Título original      │
│  -44px top [Anime] [⭐ 8.7]                 │
├──────────────────────────────────────────────│
│  [Total eps]    [Rank MAL]    [Popularidade] │
│  Stats em 3 colunas, fundo var(--c2)        │
├──────────────────────────────────────────────│
│  GÊNEROS                                    │
│  [Ação] [Fantasia] [Romance]                │
├──────────────────────────────────────────────│
│  SINOPSE                                    │
│  Texto truncado em 3 linhas... Ver mais ▾   │
├──────────────────────────────────────────────│
│  INFORMAÇÕES                                │
│  Status: On Air   Exibição: Jan 2024        │
│  Estúdio: MAPPA   Horário: Sábado 23:00     │
├═══════════════════════════════════════════════│
│  [MAL ↗]    [+ Adicionar à Watchlist (verde)]│
└─────────────────────────────────────────────┘
```

**Detalhes de UI:**
- Cover: `height: 210px`, `object-fit: cover`, `object-position: center 20%`
- Gradiente sobre o cover: `linear-gradient(to bottom, rgba(7,8,14,.1) 0%, rgba(7,8,14,.97) 100%)`
- Botão fechar: `34×34px`, `border-radius: 9px`, posição absolute `top:12px right:12px`
- Poster: `-44px margin-top` para sobrepor o cover, `border: 2px solid var(--b2)`, `box-shadow`
- Stats: grid 3 colunas, valor em `Syne 800 17px`, label em `10px var(--t3)`
- Sinopse: max-height colapsada com botão "Ver mais ▾" / "Ver menos ▴"
- Info row: `background: var(--c2)`, `border-radius: 10px`, padding 11px, `12px var(--t2)`, strong `var(--t1)`
- Footer sticky: `position: sticky; bottom: 0`, fundo `var(--c1)`, border-top `var(--b1)`
- Botão Add: `flex: 2`, verde, `Syne 700 14px`; quando já adicionado: outline verde, fundo `var(--c2)`, texto "✓ Na sua lista"
- Botão Link: `flex: 1`, fundo `var(--c2)`, borda `var(--b1)`

### 6.3 Modal de Fluxo de Adição (`#ovl-flow`)

Aparece após clicar "+ Adicionar" no modal de detalhes. Fecha o modal de detalhes antes de abrir.

```
Título da mídia
Configure como você quer acompanhar

Você está assistindo agora?
  [✓ Sim, já comecei]  [Não, começo do E1]

[EP FIELDS — visível só se "Sim"]
  Episódio atual   |  Temporada
  [1      ]        |  [1     ]

Áudio disponível
  [✓ Dublado PT-BR]  [Legendado]

Marcar também como
  [👁 Ficar de olho]  [🔄 Nova temporada]

Nota pessoal
  [T3 confirmada para Julho 2026...  ]

[Cancelar]    [Adicionar à Watchlist]
```

**Lógica:**
- Se "Não" → ep=0, st='comecar', lista=['nc']
- Se "Sim" → ep do campo, st='continuar', lista=['meio'], _ep=ep informado
- Dub → dub=1, Leg → dub=0
- Ficar de olho → inclui 'ficar' na lista
- Nova temporada → inclui 'nova-tp' na lista

### 6.4 Modal Manual (`#ovl-manual`)

Campos:
- Nome * (obrigatório)
- URL da imagem de capa (+ pré-visualização `aspect-ratio: 3/2`)
- Gêneros (separados por vírgula)
- Sinopse
- Link Crunchyroll / plataforma
- Ep atual | Total eps temporada (row 2 cols)
- Temp. atual | Total temps. | Eps/temp. (row 3 cols)
- Áudio (radio: Dublado / Legendado)
- Status (select)
- Nota

### 6.5 Modal de Configurações (`#ovl-settings`)

Campos:
- **TMDB API Key** — input text com placeholder, `autocomplete="off"`
  - Hint: "Crie conta gratuita em themoviedb.org → Settings → API → Create → Developer"
  - Link direto para `https://www.themoviedb.org/settings/api`
- **Jikan (MAL)** — input disabled "api.jikan.moe/v4 — público e gratuito"
- Botão "Salvar configurações" — largura total, `var(--green)`

---

## 7. BANCO DE DADOS (IndexedDB via idb)

### Inicialização
```javascript
const db = await openDB('watchlist', 1, {
  upgrade(db) {
    // Store principal de mídias
    const store = db.createObjectStore('items', { keyPath: 'id' });
    store.createIndex('malId',  'malId',  { unique: false });
    store.createIndex('tmdbId', 'tmdbId', { unique: false });
    store.createIndex('st',     'st',     { unique: false });

    // Store de configurações chave-valor
    db.createObjectStore('config', { keyPath: 'key' });
  }
});
```

### Schema do Item
```typescript
interface WatchItem {
  // Identificação
  id:      string;    // uid gerado localmente (Date.now + random)
  src:     'jikan' | 'tmdb' | 'manual';
  malId?:  number;    // MAL anime ID (se src='jikan')
  tmdbId?: number;    // TMDB media ID (se src='tmdb')

  // Conteúdo
  title:    string;
  img:      string;   // URL do poster (pode ser vazia)
  genres:   string[]; // array de strings
  synopsis: string;
  type:     'anime' | 'serie' | 'filme' | 'cartoon' | 'manual';
  cr:       string;   // link Crunchyroll (pode ser vazio)

  // Progresso
  dub:   0 | 1;       // 0=legendado 1=dublado
  s:     number;      // temporada atual
  ep:    number;      // ep inicial (no momento do add)
  _ep?:  number;      // ep atual (modificado pelo app)
  tot:   number;      // total eps da temporada
  sns:   number;      // total de temporadas
  ept:   number;      // eps por temporada (média)
  freq:  string;      // frequência de novos eps

  // Status
  st:     'continuar' | 'seguir' | 'comecar' | 'novamente' | 'terminado';
  lists:  string[];   // ['meio', 'nc', 'nova-tp', 'ficar', 'term']
  note:   string;     // nota pessoal
  badge?: string;     // 'b-s' | 'b-w' | 'b-e'
  bl?:    string;     // texto do badge

  // Flags de UI
  _done?: boolean;    // marcado como concluído
  _rm?:   boolean;    // soft-deleted

  // Metadados
  addedAt: number;    // timestamp
  updatedAt: number;  // timestamp
}
```

### Operações CRUD
```javascript
// Criar
await db.put('items', item);

// Ler todos
const all = await db.getAll('items');

// Atualizar
const existing = await db.get('items', id);
await db.put('items', { ...existing, _ep: newEp, updatedAt: Date.now() });

// Soft delete
await db.put('items', { ...existing, _rm: true });

// Hard delete (limpeza periódica de _rm)
await db.delete('items', id);

// Config
await db.put('config', { key: 'tmdbKey', value: 'xxx' });
const cfg = await db.get('config', 'tmdbKey');
```

---

## 8. INTEGRAÇÃO COM APIS

### 8.1 Jikan API v4 (MyAnimeList Unofficial)

**Base URL:** `https://api.jikan.moe/v4`  
**Auth:** Nenhuma  
**CORS:** `Access-Control-Allow-Origin: *` — funciona direto do browser  
**Rate Limit:** ~3 req/s (60 req/min) — usar delay de 400ms entre requests no inject  

#### Endpoints utilizados

**Busca por nome:**
```
GET /anime?q={query}&limit=15&sfw=true
```
Retorna: `data[].{ mal_id, title, title_english, title_japanese, images, type, episodes, score, status, aired, studios, genres, synopsis, broadcast, duration, rank, popularity, url }`

- `images.webp.large_image_url` (preferido) ou `images.jpg.large_image_url` para poster
- `images.jpg.image_url` para thumbnail nos resultados
- `genres[].name` → array de strings
- `studios[].name` → array de strings
- `broadcast.string` → "Saturdays at 23:00 (JST)"
- `aired.string` → "Jan 7, 2024 to ?"
- `status` → "Currently Airing" | "Finished Airing" | "Not yet aired"

**Detalhes por ID (inject em massa):**
```
GET /anime/{mal_id}
```
Retorna: mesmo schema + `episodes` (número exato de eps)

**Campos mapeados no item salvo:**
```javascript
{
  title:   item.title,
  img:     item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || '',
  genres:  (item.genres || []).map(g => g.name),
  synopsis: item.synopsis || '',
  type:    'anime',
  tot:     item.episodes || 12,
  // broadcast, status, studios guardados em `note` ou campo livre
}
```

### 8.2 TMDB API v3

**Base URL:** `https://api.themoviedb.org/3`  
**Auth:** `?api_key={userKey}` ou Header `Authorization: Bearer {readAccessToken}`  
**Language:** sempre incluir `&language=pt-BR` para títulos em português  
**CORS:** Aberto para requests browser  

#### Endpoints utilizados

**Busca multi (filmes + séries):**
```
GET /search/multi?api_key={key}&query={q}&language=pt-BR&include_adult=false
```
Retorna: `results[].{ id, media_type, title, name, original_title, original_name, poster_path, backdrop_path, overview, vote_average, vote_count, release_date, first_air_date, original_language, genre_ids, popularity }`

- `media_type`: `'movie'` | `'tv'` | `'person'` (filtrar person)
- `title` (filmes) ou `name` (séries)
- `poster_path` → `https://image.tmdb.org/t/p/w500{poster_path}`
- `backdrop_path` → `https://image.tmdb.org/t/p/w780{backdrop_path}`

**Campos mapeados:**
```javascript
{
  title: item.title || item.name,
  img:   item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '',
  type:  item.media_type === 'movie' ? 'filme' : 'serie',
  tot:   item.media_type === 'movie' ? 1 : 24,  // padrão para séries
}
```

### 8.3 Tratamento de Erros de API
```javascript
async function fetchWithRetry(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (r.status === 429) {
        await delay(2000 * (i + 1));  // back-off exponencial
        continue;
      }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      if (i === retries) throw e;
      await delay(1000 * (i + 1));
    }
  }
}
```

---

## 9. LÓGICA DE CLASSIFICAÇÃO (LISTAS)

Cada item tem um array `lists` que define em quais abas aparece.

| Lista key | Critério de inclusão automática |
|-----------|----------------------------------|
| `meio`    | Status `continuar` ou `seguir` e está no meio de uma temporada |
| `nc`      | Status `comecar` (nunca assistiu) |
| `nova-tp` | Selecionado pelo usuário no fluxo de add — indica que há nova temporada disponível mas ainda não começou |
| `ficar`   | Selecionado pelo usuário — continuação/nova temp. a caminho |
| `term`    | Status `terminado` ou selecionado manualmente |

**Regras de negócio:**
- Um item pode estar em múltiplas listas simultaneamente
- Soft-delete (`_rm: true`) exclui de TODAS as listas
- `_done: true` → exibido com opacity reduzida e filtro grayscale

### Painel "Prioridades" (lógica de ordenação)
1. **Nível 1** — Quase acabando: `rem <= 3` e `ep > 0`
2. **Nível 2** — Dublados em andamento: `dub=1` e status `continuar|seguir`
3. **Nível 3** — Dublados para começar: `dub=1` e lista `nc` ou `nova-tp`
4. **Nível 4** — Legendados: `dub=0`

### Painel "Próx. de acabar"
- Filtro: `ep > 0 && tot > 0 && rem > 0`
- Ordenação: `rem` crescente (menos restantes primeiro)
- Máximo: 20 itens

---

## 10. BULK INJECT (importação em massa)

Injetará os 31 animes da watchlist pessoal do Igor buscando na Jikan API.

### Lista de IDs MAL (formato: [malId, ep, season, dub, status, lists[], note?, badge?, bl?])
```javascript
const INJECT_LIST = [
  // Em andamento
  [38707,  2,3, 1,'continuar',['meio'],'T3 finalizada — T4 sem previsão'],
  [108465, 4,2, 1,'continuar',['meio','ficar'],'T3 confirmada — Julho 2026','b-s','S3 Jul/2026'],
  [151807,11,2, 1,'continuar',['meio'],'⚡ Faltam só 15 eps!'],
  [157897, 4,2, 1,'continuar',['meio']],
  [140196, 1,2, 1,'continuar',['meio']],
  [32949,  5,1, 1,'continuar',['meio'],'T1 e T2 com PT-BR'],
  [170516, 8,1, 1,'continuar',['meio','ficar'],'T2 anunciada para 2026','b-s','S2 2026'],
  [32901,  1,1, 1,'continuar',['meio'],'T2 anunciada em 2021, sem data'],
  [119456, 2,1, 1,'continuar',['meio'],'Série completa: 24 eps em 2 partes'],
  [160166, 1,1, 1,'continuar',['meio']],
  [130298, 1,1, 1,'continuar',['meio']],
  [139636, 3,1, 1,'continuar',['meio']],
  [175441,10,1, 1,'seguir',   ['meio'],'⚡ Faltam só 2 eps!'],
  [168175, 7,1, 1,'seguir',   ['meio','ficar'],'T2 anunciada, sem data','b-e','T2 a vir'],
  [170512, 3,1, 1,'seguir',   ['meio']],
  [154391, 6,1, 1,'seguir',   ['meio'],'T2 do especial disponível'],
  [57030,  1,1, 0,'continuar',['meio'],'Apenas EN dub, sem PT-BR'],
  [162804, 1,1, 0,'continuar',['meio'],'Sem PT-BR na Crunchyroll'],
  [161645, 6,1, 0,'seguir',   ['meio'],'Sem PT-BR confirmado'],
  // Assistir de novo / terminado
  [116396,12,2, 1,'novamente',['nova-tp','term','ficar'],'T2 completa! T3 sem data','b-w','T2 ok'],
  // Não comecei
  [101764, 0,1, 1,'comecar',  ['nova-tp','nc'],'T1 e T2 com PT-BR'],
  [18617,  0,1, 0,'comecar',  ['nova-tp','nc'],'OVA do anime de 2013 — sem PT-BR'],
  [46102,  0,1, 1,'comecar',  ['nc']],
  [109080, 0,1, 0,'comecar',  ['nc'],'Dub EN disponível, sem PT-BR'],
  [103940, 0,1, 0,'comecar',  ['nc'],'Dub EN disponível, sem PT-BR'],
  [169805, 0,1, 0,'comecar',  ['nc'],'Sem PT-BR confirmado'],
  [167896, 0,1, 0,'comecar',  ['nc'],'Sem PT-BR confirmado'],
];

// Itens buscados por nome (MAL ID variável)
const INJECT_BY_NAME = [
  { q:'Ousama Ranking',              title:'Ranking of Kings',                              ep:0,s:1,dub:1,st:'comecar',lists:['nc']},
  { q:'Metallic Rouge',              title:'Metallic Rouge',                                ep:0,s:1,dub:1,st:'comecar',lists:['nc']},
  { q:'Kaifuku Jutsushi no Yarinaoshi', title:'The Healer Banished from His Party',         ep:0,s:1,dub:1,st:'comecar',lists:['nc']},
  { q:'Raise wa Tanin ga Ii',        title:'Yakuza Fiancé: Raise wa Tanin ga Ii',           ep:0,s:1,dub:1,st:'comecar',lists:['nc']},
];
```

### Algoritmo de Inject
```javascript
async function runInject() {
  const DELAY_MS = 400; // respeitar rate limit ~2.5 req/s
  let ok = 0, skip = 0, fail = 0;

  for (const [malId, ep, s, dub, st, lists, note, badge, bl] of INJECT_LIST) {
    // Verificar se já existe
    const existing = await db.getFromIndex('items', 'malId', malId);
    if (existing && !existing._rm) { skip++; continue; }

    try {
      const d = await fetchWithRetry(`${JIKAN}/anime/${malId}`);
      const item = d.data;
      await db.put('items', buildItemFromJikan(item, { ep, s, dub, st, lists, note, badge, bl }));
      ok++;
    } catch { fail++; }

    await delay(DELAY_MS);
    updateProgress(ok, skip, fail);
  }

  // Itens por busca
  for (const ex of INJECT_BY_NAME) {
    try {
      const d = await fetchWithRetry(`${JIKAN}/anime?q=${encodeURIComponent(ex.q)}&limit=1&sfw=true`);
      const item = d.data?.[0]; if (!item) throw new Error();
      await db.put('items', buildItemFromJikan(item, ex));
      ok++;
    } catch { fail++; }
    await delay(DELAY_MS);
  }

  showToast(`✓ ${ok} importados · ${skip} já existiam · ${fail} falhas`);
}
```

### FAB de Inject
- Posição: `fixed bottom: 20px right: 16px`
- Ícone 📥 quando parado, `⏳` com contador `X/31` durante importação
- Cor amber durante importação
- Ao finalizar: mostra toast com resultado

---

## 11. PWA / SERVICE WORKER

### Manifest (inline como data URI ou arquivo separado)
```json
{
  "name": "Watchlist",
  "short_name": "Watchlist",
  "description": "Sua lista pessoal de animes, séries e filmes",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#08090f",
  "theme_color": "#08090f",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```
*Nota: Ícones podem ser gerados como SVG data URI inline se não houver arquivo externo*

### Service Worker (cache-first para assets, network-first para APIs)
```javascript
const CACHE = 'watchlist-v1';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // APIs: sempre network-first
  if (url.hostname.includes('jikan') || url.hostname.includes('themoviedb')) return;
  // Assets: cache-first
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
```

---

## 12. FEEDBACK E UX

### Toast (notificação temporária)
- Posição: `fixed bottom: 76px`, centralizado horizontalmente
- Fundo: `var(--c2)`, borda `var(--b2)`, `border-radius: 22px`
- Animação: `opacity` + `translateY` com `transition: .2s`
- Duração: 2.2s (padrão) ou 4s (mensagens longas)
- Exemplos: "✓ +1 ep → E9 ✓", "✓ Attack on Titan adicionado!", "Já no último episódio!"

### Indicador de Loading
- Spinner CSS `spin` animado: `border-top-color: var(--green)`
- Texto junto: "Buscando em MyAnimeList..."

### Confirmações Destrutivas
- Uso de `confirm()` nativo (simples, evitar complexidade)
- Texto descritivo: "Remover Attack on Titan da lista?"

### Empty State
- SVG inline de círculo com ícone
- Texto: "Nada aqui ainda — use + Adicionar!"

---

## 13. RESPONSIVIDADE

### Breakpoints
- **Mobile-first** (default): `<600px` — grade 1 coluna de cards
- **Tablet+**: `≥600px` — grade `auto-fill minmax(300px, 1fr)` (2-3 cols)
- **Bottom sheets**: em mobile âncora na base, em tablet centralizado

### Regras Mobile Específicas
- `user-scalable=no` no viewport (comportamento de app nativo)
- `-webkit-tap-highlight-color: transparent` (sem flash de tap)
- Overflow horizontal hidden no body
- Tabs com `-webkit-overflow-scrolling: touch`
- Inputs sem zoom automático: `font-size: 14px` mínimo (iOS não faz zoom acima de 16px, mas 14px é aceitável)

---

## 14. FLUXO COMPLETO DE USUÁRIO

```
Primeira abertura
├── App carrega (IndexedDB init)
├── Lista vazia → empty state
└── Usuário clica 📥 (inject) → importa 31 animes automaticamente
    └── Busca Jikan API um por um (com delay 400ms)

Adicionar nova mídia
├── Clica "+ Adicionar"
├── Escolhe fonte: [🎌 MyAnimeList] ou [🎬 TMDB]
├── Digita nome → busca automática ao pressionar Enter
├── Lista de resultados com poster, título, meta, gêneros
├── Clica em um resultado → Modal de Detalhes
│   ├── Cover + poster + título + subtítulo
│   ├── Stats (eps, rank, popularidade)
│   ├── Gêneros como tags
│   ├── Sinopse (colapsada, expandível)
│   ├── Info (status, estúdio, horário)
│   └── Footer: [MAL/TMDB ↗] [+ Adicionar à Watchlist]
│
└── Clica "+ Adicionar à Watchlist" → Modal de Fluxo
    ├── "Já está assistindo?" → [Sim] [Não]
    ├── Se Sim: Ep atual + Temporada
    ├── Áudio: [Dublado PT-BR] [Legendado]
    ├── Marcar: [Ficar de olho] [Nova temporada]
    ├── Nota pessoal (texto livre)
    └── [Cancelar] [Adicionar à Watchlist]
        └── Toast "✓ Título adicionado!"

Interagir com item na lista
├── Clicar no card → Modal de Detalhes (versão local)
├── Hover/tap → Quick actions aparecem no lado direito
│   ├── ✓ → +1 episódio + toast + render
│   ├── ◻ → toggle concluído (opacity/grayscale)
│   └── ✕ → confirmar e remover (soft delete)
└── No modal de detalhes local:
    ├── [✓ +1 ep] [Crunchyroll ↗] [✕ Remover]
    └── Progresso visual atualizado

Configurar API Key
└── ⚙ → Modal Settings
    ├── TMDB API Key (input + instruções + link)
    └── Salvar → saveCFG()
```

---

## 15. ESTRUTURA DE ARQUIVOS

O projeto inteiro é **um único arquivo `index.html`** para máxima portabilidade.

```
watchlist/
└── index.html          (tudo: HTML + CSS inline + JS inline)

Dependências externas (CDN, carregadas online):
├── https://fonts.googleapis.com (Syne + Inter)
└── https://cdn.jsdelivr.net/npm/idb@8/build/umd.js (IndexedDB wrapper)
```

*Service Worker pode ser registrado inline via Blob URL ou em `sw.js` separado*

---

## 16. CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1 — Estrutura base
- [ ] HTML shell com todas as variáveis CSS
- [ ] Header sticky com glassmorphism
- [ ] Sistema de tabs com scroll horizontal
- [ ] Panels de conteúdo por aba
- [ ] IndexedDB init e CRUD completo
- [ ] Render engine (cardHTML, section, panels)

### Fase 2 — Cards e layout
- [ ] Card horizontal com poster 68px fixo
- [ ] Imagem `object-fit: cover / object-position: center top`
- [ ] Fallback com iniciais quando sem imagem
- [ ] Tags de status e dublagem
- [ ] Barra de progresso com gradiente colorido
- [ ] Texto de episódios restantes com cores condicionais
- [ ] Quick actions no hover (✓ ◻ ✕)
- [ ] Badge no poster (opcional)

### Fase 3 — Modais
- [ ] Bottom sheet overlay responsivo
- [ ] Modal de busca com toggle Jikan/TMDB
- [ ] Resultados de busca com poster e meta
- [ ] Modal de detalhes (cover + hero + stats + sinopse + footer sticky)
- [ ] Modal de fluxo de adição (radio groups + ep fields toggle)
- [ ] Modal de add manual com pré-visualização de imagem
- [ ] Modal de configurações com API key + instruções

### Fase 4 — APIs
- [ ] fetchWithRetry com timeout e backoff
- [ ] searchJikan (GET /anime?q=...)
- [ ] searchTmdb (GET /search/multi)
- [ ] openDetailJikan (construir modal com dados completos)
- [ ] openDetailTmdb (construir modal com dados completos)
- [ ] confirmAdd (salvar item no IndexedDB)

### Fase 5 — Bulk inject
- [ ] INJECT_LIST com 27 MAL IDs
- [ ] INJECT_BY_NAME com 4 buscas por nome
- [ ] Loop com delay 400ms entre requests
- [ ] Progresso visível no FAB (contador)
- [ ] Toast de resultado final

### Fase 6 — PWA
- [ ] Meta tags PWA (mobile-web-app-capable, theme-color)
- [ ] Manifest JSON (inline ou arquivo)
- [ ] Service Worker (cache offline dos assets)
- [ ] Ícones (SVG inline ou PNG gerado)

### Fase 7 — Polimento
- [ ] Toast system (animado, auto-dismiss)
- [ ] Empty states por painel
- [ ] Scroll de tab ativo para centro no mobile
- [ ] Feedback visual em todas as ações
- [ ] Testes em Chrome mobile (Android)

---

## 17. NOTAS PARA O AGENTE DE IA

### Instruções de desenvolvimento (Claude CLI / Codex / OpenHands)

1. **Nunca use frameworks** — HTML/CSS/JS puro. Zero React, Zero Vue, Zero Svelte.
2. **Um único arquivo** — tudo inline no `index.html`. CSS em `<style>`, JS em `<script>`.
3. **IndexedDB obrigatório** — não use localStorage como banco principal (limite de 5MB). Use `idb` via CDN.
4. **Mobile-first** — cada decisão de layout deve considerar tela de 375px de largura primeiro.
5. **Poster da imagem** — `object-fit: cover`, `object-position: center top`, `height: 100%` do card. Nunca distorcer.
6. **Fallback de imagem** — sempre implementar: `onerror` esconde img e exibe div com iniciais.
7. **CORS das imagens** — adicionar `referrerpolicy="no-referrer"` em todos os `<img>` de APIs externas.
8. **Rate limit Jikan** — nunca fazer mais de 2.5 req/s. Usar `delay(400)` entre cada request no inject.
9. **Não bloquear a UI** — todas as operações de API e IndexedDB devem ser `async/await` sem travar o render.
10. **Validar antes de salvar** — checar campos obrigatórios (id, title) antes de `db.put()`.
11. **Sem confirm() para ações não destrutivas** — usar confirm() apenas para "remover item".
12. **Accessibilidade básica** — `aria-label` em botões icônicos, `role="dialog"` nos modais.

### Ordem de implementação recomendada
1. CSS completo + HTML shell vazio
2. IndexedDB init + operações CRUD
3. Render engine (cardHTML + section + render)
4. Tabs funcionais (switchTab + painéis)
5. Modal de busca + Jikan API
6. Modal de detalhes + fluxo de add
7. TMDB API
8. Quick actions + toast
9. Modal manual + settings
10. Bulk inject
11. PWA + service worker

---

*Especificação gerada para o projeto Watchlist pessoal do Igor*  
*Data: Abril 2026*  
*APIs: Jikan v4 (api.jikan.moe/v4) + TMDB v3 (api.themoviedb.org/3)*
