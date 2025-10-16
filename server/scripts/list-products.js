const mongoose = require('mongoose');
const Lipstick = require('../models/Lipstick');
const Eyeshadow = require('../models/Eyeshadow');
const Blush = require('../models/Blush');
const Eyebrows = require('../models/Eyebrows');
const Eyeliner = require('../models/Eyeliners');
require('dotenv').config();

(async function listProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox');

    const [lipsticks, eyeshadows, blushes, eyebrows, eyeliners] = await Promise.all([
      Lipstick.find({}, 'name brand').lean(),
      Eyeshadow.find({}, 'name brand').lean(),
      Blush.find({}, 'name brand').lean(),
      Eyebrows.find({}, 'name brand').lean(),
      Eyeliner.find({}, 'name brand').lean()
    ]);

    const total = lipsticks.length + eyeshadows.length + blushes.length + eyebrows.length + eyeliners.length;

    console.log(`\n📊 Tổng sản phẩm: ${total}`);

    const fmt = arr => arr.map((p, i) => ` ${i + 1}. ${p.brand || ''} ${p.name}`.trim()).join('\n');

    console.log('\n💄 Lipsticks:', lipsticks.length);
    console.log(fmt(lipsticks) || ' (trống)');

    console.log('\n👁️ Eyeshadows:', eyeshadows.length);
    console.log(fmt(eyeshadows) || ' (trống)');

    console.log('\n🌸 Blushes:', blushes.length);
    console.log(fmt(blushes) || ' (trống)');

    console.log('\n👁️‍🗨️ Eyebrows:', eyebrows.length);
    console.log(fmt(eyebrows) || ' (trống)');

    console.log('\n✏️ Eyeliners:', eyeliners.length);
    console.log(fmt(eyeliners) || ' (trống)');

    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi liệt kê sản phẩm:', err);
    process.exit(1);
  }
})();
