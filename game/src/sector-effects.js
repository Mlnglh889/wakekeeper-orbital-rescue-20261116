import { damage, message } from "./simulation.js";

// Each passage adds a readable navigation problem, with an explicit warning.
export function updateSectorEffects(run, dt) {
  const p = run.pilot;
  if (run.sector === 2) {
    // A moving cinder front: weave around it or brake through its safe gaps.
    const x = 640 + Math.sin(run.elapsed * 0.13) * 400;
    run.front = x;
    if (Math.abs(p.x - x) < 17 && p.y < 545 && Math.hypot(p.vx, p.vy) > 90) {
      damage(run, "Cinder front strike. Brake below 90 to cross safely.");
    }
  }
  if (run.sector === 3) {
    // The strong gravity well already changes flight physics. The tide adds
    // a periodic braking tax, signalled before the active part of its cycle.
    const phase = run.elapsed % 18;
    run.tide = phase > 12;
    if (phase > 10 && phase < 10 + dt)
      message(run, "Gravity tide incoming. Leave room to brake.");
    if (run.tide && !run.braking) {
      p.vx += (640 - p.x) * 0.025 * dt;
      p.vy += (376 - p.y) * 0.025 * dt;
    }
  }
  if (run.sector === 4) {
    // Dawn supplies are useful choices, collected by flying through them.
    for (const cell of run.supplies) {
      if (!cell.used && Math.hypot(p.x - cell.x, p.y - cell.y) < 30) {
        cell.used = true;
        run.fuel = Math.min(100, run.fuel + 28);
        message(run, "Dawn supply recovered. Fuel +28.");
      }
    }
  }
}

export function drawSectorEffects(ctx, run, t) {
  ctx.save();
  if (run.sector === 2 && run.front !== undefined) {
    ctx.strokeStyle = "#f1a57888";
    ctx.setLineDash([14, 10]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(run.front, 125);
    ctx.lineTo(run.front, 545);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#f5c9a1";
    ctx.font = "12px monospace";
    ctx.fillText(
      "CINDER FRONT · BRAKE TO CROSS",
      Math.min(980, Math.max(30, run.front - 110)),
      125,
    );
    for (let i = 0; i < 20; i++) {
      const y = 150 + ((i * 37 + t * 32) % 380);
      ctx.fillRect(run.front - 6 + Math.sin(i * 3) * 13, y, 3, 8);
    }
  }
  if (run.sector === 3) {
    ctx.strokeStyle = run.tide ? "#d8adff88" : "#b4a3d52a";
    ctx.lineWidth = run.tide ? 3 : 1;
    for (let radius = 145; radius < 320; radius += 38) {
      ctx.beginPath();
      ctx.arc(640, 376, radius + Math.sin(t) * 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "#d6c5f4";
    ctx.font = "12px monospace";
    ctx.fillText(
      run.tide
        ? "GRAVITY TIDE · BRAKE TO HOLD"
        : "STRONG GRAVITY · WATCH YOUR COAST",
      30,
      145,
    );
  }
  if (run.sector === 4) {
    for (const cell of run.supplies)
      if (!cell.used) {
        ctx.strokeStyle = "#d6eaaa";
        ctx.fillStyle = "#c8e69a";
        ctx.strokeRect(cell.x - 11, cell.y - 11, 22, 22);
        ctx.fillRect(cell.x - 5, cell.y - 2, 10, 4);
        ctx.fillRect(cell.x - 2, cell.y - 5, 4, 10);
        ctx.font = "10px monospace";
        ctx.fillText("FUEL", cell.x - 13, cell.y - 20);
      }
  }
  ctx.restore();
}
