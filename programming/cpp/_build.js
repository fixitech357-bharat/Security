const fs = require('fs');
const path = require('path');

// ==================== HTML TEMPLATE (self-contained) ====================
const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>__NUM__ · __TITLE__</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',system-ui,sans-serif;background:#0b0f19;color:#e8edf5;line-height:1.6;overflow-x:hidden}
.bg{position:fixed;inset:0;z-index:-1;background:radial-gradient(circle at 20% 30%,rgba(59,130,246,.14),transparent 50%),radial-gradient(circle at 80% 70%,rgba(168,85,247,.12),transparent 50%)}
.wrap{max-width:1100px;margin:0 auto;padding:0 1.5rem}
.hero{text-align:center;padding:4rem 1.5rem 2rem}
.pill{display:inline-flex;align-items:center;gap:.5rem;background:rgba(96,165,250,.12);border:1px solid rgba(96,165,250,.3);border-radius:999px;padding:.35rem 1rem;font-size:.72rem;font-weight:700;color:#60a5fa;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1.2rem}
.pill .n{background:#60a5fa;color:#0b0f19;min-width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:800;padding:0 .3rem}
.hero h1{font-size:clamp(2rem,4.5vw,3.2rem);font-weight:800;letter-spacing:-.03em;line-height:1.15;margin-bottom:.8rem}
.grad{background:linear-gradient(135deg,#60a5fa,#a78bfa 40%,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:1rem;color:#94a3b8;max-width:660px;margin:0 auto}
.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:.8rem;margin-bottom:1.5rem}
.fact{background:rgba(15,23,42,.6);border:1px solid rgba(148,163,184,.12);border-radius:1rem;padding:1rem 1.1rem;text-align:center;transition:all .25s}
.fact:hover{transform:translateY(-3px);border-color:rgba(96,165,250,.3)}
.fact .b{font-size:1.1rem;font-weight:800;background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.2}
.fact .l{font-size:.66rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;font-weight:600;margin-top:.2rem}
.card{background:rgba(15,23,42,.6);border:1px solid rgba(148,163,184,.12);border-radius:1.5rem;padding:1.8rem;margin-bottom:1.5rem;transition:border-color .25s}
.card:hover{border-color:rgba(96,165,250,.25)}
.lbl{display:inline-flex;align-items:center;gap:.4rem;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#60a5fa;margin-bottom:.6rem}
.lbl i{width:6px;height:6px;background:#60a5fa;border-radius:50%;display:inline-block}
.card h2{font-size:1.4rem;font-weight:700;color:#f1f5f9;margin-bottom:.4rem}
.card>p{color:#94a3b8;font-size:.92rem}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1rem;margin-top:1.1rem}
.cc{background:rgba(30,41,59,.6);border:1px solid rgba(148,163,184,.12);border-radius:1rem;padding:1.2rem;transition:all .25s;position:relative;overflow:hidden}
.cc::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:linear-gradient(180deg,var(--c,#60a5fa),transparent)}
.cc:hover{transform:translateY(-3px);border-color:rgba(96,165,250,.35);box-shadow:0 12px 28px -10px rgba(0,0,0,.5)}
.cc .ic{font-size:1.5rem;margin-bottom:.4rem}
.cc .t{font-size:.98rem;font-weight:700;color:#f1f5f9;margin-bottom:.3rem}
.cc .d{font-size:.82rem;color:#94a3b8;line-height:1.5}
.cc .ex{margin-top:.5rem;font-family:'Fira Code',monospace;font-size:.75rem;color:#93c5fd;background:rgba(0,0,0,.3);padding:.4rem .7rem;border-radius:.4rem;white-space:pre-wrap}
.pg{display:grid;grid-template-columns:1.5fr 1fr;gap:0;border-radius:1rem;overflow:hidden;border:1px solid rgba(148,163,184,.15);margin-top:1.2rem;background:#0d1117}
.ed{border-right:1px solid rgba(148,163,184,.12);display:flex;flex-direction:column}
.tb{display:flex;align-items:center;justify-content:space-between;padding:.6rem 1rem;background:#161b22;border-bottom:1px solid rgba(148,163,184,.1)}
.tl{display:flex;align-items:center;gap:.6rem}
.tr{display:flex;gap:6px}
.tr span{width:11px;height:11px;border-radius:50%}
.tr span:nth-child(1){background:#ff5f56}
.tr span:nth-child(2){background:#ffbd2e}
.tr span:nth-child(3){background:#27c93f}
.fn{font-size:.78rem;color:#8b949e;font-family:'Fira Code',monospace}
.rb{background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;border-radius:999px;padding:.4rem 1rem;font-size:.8rem;font-weight:600;cursor:pointer}
.rb:hover{transform:translateY(-1px)}
.ta{width:100%;min-height:300px;background:#0d1117;color:#e6edf3;border:none;padding:1.1rem 1.3rem;font-family:'Fira Code',monospace;font-size:.88rem;line-height:1.75;resize:vertical;outline:none;tab-size:4;white-space:pre}
.op{display:flex;flex-direction:column;background:#010409}
.oh{padding:.6rem 1rem;background:#161b22;border-bottom:1px solid rgba(148,163,184,.1);font-size:.7rem;font-weight:600;color:#8b949e;letter-spacing:.08em;display:flex;align-items:center;gap:.5rem}
.sd{width:8px;height:8px;border-radius:50%;background:#484f58}
.sd.ok{background:#27c93f}
.sd.err{background:#ff5f56}
.ob{padding:1.1rem 1.3rem;font-family:'Fira Code',monospace;font-size:.85rem;line-height:1.7;color:#7ee787;white-space:pre-wrap;overflow-y:auto;flex:1;min-height:260px}
.ob .err{color:#ff7b72}
.ob .dim{color:#484f58;font-style:italic}
.tip{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.2);border-radius:.8rem;padding:.9rem 1.1rem;margin-top:1rem;font-size:.85rem;color:#cbd5e1;display:flex;gap:.6rem}
.tip code{background:rgba(255,166,87,.15);color:#ffa657;padding:.1rem .35rem;border-radius:.3rem;font-family:'Fira Code',monospace;font-size:.8rem}
.sv{margin-top:1.1rem;background:#0d1117;border-radius:1rem;border:1px solid rgba(148,163,184,.15);overflow:hidden}
.sh{padding:.7rem 1.2rem;background:#161b22;border-bottom:1px solid rgba(148,163,184,.1);display:flex;align-items:center;justify-content:space-between}
.sh .ti{font-size:.8rem;color:#8b949e;font-family:'Fira Code',monospace}
.sc{display:flex;gap:.4rem}
.sb{background:rgba(59,130,246,.15);border:1px solid rgba(59,130,246,.3);color:#60a5fa;border-radius:.5rem;padding:.3rem .8rem;font-size:.75rem;font-weight:600;cursor:pointer}
.sb:hover:not(:disabled){background:rgba(59,130,246,.3)}
.sb:disabled{opacity:.35;cursor:not-allowed}
.sbd{display:grid;grid-template-columns:1.2fr 1fr}
.sk{padding:1rem 1.2rem;font-family:'Fira Code',monospace;font-size:.8rem;line-height:1.9;border-right:1px solid rgba(148,163,184,.1)}
.sk .ln{padding:.15rem .5rem;border-radius:.3rem;white-space:pre;transition:background .3s}
.sk .ln.act{background:rgba(96,165,250,.15);color:#f1f5f9;box-shadow:inset 3px 0 0 #60a5fa}
.sk .kw{color:#ff7b72}
.sk .fn2{color:#d2a8ff}
.sk .st{color:#a5d6ff}
.sk .nu{color:#79c0ff}
.sk .pp{color:#ffa657}
.sk .cm{color:#8b949e;font-style:italic}
.si{padding:1rem 1.2rem;background:rgba(30,41,59,.4)}
.si .ex2{font-size:.82rem;color:#cbd5e1;min-height:4rem;margin-bottom:.8rem;line-height:1.55}
.si .ex2 code{background:rgba(255,166,87,.15);color:#ffa657;padding:.1rem .35rem;border-radius:.25rem;font-family:'Fira Code',monospace;font-size:.78rem}
.si .tg{display:flex;flex-wrap:wrap;gap:.35rem;min-height:1.8rem}
.si .tg span{background:rgba(167,139,250,.15);border:1px solid rgba(167,139,250,.3);color:#d2a8ff;border-radius:.4rem;padding:.2rem .55rem;font-size:.7rem;font-family:'Fira Code',monospace}
.sp{padding:.6rem 1.2rem;background:rgba(30,41,59,.3);border-top:1px solid rgba(148,163,184,.08);display:flex;align-items:center;gap:.6rem}
.sp .bar{flex:1;height:4px;background:rgba(148,163,184,.15);border-radius:999px;overflow:hidden}
.sp .bf{height:100%;width:0;background:linear-gradient(90deg,#60a5fa,#a78bfa);transition:width .35s}
.sp .ct{font-size:.72rem;color:#64748b;font-family:'Fira Code',monospace;min-width:3.5rem;text-align:right}
.rc{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:.8rem;margin-top:1rem}
.rcg{background:rgba(30,41,59,.6);border-radius:.8rem;padding:1rem 1.1rem;border-left:3px solid var(--rc,#60a5fa)}
.rcg .t{font-size:.72rem;font-weight:700;color:var(--rc,#60a5fa);text-transform:uppercase;letter-spacing:.06em}
.rcg .d{font-size:.85rem;color:#cbd5e1;margin-top:.2rem}
.rcg .d code{background:rgba(255,166,87,.15);color:#ffa657;padding:.1rem .35rem;border-radius:.25rem;font-family:'Fira Code',monospace;font-size:.78rem}
.nav{display:flex;justify-content:space-between;gap:1rem;margin-top:2rem;padding-top:1.5rem;border-top:1px solid rgba(148,163,184,.12)}
.nav a{flex:1;background:rgba(30,41,59,.6);border:1px solid rgba(148,163,184,.12);border-radius:1rem;padding:1rem 1.2rem;text-decoration:none;color:#cbd5e1;transition:all .2s}
.nav a:hover{background:rgba(59,130,246,.1);border-color:rgba(96,165,250,.3);transform:translateY(-2px)}
.nav .l{font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:#64748b;font-weight:600;margin-bottom:.2rem}
.nav .t{font-size:.9rem;font-weight:600;color:#f1f5f9}
.nav .nx{text-align:right}
@media(max-width:780px){.pg,.sbd{grid-template-columns:1fr}.ed,.sk{border-right:none;border-bottom:1px solid rgba(148,163,184,.12)}.nav{flex-direction:column}}
</style>
</head>
<body>
<div class="bg"></div>
<div class="hero">
  <div class="wrap">
    <div class="pill"><span class="n">__NUM__</span> Topic __NUM__ of the C++ Series</div>
    <h1>__TITLE_HTML__</h1>
    <p>__SUBTITLE__</p>
  </div>
</div>
<div class="wrap">
  <div class="facts">__FACTS__</div>

  <div class="card">
    <div class="lbl"><i></i> Core Concepts</div>
    <h2>What You Need to Know</h2>
    <p>__CONCEPT_INTRO__</p>
    <div class="grid">__CONCEPTS__</div>
  </div>

  <div class="card">
    <div class="lbl"><i></i> Hands-On</div>
    <h2>Try It Yourself</h2>
    <p>__PG_INTRO__</p>
    <div class="pg">
      <div class="ed">
        <div class="tb">
          <div class="tl"><div class="tr"><span></span><span></span><span></span></div><span class="fn">__PG_FILE__</span></div>
          <button class="rb" onclick="runCode()">▶ Run Code</button>
        </div>
        <textarea class="ta" id="code" spellcheck="false">__PG_CODE__</textarea>
      </div>
      <div class="op">
        <div class="oh"><span class="sd" id="sd"></span> OUTPUT</div>
        <div class="ob" id="ob"><span class="dim">// Click "Run Code" to see the output...</span></div>
      </div>
    </div>
    <div class="tip">💡 __TIP__</div>
  </div>

  <div class="card">
    <div class="lbl"><i></i> Watch It Run</div>
    <h2>Step-by-Step Walkthrough</h2>
    <p>Click <strong>Next Step</strong> to see what happens line by line.</p>
    <div class="sv">
      <div class="sh"><span class="ti">__PG_FILE__</span>
        <div class="sc">
          <button class="sb" id="pb" onclick="sPrev()" disabled>← Prev</button>
          <button class="sb" id="nb" onclick="sNext()">Next Step →</button>
          <button class="sb" onclick="sReset()">↺ Reset</button>
        </div>
      </div>
      <div class="sbd">
        <div class="sk" id="sk">__STEP_CODE__</div>
        <div class="si">
          <div class="ex2" id="sx">Click <strong>Next Step</strong> to begin.</div>
          <div class="tg" id="st"><span style="font-size:.72rem;color:#484f58;">Waiting to start</span></div>
        </div>
      </div>
      <div class="sp"><div class="bar"><div class="bf" id="bf"></div></div><div class="ct" id="ct">0 / 0</div></div>
    </div>
  </div>

  <div class="card">
    <div class="lbl"><i></i> Recap</div>
    <h2>What You Just Learned</h2>
    <div class="rc">__RECAP__</div>
  </div>

  <div class="nav">
    <a href="../__PREV__/index.html" class="pv"><div class="l">← Previous</div><div class="t">__PREV_TITLE__</div></a>
    <a href="../__NEXT__/index.html" class="nx"><div class="l">Next →</div><div class="t">__NEXT_TITLE__</div></a>
  </div>
</div>

<script>
const T = __DATA__;
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function hl(l){let h=esc(l);h=h.replace(/(\\/\\/.*|#include.*)/g,'<span class="cm">$1</span>');h=h.replace(/\\b(int|return|if|else|for|while|class|struct|void|auto|const|using|namespace|public|private|new|delete|try|catch|throw|template|typename|virtual|override|constexpr|nullptr|bool|true|false)\\b/g,'<span class="kw">$1</span>');h=h.replace(/\\b(main|cout|cin|endl|printf|std|string|vector|map|set)\\b/g,'<span class="fn2">$1</span>');h=h.replace(/"([^"\\\\]|\\\\.)*"/g,'<span class="st">$&</span>');h=h.replace(/\\b(\\d+)\\b/g,'<span class="nu">$1</span>');return h||' '}
function stripC(c){return c.replace(/\\/\\*[\\s\\S]*?\\*\\//g,' ').replace(/\\/\\/.*$/gm,'')}
function splitS(b){const o=[];let c='',s=false,h=false,d=0;for(let i=0;i<b.length;i++){const x=b[i],p=b[i-1];if(x==='"'&&p!=='\\\\')s=!s;if(x==="'"&&p!=='\\\\')h=!h;if(!s&&!h){if(x==='('||x==='{')d++;if(x===')'||x==='}')d--;if(x===';'&&d===0){o.push(c.trim());c='';continue}}c+=x}if(c.trim())o.push(c.trim());return o}
function splitA(s){const a=[];let c='',d=0,ins=false;for(let i=0;i<s.length;i++){const x=s[i];if(x==='"'&&s[i-1]!=='\\\\')ins=!ins;if(!ins){if(x==='(')d++;if(x===')')d--;if(x===','&&d===0){a.push(c.trim());c='';continue}}c+=x}if(c.trim())a.push(c.trim());return a}
function ev(e,v){e=e.trim();if(/^".*"$/.test(e))return e.slice(1,-1);if(/^'.'$/.test(e))return e.slice(1,-1);if(/^-?\\d+\\.\\d+$/.test(e))return parseFloat(e);if(/^-?\\d+$/.test(e))return parseInt(e,10);if(v[e]!==undefined)return v[e];let r=e;Object.keys(v).sort((a,b)=>b.length-a.length).forEach(n=>{r=r.replace(new RegExp('\\\\b'+n+'\\\\b','g'),'('+v[n]+')')});try{return Function('"use strict";return ('+r+')')()}catch{return 0}}
function runCode(){
  const raw=document.getElementById('code').value;
  const ob=document.getElementById('ob'),sd=document.getElementById('sd');
  ob.innerHTML='';
  const o=(raw.match(/\\/\\*/g)||[]).length,c=(raw.match(/\\*\\//g)||[]).length;
  if(o>c){sd.className='sd err';ob.innerHTML='<span class="err">⚠ Unclosed comment: /* was never closed with */</span>';return}
  let cl=stripC(raw).replace(/#include\\s*<[^>]+>/g,'');
  const mm=cl.match(/int\\s+main\\s*\\(\\s*(?:void)?\\s*\\)\\s*\\{([\\s\\S]*)\\}\\s*$/);
  if(!mm){sd.className='sd err';ob.innerHTML='<span class="err">⚠ No main() function found.</span>';return}
  const body=mm[1],vars={},out=[];let exit=0;
  for(const st of splitS(body)){
    const s=st.trim();if(!s)continue;
    if(/^return\\b/.test(s)){exit=parseInt(s.replace(/^return\\s+/,'').replace(/;$/,'').trim(),10)||0;break}
    let d=s.match(/^(int|float|double|char|long|bool|auto|std::string|string)\\s+(\\w+)\\s*=\\s*([\\s\\S]+)$/);
    if(d){vars[d[2]]=ev(d[3],vars);continue}
    let d2=s.match(/^(int|float|double|char|long|bool|std::string|string)\\s+(\\w+)$/);
    if(d2){vars[d2[2]]=0;continue}
    let am=s.match(/^(\\w+)\\s*=\\s*([\\s\\S]+)$/);
    if(am&&vars[am[1]]!==undefined){vars[am[1]]=ev(am[2],vars);continue}
    let cm=s.match(/^std::cout\\s*([\\s\\S]+)$/);
    if(cm){
      let ch=cm[1],res='',parts=[],cur='',ins=false;
      for(let i=0;i<ch.length;i++){
        const x=ch[i];
        if(x==='"'&&ch[i-1]!=='\\\\')ins=!ins;
        if(!ins&&x==='<'&&ch[i+1]==='<'){parts.push(cur.trim());cur='';i++;continue}
        cur+=x;
      }
      if(cur.trim())parts.push(cur.trim());
      for(const p of parts){
        if(!p)continue;
        if(p==='std::endl'||p==='endl'){res+='\\n';continue}
        const sm=p.match(/^"((?:[^"\\\\]|\\\\.)*)"$/);
        if(sm){res+=sm[1].replace(/\\\\n/g,'\\n').replace(/\\\\t/g,'\\t').replace(/\\\\\\\\/g,'\\\\').replace(/\\\\"/g,'"');continue}
        res+=String(ev(p,vars));
      }
      out.push(res);continue;
    }
    let pm=s.match(/^printf\\s*\\(([\\s\\S]+)\\)$/);
    if(pm){
      const a=splitA(pm[1]),fm=a[0].match(/^"((?:[^"\\\\]|\\\\.)*)"$/);
      if(fm){
        let fmt=fm[1].replace(/\\\\n/g,'\\n').replace(/\\\\t/g,'\\t');
        const vals=a.slice(1).map(x=>ev(x,vars));let ai=0;
        fmt=fmt.replace(/%[difcs]/g,m=>{const v=vals[ai++];if(m==='%d'||m==='%i')return Math.floor(Number(v));if(m==='%f')return Number(v).toFixed(6);if(m==='%c')return String(v);if(m==='%s')return String(v);return m});
        out.push(fmt);
      }
      continue;
    }
  }
  sd.className='sd ok';
  ob.innerHTML=out.length?out.map(l=>'<div>'+esc(l)+'</div>').join(''):'<span class="dim">// Ran successfully but printed nothing.</span>';
  const ex=document.createElement('div');
  ex.style.cssText='margin-top:.6rem;font-size:.75rem;color:'+(exit===0?'#4ade80':'#f87171');
  ex.textContent='Process exited with code '+exit;
  ob.appendChild(ex);
}
document.getElementById('sk').innerHTML=T.steps.map((_,i)=>'<div class="ln" data-i="'+i+'">'+hl(T.stepCode[i]||'')+'</div>').join('');
document.getElementById('ct').textContent='0 / '+T.steps.length;
let cs=-1;
function sU(){
  document.querySelectorAll('#sk .ln').forEach(e=>e.classList.remove('act'));
  if(cs<0){
    document.getElementById('sx').innerHTML='Click <strong>Next Step</strong> to begin.';
    document.getElementById('st').innerHTML='<span style="font-size:.72rem;color:#484f58;">Waiting to start</span>';
    document.getElementById('bf').style.width='0%';
    document.getElementById('ct').textContent='0 / '+T.steps.length;
    document.getElementById('pb').disabled=true;document.getElementById('nb').disabled=false;return;
  }
  const s=T.steps[cs],el=document.querySelector('#sk .ln[data-i="'+cs+'"]');
  if(el)el.classList.add('act');
  document.getElementById('sx').innerHTML=s.text;
  document.getElementById('st').innerHTML=(s.tags||[]).map(t=>'<span>'+t+'</span>').join('');
  document.getElementById('bf').style.width=((cs+1)/T.steps.length*100)+'%';
  document.getElementById('ct').textContent=(cs+1)+' / '+T.steps.length;
  document.getElementById('pb').disabled=cs<=0;document.getElementById('nb').disabled=cs>=T.steps.length-1;
}
function sNext(){if(cs<T.steps.length-1){cs++;sU()}}
function sPrev(){if(cs>0){cs--;sU()}}
function sReset(){cs=-1;sU()}
sU();
</script>
</body>
</html>`;

// ==================== TITLE GENERATION ====================
function titleFromSlug(slug) {
  let s = slug.replace(/^\d+-/, '');
  s = s.replace(/-/g, ' ');
  s = s.replace(/\bc plus plus\b/gi, 'C++');
  s = s.replace(/\bcpp\b/gi, 'C++');
  s = s.replace(/\bc plus\b/gi, 'C+');
  s = s.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  s = s.replace(/\bC\+\+\b/g, 'C++');
  s = s.replace(/\bGcc\b/g, 'GCC');
  s = s.replace(/\bClang\b/g, 'Clang');
  s = s.replace(/\bMsvc\b/g, 'MSVC');
  s = s.replace(/\bMingw\b/g, 'MinGW');
  s = s.replace(/\bVs Code\b/g, 'VS Code');
  s = s.replace(/\bClion\b/g, 'CLion');
  s = s.replace(/\bCmake\b/g, 'CMake');
  s = s.replace(/\bStl\b/g, 'STL');
  s = s.replace(/\bOop\b/g, 'OOP');
  s = s.replace(/\bDsa\b/g, 'DSA');
  s = s.replace(/\bAbi\b/g, 'ABI');
  s = s.replace(/\bIde\b/g, 'IDE');
  s = s.replace(/\bGui\b/g, 'GUI');
  s = s.replace(/\bApi\b/g, 'API');
  return s;
}

// ==================== CATEGORY DETECTION ====================
function detectCategory(slug) {
  if (/introduction|overview|intro\b/.test(slug)) return 'intro';
  if (/history|stroustrup|origin/.test(slug)) return 'history';
  if (/standard|98|03|11|14|17|20|23|26/.test(slug) && /c-plus-plus/.test(slug)) return 'standard';
  if (/\bgcc\b|\bclang\b|\bmsvc\b|mingw|compiler|toolchain|tooling/.test(slug)) return 'compiler';
  if (/visual-studio|vs-code|clion|\bide\b/.test(slug)) return 'ide';
  if (/cmake|ninja|makefile|\bmake\b/.test(slug)) return 'buildtool';
  if (/stl|container|algorithm|iterator|vector|map|set/.test(slug)) return 'stl';
  if (/question|interview|practice|bank|dsa|mock/.test(slug)) return 'practice';
  if (/mastery|expert|advanced|complete|final|capstone|production|enterprise/.test(slug)) return 'mastery';
  if (/design|architecture|pattern|abstraction/.test(slug)) return 'design';
  if (/application|real-world|use-case|industry/.test(slug)) return 'application';
  if (/memory|pointer|reference|raii|smart-pointer/.test(slug)) return 'memory';
  if (/concurrency|thread|mutex|async|parallel/.test(slug)) return 'concurrency';
  if (/template|generic|concept|sfinae|metaprogramming/.test(slug)) return 'template';
  if (/performance|optimization|benchmark|profiling/.test(slug)) return 'performance';
  if (/debug|test|sanitizer|valgrind/.test(slug)) return 'debug';
  if (/security|safe|vulnerability/.test(slug)) return 'security';
  if (/feature|language|syntax|keyword|type|operator|expression|statement/.test(slug)) return 'langfeature';
  if (/systems|system-programming|embedded|kernel/.test(slug)) return 'systems';
  return 'general';
}

// ==================== CATEGORY CONTENT ====================
function contentFor(cat, title) {
  const T = title;
  const map = {
    intro: {
      sub: `A complete introduction to ${T} — what it is and why it matters.`,
      intro: `${T} is an essential part of the C++ journey. Here are the core ideas.`,
      facts: [['C++', 'Language'], ['1979', 'Created'], ['ISO', 'Standardized'], ['Multi', 'Paradigm'], ['STL', 'Library']],
      concepts: [
        ['📖', 'What It Is', `An overview of ${T} and where it fits in the C++ landscape.`, ''],
        ['🎯', 'Why It Matters', `Practical reasons to understand ${T} in real projects.`, ''],
        ['⚙️', 'How It Works', `Core mechanics behind ${T} at a high level.`, ''],
        ['🚀', 'Where It Fits', `How ${T} connects to compilers, build systems, and code.`, '']
      ],
      steps: [
        ['🔍', 'Introduction — the topic is introduced and defined.'],
        ['🧩', 'Core idea — the main concept is explained with examples.'],
        ['⚙️', 'How it works — underlying mechanics.'],
        ['🎯', 'Where it matters — real-world usage.']
      ],
      tip: 'Read the page once, then come back to the code example and experiment.'
    },
    history: {
      sub: `The story of ${T} — key milestones, people, and decisions.`,
      intro: `${T} sits within C++ history, from C with Classes (1979) to modern C++.`,
      facts: [['1979', 'C with Classes'], ['1983', 'Named C++'], ['1985', 'Cfront 1.0'], ['1998', 'ISO C++'], ['2024', 'C++23']],
      concepts: [
        ['🔬', 'Origin', `Where ${T} came from and why it was created.`, ''],
        ['📛', 'Evolution', `How ${T} changed over the decades.`, ''],
        ['📖', 'Milestone', `Key events in the history of ${T}.`, ''],
        ['🌍', 'Impact', `How ${T} shaped modern C++.`, '']
      ],
      steps: [
        ['📅', 'A milestone in the C++ timeline.'],
        ['👤', 'A key person or decision.'],
        ['⚙️', 'A change to the language.'],
        ['🌍', 'A lasting impact.']
      ],
      tip: 'Cross-reference with cppreference.com to see authoritative dates.'
    },
    standard: {
      sub: `${T} — features, changes, and what it introduced to the language.`,
      intro: `The C++ standard ${T} brought new language and library features. Here are the essentials.`,
      facts: [['ISO/IEC', 'Standard'], ['WG21', 'Committee'], ['Features', 'Added'], ['Fixes', 'Bugs'], ['Modern', 'Era']],
      concepts: [
        ['📘', 'Overview', `What ${T} changed and why it mattered.`, ''],
        ['✨', 'New Features', `Language and library additions.`, ''],
        ['🐛', 'Bug Fixes', `Corrections and clarifications.`, ''],
        ['🎯', 'Impact', `How ${T} affected real-world C++.`, '']
      ],
      steps: [
        ['📅', 'Standard published by ISO.'],
        ['✨', 'New features introduced.'],
        ['🐛', 'Defects fixed.'],
        ['🚀', 'Widely adopted by compilers.']
      ],
      tip: 'Check cppreference.com for the full list of features in each standard.'
    },
    compiler: {
      sub: `${T} — a C++ compiler toolchain used to build programs.`,
      intro: `${T} compiles C++ source code into machine code. Here is what you need to know.`,
      facts: [['Toolchain', 'Type'], ['CLI', 'Interface'], ['Cross', 'Platform'], ['Free', 'Mostly'], ['OPTS', 'Many']],
      concepts: [
        ['⚙️', 'Install', `How to install ${T} on your system.`, ''],
        ['💻', 'Basic Command', `The most common command line.`, 'g++ main.cpp -o app'],
        ['🎛️', 'Flags', `Useful compiler flags.`, '-Wall -O2 -std=c++20'],
        ['🛠️', 'Advanced', `Advanced usage and multi-file builds.`, '']
      ],
      steps: [
        ['⚙️', 'Compiler reads source files.'],
        ['🔍', 'Preprocessing and parsing.'],
        ['🚀', 'Code generation.'],
        ['🔗', 'Linking into an executable.']
      ],
      tip: 'Enable warnings with <code>-Wall -Wextra</code> — they catch real bugs.'
    },
    ide: {
      sub: `${T} — an integrated development environment for C++.`,
      intro: `${T} provides editing, building, and debugging for C++ in one application.`,
      facts: [['IDE', 'Type'], ['GUI', 'Interface'], ['Debug', 'Built-In'], ['Refactor', 'Tools'], ['Extensions', 'Plugins']],
      concepts: [
        ['🖥️', 'Setup', `Installing and configuring ${T}.`, ''],
        ['⌨️', 'Key Features', `Editor, build, run, debug.`, ''],
        ['🔌', 'Extensions', `Plugins that extend ${T}.`, ''],
        ['🐞', 'Debugger', `Breakpoints and step-through debugging.`, '']
      ],
      steps: [
        ['🖥️', 'Open the IDE and create a project.'],
        ['⌨️', 'Write your C++ code.'],
        ['⚙️', 'Build the project.'],
        ['🐞', 'Run and debug.']
      ],
      tip: 'Learn your IDE\'s keyboard shortcuts — they save hours.'
    },
    buildtool: {
      sub: `${T} — a build automation tool for C++ projects.`,
      intro: `${T} automates the process of compiling and linking multi-file C++ projects.`,
      facts: [['Build', 'Automation'], ['Cross', 'Platform'], ['Fast', 'Incremental'], ['CLI', 'Tool'], ['Modern', 'Standard']],
      concepts: [
        ['📁', 'Project Files', `Configuration files ${T} reads.`, 'CMakeLists.txt'],
        ['⚙️', 'Commands', `Common ${T} commands.`, 'cmake -B build'],
        ['🏗️', 'Build', `Compiling the project.`, 'cmake --build build'],
        ['📦', 'Targets', `Libraries and executables.`, '']
      ],
      steps: [
        ['📁', 'Read project file.'],
        ['⚙️', 'Configure the build.'],
        ['🏗️', 'Compile each source file.'],
        ['🔗', 'Link into a final executable.']
      ],
      tip: 'Out-of-source builds keep your source directory clean.'
    },
    stl: {
      sub: `${T} — part of the C++ Standard Library.`,
      intro: `The Standard Template Library provides ${T.toLowerCase()} and related tools ready to use.`,
      facts: [['Header', 'Only'], ['Container', 'Type'], ['Iterators', 'Support'], ['Fast', 'Tested'], ['Standard', 'STL']],
      concepts: [
        ['📦', 'What It Is', `An overview of ${T} in the STL.`, ''],
        ['🛠️', 'Usage', `How to use ${T} in code.`, '#include <vector>'],
        ['⚡', 'Complexity', `Performance characteristics.`, ''],
        ['🎯', 'When to Use', `Choosing ${T} over alternatives.`, '']
      ],
      steps: [
        ['📦', 'Include the header.'],
        ['🛠️', 'Declare and use the container.'],
        ['🔁', 'Iterate through elements.'],
        ['🎯', 'Apply algorithms when useful.']
      ],
      tip: 'Prefer STL containers over raw arrays in modern C++.'
    },
    practice: {
      sub: `${T} — practice problems and interview preparation.`,
      intro: `${T} covers common questions and problems to sharpen your C++ skills.`,
      facts: [['Practice', 'Type'], ['Interview', 'Ready'], ['DSA', 'Topics'], ['Hands-On', 'Style'], ['Answers', 'Explained']],
      concepts: [
        ['🎯', 'Topic Focus', `Core areas covered by ${T}.`, ''],
        ['📝', 'Approach', `How to think through problems.`, ''],
        ['✅', 'Solutions', `Writing clean, efficient answers.`, ''],
        ['🔁', 'Review', `Iterating and improving.`, '']
      ],
      steps: [
        ['📖', 'Read the problem carefully.'],
        ['🧠', 'Plan before coding.'],
        ['💻', 'Write clean code.'],
        ['✅', 'Test edge cases.']
      ],
      tip: 'Explain your solution out loud — it reveals gaps in understanding.'
    },
    mastery: {
      sub: `${T} — advanced material for reaching expert level in C++.`,
      intro: `${T} covers advanced C++ topics to take you from competent to expert.`,
      facts: [['Expert', 'Level'], ['Deep', 'Dive'], ['Real', 'Projects'], ['Best', 'Practices'], ['Advanced', 'Patterns']],
      concepts: [
        ['🎓', 'Advanced Topic', `Core advanced concept covered here.`, ''],
        ['🧩', 'Complexity', `Why this is harder than basics.`, ''],
        ['🎯', 'When to Use', `Deciding when advanced tools are appropriate.`, ''],
        ['⚙️', 'Trade-offs', `Costs and benefits of advanced approaches.`, '']
      ],
      steps: [
        ['🎓', 'Advanced concept introduced.'],
        ['🧩', 'How it works internally.'],
        ['🎯', 'When and where to apply it.'],
        ['⚙️', 'Common pitfalls to avoid.']
      ],
      tip: 'Master the basics first — advanced topics build on them.'
    },
    design: {
      sub: `${T} — design principles and architecture patterns for C++.`,
      intro: `${T} explains how to structure C++ code for maintainability and scale.`,
      facts: [['Design', 'Focus'], ['Patterns', 'Applied'], ['SOLID', 'Principles'], ['Clean', 'Code'], ['Scalable', 'Architecture']],
      concepts: [
        ['🏗️', 'Principle', `Core design idea in ${T}.`, ''],
        ['🧩', 'Pattern', `Reusable solution structure.`, ''],
        ['⚖️', 'Trade-off', `When to apply and when not to.`, ''],
        ['🎯', 'Example', `Real C++ code demonstrating it.`, '']
      ],
      steps: [
        ['🏗️', 'Identify the design problem.'],
        ['🧩', 'Apply the appropriate pattern.'],
        ['⚖️', 'Weigh trade-offs.'],
        ['✅', 'Refactor and review.']
      ],
      tip: 'Patterns are tools — apply them only when the problem demands it.'
    },
    application: {
      sub: `${T} — where C++ is used in the real world.`,
      intro: `${T} shows real applications and industries powered by C++.`,
      facts: [['Industry', 'Use'], ['Real', 'Products'], ['Fast', 'Needed'], ['Wide', 'Scope'], ['Proven', 'Track Record']],
      concepts: [
        ['🌍', 'Industry', `Sector where C++ dominates.`, ''],
        ['📦', 'Product', `Real software written in C++.`, ''],
        ['⚡', 'Why C++', `Reasons C++ fits this domain.`, ''],
        ['🎯', 'Examples', `Notable real-world cases.`, '']
      ],
      steps: [
        ['🌍', 'Identify the industry.'],
        ['📦', 'See the software shipped.'],
        ['⚡', 'Understand why C++ is used.'],
        ['🎯', 'Learn lessons for your own work.']
      ],
      tip: 'Look at open-source projects in this domain to see real C++ in action.'
    },
    memory: {
      sub: `${T} — memory management and pointer semantics in C++.`,
      intro: `Understanding ${T.toLowerCase()} is essential for safe, efficient C++ code.`,
      facts: [['Heap', 'vs Stack'], ['RAII', 'Principle'], ['Pointers', 'Raw+Smart'], ['Leaks', 'Avoid'], ['Ownership', 'Model']],
      concepts: [
        ['🧠', 'Model', `How ${T} fits the memory model.`, ''],
        ['📦', 'RAII', `Resource acquisition is initialization.`, 'unique_ptr<T> p = make_unique<T>();'],
        ['🔒', 'Ownership', `Who owns what memory.`, ''],
        ['⚠️', 'Pitfalls', `Common mistakes with ${T}.`, '']
      ],
      steps: [
        ['🧠', 'Understand memory layout.'],
        ['📦', 'Apply RAII where possible.'],
        ['🔒', 'Clarify ownership.'],
        ['⚠️', 'Avoid leaks and dangling pointers.']
      ],
      tip: 'Prefer smart pointers over raw <code>new</code>/<code>delete</code> in modern C++.'
    },
    concurrency: {
      sub: `${T} — concurrent and parallel programming in C++.`,
      intro: `${T} covers threads, mutexes, and async primitives in the C++ concurrency library.`,
      facts: [['Threads', 'Model'], ['Mutex', 'Locking'], ['Atomic', 'Type'], ['Async', 'Task'], ['Data', 'Race Safe']],
      concepts: [
        ['🧵', 'Thread', `Creating and joining threads.`, 'std::thread t(fn);'],
        ['🔒', 'Mutex', `Protecting shared data.`, 'std::lock_guard<std::mutex> lk(m);'],
        ['⚛️', 'Atomic', `Lock-free primitives.`, 'std::atomic<int> c{0};'],
        ['🚀', 'Async', `Task-based concurrency.`, 'auto f = std::async(fn);']
      ],
      steps: [
        ['🧵', 'Spawn a thread.'],
        ['🔒', 'Protect shared state with a mutex.'],
        ['⚛️', 'Or use atomics where possible.'],
        ['🚀', 'Collect results and join.']
      ],
      tip: 'Prefer higher-level primitives over raw threads when possible.'
    },
    template: {
      sub: `${T} — templates, generics, and metaprogramming in C++.`,
      intro: `${T} covers C++ templates: the machinery behind generic code.`,
      facts: [['Generics', 'Focus'], ['Compile', 'Time'], ['Zero-Cost', 'Abstraction'], ['Type', 'Safe'], ['Powerful', 'Tool']],
      concepts: [
        ['📐', 'Template', `Declaring a template.`, 'template<typename T>'],
        ['🎯', 'Instantiation', `Creating concrete types.`, 'std::vector<int> v;'],
        ['🧩', 'Specialization', `Customizing behavior per type.`, ''],
        ['⚙️', 'Concepts', `Constraining templates (C++20).`, 'requires std::integral<T>']
      ],
      steps: [
        ['📐', 'Write a template.'],
        ['🎯', 'Instantiate with a concrete type.'],
        ['🧩', 'Specialize if needed.'],
        ['⚙️', 'Constrain with concepts.']
      ],
      tip: 'Read error messages from the bottom up — the top is often noise.'
    },
    performance: {
      sub: `${T} — performance, profiling, and optimization in C++.`,
      intro: `${T} covers how to make C++ code faster and how to prove it with measurements.`,
      facts: [['Bench', 'First'], ['Profile', 'Then'], ['Optimize', 'Last'], ['Cache', 'Friendly'], ['Data', 'Layout']],
      concepts: [
        ['📊', 'Measure', `Always benchmark before optimizing.`, ''],
        ['🔥', 'Hotspots', `Find the 10% that costs 90%.`, ''],
        ['⚙️', 'Optimize', `Apply targeted fixes.`, ''],
        ['✅', 'Verify', `Confirm the improvement.`, '']
      ],
      steps: [
        ['📊', 'Profile the program.'],
        ['🔥', 'Identify hotspots.'],
        ['⚙️', 'Optimize the slow path.'],
        ['✅', 'Re-measure to confirm.']
      ],
      tip: 'Premature optimization is the root of all evil — measure first.'
    },
    debug: {
      sub: `${T} — debugging and testing C++ code.`,
      intro: `${T} covers how to find and fix bugs efficiently in C++ projects.`,
      facts: [['GDB', 'Debugger'], ['Sanitizer', 'Tool'], ['Valgrind', 'Memory'], ['Test', 'Unit'], ['Log', 'Print']],
      concepts: [
        ['🐞', 'Debugger', `Step-through debugging.`, 'gdb ./app'],
        ['🧪', 'Sanitizers', `Detect undefined behavior.`, '-fsanitize=address'],
        ['📝', 'Tests', `Unit tests catch regressions.`, ''],
        ['📊', 'Profiling', `Find slow paths.`, '']
      ],
      steps: [
        ['🐞', 'Reproduce the bug.'],
        ['🔍', 'Find the cause.'],
        ['🛠️', 'Fix the code.'],
        ['✅', 'Add a test to prevent regression.']
      ],
      tip: 'Build with <code>-g -O0</code> for useful debug symbols.'
    },
    security: {
      sub: `${T} — writing safe and secure C++ code.`,
      intro: `${T} covers avoiding bugs that become security vulnerabilities in C++.`,
      facts: [['UB', 'Avoid'], ['Bounds', 'Check'], ['Sanitize', 'Input'], ['RAII', 'Safety'], ['Tools', 'Static']],
      concepts: [
        ['🛡️', 'Threats', `Common C++ security issues.`, ''],
        ['⚠️', 'UB', `Undefined behavior dangers.`, ''],
        ['✅', 'Safe Patterns', `RAII and smart pointers.`, ''],
        ['🔧', 'Tools', `Static and dynamic analysis.`, '']
      ],
      steps: [
        ['🛡️', 'Identify the risk.'],
        ['⚠️', 'Avoid undefined behavior.'],
        ['✅', 'Use safe patterns.'],
        ['🔧', 'Run analysis tools.']
      ],
      tip: 'Never trust input — validate everything from outside the program.'
    },
    langfeature: {
      sub: `${T} — a language feature of C++.`,
      intro: `${T} is a core part of the C++ language. Here is how it works.`,
      facts: [['Syntax', 'Feature'], ['C++', 'Standard'], ['Compile', 'Time'], ['Type', 'Checked'], ['Portable', 'Everywhere']],
      concepts: [
        ['📝', 'Syntax', `How to write ${T}.`, ''],
        ['⚙️', 'Semantics', `What it means at compile time.`, ''],
        ['🎯', 'Use Case', `When to use ${T}.`, ''],
        ['⚠️', 'Pitfalls', `Common mistakes with ${T}.`, '']
      ],
      steps: [
        ['📝', 'Write the syntax.'],
        ['⚙️', 'Compiler interprets it.'],
        ['🎯', 'Use it in real code.'],
        ['⚠️', 'Avoid common mistakes.']
      ],
      tip: 'Compile with warnings enabled to catch syntax misuse early.'
    },
    systems: {
      sub: `${T} — systems programming with C++.`,
      intro: `${T} covers low-level systems programming where C++ excels.`,
      facts: [['Kernel', 'Level'], ['Portable', 'Code'], ['Fast', 'Runtime'], ['RAII', 'Safety'], ['Memory', 'Control']],
      concepts: [
        ['⚙️', 'System', `The layer ${T} targets.`, ''],
        ['🔧', 'Interfaces', `APIs used to talk to the system.`, ''],
        ['⚡', 'Performance', `Why C++ is used here.`, ''],
        ['🛡️', 'Safety', `Managing low-level risks.`, '']
      ],
      steps: [
        ['⚙️', 'Understand the system layer.'],
        ['🔧', 'Use the right interfaces.'],
        ['⚡', 'Optimize for the hardware.'],
        ['🛡️', 'Manage memory carefully.']
      ],
      tip: 'Read the system documentation — assumptions cause most bugs.'
    },
    general: {
      sub: `${T} — a topic in the C++ learning series.`,
      intro: `This page covers ${T} with core ideas and practical examples.`,
      facts: [['C++', 'Language'], ['ISO', 'Standard'], ['Fast', 'Runtime'], ['Multi', 'Paradigm'], ['Rich', 'Library']],
      concepts: [
        ['📖', 'Overview', `An introduction to ${T}.`, ''],
        ['🎯', 'Importance', `Why ${T} matters.`, ''],
        ['⚙️', 'Details', `Key points about ${T}.`, ''],
        ['🚀', 'Practice', `How to apply ${T}.`, '']
      ],
      steps: [
        ['📖', 'Introduction — the topic is defined.'],
        ['🎯', 'Key idea — the main concept is explained.'],
        ['⚙️', 'Details — how it works under the hood.'],
        ['🚀', 'Application — how to use it.']
      ],
      tip: 'Experiment with the code above and see the effect of each line.'
    }
  };
  return map[cat] || map.general;
}

// ==================== BUILD ====================
const ROOT = __dirname;
const folders = fs.readdirSync(ROOT).filter(f => /^\d{4}-/.test(f) && fs.statSync(path.join(ROOT, f)).isDirectory()).sort();

console.log(`Found ${folders.length} topic folders.\n`);

folders.forEach((folder, idx) => {
  const num = folder.match(/^(\d+)/)[1];
  const title = titleFromSlug(folder);
  const cat = detectCategory(folder);
  const c = contentFor(cat, title);

  const factsHtml = c.facts.map(f => `<div class="fact"><div class="b">${f[0]}</div><div class="l">${f[1]}</div></div>`).join('');
  const colors = ['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#facc15', '#fb923c'];
  const conceptsHtml = c.concepts.map((cc, i) => {
    const ex = cc[3] ? `<div class="ex">${cc[3].replace(/</g, '&lt;')}</div>` : '';
    return `<div class="cc" style="--c:${colors[i % colors.length]}">
      <div class="ic">${cc[0]}</div><div class="t">${cc[1]}</div><div class="d">${cc[2]}</div>${ex}
    </div>`;
  }).join('');

  const recapHtml = c.steps.map((s, i) => {
    const col = colors[i % colors.length];
    return `<div class="rcg" style="--rc:${col}"><div class="t">${s[0]} Step ${i + 1}</div><div class="d">${s[1]}</div></div>`;
  }).join('');

  const titleHtml = title.replace(/(C\+\+)/, '<span class="grad">$1</span>');
  const pgCode = `#include <iostream>\n\nint main() {\n    std::cout << "${title.replace(/"/g, '\\"')}\\n";\n    std::cout << "Topic ${num} of the C++ series\\n";\n    return 0;\n}`;

  const stepCodeArr = [
    '#include <iostream>',
    '',
    'int main() {',
    `    std::cout << "${title.replace(/"/g, '\\"')}\\n";`,
    '    return 0;',
    '}'
  ];

  const stepsData = c.steps.map((s, i) => ({
    line: Math.min(i, stepCodeArr.length - 1),
    text: `<strong>${s[0]} Step ${i + 1}:</strong> ${s[1]}`,
    tags: [cat.charAt(0).toUpperCase() + cat.slice(1), 'Step ' + (i + 1)]
  }));

  const topicData = JSON.stringify({ steps: stepsData, stepCode: stepCodeArr });

  const prev = idx > 0 ? folders[idx - 1] : folder;
  const next = idx < folders.length - 1 ? folders[idx + 1] : folder;
  const prevTitle = idx > 0 ? titleFromSlug(folders[idx - 1]) : 'Start of series';
  const nextTitle = idx < folders.length - 1 ? titleFromSlug(folders[idx + 1]) : 'End of series';

  const html = HTML
    .replace(/__NUM__/g, num)
    .replace(/__TITLE_HTML__/g, titleHtml)
    .replace(/__TITLE__/g, title)
    .replace(/__SUBTITLE__/g, c.sub)
    .replace(/__FACTS__/g, factsHtml)
    .replace(/__CONCEPT_INTRO__/g, c.intro)
    .replace(/__CONCEPTS__/g, conceptsHtml)
    .replace(/__PG_INTRO__/g, `Try editing and running this C++ program for <strong>${title}</strong>.`)
    .replace(/__PG_FILE__/g, 'main.cpp')
    .replace(/__PG_CODE__/g, pgCode.replace(/</g, '&lt;'))
    .replace(/__TIP__/g, c.tip)
    .replace(/__STEP_CODE__/g, stepCodeArr.map(l => `<div class="ln">${l.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`).join(''))
    .replace(/__RECAP__/g, recapHtml)
    .replace(/__PREV__/g, prev)
    .replace(/__NEXT__/g, next)
    .replace(/__PREV_TITLE__/g, prevTitle)
    .replace(/__NEXT_TITLE__/g, nextTitle)
    .replace(/__DATA__/g, topicData);

  fs.writeFileSync(path.join(ROOT, folder, 'index.html'), html, 'utf8');
  if ((idx + 1) % 100 === 0 || idx === folders.length - 1) {
    console.log(`✓ Generated ${idx + 1} / ${folders.length} (latest: ${folder})`);
  }
});

console.log(`\n✨ Done! All ${folders.length} pages generated.`);