import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import path from 'path';

const dir = path.resolve('src/assets/images');
const files = readdirSync(dir).filter(f => f.endsWith('.png'));

for (const file of files) {
  const input = path.join(dir, file);
  const output = path.join(dir, file.replace(/\.png$/, '.webp'));
  const before = statSync(input).size;

  await sharp(input)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(output);

  const after = statSync(output).size;
  console.log(`${file} -> ${path.basename(output)}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
}
