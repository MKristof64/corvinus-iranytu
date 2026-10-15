'use strict';
const solutions = {
  seats: {title:'Betelt a kurzus? Indulj a lehetőségektől.', steps:[['Nézd át az alternatív kurzusokat.','Ellenőrizd a többi csoport időpontját, nyelvét és a saját képzésed követelményeit.'],['Rögzítsd pontosan, melyik tárgyról van szó.','Írd fel a tárgy- és kurzuskódot, a csoportot, valamint azt, hogy miért nem megfelelő a többi lehetőség.'],['Kérj tájékoztatást az illetékes egyetemi felületen.','A bővítés lehetőségéről és az ügyintézés módjáról kérj megerősítést. Őrizd meg a válaszokat.']]},
  clash: {title:'Két óra egy időben? Legyen B terved.', steps:[['Nézd meg az összes meghirdetett idősávot.','Ellenőrizd, hogy választható-e másik csoport, és számolj az épületek közötti utazási idővel is.'],['Hasonlítsd össze a tárgyak tantervi helyét.','Nézd meg az előfeltételeket és az ajánlott félévet. Jelöld meg, melyik tárgy elhalasztása érintené a további tanulmányaidat.'],['Az eltérési lehetőségekről kérj hivatalos tájékoztatást.','Az ütközés megengedhetőségét és az esetleges kérelmet a saját képzésed aktuális szabályai alapján tisztázd az ügyintézéssel.']]},
  tech: {title:'Hibaüzenet? Legyen meg minden részlet.', steps:[['Mentsd el a pontos hibaüzenetet.','Készíts képernyőképet, jegyezd fel az időpontot és azt, milyen műveletnél jelentkezett a hiba. Jelszót ne ossz meg.'],['Nézd meg a hivatalos tájékoztatást.','Ellenőrizd, jeleztek-e karbantartást vagy üzemzavart, és hogy a saját féléves státuszod, illetve tárgyfelvételi időszakod megfelelő-e.'],['Jelezd a problémát az ügyintézési felületen.','Add meg a szükséges tárgy- és kurzuskódot, a hiba leírását, valamint a reprodukálás lépéseit. Őrizd meg az ügy azonosítóját.']]},
  info: {title:'Sok az információ? Kezdj három ponttal.', steps:[['A saját képzésedből indulj ki.','Keresd meg a képzési programodat és az ahhoz tartozó mintatantervet. Írd össze az adott félévre tervezett tárgyaidat.'],['Ellenőrizd az aktuális félév tájékoztatóját.','A saját képzésedre és évfolyamodra érvényes időpontokat, bejelentkezési teendőket és tárgyfelvételi feltételeket keresd.'],['Tisztázd a nyitott kérdéseket.','Ami nem derül ki a hivatalos tájékoztatóból, azt egy konkrét, tárgykóddal és képzéssel megadott kérdésben jelezd.']]}
};
const tabs = [...document.querySelectorAll('[data-problem]')];
const panel = document.querySelector('#solution');
function selectProblem(tab, focus=false) {
  tabs.forEach(item=>{const selected=item===tab;item.classList.toggle('active',selected);item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;});
  const data=solutions[tab.dataset.problem];
  panel.setAttribute('aria-labelledby',tab.id);
  panel.querySelector('h3').textContent=data.title;
  const list=panel.querySelector('ol');list.replaceChildren();
  data.steps.forEach(([title,description])=>{const li=document.createElement('li'),b=document.createElement('b'),p=document.createElement('p');b.textContent=title;p.textContent=description;li.append(b,p);list.append(li);});
  if(focus)tab.focus();
}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectProblem(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%tabs.length;if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();selectProblem(tabs[next],true);}});});
const storageKey='corvinus-iranytu-plan-v1';
const tasks=[...document.querySelectorAll('[data-task]')];
const note=document.querySelector('#plan-note');
const status=document.querySelector('#save-status');
let storageWorks=true;
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved&&typeof saved==='object'){tasks.forEach(t=>t.checked=saved.tasks?.[t.dataset.task]===true);if(typeof saved.note==='string')note.value=saved.note.slice(0,2000);}}catch{storageWorks=false;}
function updateProgress(){const done=tasks.filter(t=>t.checked).length;document.querySelector('#progress-text').textContent=`${done} / ${tasks.length} lépés kész`;document.querySelector('#progress-percent').textContent=`${Math.round(done/tasks.length*100)}%`;document.querySelector('#progress-fill').style.width=`${done/tasks.length*100}%`;document.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',done);}
function save(){updateProgress();try{localStorage.setItem(storageKey,JSON.stringify({tasks:Object.fromEntries(tasks.map(t=>[t.dataset.task,t.checked])),note:note.value}));storageWorks=true;status.textContent='Mentve ezen a böngészőn.';}catch{storageWorks=false;status.textContent='Az automatikus mentés nem elérhető. A tervedet letöltheted.';}}
tasks.forEach(task=>task.addEventListener('change',save));note.addEventListener('input',save);
const resetButton=document.querySelector('#reset-plan');
const resetConfirmation=document.querySelector('#reset-confirm');
const cancelResetButton=document.querySelector('#cancel-reset');
function closeResetConfirmation(){resetConfirmation.hidden=true;resetButton.setAttribute('aria-expanded','false');resetButton.focus();}
resetButton.addEventListener('click',()=>{const opening=resetConfirmation.hidden;resetConfirmation.hidden=!opening;resetButton.setAttribute('aria-expanded',String(opening));if(opening)cancelResetButton.focus();});
cancelResetButton.addEventListener('click',closeResetConfirmation);
document.querySelector('#confirm-reset').addEventListener('click',()=>{tasks.forEach(t=>t.checked=false);note.value='';save();closeResetConfirmation();showToast('Új, üres teendőlista indult.');});
let toastTimer;
function showToast(message){const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),3200);}
document.querySelector('#export-plan').addEventListener('click',()=>{const text=['CORVINUS IRÁNYTŰ — SAJÁT FÉLÉVTERV','',...tasks.map(task=>`${task.checked?'[x]':'[ ]'} ${task.closest('label').querySelector('b').textContent}`),'','MEGJEGYZÉSEM',note.value||'Nincs megjegyzés.','','Önálló hallgatói segédoldal. A hivatalos feltételeket az egyetemi tájékoztatóban ellenőrizd.'].join('\r\n');const blob=new Blob(['\ufeff',text],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='corvinus-iranytu-felevtervem.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);showToast('A terved letöltése elindult.');});
updateProgress();if(!storageWorks)status.textContent='Az automatikus mentés nem elérhető. A tervedet letöltheted.';
