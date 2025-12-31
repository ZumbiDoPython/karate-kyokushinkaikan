import React from 'react';
import PropTypes from 'prop-types';

const YoutubeEmbed = ({ embedId }) => (
  <div className="mx-auto w-full max-w-4xl px-4 mb-6"> {/* Container principal centralizado */}
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}> {/* Aspect ratio 16:9 */}
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

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired
};

export default YoutubeEmbed;