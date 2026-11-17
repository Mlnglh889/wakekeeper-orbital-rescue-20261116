import { SECTORS } from './state.js';

export function routeChart(chart, current = 0) {
  return `<ol class="route-chart">${SECTORS.map((sector, index) => {
    const record = chart.records[index];
    const available = index === 0 || chart.records[index - 1];
    const status = record ? 'Secured' : current === index + 1 ? 'Current passage' : available ? 'Ready' : 'Uncharted';
    return `<li class="${record ? 'secured' : ''} ${current === index + 1 ? 'current' : ''}">
      <span class="route-dot">${record ? '✓' : index + 1}</span>
      <div><b>${sector.name}</b><small>${record ? `${record.delivered} home · ${record.seconds}s · ${record.damage} impacts` : `${status} · ${sector.pods.length} signals`}</small></div>
    </li>`;
  }).join('')}</ol>`;
}

export function passageTable(records) {
  if (!records.length) return '';
  return `<table class="passages"><caption>Passage log</caption><thead><tr><th>Sector</th><th>Home</th><th>Time</th><th>Impacts</th></tr></thead><tbody>${records.map(record => `<tr><td>${SECTORS[record.sector - 1].name}</td><td>${record.delivered}</td><td>${record.seconds}s</td><td>${record.damage}</td></tr>`).join('')}</tbody></table>`;
}
