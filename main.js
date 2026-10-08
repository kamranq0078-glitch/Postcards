import { init as snowfall } from './styles/snowfall.js';
import { init as chinar } from './styles/chinar.js';
import { init as dallake } from './styles/dallake.js';
import { init as saffron } from './styles/saffron.js';
import { init as dusk } from './styles/dusk-call.js';
import { init as chillai } from './styles/chillai-kalan.js';
import { init as garden } from './styles/garden.js';

const renderers = { snowfall, chinar, dallake, saffron, 'dusk-call': dusk, 'chillai-kalan': chillai, garden };
const app = document.querySelector('#app');
const today = localDateKey(new Date());
let days = [];

function localDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
function safeDate(key) { const [y,m,d] = key.split('-').map(Number); return new Date(y,m-1,d,12); }
function dateLabel(key, options={month:'long',day:'numeric',year:'numeric'}) { return new Intl.DateTimeFormat(undefined,options).format(safeDate(key)); }
function escapeHTML(value='') { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function sceneMarkup(day, quiet=false) {
  const cls = renderers[day?.visualStyle] ? day.visualStyle : 'chinar';
  return `<div class="scene-host${quiet?' quiet':''}" data-style="${cls}"></div>`;
}
function hydrateScenes() {
  document.querySelectorAll('.scene-host').forEach(host => (renderers[host.dataset.style] || chinar)(host, {}));
}
function frame(day, content) {
  app.innerHTML = `<section class="experience" data-style="${escapeHTML(day?.visualStyle||'chinar')}">${sceneMarkup(day)}<header class="topbar"><div class="brand-mark" aria-label="A piece of home">⌂</div><button class="archive-toggle" type="button" aria-label="Open postcard archive">Postcards <span>↗</span></button></header>${content}</section>`;
  hydrateScenes();
  app.querySelector('.archive-toggle').addEventListener('click', showArchive);
}
function showDay(day, isToday=false) {
  const notes = day.familyNotes || (day.familyNote ? [day.familyNote] : []);
  const noteMarkup = notes.map((note,index) => `<div class="note-item"><button class="note-trigger" type="button" aria-expanded="false" data-note-index="${index}"><span class="note-icon">✉</span><span>A note from ${escapeHTML(note.from)}</span><span class="note-caret">＋</span></button><div class="family-note" data-note-index="${index}" hidden><span class="note-from">With love, from ${escapeHTML(note.from)}</span><p>${escapeHTML(note.message)}</p></div></div>`).join('');
  frame(day, `<article class="postcard ${isToday?'today-card':'archive-card'}"><div class="eyebrow">${isToday?'TODAY’S PIECE OF HOME':dateLabel(day.date).toUpperCase()}</div><h1>${escapeHTML(day.title)}</h1><p class="body-copy">${escapeHTML(day.body||'')}</p>${noteMarkup}<div class="postcard-footer">${isToday?'A little home, wherever you are':'A postcard to keep'}</div></article>${!isToday?'<button class="back-today" type="button">← Back to today</button>':''}`);
  app.querySelectorAll('.note-trigger').forEach(trigger => trigger.addEventListener('click', () => {
    const index=trigger.dataset.noteIndex;
    const panel=app.querySelector(`.family-note[data-note-index="${index}"]`); const open=trigger.getAttribute('aria-expanded')==='true';
    trigger.setAttribute('aria-expanded',String(!open)); panel.hidden=open; trigger.querySelector('.note-caret').textContent=open?'＋':'−';
  }));
  app.querySelector('.back-today')?.addEventListener('click', showHome);
}
function showHome() {
  const entry = days.find(day=>day.date===today);
  if (entry) { showDay(entry,true); return; }
  const latest = [...days].filter(day=>day.date<today).sort((a,b)=>b.date.localeCompare(a.date))[0] || {visualStyle:'chinar'};
  frame(latest, `<article class="postcard holding-card"><div class="eyebrow">A NOTE FOR TODAY</div><div class="holding-flower">✳</div><h1>Today's piece of home<br>is still on its way.</h1><p class="body-copy">Tomorrow brings a new piece of home. I'm already working on it.</p><div class="postcard-footer">Until then, there's a little archive to wander through.</div><button class="holding-archive" type="button">Visit the postcards <span>↗</span></button></article>`);
  app.querySelector('.holding-archive').addEventListener('click',showArchive);
}
function showArchive() {
  const ordered=[...days].sort((a,b)=>b.date.localeCompare(a.date));
  app.innerHTML=`<section class="archive-page"><header class="archive-header"><button class="home-link" type="button">← Today</button><span class="archive-kicker">A GROWING COLLECTION</span><h1>Postcards from home</h1><p>Every little window opens onto a day.</p></header><div class="postcard-grid">${ordered.map((day,index)=>`<button class="mini-card" data-day="${escapeHTML(day.id||`${day.date}-${index}`)}" data-style="${escapeHTML(day.visualStyle)}" type="button"><span class="mini-scene scene-host" data-style="${escapeHTML(day.visualStyle)}"></span><span class="mini-date">${dateLabel(day.date,{month:'short',day:'numeric'})}</span><span class="mini-title">${escapeHTML(day.title)}</span><span class="mini-arrow">↗</span></button>`).join('')}</div>${ordered.length?'':'<p class="empty-archive">The first postcard will find its place here soon.</p>'}</section>`;
  hydrateScenes();
  app.querySelector('.home-link').addEventListener('click',showHome);
  app.querySelectorAll('.mini-card').forEach(button=>button.addEventListener('click',()=>showDay(days.find((day,index)=>(day.id||`${day.date}-${index}`)===button.dataset.day))));
}

try {
  const response=await fetch('content/days.json',{cache:'no-store'});
  if(!response.ok) throw new Error('Could not load postcards');
  const data=await response.json();
  if(!Array.isArray(data)) throw new Error('Postcard list must be an array');
  days=data.filter(day=>/^\d{4}-\d{2}-\d{2}$/.test(day.date)&&day.title&&renderers[day.visualStyle]).sort((a,b)=>a.date.localeCompare(b.date));
  showHome();
} catch(error) {
  app.innerHTML='<section class="error-state"><h1>The postcards are taking a moment.</h1><p>Please refresh in a little while.</p></section>';
}
