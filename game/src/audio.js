let ctx,
  enabled = true,
  beat = 0;
export function setSound(v) {
  enabled = v;
  if (ctx) ctx.resume();
}
export function tone(freq = 440, dur = 0.08, type = "sine", volume = 0.045) {
  if (!enabled) return;
  try {
    ctx ??= new AudioContext();
    ctx.resume();
    const o = ctx.createOscillator(),
      g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(
      freq * 0.75,
      ctx.currentTime + dur,
    );
    g.gain.setValueAtTime(volume, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  } catch {}
}
export function fanfare() {
  tone(392, 0.18);
  setTimeout(() => tone(523, 0.25), 120);
  setTimeout(() => tone(784, 0.4), 280);
}
export function ambience(dt) {
  beat += dt;
  if (beat > 2.5) {
    beat = 0;
    tone(
      [130.81, 164.81, 196, 261.63][Math.floor(performance.now() / 2500) % 4],
      1.8,
      "sine",
      0.013,
    );
  }
}
