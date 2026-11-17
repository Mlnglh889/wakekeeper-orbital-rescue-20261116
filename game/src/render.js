import { drawSectorEffects } from "./sector-effects.js";
import { W, H, PLANET } from "./state.js";
import { predictedOrbit } from "./input.js";
const C = { ice: "#a2e4e4", gold: "#f5ce9b", coral: "#e38c73" };
export function draw(c, r, t) {
  let g = c.createLinearGradient(0, 0, W, H);
  const themes = [
    ["#071824", "#102f40", "#071725"],
    ["#241a24", "#493332", "#16202e"],
    ["#13152d", "#302744", "#101d32"],
    ["#182d32", "#45524a", "#142932"],
  ];
  const theme = themes[r.sector - 1];
  g.addColorStop(0, theme[0]);
  g.addColorStop(0.55, theme[1]);
  g.addColorStop(1, theme[2]);
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
  drawChart(c, r, t);
  drawPlanet(c, t);
  drawRelay(c, t);
  if (r.screen === "play") drawSectorEffects(c, r, t);
  for (const b of r.beacons) if (!b.rescued) drawBeacon(c, b, t);
  for (const h of r.hazards) drawHazard(c, h, t);
  if (!["title", "result"].includes(r.screen)) {
    drawTrajectory(c, r);
    drawShip(c, r, t);
    drawParticles(c, r);
  }
  c.strokeStyle = "#64939b33";
  c.strokeRect(16, 16, W - 32, H - 32);
}
function drawChart(c, r, t) {
  for (const s of r.stars) {
    c.globalAlpha = s.a;
    c.fillStyle = "#d8efe8";
    c.fillRect(s.x, s.y, s.r, s.r);
  }
  c.globalAlpha = 1;
  c.strokeStyle = "#6fb5c012";
  c.lineWidth = 1;
  for (let x = 40; x < W; x += 60) {
    c.beginPath();
    c.moveTo(x, 80);
    c.lineTo(x, H);
    c.stroke();
  }
  for (let y = 120; y < H; y += 60) {
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(W, y);
    c.stroke();
  }
  c.save();
  c.translate(640, 376);
  c.rotate(-0.24);
  for (let i = 0; i < 7; i++) {
    c.strokeStyle = i % 2 ? "#acbc9a21" : "#61c9d12b";
    c.lineWidth = i === 2 ? 2 : 1;
    c.beginPath();
    c.ellipse(0, 0, 180 + i * 44, 70 + i * 24, 0, 0, Math.PI * 2);
    c.stroke();
  }
  c.restore();
  c.font = "10px monospace";
  c.fillStyle = "#7298a4";
  c.fillText("38° N / AURELION RING", 34, 105);
  c.fillText("NAV CHART  ·  04.16", 1070, 680);
  for (let i = 0; i < 12; i++) {
    c.fillStyle = "#70a3b455";
    c.fillText(String(i * 30).padStart(3, "0"), 40 + i * 106, 693);
  }
  c.fillStyle = "#91c4cb";
  c.font = "11px monospace";
  c.fillText("PERIAPSIS", 790, 386);
}
function drawPlanet(c, t) {
  const { x, y, r } = PLANET;
  let halo = c.createRadialGradient(x, y, r * 0.85, x, y, r * 1.45);
  halo.addColorStop(0, "#dd9c8144");
  halo.addColorStop(1, "#dd9c8100");
  c.fillStyle = halo;
  c.beginPath();
  c.arc(x, y, r * 1.45, 0, 7);
  c.fill();
  c.save();
  c.beginPath();
  c.arc(x, y, r, 0, 7);
  c.clip();
  let g = c.createLinearGradient(x - r, y - r, x + r, y + r);
  g.addColorStop(0, "#f5d2a4");
  g.addColorStop(0.4, "#c78772");
  g.addColorStop(0.75, "#71536b");
  g.addColorStop(1, "#213243");
  c.fillStyle = g;
  c.fillRect(x - r, y - r, r * 2, r * 2);
  for (let i = 0; i < 18; i++) {
    c.strokeStyle = i % 3 === 0 ? "#ffe0a735" : "#54395040";
    c.lineWidth = 4 + (i % 5);
    c.beginPath();
    c.ellipse(x - 10, y - 100 + i * 13, 120, 16 + (i % 4) * 3, 0.12, 0, 7);
    c.stroke();
  }
  let shade = c.createLinearGradient(x - 25, y, x + r, y);
  shade.addColorStop(0, "#07182400");
  shade.addColorStop(1, "#071824bb");
  c.fillStyle = shade;
  c.fillRect(x - r, y - r, r * 2, r * 2);
  c.restore();
  c.strokeStyle = "#f0b78a88";
  c.lineWidth = 1;
  c.beginPath();
  c.arc(x, y, r + 3, 0, 7);
  c.stroke();
  c.fillStyle = "#c7a7a0";
  c.font = "12px monospace";
  c.fillText("A U R E L I O N", 594, 382);
  c.font = "9px monospace";
  c.fillText("ATMOSPHERE — KEEP CLEAR", 576, 400);
}
function drawRelay(c, t) {
  c.save();
  c.translate(640, 604);
  c.strokeStyle = "#8ce1da44";
  c.setLineDash([3, 6]);
  c.beginPath();
  c.arc(0, 0, 57, 0, 7);
  c.stroke();
  c.setLineDash([]);
  c.strokeStyle = "#d6d6ad";
  c.lineWidth = 2;
  c.strokeRect(-32, -7, 20, 14);
  c.strokeRect(12, -7, 20, 14);
  c.fillStyle = "#204555";
  c.fillRect(-32, -7, 20, 14);
  c.fillRect(12, -7, 20, 14);
  c.strokeStyle = "#7abdc3";
  for (let i = 0; i < 5; i++) {
    c.beginPath();
    c.moveTo(-32 + i * 5, -7);
    c.lineTo(-32 + i * 5, 7);
    c.moveTo(12 + i * 5, -7);
    c.lineTo(12 + i * 5, 7);
    c.stroke();
  }
  c.fillStyle = "#f8d59f";
  c.fillRect(-6, -13, 12, 26);
  c.fillStyle = "#98fff0";
  c.beginPath();
  c.arc(0, 0, 3, 0, 7);
  c.fill();
  c.restore();
  c.font = "11px monospace";
  c.fillStyle = "#b8e8df";
  c.fillText("HOME RELAY", 606, 674);
}
function drawBeacon(c, b, t) {
  let pulse = 1 + Math.sin(t * 2 + b.phase) * 0.08;
  c.strokeStyle = "#83e4d94d";
  c.lineWidth = 1;
  c.beginPath();
  c.arc(b.x, b.y, 27 * pulse, 0, 7);
  c.stroke();
  c.fillStyle = "#112d3b";
  c.strokeStyle = "#a6f2df";
  c.lineWidth = 2;
  c.beginPath();
  c.roundRect(b.x - 8, b.y - 13, 16, 26, 7);
  c.fill();
  c.stroke();
  c.fillStyle = "#c5ffe8";
  c.fillRect(b.x - 3, b.y - 6, 6, 9);
  c.strokeStyle = "#97d6d0";
  c.beginPath();
  c.moveTo(b.x - 14, b.y + 16);
  c.lineTo(b.x + 14, b.y + 16);
  c.stroke();
  c.font = "10px monospace";
  c.fillStyle = "#a5e3dc";
  c.fillText("SOS", b.x - 10, b.y - 37);
}
function drawHazard(c, h, t) {
  c.save();
  c.translate(h.x, h.y);
  c.rotate(t * 0.07 + h.phase);
  c.beginPath();
  for (let i = 0; i < 11; i++) {
    let a = (i * Math.PI * 2) / 11,
      q = h.r * (0.79 + 0.21 * Math.sin(i * 2.4 + 1));
    c.lineTo(Math.cos(a) * q, Math.sin(a) * q);
  }
  c.closePath();
  c.fillStyle = "#33404b";
  c.fill();
  c.strokeStyle = "#c78571";
  c.lineWidth = 2;
  c.stroke();
  c.fillStyle = "#8c655e";
  for (let i = 0; i < 4; i++) {
    c.beginPath();
    c.arc(
      Math.cos(i * 2) * h.r * 0.4,
      Math.sin(i * 2) * h.r * 0.4,
      3 + i,
      0,
      7,
    );
    c.fill();
  }
  c.restore();
  c.strokeStyle = "#dc8b7044";
  c.setLineDash([3, 8]);
  c.beginPath();
  c.arc(h.x, h.y, h.r + 8, 0, 7);
  c.stroke();
  c.setLineDash([]);
}
function drawTrajectory(c, r) {
  const a = predictedOrbit(r.pilot, r.sector);
  c.strokeStyle = "#f0cf974d";
  c.setLineDash([3, 7]);
  c.beginPath();
  c.moveTo(r.pilot.x, r.pilot.y);
  for (const p of a) c.lineTo(p.x, p.y);
  c.stroke();
  c.setLineDash([]);
  if (a.length) {
    let p = a[a.length - 1];
    c.strokeStyle = "#e8bf8a77";
    c.strokeRect(p.x - 3, p.y - 3, 6, 6);
  }
  c.strokeStyle = "#72d9dd40";
  c.lineWidth = 2;
  c.beginPath();
  r.trail.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
  c.stroke();
}
function drawShip(c, r, t) {
  let p = r.pilot;
  c.save();
  c.translate(p.x, p.y);
  if (r.invincible > 0) {
    c.strokeStyle = "#b4f6eb88";
    c.beginPath();
    c.arc(0, 0, 25 + Math.sin(t * 8) * 2, 0, 7);
    c.stroke();
  }
  c.rotate(p.angle + Math.PI / 2);
  if (r.burning) {
    let g = c.createLinearGradient(0, 8, 0, 46);
    g.addColorStop(0, "#d3ffff");
    g.addColorStop(0.3, r.boosting ? "#ffc571" : "#6bd9dc");
    g.addColorStop(1, "#72e4e000");
    c.fillStyle = g;
    c.beginPath();
    c.moveTo(-7, 9);
    c.lineTo(0, 36 + (r.boosting ? 15 : 0) + Math.sin(t * 70) * 5);
    c.lineTo(7, 9);
    c.fill();
  }
  c.fillStyle = "#f5d6a0";
  c.strokeStyle = "#e0b37f";
  c.lineWidth = 1;
  c.beginPath();
  c.moveTo(0, -19);
  c.lineTo(13, 13);
  c.lineTo(0, 7);
  c.lineTo(-13, 13);
  c.closePath();
  c.fill();
  c.stroke();
  c.fillStyle = "#244655";
  c.beginPath();
  c.ellipse(0, -2, 4, 8, 0, 0, 7);
  c.fill();
  c.fillStyle = "#b8ffff";
  c.fillRect(-2, -7, 4, 5);
  c.restore();
  for (let i = 0; i < r.cargo; i++) {
    c.fillStyle = "#8cf1d7";
    c.beginPath();
    c.arc(p.x - 9 + i * 8, p.y + 29, 2.8, 0, 7);
    c.fill();
  }
}
function drawParticles(c, r) {
  for (const p of r.particles) {
    c.globalAlpha = Math.min(1, p.life);
    c.fillStyle = p.color;
    c.fillRect(p.x, p.y, 2, 2);
  }
  c.globalAlpha = 1;
}
