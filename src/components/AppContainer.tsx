
'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useItems } from '@/hooks/useItems';
import { useConfig } from '@/hooks/useConfig';
import { useInject } from '@/hooks/useInject';
import { filterByTab } from '../utils/filters';
import { uid } from '../utils/helpers';
import Header from "@/components/Header";
import Tabs from "@/components/Tabs";
import SearchBar from "@/components/SearchBar";
import Content from "@/components/Content";
import LockScreen from "@/components/LockScreen";
import InjectModal from "@/components/InjectModal";
import EditModal from "@/components/EditModal";
import ConfirmModal from "@/components/ConfirmModal";
import Toast from "@/components/Toast";
import SearchModal from "@/components/SearchModal";
import DetailModal from "@/components/DetailModal";
import ApiDetailModal from "@/components/ApiDetailModal";
import FlowModal from "@/components/FlowModal";
import ManualModal from "@/components/ManualModal";
import SettingsModal from "@/components/SettingsModal";

const AppContainer = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { items, updateItem, softDeleteItem, resetAll, exportItems, importItems } = useItems();
  const { config, setConfig } = useConfig();
  const { runInject, status: injectStatus } = useInject(updateItem);

  const [isLocked, setIsLocked] = useState(false);

  // Estados dos modais
  const [editingItem, setEditingItem] = useState<any>(null);
  const [confirmData, setConfirmData] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null); // Local item
  const [apiItemToOpen, setApiItemToOpen] = useState<any>(null); // { id, type }
  const [flowData, setFlowData] = useState<any>(null); // API data for flow
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isInjectOpen, setIsInjectOpen] = useState(false);

  useEffect(() => {
    if (config.appPin) {
      setIsLocked(true);
    }
  }, [config.appPin]);

  // History API - Fechar modais com o botão voltar
  useEffect(() => {
    const handlePopState = () => {
      setEditingItem(null);
      setConfirmData(null);
      setSelectedItem(null);
      setApiItemToOpen(null);
      setFlowData(null);
      setIsSearchOpen(false);
      setIsSettingsOpen(false);
      setIsManualOpen(false);
      setIsInjectOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const anyModalOpen = !!(editingItem || confirmData || selectedItem || apiItemToOpen || flowData || isSearchOpen || isSettingsOpen || isManualOpen || isInjectOpen);

  useEffect(() => {
    if (anyModalOpen) {
      window.history.pushState({ modal: true }, '');
    }
  }, [anyModalOpen]);

  // Tecla ESC para fechar modais
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (anyModalOpen) window.history.back();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [anyModalOpen]);

  // Verificar link compartilhado na carga
  useEffect(() => {
    const checkShare = async () => {
      const hash = window.location.hash;
      if (!hash.startsWith('#share=')) return;
      try {
        const b64 = hash.slice(7);
        const json = decodeURIComponent(escape(atob(b64)));
        const sharedItems = JSON.parse(json);
        if (!Array.isArray(sharedItems) || !sharedItems.length) return;

        setConfirmData({
          msg: `Recebeu uma watchlist compartilhada com ${sharedItems.length} itens. Deseja importar?`,
          okText: 'Importar',
          icon: '🔗',
          onConfirm: async () => {
            const itemsToImport = sharedItems.map((i: any) => ({
              ...i,
              id: uid(),
              addedAt: i.addedAt || Date.now(),
              updatedAt: Date.now()
            }));
            await importItems(itemsToImport);
            setConfirmData(null);
            window.location.hash = '';
          },
          onCancel: () => {
            setConfirmData(null);
            window.location.hash = '';
          }
        });
      } catch (err) {
        console.error('Erro ao processar link de share', err);
        window.location.hash = '';
      }
    };
    checkShare();
  }, [importItems]);

  // Calcular contagens para os badges das abas
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ['all', 'meio', 'nova-tp', 'nc', 'ficar', 'term', 'dub', 'prio', 'prox', 'alfa'].forEach(tab => {
      counts[tab] = filterByTab(items, tab).length;
    });
    return counts;
  }, [items]);

  // Handlers
  const handleOpenEditModal = useCallback((item: any) => {
    setEditingItem(item);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditingItem(null);
  }, []);

  const handleSaveEdit = useCallback(async (updatedItem: any) => {
    await updateItem(updatedItem);
    setEditingItem(null);
  }, [updateItem]);

  const handleDeleteItem = useCallback(async (item: any) => {
    setConfirmData({
      msg: `Remover "${item.title}" da lista?`,
      okText: 'Remover',
      cancelText: 'Cancelar',
      danger: true,
      icon: '🗑️',
      onConfirm: async () => {
        await softDeleteItem(item.id);
        setConfirmData(null);
      },
      onCancel: () => setConfirmData(null)
    });
  }, [softDeleteItem]);

  const handleOpenDetail = useCallback((item: any) => {
    setSelectedItem(item);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleOpenApiDetail = useCallback((id: any, type: string) => {
    setApiItemToOpen({ id, type });
  }, []);

  const handleCloseApiDetail = useCallback(() => {
    setApiItemToOpen(null);
  }, []);

  const handleOpenFlow = useCallback((apiData: any) => {
    setFlowData(apiData);
    setApiItemToOpen(null);
  }, []);

  const handleConfirmFlow = useCallback(async (finalData: any) => {
    const newItem = {
      id: uid(),
      malId: finalData.mal_id || null,
      tmdbId: finalData.id && finalData.media_type ? finalData.id : null,
      title: finalData.title_english || finalData.title || finalData.name,
      titleAlt: finalData.title !== (finalData.title_english || finalData.title) ? finalData.title : null,
      img: finalData.images?.webp?.large_image_url || finalData.images?.jpg?.large_image_url || (finalData.poster_path ? `https://image.tmdb.org/t/p/w500${finalData.poster_path}` : ''),
      genres: finalData.genresPT || [],
      synopsis: finalData.synopsisPT || finalData.overview || '',
      type: finalData.type || finalData.media_type || 'anime',
      cr: finalData.streamLink?.url || finalData.cr || '',
      crName: finalData.streamLink?.name || finalData.crName || '',
      dub: finalData.dub,
      s: finalData.s,
      ep: finalData.ep,
      _ep: finalData.ep,
      tot: finalData.episodes || finalData.tot || 0,
      st: finalData.st,
      lists: finalData.lists,
      note: finalData.note || '',
      addedAt: Date.now(),
      updatedAt: Date.now(),
    };
    await updateItem(newItem);
    setFlowData(null);
    setIsSearchOpen(false);
  }, [updateItem]);

  const handleAdvEp = useCallback(async (item: any) => {
    const currentEp = item._ep ?? item.ep;
    const updatedItem = { ...item, _ep: currentEp + 1 };
    
    if (item.tot > 0 && updatedItem._ep >= item.tot) {
      updatedItem._done = true;
      updatedItem.st = 'terminado';
      updatedItem.lists = (item.lists || []).filter((l: string) => l !== 'meio').concat('term');
    }
    await updateItem(updatedItem);
  }, [updateItem]);

  const handleRunInject = useCallback(async () => {
    setIsInjectOpen(true);
    await runInject();
  }, [runInject]);

  const handleExport = useCallback(async () => {
    const data = await exportItems();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watchlist_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportItems]);

  const handleImport = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) {
          await importItems(data);
        }
      } catch (err) {
        console.error('Erro ao importar JSON', err);
      }
    };
    reader.readAsText(file);
  }, [importItems]);

  const handleCopyShareLink = useCallback(async () => {
    const compact = items.map(i => ({
      title: i.title,
      img: i.img,
      dub: i.dub,
      st: i.st,
      lists: i.lists,
      ep: i._ep ?? i.ep,
      tot: i.tot,
      s: i.s
    }));
    const json = JSON.stringify(compact);
    const b64 = btoa(unescape(encodeURIComponent(json)));
    const url = `${window.location.origin}${window.location.pathname}#share=${b64}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copiado com sucesso!');
    } catch {
      prompt('Copie o link abaixo:', url);
    }
  }, [items]);

  const handleReset = useCallback(async () => {
    setConfirmData({
      msg: 'Apagar todos os dados permanentemente? Esta ação não pode ser desfeita!',
      okText: 'Reset Total',
      cancelText: 'Cancelar',
      danger: true,
      icon: '⚠',
      onConfirm: async () => {
        await resetAll();
        setConfirmData(null);
        window.location.reload();
      },
      onCancel: () => setConfirmData(null)
    });
  }, [resetAll]);

  if (isLocked) {
    return <LockScreen correctPin={config.appPin} onUnlock={() => setIsLocked(false)} />;
  }

  return (
    <>
      <div id="app">
        <Header 
          onOpenSettings={() => setIsSettingsOpen(true)} 
          onOpenSearch={() => setIsSearchOpen(true)} 
        />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} counts={tabCounts} />
        <SearchBar query={searchQuery} setQuery={setSearchQuery} />
        <Content
          activeTab={activeTab}
          items={items}
          query={searchQuery}
          onOpenEdit={handleOpenEditModal}
          onOpenDetail={handleOpenDetail}
          onUpdateItem={updateItem}
          onDeleteItem={handleDeleteItem}
        />
      </div>

      {editingItem && (
        <EditModal 
          item={editingItem} 
          onClose={() => window.history.back()} 
          onSave={handleSaveEdit} 
        />
      )}

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => window.history.back()}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteItem}
          onAdvEp={handleAdvEp}
        />
      )}

      {apiItemToOpen && (
        <ApiDetailModal
          id={apiItemToOpen.id}
          type={apiItemToOpen.type}
          onClose={() => window.history.back()}
          onAdd={handleOpenFlow}
          tmdbKey={config.tmdbKey}
          items={items}
        />
      )}

      {flowData && (
        <FlowModal
          apiData={flowData}
          onClose={() => window.history.back()}
          onConfirm={handleConfirmFlow}
        />
      )}

      {isSearchOpen && (
        <SearchModal 
          onClose={() => window.history.back()} 
          onOpenManual={() => { setIsSearchOpen(false); setIsManualOpen(true); }}
          onSelectItem={handleOpenApiDetail}
          tmdbKey={config.tmdbKey}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => window.history.back()} 
          config={config}
          onSaveConfig={setConfig}
          onRunInject={handleRunInject}
          onExport={handleExport}
          onImport={handleImport}
          onCopyShareLink={handleCopyShareLink}
          onReset={handleReset}
        />
      )}

      {isManualOpen && (
        <ManualModal onClose={() => window.history.back()} onAdd={updateItem} />
      )}

      {isInjectOpen && (
        <InjectModal status={injectStatus} onClose={() => window.history.back()} />
      )}

      {confirmData && (
        <ConfirmModal 
          msg={confirmData.msg}
          okText={confirmData.okText}
          cancelText={confirmData.cancelText}
          danger={confirmData.danger}
          icon={confirmData.icon}
          onConfirm={confirmData.onConfirm}
          onCancel={() => window.history.back()}
        />
      )}

      <Toast />
    </>
  );
};

export default AppContainer;
