import React from 'react';

/**
 * @param {{ author: import('../services/newsNormalizer').ArticleAuthor|null }} props
 */
const ArticleAuthorFooter = ({ author }) => {
  if (!author?.name) return null;

  return (
    <footer className="mt-10 pt-6 border-t border-gray-200 flex gap-4 items-start">
      {author.photo && (
        <img
          src={author.photo}
          alt={author.name}
          className="w-16 h-16 rounded-full object-cover flex-shrink-0 border border-gray-200"
        />
      )}
      <div>
        <p className="text-sm text-gray-500">Escrito por</p>
        <p className="font-semibold text-gray-900">{author.name}</p>
        {author.bio && (
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{author.bio}</p>
        )}
      </div>
    </footer>
  );
};

export default ArticleAuthorFooter;
