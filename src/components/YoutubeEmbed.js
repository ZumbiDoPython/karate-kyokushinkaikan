import React from 'react';
import PropTypes from 'prop-types';
import { normalizeImageWidthPercent } from '../services/contentNormalizer';

const YoutubeEmbed = ({ embedId, widthPercent = 100 }) => {
  const pct = normalizeImageWidthPercent({ widthPercent });
  const widthStyle =
    pct >= 100 ? { maxWidth: '100%' } : { width: `${pct}%`, maxWidth: `${pct}%` };

  return (
    <div className="mx-auto mb-6 text-center" style={widthStyle}>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${embedId}`}
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      </div>
    </div>
  );
};

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
  widthPercent: PropTypes.number,
};

export default YoutubeEmbed;
