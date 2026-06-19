import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT = path.join(process.cwd(), 'public', 'images');

const tasks = [
  { name: 'products/french-press.png', prompt: 'Professional product photography of a modern glass french press coffee maker with dark coffee inside, minimalist design, warm wooden table, soft natural light, premium lifestyle coffee aesthetic, ultra detailed, 8k', size: '1024x1024' as const },
  { name: 'products/latte-mix.png', prompt: 'Professional product photography of premium instant latte coffee powder in an elegant white jar with minimalist gold label, clean cream background, soft warm lighting, luxury coffee brand aesthetic, ultra detailed, 8k', size: '1024x1024' as const },
  { name: 'products/turkish-coffee.png', prompt: 'Professional product photography of fine ground Turkish coffee in an elegant copper tin with ornate minimalist design, warm dark background, dramatic lighting, heritage premium coffee brand aesthetic, ultra detailed, 8k', size: '1024x1024' as const },
  { name: 'products/mocha-beans.png', prompt: 'Professional product photography of chocolate covered coffee beans in a clear glass jar with minimalist cork lid, warm beige background, soft studio lighting, artisanal premium coffee aesthetic, ultra detailed, 8k', size: '1024x1024' as const },
  { name: 'products/decaf-roast.png', prompt: 'Professional product photography of premium decaf coffee beans in a soft green kraft bag with minimalist botanical label, clean light background, soft natural lighting, organic premium coffee brand aesthetic, ultra detailed, 8k', size: '1024x1024' as const },
  { name: 'products/vietnam-drip.png', prompt: 'Professional product photography of Vietnamese drip coffee filter set with stainless steel phin filter over a glass cup, dark wood surface, moody warm lighting, authentic premium coffee aesthetic, ultra detailed, 8k', size: '1024x1024' as const },
  { name: 'products/caramel-macchiato.png', prompt: 'Professional product photography of caramel macchiato coffee syrup bottle with minimalist label, warm cream background, soft golden lighting, premium coffee shop aesthetic, ultra detailed, 8k', size: '1024x1024' as const },
  { name: 'products/ethiopia-yirgacheffe.png', prompt: 'Professional product photography of single origin Ethiopia Yirgacheffe coffee beans in an elegant black matte bag with gold foil minimalist label, dark dramatic background, luxury specialty coffee aesthetic, ultra detailed, 8k', size: '1024x1024' as const },
  { name: 'products/colombia-supremo.png', prompt: 'Professional product photography of single origin Colombia Supremo coffee beans in a warm terracotta colored bag with minimalist label, soft warm background, premium specialty coffee aesthetic, ultra detailed, 8k', size: '1024x1024' as const },
  { name: 'hero.png', prompt: 'Cinematic premium coffee hero image, steam rising from a artisan latte in a ceramic cup on dark marble surface, warm golden morning light, coffee beans scattered, moody atmospheric luxury coffee shop aesthetic, ultra detailed, 8k, shallow depth of field', size: '1440x720' as const },
  { name: 'about.png', prompt: 'Artisan coffee roastery interior, vintage modern design, warm wood and brass, roasting machine, burlap sacks of coffee beans, soft natural light through large windows, premium craft coffee brand atmosphere, ultra detailed, 8k', size: '1344x768' as const },
];

async function genOne(zai: any, task: typeof tasks[0]) {
  const out = path.join(OUT, task.name);
  if (fs.existsSync(out)) {
    console.log('SKIP', task.name);
    return;
  }
  for (let a = 1; a <= 3; a++) {
    try {
      console.log('Generating', task.name, `(attempt ${a})`);
      const r = await zai.images.generations.create({ prompt: task.prompt, size: task.size });
      fs.writeFileSync(out, Buffer.from(r.data[0].base64, 'base64'));
      console.log('OK', task.name);
      return;
    } catch (e) {
      console.error('FAIL', task.name, a, (e as Error).message);
      await new Promise((r) => setTimeout(r, 4000));
    }
  }
}

async function main() {
  const zai = await ZAI.create();
  for (const t of tasks) {
    await genOne(zai, t);
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.log('ALL DONE');
}

main().catch((e) => { console.error(e); process.exit(1); });
