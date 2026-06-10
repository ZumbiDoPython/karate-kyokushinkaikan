import React from 'react';
import ContentTable from '../ContentTable';
import { normalizeTablePayload } from '../../services/contentNormalizer';

/**
 * @param {{ payload: Record<string, unknown>, onChange: (patch: Record<string, unknown>) => void, widthField: React.ReactNode }} props
 */
const TableBlockEditor = ({ payload, onChange, widthField }) => {
  const table = normalizeTablePayload(payload);
  const { headers, rows, caption } = table;

  const updateHeaders = (nextHeaders) => {
    const colCount = nextHeaders.length;
    const nextRows = rows.map((row) => {
      const cells = [...row.cells];
      while (cells.length < colCount) cells.push('');
      return { cells: cells.slice(0, colCount) };
    });
    onChange({ headers: nextHeaders, rows: nextRows });
  };

  const updateCell = (rowIndex, colIndex, value) => {
    const nextRows = rows.map((row, ri) => {
      if (ri !== rowIndex) return row;
      const cells = [...row.cells];
      cells[colIndex] = value;
      return { cells };
    });
    onChange({ rows: nextRows });
  };

  const addColumn = () => {
    updateHeaders([...headers, `Coluna ${headers.length + 1}`]);
  };

  const removeColumn = (colIndex) => {
    if (headers.length <= 1) return;
    const nextHeaders = headers.filter((_, i) => i !== colIndex);
    const nextRows = rows.map((row) => ({
      cells: row.cells.filter((_, i) => i !== colIndex),
    }));
    onChange({ headers: nextHeaders, rows: nextRows });
  };

  const addRow = () => {
    onChange({ rows: [...rows, { cells: headers.map(() => '') }] });
  };

  const removeRow = (rowIndex) => {
    onChange({ rows: rows.filter((_, i) => i !== rowIndex) });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={addColumn}
          className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50"
        >
          + Coluna
        </button>
        <button
          type="button"
          onClick={addRow}
          className="text-xs px-2 py-1 bg-white border rounded hover:bg-gray-50"
        >
          + Linha
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, colIndex) => (
                <th key={`edit-h-${colIndex}`} className="border border-gray-200 p-1 align-top">
                  <input
                    type="text"
                    value={header}
                    onChange={(e) => {
                      const next = [...headers];
                      next[colIndex] = e.target.value;
                      updateHeaders(next);
                    }}
                    className="w-full min-w-[7rem] border border-gray-300 rounded px-2 py-1 text-sm font-semibold"
                    placeholder={`Coluna ${colIndex + 1}`}
                  />
                  {headers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColumn(colIndex)}
                      className="mt-1 text-xs text-red-600 hover:underline"
                    >
                      Remover coluna
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`edit-r-${rowIndex}`}>
                {headers.map((_, colIndex) => (
                  <td key={`edit-c-${rowIndex}-${colIndex}`} className="border border-gray-200 p-1">
                    <textarea
                      value={row.cells[colIndex] ?? ''}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      rows={2}
                      className="w-full min-w-[7rem] border border-gray-300 rounded px-2 py-1 text-sm resize-y"
                    />
                  </td>
                ))}
                <td className="border-0 p-1 align-top">
                  <button
                    type="button"
                    onClick={() => removeRow(rowIndex)}
                    className="text-xs text-red-600 hover:underline whitespace-nowrap"
                  >
                    Remover linha
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Legenda (opcional)</label>
        <input
          type="text"
          value={caption}
          onChange={(e) => onChange({ caption: e.target.value })}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          placeholder="Ex.: Tabela de resultados"
        />
      </div>

      {widthField}

      <div>
        <p className="text-xs font-medium text-gray-600 mb-2">Pré-visualização</p>
        <ContentTable payload={table} />
      </div>
    </div>
  );
};

export default TableBlockEditor;
