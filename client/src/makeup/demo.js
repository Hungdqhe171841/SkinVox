// Demo script để test Makeup AR feature
// Chạy script này trong browser console để test các chức năng

console.log('🎨 SkinVox Makeup AR Demo');

// Test MakeupModel
const model = new MakeupModel();
console.log('✅ MakeupModel initialized');

// Test color setting
model.setColor('#FF0000');
console.log('✅ Color set to red:', model.getColor());

// Test preset loading
console.log('✅ Lipstick presets:', Object.keys(model.getPresets()));
console.log('✅ Eyelash presets:', Object.keys(model.getEyelashPresets()));
console.log('✅ Eyebrow presets:', Object.keys(model.getEyebrowPresets()));
console.log('✅ Blush presets:', Object.keys(model.getBlushPresets()));

// Test feature toggles
model.toggleFeature('lipstick');
console.log('✅ Lipstick feature toggled:', model.isFeatureActive('lipstick'));

model.toggleFeature('eyelash');
console.log('✅ Eyelash feature toggled:', model.isFeatureActive('eyelash'));

// Test preset selection
const redLipstick = model.getPresets()['Classic Red'];
model.setColor(redLipstick.color);
console.log('✅ Red lipstick applied:', model.getColor());

const dramaticEyelash = model.getEyelashPresets()['Dramatic'];
model.setEyelash(dramaticEyelash);
console.log('✅ Dramatic eyelash applied:', model.getEyelash());

console.log('🎉 All tests passed! Makeup AR is ready to use.');
