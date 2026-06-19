#!/bin/bash
# Generate each coffee image in a separate process for resilience
cd /home/z/my-project

PRODUCTS=(
  "cold-brew|Professional product photography of a glass bottle of cold brew coffee with minimalist label, condensation droplets, dark slate background, dramatic side lighting, premium craft coffee aesthetic, ultra detailed, 8k"
  "french-press|Professional product photography of a modern glass french press coffee maker with dark coffee inside, minimalist design, warm wooden table, soft natural light, premium lifestyle coffee aesthetic, ultra detailed, 8k"
  "latte-mix|Professional product photography of premium instant latte coffee powder in an elegant white jar with minimalist gold label, clean cream background, soft warm lighting, luxury coffee brand aesthetic, ultra detailed, 8k"
  "turkish-coffee|Professional product photography of fine ground Turkish coffee in an elegant copper tin with ornate minimalist design, warm dark background, dramatic lighting, heritage premium coffee brand aesthetic, ultra detailed, 8k"
  "mocha-beans|Professional product photography of chocolate covered coffee beans in a clear glass jar with minimalist cork lid, warm beige background, soft studio lighting, artisanal premium coffee aesthetic, ultra detailed, 8k"
  "decaf-roast|Professional product photography of premium decaf coffee beans in a soft green kraft bag with minimalist botanical label, clean light background, soft natural lighting, organic premium coffee brand aesthetic, ultra detailed, 8k"
  "vietnam-drip|Professional product photography of Vietnamese drip coffee filter set with stainless steel phin filter over a glass cup, dark wood surface, moody warm lighting, authentic premium coffee aesthetic, ultra detailed, 8k"
  "caramel-macchiato|Professional product photography of caramel macchiato coffee syrup bottle with minimalist label, warm cream background, soft golden lighting, premium coffee shop aesthetic, ultra detailed, 8k"
  "ethiopia-yirgacheffe|Professional product photography of single origin Ethiopia Yirgacheffe coffee beans in an elegant black matte bag with gold foil minimalist label, dark dramatic background, luxury specialty coffee aesthetic, ultra detailed, 8k"
  "colombia-supremo|Professional product photography of single origin Colombia Supremo coffee beans in a warm terracotta colored bag with minimalist label, soft warm background, premium specialty coffee aesthetic, ultra detailed, 8k"
)

for entry in "${PRODUCTS[@]}"; do
  name="${entry%%|*}"
  prompt="${entry##*|}"
  out="public/images/products/${name}.png"
  if [ -f "$out" ]; then
    echo "SKIP $name (exists)"
    continue
  fi
  echo "Generating $name..."
  bun -e "
    import ZAI from 'z-ai-web-dev-sdk';
    import fs from 'fs';
    const zai = await ZAI.create();
    const r = await zai.images.generations.create({ prompt: process.argv[1], size: '1024x1024' });
    fs.writeFileSync(process.argv[2], Buffer.from(r.data[0].base64, 'base64'));
    console.log('OK');
  " "$prompt" "$out" 2>&1 | tail -3
  sleep 1
done

# Hero & About (landscape)
if [ ! -f "public/images/hero.png" ]; then
  echo "Generating hero..."
  bun -e "
    import ZAI from 'z-ai-web-dev-sdk';
    import fs from 'fs';
    const zai = await ZAI.create();
    const r = await zai.images.generations.create({ prompt: 'Cinematic premium coffee hero image, steam rising from a artisan latte in a ceramic cup on dark marble surface, warm golden morning light, coffee beans scattered, moody atmospheric luxury coffee shop aesthetic, ultra detailed, 8k, shallow depth of field', size: '1440x720' });
    fs.writeFileSync('public/images/hero.png', Buffer.from(r.data[0].base64, 'base64'));
    console.log('OK');
  " 2>&1 | tail -3
fi

if [ ! -f "public/images/about.png" ]; then
  echo "Generating about..."
  bun -e "
    import ZAI from 'z-ai-web-dev-sdk';
    import fs from 'fs';
    const zai = await ZAI.create();
    const r = await zai.images.generations.create({ prompt: 'Artisan coffee roastery interior, vintage modern design, warm wood and brass, roasting machine, burlap sacks of coffee beans, soft natural light through large windows, premium craft coffee brand atmosphere, ultra detailed, 8k', size: '1344x768' });
    fs.writeFileSync('public/images/about.png', Buffer.from(r.data[0].base64, 'base64'));
    console.log('OK');
  " 2>&1 | tail -3
fi

echo "ALL DONE"
ls -la public/images/products/
ls -la public/images/*.png
