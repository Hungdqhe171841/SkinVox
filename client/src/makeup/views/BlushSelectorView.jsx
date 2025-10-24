import React from 'react';

function BlushSelectorView({ presets, onSelect }) {
  const handlePresetSelect = (preset) => {
    onSelect(preset);
  };

  return (
    <div className="blush-selector">
      <h3 className="selector-title">Choose Blush Style</h3>
      <div className="presets-grid">
        {presets.map((preset, index) => (
          <button
            key={index}
            className="preset-button"
            onClick={() => handlePresetSelect(preset)}
          >
            <div className="preset-preview">
              <span className="preset-name">{preset.name || `Style ${index + 1}`}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BlushSelectorView;

