import React from 'react';
import YoutubeEmbed from '../YoutubeEmbed';
import {
  getYoutubeEmbedId,
  parseYoutubeEmbedId,
  reorderByIndex,
  createEmptyBlock,
} from '../../utils/contentAdminHelpers';

/**
 * @param {Object} props
 * @param {import('../../services/contentNormalizer').ContentBlock} props.block
 * @param {number} props.index
 * @param {number} props.total
 * @param {(block: import('../../services/contentNormalizer').ContentBlock) => void} props.onChange
 * @param {() => void} props.onRemove
 * @param {(from: number, to: number) => void} props.onReorder
 */
const BlockEditor = ({ block, index, total, onChange, onRemove, onReorder }) => {
  const updatePayload = (patch) => {
    onChange({
      ...block,
      payload: { ...block.payload, ...patch },
    });
  };

  const moveUp = () => {
    if (index > 0) onReorder(index, index - 1);
  };

  const moveDown = () => {
    if (index < total - 1) onReorder(index, index + 1);
  };

  const embedId = getYoutubeEmbedId(block);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase text-gray-500">
          Bloco: {block.type} · pos {block.position ?? index}
        </span>
        <div className="flex gap-1">
          <button type="button" onClick={moveUp} disabled={index === 0} className="px-2 py-0.5 text-xs border rounded disabled:opacity-40">
            ↑
          </button>
          <button type="button" onClick={moveDown} disabled={index >= total - 1} className="px-2 py-0.5 text-xs border rounded disabled:opacity-40">
            ↓
          </button>
          <button type="button" onClick={onRemove} className="px-2 py-0.5 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50">
            Remover
          </button>
        </div>
      </div>

      {block.type === 'text' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">HTML / parágrafos</label>
          <textarea
            value={block.payload?.html || ''}
            onChange={(e) => updatePayload({ html: e.target.value })}
            rows={6}
            className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm"
            placeholder="<p>Texto...</p>"
          />
        </div>
      )}

      {block.type === 'image' && (
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL da imagem (src)</label>
            <input
              type="url"
              value={block.payload?.src || ''}
              onChange={(e) => updatePayload({ src: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Texto alternativo (alt)</label>
            <input
              type="text"
              value={block.payload?.alt || ''}
              onChange={(e) => updatePayload({ alt: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Legenda (opcional)</label>
            <input
              type="text"
              value={block.payload?.caption || ''}
              onChange={(e) => updatePayload({ caption: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>
          {block.payload?.src && (
            <img
              src={block.payload.src}
              alt={block.payload.alt || ''}
              className="max-h-40 rounded border object-contain"
            />
          )}
        </div>
      )}

      {block.type === 'youtube' && (
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              embedId (YouTube)
            </label>
            <input
              type="text"
              value={embedId}
              onChange={(e) => {
                const id = parseYoutubeEmbedId(e.target.value);
                updatePayload({ videoId: id, embedId: id });
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="dQw4w9WgXcQ ou URL do YouTube"
            />
            <p className="text-xs text-gray-500 mt-1">
              Compatível com <code>YoutubeEmbed</code> — salvo como videoId/embedId.
            </p>
          </div>
          {embedId && (
            <div className="border rounded overflow-hidden bg-white">
              <YoutubeEmbed embedId={embedId} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Lista de blocos com reordenação.
 */
export const BlockListEditor = ({ blocks, onChange }) => {
  const handleReorder = (from, to) => {
    onChange(reorderByIndex(blocks, from, to));
  };

  const handleBlockChange = (index, updated) => {
    const next = blocks.map((b, i) => (i === index ? updated : b));
    onChange(next.map((b, i) => ({ ...b, position: i })));
  };

  const handleRemove = (index) => {
    const next = blocks.filter((_, i) => i !== index).map((b, i) => ({ ...b, position: i }));
    onChange(next);
  };

  const handleAdd = (type) => {
    onChange([...blocks, createEmptyBlock(type, blocks.length)]);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => handleAdd('text')} className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">
          + Texto
        </button>
        <button type="button" onClick={() => handleAdd('image')} className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">
          + Imagem
        </button>
        <button type="button" onClick={() => handleAdd('youtube')} className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">
          + YouTube
        </button>
      </div>
      {blocks.length === 0 && (
        <p className="text-sm text-gray-500 italic">Nenhum bloco nesta seção.</p>
      )}
      {blocks.map((block, index) => (
        <BlockEditor
          key={block.id || index}
          block={block}
          index={index}
          total={blocks.length}
          onChange={(updated) => handleBlockChange(index, updated)}
          onRemove={() => handleRemove(index)}
          onReorder={handleReorder}
        />
      ))}
    </div>
  );
};

export default BlockEditor;
