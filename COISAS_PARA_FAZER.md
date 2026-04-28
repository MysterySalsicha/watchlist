
# Lista de Funcionalidades - Watchlist Premium

## 1. Arquitetura e Estrutura Base
- [x] **Migração Segura para Next.js (App Router)**:
    - [x] Configurar projeto Next.js com TypeScript e importar 100% do CSS original (globals.css) para garantir fidelidade visual.
- [x] **Fase 2: Arquitetura de Componentes**: Transformar a estrutura HTML em componentes React.
- [x] **Fase 3: Lógica de Estado e Filtros**: Migrar o sistema de abas e filtragem para Hooks.
- [x] **Fase 4: Persistência IndexedDB**: Portar a lógica da biblioteca `idb` para Custom Hooks (`useItems`, `useConfig`).
- [x] Finalizar a lógica de busca por texto no `Content.tsx`.
- [x] Implementar a lógica de `toggleEditList` dentro do `EditModal`.
- [x] Migrar a lógica de abertura/fechamento de todos os modais.
- [x] Refatorar o `script.js` (movido para hooks e utils).
- [x] Implementar a lógica de drag and drop para reordenação.
- [x] Implementar a lógica de abrir detalhes locais e da API.
- [x] Migrar a lógica de tradução de gêneros e sinopse.
- [x] Migrar a lógica das APIs (Jikan/TMDB) para hooks (`useSearch`, `useDetails`).
- [x] Implementar a lógica de exibição das badges dos cards.
- [x] Implementar o Dashboard no topo da aba "Todas".

## 2. Importação e Busca Inteligente
- [x] **Busca via API (MAL/TMDB)**: Pesquisa com resultados visuais no `SearchModal`.
- [x] **Adição Manual**: Cadastrar itens no `ManualModal`.
- [x] **Importação Massiva**: Implementado via `useInject` e `InjectModal`.

## 3. UI/UX - Cards Premium
- [x] **Padronização de Tamanho**: Alinhamento garantido via CSS.
- [x] **Visual Premium**: Backdrop dinâmico e bordas arredondadas.
- [x] **Informações no Card**: Título, Temporada, Progresso e Tags.
- [x] **Barra de Ações**: Streaming, +1 ep, Concluir, Editar, Remover.
- [x] **Aviso de Dados Pendentes**: Mensagem visual quando `tot` episódios é 0.
- [x] **Tags Coloridas**: Cores específicas para status e áudio.

## 4. Modais de Detalhes e Edição
- [x] **Modal de Detalhes**: Capa, sinopse traduzida, links de streaming.
- [x] **Modal de Edição**: Edição completa de campos, incluindo listas e áudio.
- [x] **Flow de Adição**: Escolha de status e progresso ao adicionar da API.

## 5. Inteligência de Dados e APIs
- [x] **Tradução Automática**: Via Google Translate em `helpers.js`.
- [x] **Detecção de Dublagem**: Lógica no hook `useDetails`.

## 6. Configurações e Segurança
- [x] **TMDB Key**: Configuração persistente no IndexedDB.
- [x] **Segurança (PIN)**: `LockScreen` funcional com validação.
- [x] **Backup (Import/Export)**: Implementado no `AppContainer` e `SettingsModal`.
- [x] **Reset Total**: Implementado no `AppContainer` e `SettingsModal`.

### Concluído! 🚀
A migração da Watchlist Premium para Next.js foi finalizada com sucesso, mantendo toda a fidelidade visual e funcional do projeto original, agora com uma arquitetura moderna e escalável.
