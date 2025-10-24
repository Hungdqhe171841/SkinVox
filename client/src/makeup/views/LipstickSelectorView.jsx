import React from 'react';

function LipstickSelectorView({ shades, onSelect }) {
  const handleShadeSelect = (shadeName, shadeData) => {
    onSelect(shadeData.color);
  };

  return (
    <div className="lipstick-selector">
      <h3 className="selector-title">Choose Lipstick Shade</h3>
      <div className="shades-grid">
        {Object.entries(shades).map(([shadeName, shadeData]) => (
          <button
            key={shadeName}
            className="shade-button"
            style={{ backgroundColor: shadeData.color }}
            onClick={() => handleShadeSelect(shadeName, shadeData)}
            title={shadeName}
          >
            <span className="shade-name">{shadeName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LipstickSelectorView;

