'use strict';
const $=q=>document.querySelector(q),cv=$('#c'),g=cv.getContext('2d'),W=960,H=540,GY=440,sc=$('#scr'),K={};
let S={scene:'rain'},mode='title',T=0,AC,mg,mus,tt,mini=null;

/* ============ AUDIO (WebAudio, tanpa file) — musik berubah: santai saat menjelajah, tegang saat memecahkan kode ============ */
const au=()=>{if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();mg=AC.createGain();mg.connect(AC.destination)}AC.resume()};
const tone=(f,d=.15,ty='square',v=.07,t0=0,sl)=>{if(!AC)return;const o=AC.createOscillator(),n=AC.createGain(),t=AC.currentTime+t0;o.type=ty;o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(sl,t+d);n.gain.setValueAtTime(v,t);n.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(n);n.connect(mg);o.start(t);o.stop(t+d+.05)};
const run=(a,ty,v,gap=.1,d=.2)=>a.forEach((f,i)=>tone(f,d,ty,v,i*gap));
const sfx={click:()=>tone(700,.05),jump:()=>tone(300,.15,'square',.05,0,600),step:()=>tone(70+Math.random()*30,.05,'triangle',.06),item:()=>run([880,1320],'sine',.1,.08),ok:()=>run([523,659,784,1047,1319],'triangle',.1,.09),bad:()=>tone(160,.4,'sawtooth',.1,0,50),door:()=>tone(60,1,'sawtooth',.09,0,300),over:()=>run([400,300,220,150],'sawtooth',.1,.3,.35),win:()=>run([523,659,784,1047,784,1047,1319,1568],'square',.08,.15,.3),lock:()=>run([300,200],'square',.08,.1,.1),laser:()=>tone(1200,.3,'sawtooth',.08,0,100)};
function music(){clearInterval(mus);let n=0;mus=setInterval(()=>{if(!AC)return;const t=S.mood=='tense',r=[55,49,58,52][(n>>5)&3];
 if(!t){if(n%16==0)[0,7,12].forEach(k=>tone(r*4*2**(k/12),3.4,'sine',.028));if(n%4==0&&Math.random()<.6)tone(r*8*2**([0,2,4,7,9][Math.random()*5|0]/12),.9,'triangle',.022)}
 else{if(n%2==0)tone(r/2,.16,'sine',.17);if(n%8==3)tone(r/2,.14,'sine',.12);if(n%8==0)tone(r*2,1.4,'sawtooth',.03,0,r*2.1);if(n%16==6)tone(r*2.83,.8,'square',.014);if(n%4==0)tone(r*8*2**([0,1,3,6][Math.random()*4|0]/12),.2,'triangle',.022)}
 n++},240)}

//#C ============ KRIPTOGRAFI MATEMATIKA: f(x)=m·x+a, invers=(x−a)/m ============
const MM={F:[3,2],G:[2,1],H:[5,-3],I:[4,4],J:[7,-5]};
const fx=k=>{const[m,a]=MM[k];return`${m}x ${a<0?'−':'+'} ${Math.abs(a)}`},ix=k=>{const[m,a]=MM[k];return`(x ${a<0?'+':'−'} ${Math.abs(a)}) ÷ ${m}`};
const c2n=c=>c==' '?0:c<='Z'?c.charCodeAt(0)-64:-(c.charCodeAt(0)-96),n2c=n=>n==0?' ':n>0?String.fromCharCode(64+n):String.fromCharCode(96-n);
const eo=(k,x)=>MM[k][0]*x+MM[k][1],dof=(k,x)=>(x-MM[k][1])/MM[k][0];
const chain=q=>q[1].split(',');
const enc=q=>[...q[0]].map(c=>chain(q).reduce((x,k)=>eo(k,x),c2n(c)));
const dec=(q,cs)=>cs.map(x=>[...chain(q)].reverse().reduce((v,k)=>dof(k,v),x)).map(n2c).join('');
const okq=q=>{const cs=enc(q);let good=1;cs.forEach(x=>{let v=x;[...chain(q)].reverse().forEach(k=>{v=dof(k,v);if(!Number.isInteger(v))good=0})});return good&&dec(q,cs)===q[0]};
const LV=[
{n:'THE WAREHOUSE',id:'Gudang',life:10,goal:'Kotak dokumen rahasia',w:2300,sky:['#0a0e18','#1b2436'],fl:'#262c38',ac:'#ffb703',dark:1,hl:3,
 q:[['HAI','F'],['KODE','F'],['Aku','F'],['Pintu','F'],['Go On','F']],
 pl:[{x:1100,w:150,h:90},{x:1850,w:150,h:130}],
 intro:'Gudang tua yang GELAP. Pakai senter (cahaya di sekitarmu) dan LOMPAT (W / ↑ / Spasi) ke tumpukan peti untuk menemukan 5 chip akses.',
 tip:'Gudang gelap! Senter hanya menerangi sekitarmu. Lompat ke peti tinggi untuk mencari chip akses ◆.',
 item:'Kotak dokumen rahasia — berisi simbol dan alamat menuju museum.',link:'Salah satu dokumen menyebut artefak yang disimpan di museum. Alamat itu jadi tujuan misi kedua.',
 props:[{x:300,t:'crate',n:'Peti kayu',s:0,txt:'Di bawah tutup peti ada chip akses kecil.'},
 {x:650,t:'radio',n:'Radio tua',s:1,txt:'Radio berdesis... lalu mengeluarkan chip akses dari lubang baterai.'},
 {x:1100,h:90,t:'note',n:'Papan pesan',s:2,txt:'Di balik papan pesan tertempel chip akses.'},
 {x:1450,t:'barrel',n:'Tong besi',s:3,txt:'Dasar tong berongga. Ada chip akses di dalamnya.'},
 {x:1850,h:130,t:'crate',n:'Peti tinggi',s:4,txt:'Kamu memanjat ke atas! Peti ini menyimpan chip akses terakhir.'},
 {x:2080,t:'barrel',n:'Tong kosong',txt:'Kosong. Hanya ada bau oli.'}]},
{n:'THE MUSEUM',id:'Museum',life:8,goal:'Artefak kuno',w:2600,sky:['#120d1f','#2a1b3d'],fl:'#2b2338',ac:'#c77dff',hl:3,
 q:[['MUSEUM','F'],['Relik','G'],['Emas Ku','F,G'],['PATUNG','G,F'],['Aku Tau','F,G']],
 pl:[{x:900,w:150,h:100},{x:1950,w:170,h:110}],
 intro:'Museum sunyi. Patung-patung penjaga akan memberi chip akses kalau kamu bisa mengulang POLA CAHAYA mereka.',
 tip:'Periksa patung penjaga (E). Hafalkan pola cahaya lalu ulangi dengan benar!',
 item:'Artefak kuno — memiliki nomor seri dan petunjuk akses menuju pusat data.',link:'Nomor seri artefak cocok dengan catatan inventaris sebuah pusat data. Kamu mengikuti jejaknya.',
 props:[{x:350,t:'statue',n:'Patung batu',txt:'Matanya seolah mengikuti gerakanmu.'},
 {x:600,t:'statue',n:'Patung penjaga I',s:0,g:'mem',txt:'Penjaga terbuka! Chip akses jatuh dari tangannya.'},
 {x:900,h:100,t:'frame',n:'Lukisan emas',s:1,txt:'Di balik bingkai tersembunyi chip akses.'},
 {x:1300,t:'statue',n:'Patung penjaga II',s:2,g:'mem',txt:'Pola benar! Chip akses terlepas.'},
 {x:1650,t:'case',n:'Etalase retak',s:3,txt:'Di dasar etalase ada chip akses.'},
 {x:1950,h:110,t:'statue',n:'Patung penjaga III',s:4,g:'mem',txt:'Pola terakhir benar! Chip akses terakhir ditemukan.'},
 {x:2300,t:'frame',n:'Lukisan lima pintu',txt:'Tanda tangan "O.M." di pojok lukisan.'}]},
{n:'THE DATA CENTER',id:'Pusat Data',life:6,goal:'Data digital rahasia',w:2800,sky:['#04141a','#062a33'],fl:'#0c2229',ac:'#2ec4b6',hl:2,
 q:[['Data Aman','F'],['PASSWORD','G'],['Buka Pintu','H'],['FIREWALL','G,H'],['Server Data','F,G,H']],
 pl:[{x:800,w:150,h:100},{x:1700,w:160,h:120},{x:2300,w:150,h:90}],
 intro:'Ruang server. Retas 3 firewall dengan menghentikan penanda tepat di zona hijau, dan cari 2 chip lain di rak.',
 tip:'Layar bertanda ◆ adalah firewall: tekan STOP/Spasi saat penanda di zona hijau.',
 item:'Salinan data rahasia — berisi koordinat dan catatan penelitian.',link:'Data itu mengungkap laboratorium rahasia. Koordinatnya jadi petunjuk lokasi keempat.',
 props:[{x:500,t:'server',n:'Rak server',txt:'Lampu berkedip. "BACKUP ARSIP O.M."'},
 {x:800,h:100,t:'screen',n:'Firewall A',s:0,g:'tim',txt:'Firewall A jebol! Chip akses diunduh.'},
 {x:1200,t:'server',n:'Rak server B',s:1,txt:'Slot cadangan rak ini menyimpan chip akses.'},
 {x:1700,h:120,t:'screen',n:'Firewall B',s:2,g:'tim',txt:'Firewall B jebol! Chip akses diunduh.'},
 {x:2000,t:'note',n:'Panel admin',s:3,txt:'Panel admin terbuka. Ada chip akses di dalamnya.'},
 {x:2300,h:90,t:'screen',n:'Firewall C',s:4,g:'tim',txt:'Firewall C jebol! Chip terakhir diunduh.'}]},
{n:'THE LABORATORY',id:'Laboratorium',life:4,goal:'Hasil penelitian rahasia',w:3000,sky:['#0a1a0e','#123320'],fl:'#16301c',ac:'#80ff72',hl:2,
 q:[['Hasil Riset','I'],['SAMPEL RAHASIA','H,I'],['Gen Dan Virus','F,G'],['Eksperimen','G,H,I'],['Kode Lab Aman','F,G,H,I']],
 pl:[{x:900,w:150,h:100},{x:2000,w:160,h:110}],
 intro:'Laboratorium rahasia. Kotak sampel terkunci: cocokkan pasangan simbol untuk membukanya. Hanya 4 nyawa!',
 tip:'Kotak bertanda ◆ berisi teka-teki pasangan simbol (memory match).',
 item:'Berkas penelitian — mengungkap hubungan organisasi dengan arsip rahasia pemerintah.',link:'Berkas menyebut brankas khusus di gedung pemerintah. Di sanalah bukti utama disimpan.',
 props:[{x:400,t:'tube',n:'Tabung kaca',s:0,txt:'Cairan hijau bergelembung. Chip akses menempel di dasarnya.'},
 {x:900,h:100,t:'board',n:'Kotak sampel A',s:1,g:'card',txt:'Terbuka! Chip akses ada di dalam.'},
 {x:1400,t:'case',n:'Kotak sampel B',s:2,g:'card',txt:'Terbuka! Chip akses ada di dalam.'},
 {x:1800,t:'tube',n:'Tabung retak',s:3,txt:'Di balik pecahan kaca ada chip akses.'},
 {x:2000,h:110,t:'board',n:'Kotak sampel C',s:4,g:'card',txt:'Terbuka! Chip akses terakhir.'},
 {x:2500,t:'tube',n:'Tabung SUBJEK 05',txt:'Label: "SUBJEK 05". Kosong.'},
 {x:2700,t:'note',n:'Catatan lab',txt:'"Brankas pemerintah... kunci terakhir..."'}]},
{n:'THE FINAL VAULT',id:'Brankas Pemerintah',life:2,goal:'Arsip rahasia pemerintah',w:3300,sky:['#1a0b0b','#351313'],fl:'#2a1212',ac:'#ff4d4d',hl:1,
 q:[['Brankas Negara','J'],['Bukti Dan Fakta','I,J'],['Arsip Rahasia Ku','H,I,J'],['Dalang Di Balik','G,H,I,J'],['Kebenaran Terbuka','F,G,H,I,J']],
 pl:[{x:1000,w:150,h:100},{x:2200,w:170,h:120}],
 las:[{x:800,p:0},{x:1250,p:2},{x:1500,p:4},{x:1950,p:1},{x:2500,p:3},{x:2800,p:5}],
 intro:'Brankas terakhir. SINAR LASER menjaga lorong: lompati saat padam! Gabungan semua teka-teki. Hanya 2 nyawa.',
 tip:'Awas laser merah! Lompat saat sinar padam. Kena laser = terlempar mundur (nyawa aman).',
 item:'Arsip rahasia — identitas organisasi, rencana kejahatan, dan identitas pengirim pesan anonim.',link:'Setelah arsip diambil, kebenaran terbuka: kamu tahu mengapa dirimu yang dipilih.',
 props:[{x:300,t:'frame',n:'Potret pejabat',txt:'Wajahnya dicoret tinta merah.'},
 {x:550,t:'note',n:'Memo',s:0,txt:'Memo menempel chip akses di baliknya.'},
 {x:1000,h:100,t:'screen',n:'Sensor retina',s:1,g:'tim',txt:'Sensor dibobol! Chip akses keluar.'},
 {x:1700,t:'case',n:'Etalase medali',s:2,g:'mem',txt:'Pola benar! Chip akses terlepas.'},
 {x:2200,h:120,t:'board',n:'Kotak pengunci',s:3,g:'card',txt:'Terbuka! Chip akses ada di dalam.'},
 {x:3050,t:'note',n:'Stiker pintu',s:4,txt:'Chip akses terakhir tertempel di sini.'}]}
];
//#E

/* ============ UI ============ */
const scr=h=>{sc.innerHTML=h||'';sc.classList.toggle('on',!!h)};
function toast(h,ms=4200){const t=$('#toast');t.innerHTML=h;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),ms)}
function ty(el,t,cb){let i=0,d=0;const fin=()=>{if(d)return;d=1;clearInterval(ty.i);el.textContent=t;cb&&cb()};clearInterval(ty.i);ty.i=setInterval(()=>{el.textContent=t.slice(0,++i);if(i%2==0)tone(900+Math.random()*500,.02,'square',.015);if(i>=t.length)fin()},26);sc.onclick=fin}
function hud(){const L=LV[S.lv];$('#hud').classList.remove('hide');$('#hud').innerHTML=`<span>👤 <b>${S.name}</b></span><span>MISI ${S.lv+1}/5 • ${L.id}</span><span>NYAWA <b id=life>${'♥'.repeat(Math.max(0,S.lives))}</b></span><span>🔑 Chip <b>${S.chip.size}/5</b></span><span>✔ Soal <b>${S.done.size}/5</b></span><span class=sp></span><button id=mute>${AC&&mg.gain.value==0?'🔇':'🔊'}</button>`}
$('#hud').onclick=e=>{if(e.target.id=='mute'){au();mg.gain.value=mg.gain.value?0:1;hud()}};
function title(){S={scene:'rain'};mode='title';$('#hud').classList.add('hide');
 scr(`<div class=ct><h1>DEADLOCK</h1><p class=tg>FIVE PLACES. FIVE SECRETS. ONE IMPOSSIBLE MISSION.</p><p class=mut>2D Puzzle Adventure • Mystery • Cryptography</p><button id=b1>▶ START GAME</button><button id=b2 class=b2>? HOW TO PLAY</button></div>`);
 $('#b1').onclick=()=>{au();sfx.click();music();nameScr()};$('#b2').onclick=()=>{au();sfx.click();how()}}
function how(){scr(`<div class=ct><h2>HOW TO PLAY</h2><p>⬅ ➡ / A D : jalan &nbsp;•&nbsp; W / ⬆ / Spasi : lompat &nbsp;•&nbsp; E / Enter : periksa objek</p><p>1. Jelajahi lokasi, lompati rintangan, dan selesaikan teka-teki (pola cahaya, firewall, pasangan simbol) untuk mendapat <b style="color:#ffd24a">5 chip akses ◆</b>.</p><p>2. Tiap chip membuka 1 soal di terminal ujung lorong. Tiap level punya <b>5 soal</b>.</p><p>3. Di terminal ada rumus, contoh, panduan bertahap, <b>kalkulator</b>, dan tombol <b>HINT</b>. Dekripsi urutannya DIBALIK!</p><p>4. Jawaban salah = -1 nyawa. Nyawa habis = tertangkap polisi.</p><button id=bk>◀ KEMBALI</button></div>`);$('#bk').onclick=()=>{sfx.click();title()}}
function nameScr(){scr(`<div class=ct><h2>BUAT KARAKTERMU</h2><p class=mut>Siapa nama pencuri legendaris ini?</p><input id=nm maxlength=12 placeholder="NAMA..." style="text-transform:none"><br><button id=go>LANJUT ▶</button></div>`);const f=()=>{S.name=($('#nm').value.trim().replace(/[<>&]/g,'')||'Ghost');sfx.click();story()};$('#go').onclick=f;$('#nm').onkeydown=e=>{e.stopPropagation();if(e.key=='Enter')f()};$('#nm').onkeyup=e=>e.stopPropagation();$('#nm').focus()}
function story(){mode='story';scr(`<div class=ct><div class=ty id=t></div><button id=go class=hide>TERIMA MISI ▶</button></div>`);
 ty($('#t'),`📩 PESAN ANONIM — 02:13 AM\n\n"${S.name}, aku tahu siapa dirimu dan apa yang bisa kamu lakukan.\nAda lima benda yang harus kamu curi dari lima tempat berbeda. Imbalannya sangat besar.\nTidak ada kunci biasa. Setiap pintu dijaga kode enkripsi.\nJangan tanya alasannya. Mulailah dari gudang tua di pinggir kota."`,()=>{$('#go').classList.remove('hide')});
 $('#go').onclick=()=>{sc.onclick=null;sfx.click();startLv(0)}}
function startLv(i){const L=LV[i];Object.assign(S,{lv:i,lives:L.life,px:120,py:0,vy:0,vx:0,face:1,cam:0,seen:new Set(),chip:new Set(),done:new Set(),hints:{},scene:'lv',bad:0,open:false});
 S.cs=L.q.map(enc);mode='intro';$('#hud').classList.add('hide');
 scr(`<div class=ct><p class=mut>MISI ${i+1} / 5</p><h2>${L.n}</h2><p class=tg>${L.id}</p><p>${L.intro}</p><p>♥ Nyawa: <b>${L.life}</b> &nbsp;•&nbsp; 🔐 Metode: <b>${'FGHIJ'.slice(0,i+1).split('').join(', ')}</b> &nbsp;•&nbsp; 5 soal</p><button id=go>MASUK ▶</button></div>`);
 $('#go').onclick=()=>{sfx.click();scr();mode='play';hud();toast(L.tip+'<br>Tekan <b>E</b> untuk memeriksa. Terminal ada di ujung lorong.',7000)}}

function near(p){return mode=='play'&&Math.abs(S.px-p.x)<65&&Math.abs(S.py-(p.h||0))<55}
function act(){if(mode!='play')return;const L=LV[S.lv];
 if(Math.abs(S.px-(L.w-70))<75&&S.py<30){sfx.click();return terminal()}
 const p=L.props.find(near);if(!p)return;
 const give=()=>{S.seen.add(p);if(p.s!=null&&!S.chip.has(p.s)){S.chip.add(p.s);sfx.item();toast(`<b>${p.n}</b><br>${p.txt}<br><b style="color:#ffd24a">🔑 Chip akses → membuka SOAL ${p.s+1} di terminal!</b>`,6000);hud()}else toast(`<b>${p.n}</b><br>${p.txt}`,4500)};
 if(p.s!=null&&!S.chip.has(p.s)&&p.g){sfx.click();return MG[p.g](()=>{scr();mode='play';give()})}
 sfx.click();give()}

/* ---------- MINI GAME ---------- */
const MG={
mem(cb){mode='mini';const n=3+Math.min(S.lv,3),sq=Array.from({length:n},()=>Math.random()*4|0),cl=['#f44','#4f4','#48f','#fd2'];let inp=[],lk=1,dead=0;
 scr(`<div class=ct><h2>POLA CAHAYA</h2><p id=mm>Perhatikan urutan cahaya...</p><div id=pd>${cl.map((c,i)=>`<button class=pad data-i=${i} style="background:${c}"></button>`).join('')}</div><button class=b2 id=x>← BATAL</button></div>`);
 const pads=[...document.querySelectorAll('.pad')],fl=i=>{if(dead)return;pads[i].classList.add('lit');tone(300+i*130,.25,'sine',.1);setTimeout(()=>pads[i].classList.remove('lit'),350)},play=()=>{lk=1;inp=[];sq.forEach((v,k)=>setTimeout(()=>fl(v),600+k*600));setTimeout(()=>{if(dead)return;lk=0;$('#mm').textContent='Giliranmu! Ulangi polanya.'},600+n*600)};play();
 pads.forEach(p=>p.onclick=()=>{if(lk)return;const i=+p.dataset.i;fl(i);if(i!=sq[inp.length]){sfx.bad();$('#mm').textContent='Salah! Perhatikan lagi...';return setTimeout(play,900)}inp.push(i);if(inp.length==n){lk=1;dead=1;setTimeout(()=>{sfx.ok();cb()},500)}});
 $('#x').onclick=()=>{dead=1;scr();mode='play'}},
tim(cb){mode='mini';let pos=0,d=1,hit=0,zc=50,zw=Math.max(14,30-S.lv*4),sp=1.4+S.lv*.35;
 const nz=()=>{zc=20+Math.random()*60};nz();
 scr(`<div class=ct><h2>PERETASAN FIREWALL</h2><p>Hentikan penanda di zona hijau — 3 kali berhasil! (tombol STOP / Spasi)</p><div id=bar><i id=zn></i><b id=mk></b></div><p id=mm>0 / 3</p><button id=sp>■ STOP</button><button class=b2 id=x>← BATAL</button></div>`);
 const iv=setInterval(()=>{pos+=d*sp;if(pos>100||pos<0)d=-d;pos=Math.max(0,Math.min(100,pos));$('#mk').style.left=pos+'%';$('#zn').style.left=(zc-zw/2)+'%';$('#zn').style.width=zw+'%'},16);
 const stop=()=>{if(Math.abs(pos-zc)<=zw/2){hit++;sfx.item();$('#mm').textContent=hit+' / 3';nz();if(hit>=3){clearInterval(iv);mini=null;sfx.ok();setTimeout(cb,400)}}else{hit=0;sfx.bad();$('#mm').textContent='Meleset! Ulang dari 0 / 3'}};
 mini=stop;$('#sp').onclick=stop;$('#x').onclick=()=>{clearInterval(iv);mini=null;scr();mode='play'}},
card(cb){mode='mini';const sy=['🔑','💾','🧪'],c=[...sy,...sy].sort(()=>Math.random()-.5);let o=[],m=0,lk=0;
 scr(`<div class=ct><h2>COCOKKAN SIMBOL</h2><p>Temukan 3 pasang simbol yang sama.</p><div id=cd>${c.map(()=>`<button class=card>?</button>`).join('')}</div><button class=b2 id=x>← BATAL</button></div>`);
 const b=[...document.querySelectorAll('.card')];b.forEach((e,i)=>e.onclick=()=>{if(lk||o.includes(i)||e.dataset.ok)return;e.textContent=c[i];sfx.click();o.push(i);if(o.length==2){lk=1;const[a,z]=o;if(c[a]==c[z]){b[a].dataset.ok=b[z].dataset.ok=1;o=[];lk=0;sfx.item();if(++m==3)setTimeout(()=>{sfx.ok();cb()},500)}else setTimeout(()=>{b[a].textContent=b[z].textContent='?';o=[];lk=0},700)}});
 $('#x').onclick=()=>{scr();mode='play'}}};

/* ---------- TERMINAL ---------- */
function terminal(){mode='panel';const L=LV[S.lv];
 scr(`<div class=pn><h2>🔐 TERMINAL — ${L.n}</h2><p>Selesaikan <b>5 soal</b>. Soal terbuka setelah kamu menemukan chip aksesnya di area ini.</p><p class=flow>Metode level ini: ${'FGHIJ'.slice(0,S.lv+1).split('').map(k=>`${k}(x)=${fx(k)}`).join(' &nbsp;•&nbsp; ')}</p><div>${L.q.map((q,i)=>{const d=S.done.has(i),u=S.chip.has(i);return`<button class="${d?'b2':''}" data-i=${i} ${d||!u?'disabled':''}>${d?'✔':u?'🔓':'🔒'} SOAL ${i+1}</button>`}).join('')}</div><p class=mut>Nyawa: ${S.lives} • Chip ${S.chip.size}/5 • Terpecahkan ${S.done.size}/5</p><button class=b2 id=cl>← KELUAR</button></div>`);
 $('#cl').onclick=()=>{sfx.click();scr();mode='play'};document.querySelectorAll('.pn [data-i]').forEach(b=>b.onclick=()=>{sfx.click();soal(+b.dataset.i)})}
const calc={run(){const i=$('#cdp'),raw=i.value.trim();if(!raw||raw=='ERR')return;const e=raw.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/,/g,'.');let r=NaN;if(/^[0-9+\-*/().\s]+$/.test(e)){try{r=Function('"use strict";return('+e+')')()}catch(_){}}
 $('#cdx').textContent=raw+' =';i.value=isFinite(r)?String(+r.toFixed(8)):'ERR';tone(660,.06)},
 key(k){const i=$('#cdp');if(k=='=')return this.run();if(i.value=='ERR')i.value='';if(k=='C'){i.value='';$('#cdx').textContent=' '}else if(k=='⌫')i.value=i.value.slice(0,-1);else i.value+=k;i.focus()}};
function hintTxt(i,n){const L=LV[S.lv],q=L.q[i],ch=chain(q),rv=[...ch].reverse(),cs=S.cs[i];
 if(n==0)return`Urutan dekripsi: ${rv.map(k=>k+'⁻¹').join(' → ')}. Ingat: huruf kapital = angka positif, huruf kecil = negatif, spasi = 0.`;
 if(n==1){const k=rv[0];return`Angka pertama kode = ${cs[0]}. Tahap pertama ${k}⁻¹: (${cs[0]} ${MM[k][1]<0?'+':'−'} ${Math.abs(MM[k][1])}) ÷ ${MM[k][0]} = <b>${dof(k,cs[0])}</b>. Lanjutkan sendiri untuk tahap berikutnya.`}
 const sp=ch.reduce((x,k)=>eo(k,x),0);return q[0].includes(' ')?`Spasi (0) dienkripsi menjadi <b>${sp}</b>. Setiap angka ${sp} di kode berarti spasi.`:`Pesan ini tidak mengandung spasi (tidak ada angka ${sp}).`}
function soal(i){S.cur=i;mode='soal';const L=LV[S.lv],q=L.q[i],ch=chain(q),rv=[...ch].reverse(),cs=S.cs[i],hn=L.hl,used=(S.hints[i]||0);
 const ex=c=>{let v=c2n(c),a=[`${c} = ${v}`];ch.forEach(k=>{v=eo(k,v);a.push(`${k}: ${v}`)});const e=v;rv.forEach(k=>{v=dof(k,v);a.push(`${k}⁻¹: ${v}`)});return`Contoh 1 karakter "${c}":\n  Enkripsi : ${a.slice(0,ch.length+1).join(' → ')}\n  Dekripsi : ${e} → ${a.slice(ch.length+1).join(' → ')} = ${c}`};
 const strip='A=1 B=2 C=3 D=4 E=5 F=6 G=7 H=8 I=9 J=10 K=11 L=12 M=13\nN=14 O=15 P=16 Q=17 R=18 S=19 T=20 U=21 V=22 W=23 X=24 Y=25 Z=26\na=-1 b=-2 c=-3 d=-4 e=-5 f=-6 g=-7 h=-8 i=-9 j=-10 k=-11 l=-12 m=-13\nn=-14 o=-15 p=-16 q=-17 r=-18 s=-19 t=-20 u=-21 v=-22 w=-23 x=-24 y=-25 z=-26   spasi=0';
 let h=`<div class=pn id=pn><h2>SOAL ${i+1}/5 — ${L.n}</h2><p class=flow>Enkripsi: ${ch.join(' → ')} &nbsp;|&nbsp; Dekripsi (DIBALIK): ${rv.map(k=>k+'⁻¹').join(' → ')}</p><h3>📘 Rumus & contoh</h3>`;
 ch.forEach(k=>h+=`<div class=mt><b>Method ${k}</b>: enkripsi ${k.toLowerCase()}(x) = ${fx(k)} &nbsp;|&nbsp; dekripsi ${k.toLowerCase()}⁻¹(x) = ${ix(k)}</div>`);
 h+=`<pre>${ex(ch.length>1?'B':'H')}</pre><details><summary>🔤 Tabel konversi karakter (klik)</summary><pre>${strip}</pre></details><h3>🪜 Panduan bertahap</h3><ol class=stp>${rv.map((k,j)=>`<li>Terapkan <b>${k}⁻¹</b>(x) = ${ix(k)} pada <i>setiap angka</i> kode${j==0?' (angka asli dari ciphertext)':' (hasil tahap sebelumnya)'} <small class=mut>[klik jika selesai]</small></li>`).join('')}<li>Ubah tiap angka hasil akhir menjadi karakter (positif = kapital, negatif = kecil, 0 = spasi), lalu ketik pesannya.</li></ol>`;
 h+=`<div class=g2><div><h3>💻 CIPHERTEXT (${cs.length} karakter)</h3><div class=cph>${cs.map((x,j)=>`<span><small>${j+1}</small>${x}</span>`).join('')}</div><div id=hb>${Array.from({length:used},(_,n)=>`<p class=hint>💡 ${hintTxt(i,n)}</p>`).join('')}</div><div id=ls>${'♥'.repeat(S.lives)}</div><input id=ans autocomplete=off style="text-transform:none" placeholder="ketik plaintext (huruf besar/kecil berpengaruh)..."><br><button id=ck>DEKRIPSI</button><button class=b2 id=hi>💡 HINT (${hn-used} sisa)</button><p id=ms></p><button class=b2 id=bk>← DAFTAR SOAL</button></div>
 <div class=calc><div id=cdx> </div><input id=cdp autocomplete=off spellcheck=false inputmode=decimal placeholder="ketik: (26-2)/3"><div class=ck>${['7','8','9','÷','4','5','6','×','1','2','3','−','0','.','+','=','C','⌫','(',')'].map(k=>`<button class=${/\d|\./.test(k)?'':'b2'} data-k="${k}">${k}</button>`).join('')}</div><p class=mut style="font-size:.9em">Bisa diketik langsung (+ − * / ( )), Enter = hitung.</p></div></div></div>`;
 scr(h);const a=$('#ans');a.focus();a.onkeydown=e=>{e.stopPropagation();e.key=='Enter'&&check()};$('#ck').onclick=check;$('#bk').onclick=()=>{sfx.click();terminal()};
 document.querySelectorAll('.calc [data-k]').forEach(b=>b.onclick=()=>{tone(500,.04);calc.key(b.dataset.k)});const ci=$('#cdp');ci.onkeydown=e=>{e.stopPropagation();if(e.key=='Enter'||e.key=='='){e.preventDefault();calc.run()}};ci.onkeyup=e=>e.stopPropagation();document.querySelectorAll('.stp li').forEach(l=>l.onclick=()=>{l.classList.toggle('dn');sfx.click()});
 $('#hi').onclick=()=>{const u=S.hints[i]||0;if(u>=hn)return toast('Hint untuk level ini sudah habis.',2000);S.hints[i]=u+1;sfx.item();$('#hb').insertAdjacentHTML('beforeend',`<p class=hint>💡 ${hintTxt(i,u)}</p>`);$('#hi').textContent=`💡 HINT (${hn-u-1} sisa)`}}
function check(){const L=LV[S.lv],i=S.cur,v=$('#ans').value.trim();if(!v)return;
 if(v===L.q[i][0]){sfx.ok();S.done.add(i);hud();mode='wait';$('#ms').innerHTML=`<b class=ok>✔ AKSES DITERIMA</b><br>${L.q[i][0]}`;
  setTimeout(()=>{if(S.done.size==5){S.open=true;sfx.door();scr();done()}else terminal()},1800)}
 else{S.lives--;sfx.bad();hud();const p=$('#pn');p.classList.add('shake');setTimeout(()=>p.classList.remove('shake'),400);if(S.lives<=0){mode='wait';return setTimeout(over,700)}
  $('#ls').textContent='♥'.repeat(S.lives);$('#ms').innerHTML=`<b class=er>✖ AKSES DITOLAK</b> — nyawa tersisa ${S.lives}`;$('#ans').select()}}
function done(){mode='end';sfx.item();const L=LV[S.lv],last=S.lv==4;
 scr(`<div class=ct><p class=mut>MISI ${S.lv+1} SELESAI</p><h2>AKSES TERBUKA</h2><p class=tg>📦 Benda diperoleh (${S.lv+1}/5):</p><p><b>${L.item}</b></p><p class=mut>${L.link}</p><button id=nx>${last?'BUKA ARSIP ▶':'LANJUT KE MISI BERIKUTNYA ▶'}</button></div>`);
 $('#nx').onclick=()=>{sfx.click();last?ending():startLv(S.lv+1)}}
function over(){mode='over';sfx.over();S.scene='rain';S.bad=1;$('#hud').classList.add('hide');
 scr(`<div class="ct red"><h1>GAME OVER</h1><p>🚨 Sirene meraung. <b>${S.name}</b> tertangkap polisi dan dibawa ke penjara...</p><p class=mut>Progres karakter ini hilang. Buat karakter baru dan mulai lagi dari Misi 1.</p><button id=nw>KARAKTER BARU</button></div>`);
 $('#nw').onclick=()=>{S.bad=0;sfx.click();nameScr()}}
function ending(){mode='end';S.scene='rain';$('#hud').classList.add('hide');
 scr(`<div class=ct><div class=ty id=t></div><div id=wn class=hide><h1>YOU WIN</h1><p class=tg>THE TRUTH WAS NEVER LOCKED. IT WAS ENCRYPTED.</p><button id=ag>MAIN LAGI</button></div></div>`);
 ty($('#t'),`Arsip terbuka. Identitas organisasi. Rencana kejahatan. Dan nama pengirim pesan anonim itu.\n\nLima benda yang kamu kumpulkan ternyata potongan bukti yang saling melengkapi.\nKamu tidak dipilih acak, ${S.name}. Hanya pencuri yang bisa memecahkan enkripsi yang mampu menembus lima sistem ini — dan sang pengirim tahu itu. Kamu dimanfaatkan.\n\nTapi arsip itu kini ada di tanganmu. Kebenaran ada di tanganmu.`,()=>{sfx.win();$('#wn').classList.remove('hide');$('#t').style.minHeight=0;$('#ag').onclick=()=>{sc.onclick=null;sfx.click();title()}})}

/* ============ GAMBAR & LOOP ============ */
function prop(p,L){const sx=p.x-S.cam;if(sx<-120||sx>W+120)return;const nr=near(p),a=L.ac,h=p.h||0;g.save();g.translate(sx,GY-h);
 const R=(c,x,y,w,hh)=>{g.fillStyle=c;g.fillRect(x,y,w,hh)};
 switch(p.t){
 case'crate':R('#6b4a2a',-30,-60,60,60);R('#4a3320',-30,-60,60,6);R('#4a3320',-3,-60,6,60);R('#8a6a42',-26,-52,52,4);break;
 case'barrel':R('#445',-20,-64,40,64);R('#667',-20,-50,40,5);R('#667',-20,-20,40,5);break;
 case'radio':R('#222',-24,-40,48,40);R('#444',-18,-34,22,26);R(a,10,-30,8,8);R('#666',14,-72,3,34);break;
 case'note':R('#333',-34,-110,68,88);R('#f4e27a',-20,-95,40,40);R('#0006',-14,-86,28,3);R('#0006',-14,-78,20,3);break;
 case'statue':R('#667',-24,-8,48,8);R('#8a8a99',-14,-48,28,40);R('#9a9aa9',-10,-116,20,70);R('#aab',-9,-142,18,24);break;
 case'case':R('#334',-34,-8,68,8);R(a+'22',-30,-90,60,82);g.strokeStyle=a;g.strokeRect(-30,-90,60,82);R(a,-8,-44,16,16);break;
 case'frame':R('#6a5230',-40,-130,80,100);R('#1a1228',-34,-124,68,88);R(a+'88',-20,-110,40,40);break;
 case'server':R('#12171f',-28,-150,56,150);for(let i=0;i<8;i++){R('#222c3a',-24,-144+i*18,48,12);R(Math.sin(T*.1+i+p.x)>0?'#3f6':'#f63',16,-141+i*18,5,5)}break;
 case'screen':R('#222',-4,-30,8,30);R('#111',-38,-90,76,56);R(a+'55',-33,-85,66,46);for(let i=0;i<4;i++)R(a,-28,-80+i*10,20+((T/8+i*7)%30),3);break;
 case'tube':R('#223',-22,-6,44,6);R(a+'22',-18,-110,36,104);R(a+'88',-18,-80,36,74);for(let i=0;i<3;i++)R('#fff6',-8+i*8,-20-((T*.8+i*30)%60),4,4);break;
 case'board':R('#334',-50,-110,100,80);R('#cde',-44,-104,88,68);R('#345',-36,-92,40,3);R('#345',-36,-82,60,3);R('#345',-36,-72,30,3);break}
 g.textAlign='center';
 if(p.s!=null&&!S.chip.has(p.s)){g.fillStyle='#ffd24a';g.font='bold 22px monospace';g.fillText(p.g?'⚡◆':'◆',0,-170+Math.sin(T*.08)*6)}
 if(nr){g.fillStyle='#000c';g.fillRect(-75,-215,150,26);g.fillStyle='#fff';g.font='15px monospace';g.fillText('[E] '+p.n,0,-197)}
 g.restore()}
function term(L){const sx=L.w-140-S.cam;if(sx<-200||sx>W+200)return;const un=S.chip.size>0,nr=mode=='play'&&Math.abs(S.px-(L.w-70))<75&&S.py<30;g.save();g.translate(sx,GY);
 g.fillStyle='#10131a';g.fillRect(-62,-204,124,204);g.fillStyle=S.open?L.ac+'66':'#2a3144';g.fillRect(-50,-192,100,192);
 if(!S.open)for(let i=0;i<5;i++){g.fillStyle='#0005';g.fillRect(-50,-192+i*38,100,3)}
 g.fillStyle='#0b0e14';g.fillRect(70,-110,46,110);g.fillStyle='#000';g.fillRect(75,-102,36,28);g.fillStyle=S.open||un?'#3f6':'#f44';g.fillRect(80,-96,26,3);g.fillRect(80,-88,16,3);
 g.fillStyle=(T>>4)%2?(un?'#3f6':'#f44'):'#222';g.fillRect(88,-64,10,10);
 g.textAlign='center';if(nr){g.fillStyle='#000c';g.fillRect(10,-150,170,26);g.fillStyle='#fff';g.font='15px monospace';g.fillText('[E] Buka terminal',95,-132)}
 g.restore()}
function plr(L){const sx=S.px-S.cam,m=S.vx&&S.py==gh()?Math.sin(T*.35):0;g.save();g.translate(sx,GY-S.py);g.fillStyle='#0006';g.beginPath();g.ellipse(0,S.py,22,6,0,0,7);g.fill();g.scale(S.face,1);
 g.fillStyle='#161b28';g.fillRect(-9+m*5,-24,8,24);g.fillRect(1-m*5,-24,8,24);g.fillStyle='#232b3f';g.fillRect(-12,-62,24,40);g.fillStyle='#4a3a20';g.fillRect(-19,-56,8,26);
 g.fillStyle='#1b2133';g.fillRect(-11,-86,22,26);g.fillStyle=L.ac;g.fillRect(3,-78,6,4);g.fillStyle='#2d3752';g.fillRect(-3+m*6,-58,8,24);g.restore();
 g.fillStyle='#fff';g.font='14px monospace';g.textAlign='center';g.fillText(S.name,sx,GY-S.py-100)}
const vg=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.95);vg.addColorStop(0,'#0000');vg.addColorStop(1,'#000c');
function lv(){const L=LV[S.lv],cam=S.cam;
 let gr=g.createLinearGradient(0,0,0,GY);gr.addColorStop(0,L.sky[0]);gr.addColorStop(1,L.sky[1]);g.fillStyle=gr;g.fillRect(0,0,W,H);
 for(let i=0;i<14;i++){const sx=((i*210-cam*.3)%(W+210)+W+210)%(W+210)-100,h=120+((i*73+S.lv*31)%140);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(sx,GY-h-40,150,h+40);g.fillStyle=L.ac+'22';for(let j=0;j<h/30;j++)if((i+j)%3==0)g.fillRect(sx+20+(j%2)*60,GY-h-20+j*30,14,10)}
 g.fillStyle=L.fl;g.fillRect(0,GY,W,H-GY);g.fillStyle=L.ac+'44';g.fillRect(0,GY,W,3);g.fillStyle='#0003';for(let i=-1;i<14;i++)g.fillRect(i*80-cam%80,GY+3,2,H);
 for(let i=0;i<6;i++){const x=((i*400-cam*.9)%2400+2400)%2400-200,f=Math.sin(T*.05+i*2)>-.85?1:.3;g.fillStyle=`rgba(255,255,255,${.04*f})`;g.beginPath();g.moveTo(x-10,0);g.lineTo(x+10,0);g.lineTo(x+120,GY);g.lineTo(x-120,GY);g.fill();g.fillStyle=L.ac;g.fillRect(x-14,0,28,5)}
 (L.pl||[]).forEach(p=>{const x=p.x-p.w/2-cam;g.fillStyle='#0004';g.fillRect(x+6,GY-p.h+12,p.w-12,p.h-12);g.fillStyle=L.fl;g.fillRect(x,GY-p.h,p.w,14);g.fillStyle=L.ac;g.fillRect(x,GY-p.h,p.w,3)});
 (L.las||[]).forEach(l=>{const on=las(l),x=l.x-cam;g.fillStyle='#222';g.fillRect(x-8,GY-96,16,8);g.fillRect(x-8,GY-6,16,6);if(on){g.fillStyle='#f33';g.fillRect(x-3,GY-90,6,84);g.fillStyle='#f336';g.fillRect(x-9,GY-90,18,84)}else{g.fillStyle='#f334';g.fillRect(x-1,GY-90,2,84)}});
 L.props.forEach(p=>prop(p,L));term(L);plr(L);
 g.fillStyle='#fff3';for(let i=0;i<40;i++)g.fillRect(((i*97+T*.2*(1+i%3)-cam*.6)%W+W)%W,(i*53+Math.sin(T*.02+i)*20+T*.1)%GY,2,2);
 if(L.dark){const sx=S.px-cam,f=g.createRadialGradient(sx,GY-S.py-50,30,sx,GY-S.py-50,230);f.addColorStop(0,'#0000');f.addColorStop(1,'rgba(0,0,6,.95)');g.fillStyle=f;g.fillRect(0,0,W,H)}
 g.fillStyle=vg;g.fillRect(0,0,W,H)}
const cols=Array.from({length:48},()=>Math.random()*H);
function rain(){g.fillStyle='rgba(3,6,10,.2)';g.fillRect(0,0,W,H);g.font='16px monospace';g.textAlign='left';cols.forEach((y,i)=>{g.fillStyle=S.bad?'#f33':'#2ee6a6';g.fillText('01ABCDEFXYZ#$%'[Math.random()*14|0],i*20,y);cols[i]=y>H&&Math.random()>.97?0:y+16})}
const las=l=>Math.sin(T*.05+l.p)>.2;
function gh(){const L=LV[S.lv];let b=0;(L.pl||[]).forEach(p=>{if(Math.abs(S.px-p.x)<p.w/2&&S.py>=p.h-14)b=Math.max(b,p.h)});return b}
function upd(){if(mode!='play'){S.vx=0;return}const L=LV[S.lv];S.vx=((K.arrowright||K.d||K.t_r)?1:0)-((K.arrowleft||K.a||K.t_l)?1:0);S.px=Math.max(40,Math.min(L.w-20,S.px+S.vx*4.2));
 const g0=gh();if((K.arrowup||K.w||K[' ']||K.t_j)&&S.py<=g0+1&&S.vy==0){S.vy=13;sfx.jump()}
 S.vy-=.7;S.py+=S.vy;const g1=gh();if(S.py<=g1&&S.vy<=0){S.py=g1;S.vy=0}
 if(S.vx){S.face=S.vx;if(T%16==0&&S.py==g1)sfx.step()}
 (L.las||[]).forEach(l=>{if(las(l)&&Math.abs(S.px-l.x)<14&&S.py<90){S.px=Math.max(80,l.x-170);S.py=0;S.vy=0;sfx.laser();toast('⚡ Terkena laser! Kamu terlempar mundur. (Nyawa aman)',2500)}});
 S.cam+=(Math.max(0,Math.min(L.w-W,S.px-W/2))-S.cam)*.12}
function loop(){T++;S.mood=(mode=='panel'||mode=='soal'||mode=='mini'||mode=='wait'||(S.scene=='lv'&&S.lives<=2&&mode=='play')||(S.lv==4&&mode=='play'))?'tense':'calm';if(S.scene=='lv'){upd();lv()}else rain();requestAnimationFrame(loop)}
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(mode=='play'&&(k.startsWith('arrow')||k==' '))e.preventDefault();
 if(e.target.tagName=='INPUT')return;K[k]=1;
 if(mode=='play'&&(k=='e'||k=='enter'))act();else if(mode=='mini'&&k==' '&&mini){e.preventDefault();mini()}else if((mode=='panel'||mode=='soal')&&k=='escape'){scr();mode='play'}});
addEventListener('keyup',e=>K[e.key.toLowerCase()]=0);addEventListener('blur',()=>{for(const k in K)K[k]=0});
document.querySelectorAll('#tc button').forEach(b=>{const k=b.dataset.k;b.onpointerdown=()=>{au();k=='t_e'?act():K[k]=1};b.onpointerup=b.onpointerleave=()=>K[k]=0});
music();title();loop();
