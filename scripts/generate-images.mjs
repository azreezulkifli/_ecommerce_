// Jana gambar SVG placeholder pastel untuk produk & kategori.
// Jalankan: node scripts/generate-images.mjs
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
mkdirSync(join(root, "products"), { recursive: true });
mkdirSync(join(root, "categories"), { recursive: true });

const PALETTES = [
  ["#A24955", "#D58B86", "#F6E8E6"],
  ["#D58B86", "#BBDDC1", "#F3EFE9"],
  ["#8BBBBA", "#B2D2D1", "#E9F2F1"],
  ["#BBDDC1", "#D2EAB8", "#F0F6EC"],
  ["#D2EAB8", "#D2CCC6", "#F7F5F0"],
  ["#B2D2D1", "#8BBBBA", "#EDF5F4"],
];

function svg(bg1, bg2, shape, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}" stop-opacity="0.25"/>
      <stop offset="1" stop-color="${bg2}" stop-opacity="0.45"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="#FBF8F4"/>
  <circle cx="300" cy="300" r="210" fill="url(#g)"/>
  <circle cx="120" cy="120" r="60" fill="${bg2}" opacity="0.5"/>
  <circle cx="500" cy="140" r="40" fill="${bg1}" opacity="0.18"/>
  <circle cx="480" cy="480" r="70" fill="${bg1}" opacity="0.12"/>
  <circle cx="90" cy="470" r="45" fill="${bg2}" opacity="0.35"/>
  ${shape}
  <text x="300" y="330" font-family="Arial, sans-serif" font-size="44" font-weight="bold" fill="${bg1}" text-anchor="middle">${label}</text>
  <text x="300" y="375" font-family="Arial, sans-serif" font-size="20" fill="#8a7f78" text-anchor="middle">KIDSMART STORE</text>
</svg>`;
}

const shirt = `<path d="M230 200 L170 235 L120 200 L155 290 L205 315 L205 430 L395 430 L395 315 L445 290 L480 200 L430 235 L370 200 L330 235 L300 215 L270 235 Z" fill="#A24955" opacity="0.85" transform="translate(0,-10) scale(0.9)"/>`;
const bear = `<circle cx="300" cy="280" r="90" fill="#D58B86"/><circle cx="255" cy="225" r="30" fill="#D58B86"/><circle cx="345" cy="225" r="30" fill="#D58B86"/><circle cx="300" cy="315" r="45" fill="#F6E8E6"/><circle cx="272" cy="270" r="9" fill="#5b3a3a"/><circle cx="328" cy="270" r="9" fill="#5b3a3a"/><ellipse cx="300" cy="305" rx="14" ry="10" fill="#5b3a3a"/>`;
const blocks = `<rect x="190" y="300" width="80" height="80" rx="10" fill="#BBDDC1" transform="rotate(-8 230 340)"/><rect x="300" y="290" width="80" height="80" rx="10" fill="#D2EAB8" transform="rotate(6 340 330)"/><rect x="250" y="380" width="80" height="80" rx="10" fill="#D58B86" transform="rotate(-4 290 420)"/><circle cx="400" cy="330" r="35" fill="#8BBBBA" opacity="0.8"/>`;
const dress = `<path d="M270 190 L240 170 Q300 140 360 170 L330 190 L345 300 Q300 330 255 300 Z" fill="#8BBBBA"/><path d="M255 300 Q300 330 345 300 L360 430 Q300 460 240 430 Z" fill="#B2D2D1"/>`;
const rompers = `<path d="M250 180 Q300 150 350 180 L370 260 L330 280 L320 430 L280 430 L270 280 L230 260 Z" fill="#D2EAB8"/><path d="M270 200 Q300 180 330 200" stroke="#A24955" stroke-width="8" fill="none"/>`;
const car = `<rect x="170" y="300" width="260" height="90" rx="30" fill="#A24955"/><rect x="220" y="240" width="140" height="80" rx="20" fill="#D58B86"/><circle cx="230" cy="395" r="28" fill="#5b3a3a"/><circle cx="370" cy="395" r="28" fill="#5b3a3a"/><circle cx="230" cy="395" r="12" fill="#D2CCC6"/><circle cx="370" cy="395" r="12" fill="#D2CCC6"/>`;
const ball = `<circle cx="300" cy="310" r="120" fill="#BBDDC1"/><path d="M300 190 Q380 250 380 310 Q380 380 300 430 Q220 380 220 310 Q220 250 300 190" fill="#D2EAB8"/><circle cx="300" cy="310" r="18" fill="#A24955"/>`;
const hat = `<ellipse cx="300" cy="360" rx="150" ry="35" fill="#D2CCC6"/><path d="M210 360 Q210 240 300 240 Q390 240 390 360 Z" fill="#8BBBBA"/><rect x="200" y="350" width="200" height="25" rx="12" fill="#B2D2D1"/>`;
const booties = `<path d="M230 250 Q230 200 290 200 L340 200 Q370 200 370 240 L370 320 Q370 360 330 360 L250 360 Q230 360 230 330 Z" fill="#D58B86"/><rect x="220" y="355" width="160" height="35" rx="15" fill="#A24955"/><circle cx="330" cy="260" r="12" fill="#F6E8E6"/>`;
const bib = `<path d="M240 190 L360 190 L390 300 Q390 360 300 390 Q210 360 210 300 Z" fill="#D2EAB8"/><circle cx="300" cy="290" r="45" fill="#BBDDC1"/><path d="M285 285 l10 10 l20 -20" stroke="#A24955" stroke-width="8" fill="none" stroke-linecap="round"/>`;
const puzzles = `<rect x="190" y="230" width="100" height="100" rx="15" fill="#BBDDC1"/><rect x="310" y="230" width="100" height="100" rx="15" fill="#D58B86"/><rect x="190" y="350" width="100" height="100" rx="15" fill="#D2CCC6"/><rect x="310" y="350" width="100" height="100" rx="15" fill="#8BBBBA"/><circle cx="240" cy="280" r="18" fill="#fff" opacity="0.7"/><path d="M350 280 l15 15 l25 -25" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>`;
const plush = `<circle cx="300" cy="300" r="110" fill="#D2EAB8"/><circle cx="230" cy="210" r="35" fill="#D2EAB8"/><circle cx="370" cy="210" r="35" fill="#D2EAB8"/><ellipse cx="300" cy="330" rx="50" ry="40" fill="#F6E8E6"/><circle cx="270" cy="290" r="10" fill="#5b3a3a"/><circle cx="330" cy="290" r="10" fill="#5b3a3a"/><ellipse cx="300" cy="320" rx="12" ry="9" fill="#5b3a3a"/>`;
const set = `<rect x="180" y="220" width="240" height="200" rx="20" fill="#B2D2D1"/><rect x="200" y="240" width="200" height="160" rx="12" fill="#F6E8E6"/><circle cx="250" cy="300" r="25" fill="#A24955"/><circle cx="330" cy="310" r="20" fill="#D2EAB8"/><rect x="260" y="330" width="60" height="18" rx="9" fill="#8BBBBA"/>`;
const stroller = `<path d="M160 300 Q160 220 240 220 L380 220 Q440 220 440 280 L440 340 Q440 380 400 380 L200 380 Q160 380 160 340 Z" fill="#D58B86"/><circle cx="220" cy="410" r="30" fill="#5b3a3a"/><circle cx="380" cy="410" r="30" fill="#5b3a3a"/><path d="M240 220 L240 180 Q240 150 280 150 L340 150" stroke="#8BBBBA" stroke-width="14" fill="none" stroke-linecap="round"/>`;
const blanket = `<rect x="170" y="230" width="260" height="190" rx="20" fill="#BBDDC1"/><path d="M170 280 h260 M170 330 h260 M220 230 v190 M280 230 v190 M340 230 v190 M400 230 v190" stroke="#D2EAB8" stroke-width="10"/><circle cx="300" cy="300" r="30" fill="#D58B86" opacity="0.7"/>`;
const blocks2 = `<rect x="180" y="300" width="90" height="90" rx="12" fill="#A24955" transform="rotate(-6 225 345)"/><rect x="280" y="290" width="90" height="90" rx="12" fill="#8BBBBA" transform="rotate(5 325 335)"/><rect x="370" y="300" width="90" height="90" rx="12" fill="#D2EAB8" transform="rotate(-4 415 345)"/><rect x="230" y="390" width="90" height="70" rx="12" fill="#D2CCC6" transform="rotate(8 275 425)"/>`;
const xylophone = `<rect x="180" y="220" width="240" height="60" rx="10" fill="#A24955"/><rect x="180" y="290" width="240" height="60" rx="10" fill="#D58B86"/><rect x="180" y="360" width="240" height="60" rx="10" fill="#8BBBBA"/><circle cx="300" cy="180" r="25" fill="#D2EAB8"/><path d="M290 180 l8 8 l16 -16" stroke="#fff" stroke-width="6" fill="none"/>`;
const doll = `<circle cx="300" cy="230" r="55" fill="#F2C9A0"/><path d="M245 230 Q245 160 300 160 Q355 160 355 230 L355 260 L245 260 Z" fill="#A24955"/><rect x="255" y="300" width="90" height="110" rx="25" fill="#B2D2D1"/><circle cx="300" cy="340" r="20" fill="#D2CCC6"/>`;

const products = [
  ["Baju Kurung Kanak-Kanak", "pakaian-kanak-kanak-lelaki", shirt, "#A24955"],
  ["Beg9292 Mainan Beruang Comel", "mainan-bayi", bear, "#D58B86"],
  ["Set Blok Pembelajaran Kanak-Kanak", "mainan-pendidikan", blocks, "#BBDDC1"],
  ["Gaun Bayi Lengan Panjang", "pakaian-bayi", dress, "#8BBBBA"],
  ["Baju Onesies Bayi Comel", "pakaian-bayi", rompers, "#D2EAB8"],
  ["Kereta Mainan Remote Control", "mainan-kreatif", car, "#A24955"],
  ["Bola Belon Kanak-Kanak", "mainan-bayi", ball, "#BBDDC1"],
  ["Topi Matahari Kanak-Kanak", "aksesori-kanak-kanak", hat, "#8BBBBA"],
  ["Set Stoking & Barut Bayi", "pakaian-bayi", booties, "#D58B86"],
  ["Beg Mayat Bayi", "pakaian-bayi", bib, "#D2EAB8"],
  ["Puzzle Kayu Kanak-Kanak", "mainan-pendidikan", puzzles, "#8BBBBA"],
  ["Mainan Plush Arnab", "mainan-bayi", plush, "#D2EAB8"],
  ["Set Baju Tidur Kanak-Kanak", "pakaian-kanak-kanak-perempuan", set, "#B2D2D1"],
  ["Stroller Mainan Kanak-Kanak", "mainan-kreatif", stroller, "#D58B86"],
  ["Selimut Kanak-Kanak Lembut", "aksesori-kanak-kanak", blanket, "#BBDDC1"],
  ["Set Blok Kayu Ajaib", "mainan-pendidikan", blocks2, "#A24955"],
  ["Xilofon Mainan Muzik", "mainan-kreatif", xylophone, "#8BBBBA"],
  ["Mainan Anak Patung", "mainan-bayi", doll, "#D2CCC6"],
];

products.forEach(([label, , shape, color], i) => {
  const p = PALETTES[i % PALETTES.length];
  writeFileSync(join(root, "products", `produk-${i + 1}.svg`), svg(p[0], p[1], shape, label));
});

const cats = [
  ["Pakaian Bayi", "pakaian-bayi", dress],
  ["Pakaian Kanak-Kanak Lelaki", "pakaian-kanak-kanak-lelaki", shirt],
  ["Pakaian Kanak-Kanak Perempuan", "pakaian-kanak-kanak-perempuan", set],
  ["Mainan Pendidikan", "mainan-pendidikan", puzzles],
  ["Mainan Bayi", "mainan-bayi", bear],
  ["Mainan Kreatif", "mainan-kreatif", car],
  ["Aksesori Kanak-Kanak", "aksesori-kanak-kanak", hat],
];
cats.forEach(([label, slug, shape], i) => {
  const p = PALETTES[i % PALETTES.length];
  writeFileSync(join(root, "categories", `${slug}.svg`), svg(p[0], p[1], shape, label));
});

console.log("Generated", products.length, "product images and", cats.length, "category images.");
