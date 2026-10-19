'use strict';
const solutions = {
  seats: {title:'Betelt a kurzus? Indulj a lehetőségektől.', steps:[['Nézd át az alternatív kurzusokat.','Ellenőrizd a többi csoport időpontját, nyelvét és a saját képzésed követelményeit.'],['Rögzítsd pontosan, melyik tárgyról van szó.','Írd fel a tárgy- és kurzuskódot, a csoportot, valamint azt, hogy miért nem megfelelő a többi lehetőség.'],['Kérj tájékoztatást az illetékes egyetemi felületen.','A bővítés lehetőségéről és az ügyintézés módjáról kérj megerősítést. Őrizd meg a válaszokat.']]},
  clash: {title:'Két óra egy időben? Legyen B terved.', steps:[['Nézd meg az összes meghirdetett idősávot.','Ellenőrizd, hogy választható-e másik csoport, és számolj az épületek közötti utazási idővel is.'],['Hasonlítsd össze a tárgyak tantervi helyét.','Nézd meg az előfeltételeket és az ajánlott félévet. Jelöld meg, melyik tárgy elhalasztása érintené a további tanulmányaidat.'],['Az eltérési lehetőségekről kérj hivatalos tájékoztatást.','Az ütközés megengedhetőségét és az esetleges kérelmet a saját képzésed aktuális szabályai alapján tisztázd az ügyintézéssel.']]},
  tech: {title:'Hibaüzenet? Legyen meg minden részlet.', steps:[['Mentsd el a pontos hibaüzenetet.','Készíts képernyőképet, jegyezd fel az időpontot és azt, milyen műveletnél jelentkezett a hiba. Jelszót ne ossz meg.'],['Nézd meg a hivatalos tájékoztatást.','Ellenőrizd, jeleztek-e karbantartást vagy üzemzavart, és hogy a saját féléves státuszod, illetve tárgyfelvételi időszakod megfelelő-e.'],['Jelezd a problémát az ügyintézési felületen.','Add meg a szükséges tárgy- és kurzuskódot, a hiba leírását, valamint a reprodukálás lépéseit. Őrizd meg az ügy azonosítóját.']]},
  info: {title:'Sok az információ? Kezdj három ponttal.', steps:[['A saját képzésedből indulj ki.','Keresd meg a képzési programodat és az ahhoz tartozó mintatantervet. Írd össze az adott félévre tervezett tárgyaidat.'],['Ellenőrizd az aktuális félév tájékoztatóját.','A saját képzésedre és évfolyamodra érvényes időpontokat, bejelentkezési teendőket és tárgyfelvételi feltételeket keresd.'],['Tisztázd a nyitott kérdéseket.','Ami nem derül ki a hivatalos tájékoztatóból, azt egy konkrét, tárgykóddal és képzéssel megadott kérdésben jelezd.']]}
};

// Hash routes keep each workspace directly shareable and browser Back usable.
const views = [...document.querySelectorAll('[data-view]')];
const mainNavigation = [...document.querySelectorAll('[data-nav]')];
let activeView;
function route(initial = false) {
  const hash = location.hash.slice(1);
  const viewName = hash === 'tervem' ? 'planner' : ['linktar','hasznos'].includes(hash) ? 'resources' : 'guide';
  const changed = activeView !== viewName;
  views.forEach(view => { view.hidden = view.dataset.view !== viewName; });
  mainNavigation.forEach(link => {
    if (link.dataset.nav === viewName) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  activeView = viewName;
  document.title = `${viewName === 'planner' ? 'Saját tervem' : viewName === 'resources' ? 'Hivatalos linktár' : 'Indíts jó irányban.'} — Corvinus Iránytű`;
  const target = ['folyamat','elakadtam'].includes(hash) ? document.getElementById(hash) : null;
  requestAnimationFrame(() => {
    if (target) target.scrollIntoView({behavior:initial?'instant':'smooth',block:'start'});
    else if (changed || hash === 'utmutato') window.scrollTo({top:0,behavior:'instant'});
    if (!initial && changed) {
      const heading = document.querySelector(`[data-view="${viewName}"] h1`);
      heading.setAttribute('tabindex','-1');
      heading.focus({preventScroll:true});
    }
  });
}
window.addEventListener('hashchange',()=>route());
document.addEventListener('click',event=>{
  const link = event.target.closest('a[href^="#"]');
  if(link?.hash === '#main') {
    event.preventDefault();
    const main=document.querySelector('main');
    main.setAttribute('tabindex','-1');main.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});return;
  }
  if(link && link.hash === location.hash && link.hash !== '#main') {
    event.preventDefault(); route();
  }
});
route(true);

const phases = {
  before: {eyebrow:'ELŐSZÖR A TERV',title:'Tudd, mit szeretnél felvenni.',icon:'book',tips:['Nézd át a mintatantervet és az előfeltételeket.','Ellenőrizd a rád vonatkozó határidőket.','Legyen A és B órarended is.'],link:'#tervem',label:'Összeállítom a listámat'},
  during: {eyebrow:'MOST JÖN A MEGVALÓSÍTÁS',title:'Haladj a saját órarended mentén.',icon:'grid',tips:['A tárgy- és kurzuskód alapján keresd a megfelelő csoportot.','Ellenőrizd az időpontot, nyelvet és a kapcsolódó kurzusokat.','Ha elakadsz, válassz helyzetet az alábbi útmutatóban.'],link:'#elakadtam',label:'Segítséget keresek'},
  after: {eyebrow:'VÉGÜL NÉZD ÁT EGYBEN',title:'A felvétel után is van egy lépés.',icon:'check',tips:['Nézd végig a ténylegesen felvett tárgyakat a Neptunban.','Ellenőrizd a kurzusokat, időpontokat és krediteket.','A nyitott ügyeket és válaszokat őrizd meg a jegyzeteidben.'],link:'#tervem',label:'Ellenőrzöm a listámat'}
};
const phaseTabs = [...document.querySelectorAll('[data-phase]')];
const phasePanel = document.querySelector('#phase-panel');
function activatePhase(tab) {
  phaseTabs.forEach(item=>{const selected=item===tab;item.classList.toggle('active',selected);item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;});
  const data=phases[tab.dataset.phase];
  phasePanel.setAttribute('aria-labelledby',tab.id);
  phasePanel.querySelector('.eyebrow').textContent=data.eyebrow;
  phasePanel.querySelector('h3').textContent=data.title;
  phasePanel.querySelector('.section-icon use').setAttribute('href',`#i-${data.icon}`);
  phasePanel.querySelector('ul').replaceChildren(...data.tips.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  const link=phasePanel.querySelector('.text-link');
  link.href=data.link; link.firstChild.textContent=data.label+' ';
}
function wireTabs(tabs, activate, vertical = false) {
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activate(tab));
    tab.addEventListener('keydown',event=>{
      const isVertical=typeof vertical==='function'?vertical():vertical;
      let next;
      if(event.key===(isVertical?'ArrowDown':'ArrowRight')) next=(index+1)%tabs.length;
      if(event.key===(isVertical?'ArrowUp':'ArrowLeft')) next=(index+tabs.length-1)%tabs.length;
      if(event.key==='Home') next=0;
      if(event.key==='End') next=tabs.length-1;
      if(next!==undefined){event.preventDefault();activate(tabs[next]);tabs[next].focus();}
    });
  });
}
wireTabs(phaseTabs,activatePhase);
const tabs=[...document.querySelectorAll('[data-problem]')];
const panel=document.querySelector('#solution');
const problemTabs=document.querySelector('.problem-tabs');
const wideScreen=matchMedia('(min-width:851px)');
function updateOrientation(){problemTabs.setAttribute('aria-orientation',wideScreen.matches?'vertical':'horizontal');}
wideScreen.addEventListener('change',updateOrientation);updateOrientation();
function selectProblem(tab){
  tabs.forEach(item=>{const selected=item===tab;item.classList.toggle('active',selected);item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;});
  const data=solutions[tab.dataset.problem];
  panel.setAttribute('aria-labelledby',tab.id);panel.querySelector('h3').textContent=data.title;
  const list=panel.querySelector('ol');list.replaceChildren();
  data.steps.forEach(([title,description])=>{const li=document.createElement('li'),b=document.createElement('b'),p=document.createElement('p');b.textContent=title;p.textContent=description;li.append(b,p);list.append(li);});
  const info=tab.dataset.problem==='info';
  const link=panel.querySelector('.solution-link');
  link.href=info?'https://www.uni-corvinus.hu/ona/hallgatoi-tanulmanyi-ugyek/kepzesi-programok/':'https://www.uni-corvinus.hu/ona/hallgatoi-tanulmanyi-ugyek/ugyintezes/';
  link.querySelector('span').textContent=info?'Képzési programok':'Tanulmányi ügyintézés';
}
wireTabs(tabs,selectProblem,()=>wideScreen.matches);

// Keep the existing storage key and task IDs so previous plans survive redesign.
const storageKey='corvinus-iranytu-plan-v1';
const tasks=[...document.querySelectorAll('[data-task]')];
const note=document.querySelector('#plan-note');
const status=document.querySelector('#save-status');
let storageWorks=true;
function restorePlan(){
  try{
    const saved=JSON.parse(localStorage.getItem(storageKey)||'null');
    if(saved&&typeof saved==='object'){
      tasks.forEach(t=>t.checked=saved.tasks?.[t.dataset.task]===true);
      note.value=typeof saved.note==='string'?saved.note.slice(0,2000):'';
    }
  }catch{storageWorks=false;}
}
function updateProgress(){
  const done=tasks.filter(t=>t.checked).length;
  document.querySelector('#progress-text').textContent=`${done} / ${tasks.length}`;
  document.querySelector('#nav-count').textContent=`${done}/${tasks.length}`;
  const progress=document.querySelector('[role="progressbar"]');
  progress.setAttribute('aria-valuenow',String(done));
  progress.setAttribute('aria-valuetext',`${done} a ${tasks.length} teendőből kipipálva`);
  progress.querySelectorAll('span').forEach((span,index)=>span.classList.toggle('done',index<done));
  document.querySelector('#progress-message').textContent=done===0?'Kezdd az első lépéssel.':done===tasks.length?'Minden teendőt kipipáltál.':'Már úton vagy.';
  document.querySelector('#note-counter').textContent=`${note.value.length} / 2000`;
}
function save(){
  updateProgress();
  try{localStorage.setItem(storageKey,JSON.stringify({tasks:Object.fromEntries(tasks.map(t=>[t.dataset.task,t.checked])),note:note.value}));storageWorks=true;status.textContent='Mentve ezen a böngészőn.';}
  catch{storageWorks=false;status.textContent='A mentés nem elérhető. Töltsd le a tervedet.';}
}
tasks.forEach(task=>task.addEventListener('change',save));note.addEventListener('input',save);
const resetButton=document.querySelector('#reset-plan'),resetConfirmation=document.querySelector('#reset-confirm'),cancelResetButton=document.querySelector('#cancel-reset');
function closeResetConfirmation(){resetConfirmation.hidden=true;resetButton.setAttribute('aria-expanded','false');resetButton.focus();}
resetButton.addEventListener('click',()=>{const opening=resetConfirmation.hidden;resetConfirmation.hidden=!opening;resetButton.setAttribute('aria-expanded',String(opening));if(opening)cancelResetButton.focus();});
cancelResetButton.addEventListener('click',closeResetConfirmation);
resetConfirmation.addEventListener('keydown',event=>{if(event.key==='Escape')closeResetConfirmation();});
document.querySelector('#confirm-reset').addEventListener('click',()=>{tasks.forEach(t=>t.checked=false);note.value='';save();closeResetConfirmation();showToast('Új, üres teendőlista indult.');});
let toastTimer;
function showToast(message){const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),3200);}
document.querySelector('#export-plan').addEventListener('click',()=>{
  const text=['CORVINUS IRÁNYTŰ — SAJÁT FÉLÉVTERV','',...tasks.map(task=>`${task.checked?'[x]':'[ ]'} ${task.closest('label').querySelector('b').textContent}`),'','MEGJEGYZÉSEM',note.value||'Nincs megjegyzés.','','Önálló hallgatói segédoldal. A hivatalos feltételeket az egyetemi tájékoztatóban ellenőrizd.'].join('\r\n');
  const blob=new Blob(['\ufeff',text],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='corvinus-iranytu-felevtervem.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);showToast('A terved letöltése elindult.');
});
restorePlan();updateProgress();
if(!storageWorks)status.textContent='A mentés nem elérhető. Töltsd le a tervedet.';
