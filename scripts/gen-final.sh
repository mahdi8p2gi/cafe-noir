#!/bin/bash
cd /home/z/my-project

# Each image: name|size|prompt
IMAGES=(
  "turkish-coffee|1024x1024|Professional product photography of fine ground Turkish coffee in an elegant copper tin with ornate minimalist design, warm dark background, dramatic lighting, heritage premium coffee brand aesthetic, ultra detailed, 8k"
  "mocha-beans|1024x1024|Professional product photography of chocolate covered coffee beans in a clear glass jar with minimalist cork lid, warm beige background, soft studio lighting, artisanal premium coffee aesthetic, ultra detailed, 8k"
  "decaf-roast|1024x1024|Professional product photography of premium decaf coffee beans in a soft green kraft bag with minimalist botanical label, clean light background, soft natural lighting, organic premium coffee brand aesthetic, ultra detailed, 8k"
  "vietnam-drip|1024x1024|Professional product photography of Vietnamese drip coffee filter set with stainless steel phin filter over a glass cup, dark wood surface, moody warm lighting, authentic premium coffee aesthetic, ultra detailed, 8k"
  "caramel-macchiato|1024x1024|Professional product photography of caramel macchiato coffee syrup bottle with minimalist label, warm cream background, soft golden lighting, premium coffee shop aesthetic, ultra detailed, 8k"
  "ethiopia-yirgacheffe|1024x1024|Professional product photography of single origin Ethiopia Yirgacheffe coffee beans in an elegant black matte bag with gold foil minimalist label, dark dramatic background, luxury specialty coffee aesthetic, ultra detailed, 8k"
  "colombia-supremo|1024x1024|Professional product photography of single origin Colombia Supremo coffee beans in a warm terracotta colored bag with minimalist label, soft warm background, premium specialty coffee aesthetic, ultra detailed, 8k"
)

for entry in "${IMAGES[@]}"; do
  IFS='|' read -r name size prompt <<< "$entry"
  out="public/images/products/${name}.png"
  if [ -f "$out" ]; then
    echo "SKIP $name"
    continue
  fi
  for attempt in 1 2 3 4 5; do
    echo "GEN $name attempt $attempt..."
    timeout 90 bun -e 'import ZAI from "z-ai-web-dev-sdk"; import fs from "fs"; const z=await ZAI.create(); const r=await z.images.generations.create({prompt:process.argv[1],size:process.argv[2]}); fs.writeFileSync(process.argv[3],Buffer.from(r.data[0].base64,"base64")); console.log("OK")' "$prompt" "$size" "$out" 2>&1 | tail -1
    if [ -f "$out" ]; then
      echo "  -> done"
      break
    fi
    echo "  -> retry in 5s"
    sleep 5
  done
done

# Hero
if [ ! -f "public/images/hero.png" ]; then
  for attempt in 1 2 3 4 5; do
    echo "GEN hero attempt $attempt..."
    timeout 120 bun -e 'import ZAI from "z-ai-web-dev-sdk"; import fs from "fs"; const z=await ZAI.create(); const r=await z.images.generations.create({prompt:"Cinematic premium coffee hero image, steam rising from a artisan latte in a ceramic cup on dark marble surface, warm golden morning light, coffee beans scattered, moody atmospheric luxury coffee shop aesthetic, ultra detailed, 8k, shallow depth of field",size:"1440x720"}); fs.writeFileSync("public/images/hero.png",Buffer.from(r.data[0].base64,"base64")); console.log("OK")' 2>&1 | tail -1
    [ -f "public/images/hero.png" ] && break
    sleep 5
  done
fi

# About
if [ ! -f "public/images/about.png" ]; then
  for attempt in 1 2 3 4 5; do
    echo "GEN about attempt $attempt..."
    timeout 120 bun -e 'import ZAI from "z-ai-web-dev-sdk"; import fs from "fs"; const z=await ZAI.create(); const r=await z.images.generations.create({prompt:"Artisan coffee roastery interior, vintage modern design, warm wood and brass, roasting machine, burlap sacks of coffee beans, soft natural light through large windows, premium craft coffee brand atmosphere, ultra detailed, 8k",size:"1344x768"}); fs.writeFileSync("public/images/about.png",Buffer.from(r.data[0].base64,"base64")); console.log("OK")' 2>&1 | tail -1
    [ -f "public/images/about.png" ] && break
    sleep 5
  done
fi

echo "=== DONE ==="
ls -la public/images/products/
ls -la public/images/*.png 2>/dev/null
