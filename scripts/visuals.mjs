import { mkdirSync, writeFileSync } from "node:fs";
mkdirSync("public/visuals", { recursive: true });
const svg = (width, height, content) =>
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
  width +
  " " +
  height +
  '">' +
  content +
  "</svg>";
const save = (name, data) =>
  writeFileSync("public/visuals/" + name + ".svg", data);
const golden = Math.PI * (3 - Math.sqrt(5));
const nodes = Array.from({ length: 150 }, (_, index) => {
  const y = 1 - ((index + 0.5) * 2) / 150;
  const radius = Math.sqrt(1 - y * y);
  const x = Math.cos(index * golden) * radius;
  const z = Math.sin(index * golden) * radius;
  return [
    x * 145 + 360,
    (y * 0.95 + z * 0.31) * 145 + 296,
    z * 0.95 - y * 0.31,
  ];
});
let edges = "";
for (const [i, a] of nodes.entries()) {
  for (const b of nodes.slice(i + 1)) {
    const distance = Math.hypot(a[0] - b[0], a[1] - b[1], (a[2] - b[2]) * 145);
    if (distance < 52)
      edges +=
        '<path d="M' +
        a[0].toFixed(1) +
        " " +
        a[1].toFixed(1) +
        "L" +
        b[0].toFixed(1) +
        " " +
        b[1].toFixed(1) +
        '" opacity="' +
        (0.24 + (a[2] + b[2] + 2) * 0.16).toFixed(2) +
        '"/>';
  }
}
const stars = Array.from(
  { length: 156 },
  (_, i) =>
    '<circle cx="' +
    (((i * 109.71) % 650) + 35).toFixed(1) +
    '" cy="' +
    (((i * 137.47) % 480) + 54).toFixed(1) +
    '" r="' +
    (i % 19 === 0 ? 1.55 : 0.65) +
    '" opacity="' +
    (0.13 + (i % 7) * 0.078) +
    '"/>',
).join("");
save(
  "core",
  svg(
    720,
    585,
    `
<defs>
 <radialGradient id="h"><stop stop-color="#7956f2" stop-opacity=".24"/><stop offset=".53" stop-color="#7243db" stop-opacity=".1"/><stop offset="1" stop-color="#6030bb" stop-opacity="0"/></radialGradient>
 <radialGradient id="s" cx=".36" cy=".36"><stop stop-color="#4a3a82" stop-opacity=".35"/><stop offset=".72" stop-color="#180f30" stop-opacity=".73"/><stop offset="1" stop-color="#140d23" stop-opacity=".52"/></radialGradient>
 <linearGradient id="r"><stop stop-color="#6840bd" stop-opacity=".25"/><stop offset=".45" stop-color="#e3c9ff"/><stop offset=".8" stop-color="#ac88f5" stop-opacity=".7"/><stop offset="1" stop-color="#6d41b3" stop-opacity=".22"/></linearGradient>
 <filter id="g" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4"/></filter>
</defs>
<ellipse cx="360" cy="298" rx="332" ry="287" fill="url(#h)"/>
<g fill="#dbc9ff">${stars}</g>
<g fill="none" stroke="#866ea9" stroke-opacity=".28" stroke-width=".75">
 <circle cx="360" cy="296" r="237" stroke-dasharray="2 6"/><circle cx="360" cy="296" r="211"/>
 <path d="M85 296H635M360 49V543" stroke-dasharray="2 8"/>
</g>
<circle cx="360" cy="296" r="146" fill="url(#s)" stroke="#ab83fc" stroke-opacity=".38"/>
<g fill="none" stroke="#c19eff" stroke-width=".78">${edges}</g>
<g fill="#e2ccff">${nodes.map(([x, y, z], i) => '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (i % 13 === 0 ? 2.5 : (1.05 + z * 0.54).toFixed(2)) + '" opacity="' + (0.56 + z * 0.34).toFixed(2) + '"/>').join("")}</g>
<g fill="none" stroke="url(#r)" stroke-width="5" filter="url(#g)">
 <ellipse cx="360" cy="296" rx="250" ry="78" transform="rotate(-24 360 296)"/>
 <ellipse cx="360" cy="296" rx="224" ry="75" transform="rotate(56 360 296)"/>
</g>
<g fill="none" stroke="url(#r)" stroke-width="1.15">
 <ellipse cx="360" cy="296" rx="250" ry="78" transform="rotate(-24 360 296)"/>
 <ellipse cx="360" cy="296" rx="224" ry="75" transform="rotate(56 360 296)"/>
 <ellipse cx="360" cy="296" rx="233" ry="127" transform="rotate(12 360 296)" opacity=".64"/>
</g>
<g fill="#ebd9ff"><circle cx="144" cy="387" r="2.7"/><circle cx="530" cy="166" r="3.7"/><circle cx="316" cy="128" r="2.4"/><circle cx="489" cy="440" r="3"/></g>
`,
  ),
);
const grid =
  '<defs><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#ffffff" opacity=".07"/></pattern></defs><rect width="720" height="440" fill="url(#grid)"/>';
save(
  "twin",
  svg(
    720,
    440,
    `<rect width="720" height="440" fill="#101a20"/>${grid}
<path d="M70 328L280 110H686L482 328Z" fill="#1c3038" stroke="#5f8e92"/>
<path d="M175 329L382 111M285 329L482 111M393 329L587 111" stroke="#abc6c6" stroke-opacity=".35" stroke-dasharray="18 12"/>
<path d="M145 298Q214 278 295 208L399 140" fill="none" stroke="#85e0d9" stroke-width="3"/><path d="M260 299Q327 274 367 233L431 182" fill="none" stroke="#cdb2fd" stroke-width="3"/>
<g fill="#85e0d9"><circle cx="399" cy="140" r="6"/><circle cx="145" cy="298" r="8"/></g><g fill="#cdb2fd"><circle cx="431" cy="182" r="6"/><circle cx="260" cy="299" r="8"/></g>
<g font-family="monospace" font-size="16" letter-spacing="2"><text x="418" y="137" fill="#a2e3dd">PHYSICAL</text><text x="450" y="181" fill="#e0ceff">PREDICTED</text></g>`,
  ),
);
save(
  "system",
  svg(
    720,
    440,
    `<rect width="720" height="440" fill="#1a1727"/>${grid}
<g stroke="#8a76b0" fill="#252039">
 <path d="M89 173l90-48 90 48v91l-90 49-90-49z"/><path d="M270 133l90-48 90 48v91l-90 49-90-49z"/><path d="M451 203l90-48 90 48v91l-90 49-90-49z"/>
 <path d="M89 173l90 48 90-48m-90 48v92m91-180 90 48 90-48m-90 48v92m91-70 90 48 90-48m-90 48v92" fill="none"/>
</g><path d="M179 221h92l89-40h91l90 70" stroke="#e3cfff" stroke-width="2" fill="none" stroke-dasharray="5 5"/>
<g fill="#e3cfff"><circle cx="179" cy="221" r="6"/><circle cx="360" cy="181" r="6"/><circle cx="541" cy="251" r="6"/></g>`,
  ),
);
save(
  "icon",
  svg(
    64,
    64,
    '<rect width="64" height="64" rx="13" fill="#1d162d"/><path d="M13 45V18h12a8 8 0 0 1 0 16H13m23 11V18h10a8 8 0 0 1 0 16H36m9 0 9 11" stroke="#dcc9ff" stroke-width="3" fill="none"/>',
  ),
);
