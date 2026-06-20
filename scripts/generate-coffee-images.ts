import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'products');

const products = [
  { name: 'espresso-blend', prompt: 'Professional product photography of premium dark roasted espresso coffee beans in an elegant matte black bag with minimalist label, warm studio lighting, dark moody background, high-end commercial coffee brand aesthetic, ultra detailed, 8k' },
  { name: 'arabica-gold', prompt: 'Professional product photography of premium light roast Arabica coffee beans in a cream colored kraft bag with gold minimalist label, soft warm lighting, clean beige background, luxury coffee brand aesthetic, ultra detailed, 8k' },
  { name: 'cold-brew', prompt: 'Professional product photography of a glass bottle of cold brew coffee with minimalist label, condensation droplets, dark slate background, dramatic side lighting, premium craft coffee aesthetic, ultra detailed, 8k' },
  { name: 'french-press', prompt: 'Professional product photography of a modern glass french press coffee maker with dark coffee inside, minimalist design, warm wooden table, soft natural light, premium lifestyle coffee aesthetic, ultra detailed, 8k' },
  { name: 'latte-mix', prompt: 'Professional product photography of premium instant latte coffee powder in an elegant white jar with minimalist gold label, clean cream background, soft warm lighting, luxury coffee brand aesthetic, ultra detailed, 8k' },
  { name: 'turkish-coffee', prompt: 'Professional product photography of fine ground Turkish coffee in an elegant copper tin with ornate minimalist design, warm dark background, dramatic lighting, heritage premium coffee brand aesthetic, ultra detailed, 8k' },
  { name: 'mocha-beans', prompt: 'Professional product photography of chocolate covered coffee beans in a clear glass jar with minimalist cork lid, warm beige background, soft studio lighting, artisanal premium coffee aesthetic, ultra detailed, 8k' },
  { name: 'decaf-roast', prompt: 'Professional product photography of premium decaf coffee beans in a soft green kraft bag with minimalist botanical label, clean light background, soft natural lighting, organic premium coffee brand aesthetic, ultra detailed, 8k' },
  { name: 'vietnam-drip', prompt: 'Professional product photography of Vietnamese drip coffee filter set with stainless steel phin filter over a glass cup, dark wood surface, moody warm lighting, authentic premium coffee aesthetic, ultra detailed, 8k' },
  { name: 'caramel-macchiato', prompt: 'Professional product photography of caramel macchiato coffee syrup bottle with minimalist label, warm cream background, soft golden lighting, premium coffee shop aesthetic, ultra detailed, 8k' },
  { name: 'ethiopia-yirgacheffe', prompt: 'Professional product photography of single origin Ethiopia Yirgacheffe coffee beans in an elegant black matte bag with gold foil minimalist label, dark dramatic background, luxury specialty coffee aesthetic, ultra detailed, 8k' },
  { name: 'colombia-supremo', prompt: 'Professional product photography of single origin Colombia Supremo coffee beans in a warm terracotta colored bag with minimalist label, soft warm background, premium specialty coffee aesthetic, ultra detailed, 8k' },
];

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const zai = await ZAI.create();

  for (const p of products) {
    const outPath = path.join(OUTPUT_DIR, `${p.name}.png`);
    if (fs.existsSync(outPath)) {
      console.log(`SKIP ${p.name} (exists)`);
      continue;
    }
    let success = false;
    for (let attempt = 1; attempt <= 3 && !success; attempt++) {
      try {
        console.log(`Generating ${p.name} (attempt ${attempt})...`);
        const zai = await ZAI.create();
        const response = await zai.images.generations.create({
          prompt: p.prompt,
          size: '1024x1024',
        });
        const base64 = response.data[0].base64;
        fs.writeFileSync(outPath, Buffer.from(base64, 'base64'));
        console.log(`OK ${p.name}`);
        success = true;
      } catch (e) {
        console.error(`FAIL ${p.name} attempt ${attempt}:`, (e as Error).message);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    // small delay between images to avoid rate limits
    await new Promise((r) => setTimeout(r, 1500));
  }

  const heroOut = path.join(process.cwd(), 'public', 'images', 'hero.png');
  if (!fs.existsSync(heroOut)) {
    try {
      console.log('Generating hero...');
      const response = await zai.images.generations.create({
        prompt: 'Cinematic premium coffee hero image, steam rising from a artisan latte in a ceramic cup on dark marble surface, warm golden morning light, coffee beans scattered, moody atmospheric luxury coffee shop aesthetic, ultra detailed, 8k, shallow depth of field',
        size: '1440x720',
      });
      fs.writeFileSync(heroOut, Buffer.from(response.data[0].base64, 'base64'));
      console.log('OK hero');
    } catch (e) {
      console.error('FAIL hero:', (e as Error).message);
    }
  }

  const aboutOut = path.join(process.cwd(), 'public', 'images', 'about.png');
  if (!fs.existsSync(aboutOut)) {
    try {
      console.log('Generating about...');
      const response = await zai.images.generations.create({
        prompt: 'Artisan coffee roastery interior, vintage modern design, warm wood and brass, roasting machine, burlap sacks of coffee beans, soft natural light through large windows, premium craft coffee brand atmosphere, ultra detailed, 8k',
        size: '1344x768',
      });
      fs.writeFileSync(aboutOut, Buffer.from(response.data[0].base64, 'base64'));
      console.log('OK about');
    } catch (e) {
      console.error('FAIL about:', (e as Error).message);
    }
  }

  console.log('DONE');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
