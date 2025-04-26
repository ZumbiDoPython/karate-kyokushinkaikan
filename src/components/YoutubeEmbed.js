import React from 'react';
import PropTypes from 'prop-types';

const YoutubeEmbed = ({ embedId }) => (
  <div className="flex justify-center w-full px-4"> {/* Container principal */}
    <div className="relative w-full max-w-4xl" style={{ paddingBottom: '56.25%' }}> {/* Aspect ratio 16:9 */}
      <iframe
        src={`https://www.youtube.com/embed/${embedId}`}
        className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
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