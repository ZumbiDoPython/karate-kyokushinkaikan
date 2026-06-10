import React from 'react';
import { normalizeImageWidthPercent } from '../services/contentNormalizer';

/**
 * @param {{ payload: import('../services/contentNormalizer').TableBlockPayload }} props
 */
const ContentTable = ({ payload }) => {
  const { headers = [], rows = [], caption = '' } = payload || {};
  if (!headers.length) return null;

  const pct = normalizeImageWidthPercent(payload);
  const widthStyle =
    pct >= 100 ? { maxWidth: '100%' } : { width: `${pct}%`, maxWidth: `${pct}%` };

  return (
    <figure className="mx-auto mb-4" style={widthStyle}>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 text-sm text-gray-800">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((header, index) => (
                <th
                  key={`h-${index}`}
                  className="border border-gray-300 px-3 py-2 text-left font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="border border-gray-300 px-3 py-2 text-gray-500 italic text-center"
                >
                  —
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={`r-${rowIndex}`} className={rowIndex % 2 === 1 ? 'bg-gray-50' : ''}>
                  {headers.map((_, colIndex) => (
                    <td
                      key={`c-${rowIndex}-${colIndex}`}
                      className="border border-gray-300 px-3 py-2 align-top"
                    >
                      {row.cells?.[colIndex] ?? ''}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-gray-600 text-center">{caption}</figcaption>
      )}
    </figure>
  );
};

export default ContentTable;
