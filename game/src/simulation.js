import { updateSectorEffects } from "./sector-effects.js";
import { PLANET, sectorData } from "./state.js";
import { flightStep, thrustVector } from "./input.js";
import { tone, fanfare, ambience } from "./audio.js";
export function burst(r, x, y, color, n = 22) {
  for (let i = 0; i < n; i++) {
    const a = i * 2.39996;
    r.particles.push({
      x,
      y,
      vx: Math.cos(a) * (25 + i * 4),
      vy: Math.sin(a) * (25 + i * 4),
      life: 1,
      color,
    });
  }
}
export function message(r, s) {
  r.message = s;
  r.messageTime = 3;
}
export function damage(r, reason) {
  if (r.invincible > 0) return;
  r.hull--;
  r.stats.damage++;
  r.invincible = 2.5;
  burst(r, r.pilot.x, r.pilot.y, "#ff9e81", 30);
  tone(77, 0.35, "sawtooth");
  message(r, reason);
  r.pilot.vx *= -0.5;
  r.pilot.vy *= -0.5;
  if (r.hull <= 0) {
    r.screen = "lost";
    r.reason = reason;
  }
}
export function updateRescue(r, k, dt) {
  if (r.paused) return;
  ambience(dt);
  r.elapsed += dt;
  r.sectorTime -= dt;
  r.invincible -= dt;
  r.messageTime -= dt;
  const p = r.pilot,
    v = thrustVector(k, p),
    burn = (v.x || v.y) && r.fuel > 0,
    boost = k.Space && r.fuel > 0,
    brake = k.ShiftLeft || k.ShiftRight;
  r.burning = !!burn;
  r.boosting = boost;
  r.braking = brake;
  if (burn) {
    p.angle = Math.atan2(v.y, v.x);
    const strength = (112 * r.engine * (boost ? 2 : 1)) / (1 + r.cargo * 0.12);
    flightStep(p, r.sector, dt, v.x * strength, v.y * strength, brake);
    r.fuel = Math.max(
      0,
      r.fuel - (dt * (boost ? 6 : 1.4)) / Math.sqrt(r.engine),
    );
    r.stats.burn += dt;
    if (Math.floor(r.elapsed * 20) % 2 === 0)
      r.particles.push({
        x: p.x - Math.cos(p.angle) * 15,
        y: p.y - Math.sin(p.angle) * 15,
        vx: -Math.cos(p.angle) * 60,
        vy: -Math.sin(p.angle) * 60,
        life: 0.45,
        color: boost ? "#ffb366" : "#90ece7",
      });
  } else flightStep(p, r.sector, dt, 0, 0, brake);
  if (brake && Math.hypot(p.vx, p.vy) > 10)
    r.fuel = Math.max(0, r.fuel - dt * 0.7);
  updateSectorEffects(r, dt);
  for (const h of r.hazards) {
    h.x = h.homeX + Math.sin(r.elapsed * 0.4 + h.phase) * h.orbit;
    h.y = h.homeY + Math.cos(r.elapsed * 0.3 + h.phase) * h.orbit * 0.6;
    if (Math.hypot(p.x - h.x, p.y - h.y) < h.r + 12)
      damage(r, "Debris strike. Armor absorbed the impact.");
  }
  if (Math.hypot(p.x - PLANET.x, p.y - PLANET.y) < PLANET.r + 14) {
    damage(r, "Atmospheric entry. Pull away from the planet.");
    let a = Math.atan2(p.y - PLANET.y, p.x - PLANET.x);
    p.x = PLANET.x + Math.cos(a) * (PLANET.r + 16);
    p.y = PLANET.y + Math.sin(a) * (PLANET.r + 16);
    p.vx = Math.cos(a) * 80;
    p.vy = Math.sin(a) * 80;
  }
  if (p.x < 25 || p.x > 1255 || p.y < 85 || p.y > 695) {
    damage(r, "Outer ring boundary. Course corrected.");
    p.x = Math.max(26, Math.min(1254, p.x));
    p.y = Math.max(86, Math.min(694, p.y));
  }
  for (const b of r.beacons)
    if (
      !b.rescued &&
      r.cargo < r.capacity &&
      Math.hypot(p.x - b.x, p.y - b.y) < r.magnet &&
      Math.hypot(p.vx, p.vy) < 180
    ) {
      b.rescued = true;
      r.rescued++;
      r.cargo++;
      r.score += 150 * r.sector;
      tone(660, 0.17, "triangle");
      burst(r, b.x, b.y, "#94ffe0");
      message(
        r,
        r.cargo === r.capacity
          ? "Cradle full. Return to the relay."
          : "Passenger aboard. Return to the relay to refuel.",
      );
    }
  const dock = Math.hypot(p.x - 640, p.y - 604);
  if (dock < 58) {
    r.fuel = Math.min(100, r.fuel + dt * 32);
    r.hull = Math.min(r.maxHull, r.hull);
    p.vx *= Math.exp(-5 * dt);
    p.vy *= Math.exp(-5 * dt);
    if (r.cargo) {
      r.delivered += r.cargo;
      r.score += r.cargo * 100;
      r.cargo = 0;
      fanfare();
      burst(r, 640, 604, "#f6d6a0", 35);
      message(r, "Passengers safe. Tanks refilling.");
    }
    if (r.delivered === r.total && r.screen === "play") {
      r.score += Math.ceil(r.sectorTime) * 3;
      r.screen = "clear";
      fanfare();
    }
  }
  const near = Math.hypot(p.x - 640, p.y - 376) < 205;
  if (near && Math.hypot(p.vx, p.vy) > 90 && !r.gravityAssist) {
    r.stats.slings++;
    message(r, "Gravity assist. Coast to conserve fuel.");
  }
  r.gravityAssist = near;
  if (r.sectorTime <= 0) {
    r.screen = "lost";
    r.reason = "The rescue window closed.";
  }
  if (r.fuel <= 0 && Math.hypot(p.vx, p.vy) < 5 && dock > 58) {
    r.screen = "lost";
    r.reason = "Fuel exhausted outside relay range.";
  }
  r.trail.push({ x: p.x, y: p.y });
  if (r.trail.length > 100) r.trail.shift();
  for (const q of r.particles) {
    q.x += q.vx * dt;
    q.y += q.vy * dt;
    q.life -= dt;
  }
  r.particles = r.particles.filter((q) => q.life > 0);
}
