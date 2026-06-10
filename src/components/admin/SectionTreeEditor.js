import React, { useState, useCallback } from 'react';
import { BlockListEditor, getBlockDragData, BLOCK_DRAG_MIME } from './BlockEditor';
import {
  createEmptySection,
  reorderByIndex,
  assignSectionPositions,
  assignBlockPositions,
  updateSectionInPage,
  moveBlockInPage,
  moveSectionInPage,
  moveAllBlocksToSection,
  flattenSectionsForPicker,
  getSectionDescendantIds,
  isSectionDescendant,
  setSectionDragData,
  getSectionDragData,
  SECTION_DRAG_MIME,
} from '../../utils/contentAdminHelpers';
import { getSectionDepthLabel } from '../../utils/contentSchema';

/**
 * @param {import('../../services/contentNormalizer').ContentSection[]} sections
 */
function collectSectionIdsWithChildren(sections) {
  /** @type {string[]} */
  const ids = [];
  const walk = (list) => {
    (list || []).forEach((s) => {
      if ((s.children || []).length > 0) {
        ids.push(s.id);
        walk(s.children);
      }
    });
  };
  walk(sections);
  return ids;
}

/**
 * @param {import('../../services/contentNormalizer').ContentPage} page
 * @param {string} sectionId
 * @param {import('../../services/contentNormalizer').ContentSection} patch
 */
function patchSectionInPage(page, sectionId, patch) {
  return updateSectionInPage(page, sectionId, patch);
}

/**
 * @param {Object} props
 * @param {import('../../services/contentNormalizer').ContentPage} props.page
 * @param {(page: import('../../services/contentNormalizer').ContentPage) => void} props.onChange
 * @param {string|null} props.selectedSectionId
 * @param {(id: string|null) => void} props.onSelectSection
 */
const SectionTreeEditor = ({ page, onChange, selectedSectionId, onSelectSection }) => {
  const sections = page.sections || [];
  const uploadFolder = page.slug ? `cms/${page.slug}` : 'cms';
  const [collapsedIds, setCollapsedIds] = useState(() => new Set());

  const toggleCollapse = useCallback((sectionId) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }, []);

  const collapseAll = () => {
    setCollapsedIds(new Set(collectSectionIdsWithChildren(sections)));
  };

  const expandAll = () => {
    setCollapsedIds(new Set());
  };

  const updateSections = (nextSections) => {
    onChange({ ...page, sections: assignSectionPositions(nextSections) });
  };

  const updateSection = (sectionId, patch) => {
    onChange(patchSectionInPage(page, sectionId, patch));
  };

  const removeSection = (sectionId) => {
    if (!window.confirm('Remover esta seção e todo o conteúdo filho?')) return;
    const filter = (list) =>
      list
        .filter((s) => s.id !== sectionId)
        .map((s) => ({ ...s, children: filter(s.children || []) }));
    onChange({ ...page, sections: assignSectionPositions(filter(sections)) });
    if (selectedSectionId === sectionId) onSelectSection(null);
  };

  const addRootSection = () => {
    const sec = createEmptySection({ position: sections.length });
    updateSections([...sections, sec]);
    onSelectSection(sec.id);
  };

  const addChildSection = (parentId) => {
    const child = createEmptySection({ parentId });

    const patch = (list) =>
      list.map((s) => {
        if (s.id === parentId) {
          return {
            ...s,
            children: assignSectionPositions([...(s.children || []), child]),
          };
        }
        return { ...s, children: patch(s.children || []) };
      });

    onChange({ ...page, sections: assignSectionPositions(patch(sections)) });
    onSelectSection(child.id);
  };

  const reorderRoots = (from, to) => {
    updateSections(reorderByIndex(sections, from, to));
  };

  const reorderChildren = (parentId, from, to) => {
    const patch = (list) =>
      list.map((s) => {
        if (s.id === parentId) {
          return { ...s, children: assignSectionPositions(reorderByIndex(s.children || [], from, to)) };
        }
        return { ...s, children: patch(s.children || []) };
      });
    onChange({ ...page, sections: assignSectionPositions(patch(sections)) });
  };

  const handleMoveBlock = (blockId, sourceSectionId, targetSectionId) => {
    const next = moveBlockInPage(page, blockId, targetSectionId);
    onChange(next);
    onSelectSection(targetSectionId);
  };

  const handleMoveSection = (sectionId, targetParentId, targetIndex) => {
    const next = moveSectionInPage(page, sectionId, targetParentId, targetIndex);
    onChange(next);
    onSelectSection(sectionId);
  };

  const handleMoveAllBlocks = (sourceSectionId, targetSectionId) => {
    const source = (() => {
      const walk = (list) => {
        for (const s of list || []) {
          if (s.id === sourceSectionId) return s;
          const found = walk(s.children);
          if (found) return found;
        }
        return null;
      };
      return walk(sections);
    })();
    const count = source?.blocks?.length || 0;
    if (!count) return;
    if (!window.confirm(`Mover ${count} bloco(s) desta seção para o destino escolhido?`)) return;
    const next = moveAllBlocksToSection(page, sourceSectionId, targetSectionId);
    onChange(next);
    onSelectSection(targetSectionId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Estrutura</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={collapseAll}
              className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
              title="Recolher todas as subseções"
            >
              Recolher tudo
            </button>
            <button
              type="button"
              onClick={expandAll}
              className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50"
              title="Expandir todas as subseções"
            >
              Expandir tudo
            </button>
            <button
              type="button"
              onClick={addRootSection}
              className="text-sm px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 rounded font-medium"
            >
              + Seção
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Use ▶/▼ para recolher subseções. Arraste seções para reordenar ou aninhar. Blocos (⠿) podem ir para
          qualquer seção; no painel à direita você pode mover todos os blocos de uma vez.
        </p>
        <RootSectionDropZone onMoveSection={handleMoveSection} />
        {sections.length === 0 && (
          <p className="text-sm text-gray-500 italic">Nenhuma seção.</p>
        )}
        {sections.map((section, index) => (
          <SectionTreeNode
            key={section.id}
            page={page}
            section={section}
            depth={0}
            selectedSectionId={selectedSectionId}
            onSelectSection={onSelectSection}
            onRemove={removeSection}
            onAddChild={addChildSection}
            onReorderSibling={(from, to) => reorderRoots(from, to)}
            onReorderChild={reorderChildren}
            onDropBlock={handleMoveBlock}
            onMoveSection={handleMoveSection}
            collapsedIds={collapsedIds}
            onToggleCollapse={toggleCollapse}
            siblingIndex={index}
            siblingTotal={sections.length}
            parentId={null}
          />
        ))}
      </div>

      <div className="lg:sticky lg:top-4 lg:self-start">
        <SectionDetailPanel
          page={page}
          selectedSectionId={selectedSectionId}
          onUpdate={updateSection}
          onMoveBlock={handleMoveBlock}
          onMoveSection={handleMoveSection}
          onMoveAllBlocks={handleMoveAllBlocks}
          uploadFolder={uploadFolder}
        />
      </div>
    </div>
  );
};

/**
 * Painel de edição da seção selecionada.
 */
const SectionDetailPanel = ({ page, selectedSectionId, onUpdate, onMoveBlock, onMoveSection, onMoveAllBlocks, uploadFolder }) => {
  const find = (list, id) => {
    for (const s of list) {
      if (s.id === id) return s;
      const inChild = find(s.children || [], id);
      if (inChild) return inChild;
    }
    return null;
  };

  const section = selectedSectionId ? find(page.sections || [], selectedSectionId) : null;

  if (!section) {
    return (
      <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500 text-sm">
        Selecione uma seção na árvore para editar título, blocos e subseções.
      </div>
    );
  }

  const depthLabel = (() => {
    const walk = (list, d) => {
      for (const s of list) {
        if (s.id === section.id) return d;
        const r = walk(s.children || [], d + 1);
        if (r !== -1) return r;
      }
      return -1;
    };
    const depth = walk(page.sections || [], 0);
    return depth >= 0 ? getSectionDepthLabel(depth) : 'Seção';
  })();

  const sectionDestinations = (() => {
    const excluded = new Set([section.id, ...getSectionDescendantIds(section)]);
    return flattenSectionsForPicker(page).filter((d) => !excluded.has(d.sectionId));
  })();

  return (
    <div className="border border-yellow-400 rounded-lg p-4 bg-white space-y-4">
      <h4 className="font-semibold text-gray-900">{depthLabel}</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Mover subseção para</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          value=""
          onChange={(e) => {
            const value = e.target.value;
            if (!value) return;
            if (value === '__root__') {
              onMoveSection(section.id, null);
            } else {
              onMoveSection(section.id, value);
            }
            e.target.value = '';
          }}
        >
          <option value="">— escolher destino —</option>
          <option value="__root__">Nível principal (raiz da página)</option>
          {sectionDestinations.map((d) => (
            <option key={d.sectionId} value={d.sectionId}>
              {'\u00A0'.repeat(d.depth * 2)}
              {d.label}
            </option>
          ))}
        </select>
      </div>
      {(section.blocks || []).length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mover todos os blocos para</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value=""
            onChange={(e) => {
              const value = e.target.value;
              if (!value) return;
              onMoveAllBlocks(section.id, value);
              e.target.value = '';
            }}
          >
            <option value="">— escolher seção de destino —</option>
            {sectionDestinations.map((d) => (
              <option key={d.sectionId} value={d.sectionId}>
                {'\u00A0'.repeat(d.depth * 2)}
                {d.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Move apenas o conteúdo (blocos) desta seção — subseções permanecem aqui.
          </p>
        </div>
      )}
      <div className="grid gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={section.title || ''}
            onChange={(e) => onUpdate(section.id, { title: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ID (âncora / menu)</label>
          <input
            type="text"
            value={section.id || ''}
            onChange={(e) => onUpdate(section.id, { id: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
          <input
            type="text"
            value={section.subtitle || ''}
            onChange={(e) => onUpdate(section.id, { subtitle: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <h5 className="text-sm font-semibold text-gray-800 mb-2">Blocos</h5>
        <BlockListEditor
          blocks={section.blocks || []}
          page={page}
          currentSectionId={section.id}
          uploadFolder={uploadFolder}
          onMoveBlock={onMoveBlock}
          onChange={(blocks) => onUpdate(section.id, { blocks: assignBlockPositions(blocks) })}
        />
      </div>
    </div>
  );
};

const RootSectionDropZone = ({ onMoveSection }) => {
  const [dragOver, setDragOver] = useState(false);

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const sectionData = getSectionDragData(e);
    if (!sectionData) return;
    onMoveSection(sectionData.sectionId, null);
  };

  return (
    <div
      onDragOver={(e) => {
        if (!Array.from(e.dataTransfer.types || []).includes(SECTION_DRAG_MIME)) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`mb-3 px-3 py-2 rounded border border-dashed text-xs text-center ${
        dragOver ? 'border-yellow-500 bg-yellow-50 text-yellow-900' : 'border-gray-300 text-gray-500'
      }`}
    >
      Nível principal — solte aqui para mover a seção para a raiz
    </div>
  );
};

const SectionTreeNode = ({
  page,
  section,
  depth,
  selectedSectionId,
  onSelectSection,
  onRemove,
  onAddChild,
  onReorderSibling,
  onReorderChild,
  onDropBlock,
  onMoveSection,
  collapsedIds,
  onToggleCollapse,
  siblingIndex,
  siblingTotal,
  parentId,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [blockDragOver, setBlockDragOver] = useState(false);
  const isSelected = selectedSectionId === section.id;
  const canAddChild = true;
  const hasChildren = (section.children || []).length > 0;
  const isCollapsed = collapsedIds.has(section.id);

  const onDragStart = (e) => {
    setSectionDragData(e, {
      sectionId: section.id,
      parentId: parentId || null,
      siblingIndex,
    });
    e.stopPropagation();
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    setBlockDragOver(false);

    const blockData = getBlockDragData(e);
    if (blockData && onDropBlock) {
      if (blockData.sourceSectionId !== section.id) {
        onDropBlock(blockData.blockId, blockData.sourceSectionId, section.id);
      }
      return;
    }

    const sectionData = getSectionDragData(e);
    if (sectionData && onMoveSection) {
      const { sectionId: draggedId, parentId: dragParentId, siblingIndex: fromIndex } = sectionData;
      if (draggedId === section.id) return;
      if (isSectionDescendant(page, draggedId, section.id)) return;

      const dropParentId = parentId || null;
      const dragParent = dragParentId || null;

      if (dragParent === dropParentId) {
        if (fromIndex === siblingIndex) return;
        if (parentId) {
          onReorderChild(parentId, fromIndex, siblingIndex);
        } else {
          onReorderSibling(fromIndex, siblingIndex);
        }
        return;
      }

      if (dropParentId === null && dragParent !== null) {
        onMoveSection(draggedId, null, siblingIndex);
        return;
      }

      onMoveSection(draggedId, section.id);
      return;
    }
  };

  return (
    <div className="mb-2">
      <div
        draggable
        onDragStart={onDragStart}
        onDragOver={(e) => {
          e.preventDefault();
          const types = Array.from(e.dataTransfer.types || []);
          if (types.includes(BLOCK_DRAG_MIME)) {
            setBlockDragOver(true);
          } else if (types.includes(SECTION_DRAG_MIME)) {
            setDragOver(true);
          }
        }}
        onDragLeave={() => {
          setDragOver(false);
          setBlockDragOver(false);
        }}
        onDrop={onDrop}
        className={`flex items-center gap-2 p-2 rounded border text-sm cursor-pointer ${isSelected ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white hover:bg-gray-50'} ${blockDragOver ? 'ring-2 ring-blue-400 bg-blue-50' : ''} ${dragOver && !blockDragOver ? 'ring-2 ring-yellow-300' : ''}`}
        style={{ marginLeft: depth * 16 }}
        onClick={() => onSelectSection(section.id)}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse(section.id);
            }}
            className="shrink-0 w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-800 border border-gray-200 rounded text-xs"
            title={isCollapsed ? 'Expandir subseções' : 'Recolher subseções'}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? '▶' : '▼'}
          </button>
        ) : (
          <span className="w-5 shrink-0" aria-hidden />
        )}
        <span className="flex-1 truncate font-medium">{section.title || '(sem título)'}</span>
        <span className="text-xs text-gray-400 shrink-0">
          {section.blocks?.length || 0} blocos
          {hasChildren ? ` · ${section.children.length} sub` : ''}
        </span>
        <button
          type="button"
          disabled={siblingIndex === 0}
          onClick={(e) => {
            e.stopPropagation();
            parentId ? onReorderChild(parentId, siblingIndex, siblingIndex - 1) : onReorderSibling(siblingIndex, siblingIndex - 1);
          }}
          className="px-1 text-xs border rounded disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          disabled={siblingIndex >= siblingTotal - 1}
          onClick={(e) => {
            e.stopPropagation();
            parentId ? onReorderChild(parentId, siblingIndex, siblingIndex + 1) : onReorderSibling(siblingIndex, siblingIndex + 1);
          }}
          className="px-1 text-xs border rounded disabled:opacity-30"
        >
          ↓
        </button>
        {canAddChild && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddChild(section.id);
            }}
            className="px-1 text-xs border rounded"
          >
            +Sub
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(section.id);
          }}
          className="px-1 text-xs text-red-600 border border-red-200 rounded"
        >
          ×
        </button>
      </div>
      {hasChildren && !isCollapsed &&
        (section.children || []).map((child, childIndex) => (
        <SectionTreeNode
          key={child.id}
          page={page}
          section={child}
          depth={depth + 1}
          selectedSectionId={selectedSectionId}
          onSelectSection={onSelectSection}
          onRemove={onRemove}
          onAddChild={onAddChild}
          onReorderSibling={onReorderSibling}
          onReorderChild={onReorderChild}
          onDropBlock={onDropBlock}
          onMoveSection={onMoveSection}
          collapsedIds={collapsedIds}
          onToggleCollapse={onToggleCollapse}
          siblingIndex={childIndex}
          siblingTotal={(section.children || []).length}
          parentId={section.id}
        />
      ))}
    </div>
  );
};

export default SectionTreeEditor;
