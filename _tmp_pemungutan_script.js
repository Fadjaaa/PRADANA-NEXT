
// ====== ISI DI SINI ======
var CANDS=[
 {id:"c1",nama:"Mumtaz Rasyid Ridha",foto:"MUMTAZ.jpg",visi:"Mewujudkan Ambalan Syihabudin sebagai organisasi yang progresif dan adaptif dalam menghadapi dinamika zaman, melalui pembentukan generasi yang kritis dalam berpikir, berintegritas dalam bersikap, dan mandiri dalam bertindak.",misi:["menciptakan ambalan yang progresif, kolaboratif, dan adaptif, dengan membangun budaya saling mendukung, terbuka terhadap kritik, serta berani melakukan perbaikan","- membangun budaya berpikir kritis dan kreatif melalui forum diskusi, musyawarah serta melatih anggota berani menyampaikan gagasan dan mencari solusi"]},
 {id:"c2",nama:"Raziq Tsany Kunaepi",foto:"RAZIQ.jpg",visi:"beriman, disiplin, dan berprestasi.",misi:["1.meningkatkan keimanan dan ketakwaan santri melalui ibadah kepada Allah","2.membiasakan santri untuk disiplin dalam baiat, ibadah, belajar, dan berorganisasi.","3.mendorong santri untuk meraih prestasi akademik dan kepramukaan yang membanggakan sekolah."]}
];
var EMAIL="fadjaai10@gmail.com",PIN="03057";
var KELAS=["X A","X B","X C","X D","XI IPA 1","XI IPA 2","XI IPS 1","XI IPS 2","XI IAI 1","XII MIPA 1","XII MIPA 2","XII IPS 1","XII IAI 1"];
// =========================
var $=function(i){return document.getElementById(i)},pick=null,db=null,uid=null,votes=[];
function show(n){["s1","s2","s3","s4"].forEach(function(s){var e=$(s);e.classList.remove("in");e.classList.toggle("hide",s!="s"+n);if(s=="s"+n){void e.offsetWidth;e.classList.add("in")}});scrollTo(0,0)}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
KELAS.forEach(function(k){var o=document.createElement("option");o.value=o.textContent=k;$("kelas").appendChild(o)});
if(window.claude&&claude.use){
  claude.use("user").then(function(u){if(u&&typeof u.id==="function")return u.id().then(function(i){uid=i})}).catch(function(){}).then(function(){return claude.use("db")}).then(function(d){db=d}).catch(function(){})
}
function render(){var c=$("cands");c.innerHTML="";CANDS.forEach(function(k,i){var d=document.createElement("div");d.className="cand";
 var m=k.misi.map(function(x){return"<li>"+esc(x)+"</li>"}).join("");
 d.innerHTML='<div class="no">0'+(i+1)+'</div><div class="ph"'+(k.foto?' style="background-image:url('+k.foto+')"':"")+'>'+(k.foto?"":"FOTO KANDIDAT")+'</div><h3>'+esc(k.nama)+'</h3><h4>Visi</h4><p>'+esc(k.visi)+'</p><h4>Misi</h4><ul>'+m+'</ul>';
 d.onclick=function(){pick=k.id;[].forEach.call(c.children,function(x){x.classList.remove("sel")});d.classList.add("sel");$("kirim").disabled=false};c.appendChild(d)})}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
$("lanjut").onclick=function(){var n=$("nama").value.trim();if(n.length<3)return $("e1").textContent="Isi nama lengkap dulu.";if(!$("kelas").value)return $("e1").textContent="Pilih kelas dulu.";
 if(ls("voted"))return $("e1").textContent="Perangkat ini sudah digunakan untuk memilih.";$("e1").textContent="";render();show(2)};
$("back").onclick=function(){show(1)};
$("kirim").onclick=function(){if(!pick)return;var b=$("kirim");b.disabled=true;
 var v={cand:pick,kelas:$("kelas").value,nama:$("nama").value.trim(),t:Date.now()};
 var done=function(){ls("voted","1");var a=JSON.parse(ls("local")||"[]");a.push(v);ls("local",JSON.stringify(a));show(3)};
 if(db){db.collection("votes").doc(uid||("v"+v.t+Math.random().toString(36).slice(2,7))).set(v).then(done).catch(function(){done()})}else done()};
function load(cb){if(db){db.collection("votes").get().then(function(s){var a=[];s.forEach(function(d){a.push(d.data())});cb(a)}).catch(function(){cb(JSON.parse(ls("local")||"[]"))})}else cb(JSON.parse(ls("local")||"[]"))}
function results(){load(function(a){votes=a;var cnt={},tot=a.length;CANDS.forEach(function(k){cnt[k.id]=0});a.forEach(function(v){if(cnt[v.cand]!==undefined)cnt[v.cand]++});
 $("bars").innerHTML=CANDS.map(function(k){var p=tot?Math.round(cnt[k.id]/tot*1000)/10:0;return'<div class="row"><b>'+esc(k.nama)+' — '+cnt[k.id]+' suara ('+p+'%)</b><div class="bar"><i style="width:'+p+'%"></i></div></div>'}).join("");
 $("tot").textContent="Total suara masuk: "+tot;
 var h="<tr><th>Kelas</th>"+CANDS.map(function(k){return"<th>"+esc(k.nama)+"</th>"}).join("")+"</tr>";
 KELAS.forEach(function(kl){h+="<tr><td>"+kl+"</td>"+CANDS.map(function(k){return"<td>"+a.filter(function(v){return v.kelas==kl&&v.cand==k.id}).length+"</td>"}).join("")+"</tr>"});
 $("tb").innerHTML=h;
 $("note").textContent=db?"Data diambil dari database bersama.":"Menampilkan data dari perangkat ini saja (database bersama tidak aktif).";
 window._sum=CANDS.map(function(k){return k.nama+": "+cnt[k.id]+" suara"}).join("\n")+"\nTotal: "+tot})}
$("adm").onclick=function(){var p=prompt("Masukkan PIN panitia");if(p===PIN){results();show(4)}else if(p!==null)alert("PIN salah")};
$("mail").onclick=function(){var body="HASIL PEMUNGUTAN SUARA\n\n"+window._sum+"\n\nPer kelas:\n"+KELAS.map(function(kl){return kl+": "+CANDS.map(function(k){return votes.filter(function(v){return v.kelas==kl&&v.cand==k.id}).length}).join(" / ")}).join("\n");
 location.href="mailto:"+EMAIL+"?subject="+encodeURIComponent("Hasil Pemungutan Suara Syihabudin")+"&body="+encodeURIComponent(body)};
$("csv").onclick=function(){var r="nama,kelas,pilihan\n"+votes.map(function(v){return'"'+v.nama+'","'+v.kelas+'","'+v.cand+'"'}).join("\n");
 claude.use("downloads").then(function(d){if(d)return d.save({filename:"hasil-suara.csv",data:r});alert("Unduhan tidak tersedia")}).catch(function(){})};
