import React from 'react';

const ParallaxBackground = ({ 
  imageUrl = 'https://i.imgur.com/vF5SgMB.png',
}) => {
  return (
    <div 
      className={`
        fixed top-0 left-0 md:left-48 right-0 bottom-0 
        bg-no-repeat pointer-events-none
        bg-center md:bg-[position:63%_center]
        bg-[size:90%_auto] md:bg-[size:56%_auto] 
      `}
      style={{
        backgroundImage: `url('${imageUrl}')`,
        backgroundAttachment: 'fixed',
        opacity: `100%`,
        zIndex: -1
      }}
    />
  );
};

export default ParallaxBackground;