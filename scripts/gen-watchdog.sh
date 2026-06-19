#!/bin/bash
cd /home/z/my-project

gen_one() {
  local name="$1"
  local size="$2"
  local prompt="$3"
  local out="public/images/products/${name}.png"
  [ -f "$out" ] && { echo "SKIP $name"; return 0; }
  for a in 1 2 3 4 5 6 7 8; do
    echo "[$name] attempt $a"
    timeout 90 bun -e 'import ZAI from "z-ai-web-dev-sdk"; import fs from "fs"; const z=await ZAI.create(); const r=await z.images.generations.create({prompt:process.argv[1],size:process.argv[2]}); fs.writeFileSync(process.argv[3],Buffer.from(r.data[0].base64,"base64"))' "$prompt" "$size" "$out" 2>/dev/null
    [ -f "$out" ] && { echo "[$name] OK"; return 0; }
    sleep 3
  done
  echo "[$name] FAILED after 8 attempts"
}

gen_one decaf-roast 1024x1024 "Professional product photography of premium decaf coffee beans in a soft green kraft bag with minimalist botanical label, clean light background, soft natural lighting, organic premium coffee brand aesthetic, ultra detailed, 8k"
gen_one vietnam-drip 1024x1024 "Professional product photography of Vietnamese drip coffee filter set with stainless steel phin filter over a glass cup, dark wood surface, moody warm lighting, authentic premium coffee aesthetic, ultra detailed, 8k"
gen_one caramel-macchiato 1024x1024 "Professional product photography of caramel macchiato coffee syrup bottle with minimalist label, warm cream background, soft golden lighting, premium coffee shop aesthetic, ultra detailed, 8k"
gen_one ethiopia-yirgacheffe 1024x1024 "Professional product photography of single origin Ethiopia Yirgacheffe coffee beans in an elegant black matte bag with gold foil minimalist label, dark dramatic background, luxury specialty coffee aesthetic, ultra detailed, 8k"
gen_one colombia-supremo 1024x1024 "Professional product photography of single origin Colombia Supremo coffee beans in a warm terracotta colored bag with minimalist label, soft warm background, premium specialty coffee aesthetic, ultra detailed, 8k"

# Hero
if [ ! -f "public/images/hero.png" ]; then
  for a in 1 2 3 4 5 6 7 8; do
    echo "[hero] attempt $a"
    timeout 120 bun -e 'import ZAI from "z-ai-web-dev-sdk"; import fs from "fs"; const z=await ZAI.create(); const r=await z.images.generations.create({prompt:"Cinematic premium coffee hero image, steam rising from a artisan latte in a ceramic cup on dark marble surface, warm golden morning light, coffee beans scattered, moody atmospheric luxury coffee shop aesthetic, ultra detailed, 8k, shallow depth of field",size:"1440x720"}); fs.writeFileSync("public/images/hero.png",Buffer.from(r.data[0].base64,"base64"))' 2>/dev/null
    [ -f "public/images/hero.png" ] && { echo "[hero] OK"; break; }
    sleep 3
  done
fi

# About
if [ ! -f "public/images/about.png" ]; then
  for a in 1 2 3 4 5 6 7 8; do
    echo "[about] attempt $a"
    timeout 120 bun -e 'import ZAI from "z-ai-web-dev-sdk"; import fs from "fs"; const z=await ZAI.create(); const r=await z.images.generations.create({prompt:"Artisan coffee roastery interior, vintage modern design, warm wood and brass, roasting machine, burlap sacks of coffee beans, soft natural light through large windows, premium craft coffee brand atmosphere, ultra detailed, 8k",size:"1344x768"}); fs.writeFileSync("public/images/about.png",Buffer.from(r.data[0].base64,"base64"))' 2>/dev/null
    [ -f "public/images/about.png" ] && { echo "[about] OK"; break; }
    sleep 3
  done
fi

echo "=== DONE ==="
ls public/images/products/ | wc -l
ls public/images/*.png 2>/dev/null
