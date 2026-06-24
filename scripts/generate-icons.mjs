import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(__dirname, '..', 'src-tauri', 'icons');
const svg = readFileSync(join(iconsDir, 'icon.svg'));

const pngSizes = [
  { name: '32x32.png', size: 32 },
  { name: '128x128.png', size: 128 },
  { name: '128x128@2x.png', size: 256 },
  { name: 'icon.png', size: 512 },
  { name: 'Square30x30Logo.png', size: 30 },
  { name: 'Square44x44Logo.png', size: 44 },
  { name: 'Square71x71Logo.png', size: 71 },
  { name: 'Square89x89Logo.png', size: 89 },
  { name: 'Square107x107Logo.png', size: 107 },
  { name: 'Square142x142Logo.png', size: 142 },
  { name: 'Square150x150Logo.png', size: 150 },
  { name: 'Square284x284Logo.png', size: 284 },
  { name: 'Square310x310Logo.png', size: 310 },
  { name: 'StoreLogo.png', size: 50 },
];

async function main() {
  for (const { name, size } of pngSizes) {
    await sharp(svg).resize(size, size).png().toFile(join(iconsDir, name));
    console.log(`  ✓ ${name} (${size}x${size})`);
  }

  // ICO (Windows) — embed 32px and 256px PNGs
  const icoSizes = [32, 256];
  const icoPngs = await Promise.all(
    icoSizes.map(s => sharp(svg).resize(s, s).png().toBuffer())
  );
  const count = icoPngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const dirs = [];
  for (let i = 0; i < count; i++) {
    const s = icoSizes[i];
    const dir = Buffer.alloc(16);
    dir.writeUInt8(s >= 256 ? 0 : s, 0);
    dir.writeUInt8(s >= 256 ? 0 : s, 1);
    dir.writeUInt8(0, 2);
    dir.writeUInt8(0, 3);
    dir.writeUInt16LE(1, 4);
    dir.writeUInt16LE(32, 6);
    dir.writeUInt32LE(icoPngs[i].length, 8);
    dir.writeUInt32LE(offset, 12);
    dirs.push(dir);
    offset += icoPngs[i].length;
  }

  writeFileSync(join(iconsDir, 'icon.ico'), Buffer.concat([header, ...dirs, ...icoPngs]));
  console.log('  ✓ icon.ico');

  // ICNS (macOS) — Tauri v2 accepts PNG as icon.icns fallback
  const icnsBuf = await sharp(svg).resize(512, 512).png().toBuffer();
  writeFileSync(join(iconsDir, 'icon.icns'), icnsBuf);
  console.log('  ✓ icon.icns');

  console.log('\nAll icons generated!');
}

main().catch(console.error);
