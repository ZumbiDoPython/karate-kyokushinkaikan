import React, { useState } from 'react';
import { BlockListEditor } from './BlockEditor';
import {
  createEmptySection,
  reorderByIndex,
  assignSectionPositions,
  assignBlockPositions,
  updateSectionInPage,
} from '../../utils/contentAdminHelpers';
import { getSectionDepthLabel } from '../../utils/contentSchema';

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Estrutura</h3>
          <button
            type="button"
            onClick={addRootSection}
            className="text-sm px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 rounded font-medium"
          >
            + Seção
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-3">Arraste para reordenar (opcional) ou use ↑↓.</p>
        {sections.length === 0 && (
          <p className="text-sm text-gray-500 italic">Nenhuma seção.</p>
        )}
        {sections.map((section, index) => (
          <SectionTreeNode
            key={section.id}
            section={section}
            depth={0}
            selectedSectionId={selectedSectionId}
            onSelectSection={onSelectSection}
            onRemove={removeSection}
            onAddChild={addChildSection}
            onReorderSibling={(from, to) => reorderRoots(from, to)}
            onReorderChild={reorderChildren}
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
        />
      </div>
    </div>
  );
};

/**
 * Painel de edição da seção selecionada.
 */
const SectionDetailPanel = ({ page, selectedSectionId, onUpdate }) => {
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

  return (
    <div className="border border-yellow-400 rounded-lg p-4 bg-white space-y-4">
      <h4 className="font-semibold text-gray-900">{depthLabel}</h4>
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
          onChange={(blocks) => onUpdate(section.id, { blocks: assignBlockPositions(blocks) })}
        />
      </div>
    </div>
  );
};

const SectionTreeNode = ({
  section,
  depth,
  selectedSectionId,
  onSelectSection,
  onRemove,
  onAddChild,
  onReorderSibling,
  onReorderChild,
  siblingIndex,
  siblingTotal,
  parentId,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const isSelected = selectedSectionId === section.id;
  const canAddChild = true;

  const onDragStart = (e) => {
    e.dataTransfer.setData('text/section-index', String(siblingIndex));
    e.dataTransfer.setData('text/parent-id', parentId || '');
    e.stopPropagation();
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const from = parseInt(e.dataTransfer.getData('text/section-index'), 10);
    const dropParent = e.dataTransfer.getData('text/parent-id') || '';
    const myParent = parentId || '';
    if (dropParent !== myParent || Number.isNaN(from) || from === siblingIndex) return;
    if (parentId) {
      onReorderChild(parentId, from, siblingIndex);
    } else {
      onReorderSibling(from, siblingIndex);
    }
  };

  return (
    <div className="mb-2">
      <div
        draggable
        onDragStart={onDragStart}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`flex items-center gap-2 p-2 rounded border text-sm cursor-pointer ${isSelected ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white hover:bg-gray-50'} ${dragOver ? 'ring-2 ring-yellow-300' : ''}`}
        style={{ marginLeft: depth * 16 }}
        onClick={() => onSelectSection(section.id)}
      >
        <span className="flex-1 truncate font-medium">{section.title || '(sem título)'}</span>
        <span className="text-xs text-gray-400">{section.blocks?.length || 0} blocos</span>
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
      {(section.children || []).map((child, childIndex) => (
        <SectionTreeNode
          key={child.id}
          section={child}
          depth={depth + 1}
          selectedSectionId={selectedSectionId}
          onSelectSection={onSelectSection}
          onRemove={onRemove}
          onAddChild={onAddChild}
          onReorderSibling={onReorderSibling}
          onReorderChild={onReorderChild}
          siblingIndex={childIndex}
          siblingTotal={(section.children || []).length}
          parentId={section.id}
        />
      ))}
    </div>
  );
};

export default SectionTreeEditor;
