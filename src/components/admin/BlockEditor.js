import React, { useId, useRef, useState } from 'react';
import YoutubeEmbed from '../YoutubeEmbed';
import ImageUrlUploadField from './ImageUrlUploadField';
import TableBlockEditor from './TableBlockEditor';
import {
  getYoutubeEmbedId,
  parseYoutubeEmbedId,
  reorderByIndex,
  createEmptyBlock,
  createImageBlock,
  flattenSectionsForPicker,
} from '../../utils/contentAdminHelpers';
import { IMAGE_WIDTH_PRESETS, normalizeImageWidthPercent, plainTextToHtml, htmlToPlainText } from '../../services/contentNormalizer';
import { uploadImagesToSupabase, isSupabaseStorageConfigured, isImageFile } from '../../services/supabaseStorage';

export const BLOCK_DRAG_MIME = 'application/x-kk-block';

/**
 * @param {DragEvent} e
 * @param {string} blockId
 * @param {string} sourceSectionId
 */
export function setBlockDragData(e, blockId, sourceSectionId) {
  e.dataTransfer.setData(
    BLOCK_DRAG_MIME,
    JSON.stringify({ blockId, sourceSectionId })
  );
  e.dataTransfer.effectAllowed = 'move';
}

/**
 * @param {DragEvent} e
 * @returns {{ blockId: string, sourceSectionId: string }|null}
 */
export function getBlockDragData(e) {
  const raw = e.dataTransfer.getData(BLOCK_DRAG_MIME);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed.blockId && parsed.sourceSectionId) return parsed;
  } catch {
    return null;
  }
  return null;
}

/**
 * @param {{ payload: Record<string, unknown>, onChange: (patch: { widthPercent: number }) => void, hint?: string }} props
 */
const BlockWidthPercentField = ({ payload, onChange, hint }) => {
  const widthPercent = normalizeImageWidthPercent(payload);
  const presetValues = IMAGE_WIDTH_PRESETS.map((p) => p.value);
  const isCustom = !presetValues.includes(widthPercent);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Largura no site</label>
      <select
        value={isCustom ? 'custom' : String(widthPercent)}
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'custom') {
            onChange({ widthPercent: 40 });
          } else {
            onChange({ widthPercent: Number(value) });
          }
        }}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
      >
        {IMAGE_WIDTH_PRESETS.map((preset) => (
          <option key={preset.value} value={String(preset.value)}>
            {preset.label}
          </option>
        ))}
        <option value="custom">Personalizado…</option>
      </select>
      {isCustom && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            min={10}
            max={100}
            step={1}
            value={widthPercent}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (!Number.isNaN(n)) {
                onChange({ widthPercent: Math.min(100, Math.max(10, Math.round(n))) });
              }
            }}
            className="w-24 border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <span className="text-sm text-gray-600">% da coluna</span>
        </div>
      )}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
};

/**
 * @param {Object} props
 * @param {import('../../services/contentNormalizer').ContentBlock} props.block
 * @param {number} props.index
 * @param {number} props.total
 * @param {string} props.currentSectionId
 * @param {import('../../services/contentNormalizer').ContentPage} [props.page]
 * @param {(block: import('../../services/contentNormalizer').ContentBlock) => void} props.onChange
 * @param {() => void} props.onRemove
 * @param {(from: number, to: number) => void} props.onReorder
 * @param {(targetSectionId: string) => void} [props.onMoveToSection]
 */
const BlockEditor = ({
  block,
  index,
  total,
  currentSectionId,
  page,
  onChange,
  onRemove,
  onReorder,
  onMoveToSection,
  uploadFolder = 'cms',
}) => {
  if (!block?.type) return null;

  const updatePayload = (patch) => {
    onChange({
      ...block,
      payload: { ...(block.payload || {}), ...patch },
    });
  };

  const moveUp = () => {
    if (index > 0) onReorder(index, index - 1);
  };

  const moveDown = () => {
    if (index < total - 1) onReorder(index, index + 1);
  };

  const embedId = getYoutubeEmbedId(block);

  const sectionOptions = page
    ? flattenSectionsForPicker(page).filter((opt) => opt.sectionId !== currentSectionId)
    : [];

  const onBlockDragStart = (e) => {
    e.stopPropagation();
    if (!block.id) return;
    setBlockDragData(e, block.id, currentSectionId);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          {block.id && onMoveToSection && (
            <span
              draggable
              onDragStart={onBlockDragStart}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 px-1 select-none"
              title="Arrastar para outra seção"
            >
              ⠿
            </span>
          )}
          <span className="text-xs font-semibold uppercase text-gray-500 truncate">
            Bloco: {block.type} · pos {block.position ?? index}
          </span>
        </div>
        <div className="flex gap-1 flex-wrap">
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

      {onMoveToSection && sectionOptions.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Mover para seção</label>
          <select
            defaultValue=""
            onChange={(e) => {
              const target = e.target.value;
              if (target) {
                onMoveToSection(target);
                e.target.value = '';
              }
            }}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white"
          >
            <option value="">Escolha a seção de destino...</option>
            {sectionOptions.map((opt) => (
              <option key={opt.sectionId} value={opt.sectionId}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Ou arraste pelo ícone ⠿ para uma seção na árvore.</p>
        </div>
      )}

      {block.type === 'text' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Texto</label>
          <textarea
            value={htmlToPlainText(block.payload?.html || '')}
            onChange={(e) => updatePayload({ html: plainTextToHtml(e.target.value) })}
            rows={8}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm leading-relaxed"
            placeholder="Digite o texto. Enter = nova linha. Linha em branco = novo parágrafo."
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter cria quebra de linha no site. Duas quebras seguidas iniciam um parágrafo novo.
          </p>
        </div>
      )}

      {block.type === 'subtitle' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
          <input
            type="text"
            value={block.payload?.text || ''}
            onChange={(e) => updatePayload({ text: e.target.value })}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            placeholder="Ex.: Resultados do campeonato regional"
          />
          <p className="text-xs text-gray-500 mt-1">
            Aparece como subtítulo entre parágrafos no site (notícias).
          </p>
        </div>
      )}

      {block.type === 'image' && (
        <div className="space-y-3">
          <ImageUrlUploadField
            label="URL ou upload (Supabase)"
            value={block.payload?.src || ''}
            onChange={(src) => updatePayload({ src })}
            uploadFolder={uploadFolder}
          />
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
          <BlockWidthPercentField
            payload={block.payload || {}}
            onChange={updatePayload}
            hint='25% ≈ metade do tamanho "padrão" anterior. Clique na imagem no site para ampliar.'
          />
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={block.payload?.inGallery !== false}
              onChange={(e) => updatePayload({ inGallery: e.target.checked })}
              className="rounded border-gray-300 mt-1"
            />
            <span>
              Agrupar em galeria com imagens seguidas
              <span className="block text-xs text-gray-500 font-normal mt-0.5">
                Desmarcado = imagem solta no texto (não entra no mosaico), mesmo entre outras fotos.
              </span>
            </span>
          </label>
        </div>
      )}

      {block.type === 'link' && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Texto do link</label>
            <input
              type="text"
              value={block.payload?.label || ''}
              onChange={(e) => updatePayload({ label: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              placeholder="Clique aqui"
            />
            <p className="text-xs text-gray-500 mt-1">O que o visitante vê (ex.: &quot;Clique aqui&quot;, &quot;Saiba mais&quot;).</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de destino</label>
            <input
              type="url"
              value={block.payload?.href || ''}
              onChange={(e) => updatePayload({ href: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm font-mono"
              placeholder="https://exemplo.com/pagina"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={block.payload?.openInNewTab !== false}
              onChange={(e) => updatePayload({ openInNewTab: e.target.checked })}
              className="rounded border-gray-300"
            />
            Abrir em nova aba
          </label>
          {block.payload?.label && block.payload?.href && (
            <div className="border rounded p-3 bg-white text-sm content-text">
              Pré-visualização:{' '}
              <a
                href={block.payload.href}
                target={block.payload?.openInNewTab !== false ? '_blank' : undefined}
                rel={block.payload?.openInNewTab !== false ? 'noopener noreferrer' : undefined}
                className="text-blue-600 underline"
              >
                {block.payload.label}
              </a>
            </div>
          )}
        </div>
      )}

      {block.type === 'table' && (
        <TableBlockEditor
          payload={block.payload || {}}
          onChange={updatePayload}
          widthField={
            <BlockWidthPercentField
              payload={block.payload || {}}
              onChange={updatePayload}
              hint="Largura da tabela na coluna de conteúdo."
            />
          }
        />
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
          <BlockWidthPercentField
            payload={block.payload || {}}
            onChange={updatePayload}
            hint="O vídeo mantém proporção 16:9. 25% ≈ metade do tamanho padrão."
          />
          {embedId && (
            <div className="border rounded overflow-hidden bg-white">
              <YoutubeEmbed
                embedId={embedId}
                widthPercent={normalizeImageWidthPercent(block.payload)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Lista de blocos com reordenação e movimentação entre seções.
 */
export const BlockListEditor = ({
  blocks,
  onChange,
  uploadFolder = 'cms',
  page,
  currentSectionId,
  onMoveBlock,
  allowSubtitleBlock = false,
}) => {
  const multiInputId = useId();
  const multiInputRef = useRef(null);
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;
  const [multiUploading, setMultiUploading] = useState(false);
  const [multiProgress, setMultiProgress] = useState('');
  const [multiError, setMultiError] = useState('');
  const storageReady = isSupabaseStorageConfigured();

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

  const handleMultipleImages = async (e) => {
    const files = e.target.files;
    e.target.value = '';
    if (!files?.length) return;

    const fileList = Array.from(files).filter(isImageFile);
    if (!fileList.length) {
      setMultiError(
        `Nenhuma imagem válida (${files.length} arquivo(s) ignorado(s)). Use JPG, PNG, WebP ou GIF.`
      );
      return;
    }

    if (fileList.length < files.length) {
      setMultiError(
        `${files.length - fileList.length} arquivo(s) ignorado(s) — apenas imagens JPG, PNG, WebP ou GIF.`
      );
    } else {
      setMultiError('');
    }

    setMultiUploading(true);
    setMultiProgress(`0/${fileList.length}`);

    try {
      const uploaded = [];
      for (let i = 0; i < fileList.length; i += 1) {
        setMultiProgress(`${i + 1}/${fileList.length}`);
        const batch = await uploadImagesToSupabase([fileList[i]], { folder: uploadFolder });
        uploaded.push(...batch);
      }

      const currentBlocks = blocksRef.current;
      const start = currentBlocks.length;
      const newBlocks = uploaded.map(({ url }, i) => createImageBlock(url, start + i));
      onChange([...currentBlocks, ...newBlocks].map((b, i) => ({ ...b, position: i })));
      setMultiError('');
    } catch (err) {
      setMultiError(err instanceof Error ? err.message : 'Falha no upload');
    } finally {
      setMultiUploading(false);
      setMultiProgress('');
    }
  };

  const handleBlockDrop = (e) => {
    e.preventDefault();
    const data = getBlockDragData(e);
    if (!data || !onMoveBlock || data.sourceSectionId === currentSectionId) return;
    onMoveBlock(data.blockId, data.sourceSectionId, currentSectionId);
  };

  return (
    <div
      className="space-y-3"
      onDragOver={(e) => {
        const types = Array.from(e.dataTransfer?.types || []);
        if (types.includes(BLOCK_DRAG_MIME)) {
          e.preventDefault();
        }
      }}
      onDrop={handleBlockDrop}
    >
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => handleAdd('text')} className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">
          + Texto
        </button>
        {allowSubtitleBlock && (
          <button type="button" onClick={() => handleAdd('subtitle')} className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">
            + Subtítulo
          </button>
        )}
        <button type="button" onClick={() => handleAdd('image')} className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">
          + Imagem
        </button>
        <input
          id={multiInputId}
          ref={multiInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/*,.jpg,.jpeg,.png,.webp,.gif"
          multiple
          className="sr-only"
          onChange={handleMultipleImages}
          tabIndex={-1}
        />
        <label
          htmlFor={multiInputId}
          className={`text-xs px-2 py-1 bg-yellow-500 rounded font-medium ${
            !storageReady || multiUploading
              ? 'opacity-50 pointer-events-none cursor-not-allowed'
              : 'hover:bg-yellow-600 cursor-pointer'
          }`}
          title="Selecione várias fotos de uma vez"
        >
          {multiUploading
            ? `Enviando ${multiProgress}...`
            : '+ Várias imagens'}
        </label>
        <button type="button" onClick={() => handleAdd('youtube')} className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">
          + YouTube
        </button>
        <button type="button" onClick={() => handleAdd('link')} className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">
          + Link externo
        </button>
        <button type="button" onClick={() => handleAdd('table')} className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50">
          + Tabela
        </button>
      </div>
      {multiError && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">{multiError}</p>
      )}
      {!storageReady && (
        <p className="text-xs text-amber-700">
          Upload de várias imagens requer Supabase S3 no <code>.env</code>.
        </p>
      )}
      {blocks.length === 0 && (
        <p className="text-sm text-gray-500 italic border border-dashed border-gray-300 rounded p-4 text-center">
          Nenhum bloco nesta seção. Solte aqui um bloco arrastado de outra seção.
        </p>
      )}
      {blocks.map((block, index) => (
        <BlockEditor
          key={block.id || index}
          block={block}
          index={index}
          total={blocks.length}
          page={page}
          currentSectionId={currentSectionId}
          uploadFolder={uploadFolder}
          onChange={(updated) => handleBlockChange(index, updated)}
          onRemove={() => handleRemove(index)}
          onReorder={handleReorder}
          onMoveToSection={
            onMoveBlock && block.id
              ? (targetSectionId) => onMoveBlock(block.id, currentSectionId, targetSectionId)
              : undefined
          }
        />
      ))}
    </div>
  );
};

export default BlockEditor;
