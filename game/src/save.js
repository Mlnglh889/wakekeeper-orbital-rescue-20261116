const KEY = 'wakekeeper-chart-v2';

export function loadChart(storage) {
  try {
    storage ??= globalThis.localStorage;
    const chart = JSON.parse(storage.getItem(KEY));
    if (chart?.version === 2 && Array.isArray(chart.records)) {
      const validRecord = record => record && Number.isInteger(record.sector) && record.sector >= 1 && record.sector <= 4 && ['seconds','delivered','damage','score'].every(key => Number.isFinite(record[key]) && record[key] >= 0);
      if (!chart.records.every(validRecord)) throw new Error('Invalid passage log');
      const checkpoint = chart.checkpoint;
      if (checkpoint && (!Number.isInteger(checkpoint.sector) || checkpoint.sector < 2 || checkpoint.sector > 4 || !Array.isArray(checkpoint.records) || !checkpoint.records.every(validRecord))) throw new Error('Invalid checkpoint');
      return chart;
    }
  } catch {}
  return { version: 2, records: [], checkpoint: null };
}

export function saveChart(chart, storage) {
  try {
    storage ??= globalThis.localStorage; storage.setItem(KEY, JSON.stringify(chart)); } catch {}
}

export function recordPassage(chart, run) {
  const seconds = Math.round(run.elapsed - run.sectorStarted);
  const record = { sector: run.sector, seconds, delivered: run.delivered,
    damage: run.stats.damage - run.damageStarted, score: run.score - run.scoreStarted };
  run.records.push(record);
  const old = chart.records[run.sector - 1];
  if (!old || record.score > old.score) chart.records[run.sector - 1] = record;
  chart.checkpoint = run.sector < 4 ? {
    sector: run.sector + 1, score: run.score, rescued: run.rescued,
    hull: run.hull, maxHull: run.maxHull, capacity: run.capacity,
    engine: run.engine, magnet: run.magnet, elapsed: run.elapsed,
    stats: { ...run.stats }, records: [...run.records]
  } : null;
  saveChart(chart);
  return record;
}

export function resumePassage(chart, freshRun) {
  if (!chart.checkpoint) return null;
  return Object.assign(freshRun(), chart.checkpoint, { screen: 'upgrade' });
}
