'use client'
import { useEffect, useState } from 'react'
import { sb } from '../../lib/supabase'
const D=n=>new Date(Date.now()+n*864e5).toISOString()
const isF=j=>!!j.featured&&(!j.featured_until||new Date(j.featured_until)>new Date())
const FIELDS=[['title','Ажлын нэр'],['company','Байгууллага'],['location','Байршил'],['type','Төрөл'],['category','Ангилал'],['salary','Цалин'],['contact','Холбогдох']]
export default function Admin(){
 const [st,setSt]=useState('load'),[tab,setTab]=useState('jobs'),[rows,setRows]=useState([]),[err,setErr]=useState('')
 const [flt,setFlt]=useState('pend'),[q,setQ]=useState(''),[ed,setEd]=useState(null)
 useEffect(()=>{sb.auth.getSession().then(async({data})=>{if(!data.session)return setSt('login')
  const {data:ok}=await sb.rpc('is_admin');setSt(ok===true?'ok':'deny')})},[])
 const T={jobs:'jobs',seekers:'seekers',orders:'ad_orders'}[tab]
 const load=()=>{setRows([]);sb.from(T).select('*').order('created_at',{ascending:false}).limit(300).then(({data,error})=>{if(error)setErr(error.message);else{setErr('');setRows(data||[])}})}
 useEffect(()=>{if(st==='ok'){setEd(null);load()}},[st,tab])
 const upd=async(id,p)=>{const {error}=await sb.from(T).update(p).eq('id',id);if(error){alert(error.message);return false}load();return true}
 const del=async id=>{if(!confirm('Устгах уу? Буцаах боломжгүй.'))return;const {error}=await sb.from(T).delete().eq('id',id);if(error)alert(error.message);else load()}
 const save=async()=>{const p={};FIELDS.forEach(([k])=>{p[k]=ed[k]||''});p.description=ed.description||'';if(await upd(ed.id,p))setEd(null)}

 if(st==='load')return <main className="wrap"><p className="empty">Уншиж байна…</p></main>
 if(st==='login')return <main className="wrap"><h1>Админ</h1><p>Эхлээд <a href="/login">нэвтэрнэ үү</a>.</p></main>
 if(st==='deny')return <main className="wrap"><h1>Админ</h1><p>Энэ хаягт админ эрх байхгүй байна.</p></main>

 const pend=rows.filter(r=>r.approved===false).length
 const okc=rows.filter(r=>r.approved===true).length
 const feat=rows.filter(r=>isF(r)).length
 const needle=q.trim().toLowerCase()
 const list=rows.filter(r=>{
  if(tab!=='orders'){
   if(flt==='pend'&&r.approved!==false)return false
   if(flt==='ok'&&r.approved!==true)return false
  }
  if(needle&&![r.title,r.company,r.name,r.profession,r.org,r.contact].join(' ').toLowerCase().includes(needle))return false
  return true
 })

 return <><div className="hrow"><div className="wrap"><h1>Админ хуудас</h1></div></div><main className="wrap">
  <div className="tabs">{[['jobs','Зар'],['seekers','Профайл'],['orders','Захиалга']].map(([k,n])=><button key={k} className={tab===k?'abtn ok':'abtn'} onClick={()=>setTab(k)}>{n}</button>)}</div>
  {err&&<p className="msg" style={{color:'#c0392b'}}>{err}</p>}

  {tab!=='orders'&&<div className="tabs">
   {[['pend','⏳ Хүлээгдэж буй ('+pend+')'],['ok','✅ Батлагдсан ('+okc+')'],['all','Бүгд ('+rows.length+')']].map(([k,n])=><button key={k} className={flt===k?'abtn ok':'abtn'} onClick={()=>setFlt(k)}>{n}</button>)}
  </div>}
  <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Хайх: нэр, байгууллага, утас…" style={{width:'100%',maxWidth:420,padding:'9px 12px',borderRadius:8,border:'1px solid #ddd',font:'inherit',margin:'6px 0 10px'}}/>
  {tab==='jobs'&&<p className="meta">Нийт {rows.length} · хүлээгдэж буй {pend} · батлагдсан {okc} · онцлох {feat}</p>}

  {list.map(r=>ed&&ed.id===r.id&&tab==='jobs'
   ? <div className="jrow" key={r.id} style={{borderLeft:'5px solid #2e7d5b',display:'block'}}>
      {FIELDS.map(([k,n])=><label key={k} style={{display:'block',margin:'6px 0'}}><span className="meta">{n}</span><br/>
       <input value={ed[k]||''} onChange={e=>setEd({...ed,[k]:e.target.value})} style={{width:'100%',maxWidth:520,padding:'8px 10px',borderRadius:8,border:'1px solid #ddd',font:'inherit'}}/></label>)}
      <label style={{display:'block',margin:'6px 0'}}><span className="meta">Тайлбар</span><br/>
       <textarea rows={7} value={ed.description||''} onChange={e=>setEd({...ed,description:e.target.value})} style={{width:'100%',maxWidth:520,padding:'8px 10px',borderRadius:8,border:'1px solid #ddd',font:'inherit'}}/></label>
      <div className="acts"><button className="abtn ok" onClick={save}>Хадгалах</button><button className="abtn" onClick={()=>setEd(null)}>Болих</button></div>
     </div>
   : <div className="jrow" key={r.id} style={{borderLeft:r.approved===false?'5px solid #f5b942':undefined}}><div className="mid" style={{flex:1,minWidth:240}}>
   {tab==='jobs'&&<><b>{r.title}</b> · {r.company}<p className="meta">📍 {r.location} · {r.type} · {r.category} · {r.salary}<br/>{r.description}<br/>📞 {r.contact}</p></>}
   {tab==='seekers'&&<><b>{r.name}</b> · {r.profession}<p className="meta">📍 {r.aimag} · {r.salary}<br/>{r.about}<br/>📞 {r.contact}</p></>}
   {tab==='orders'&&<><b>{r.org}</b> · {r.plan} · <span className="tag">{r.status||'new'}</span><p className="meta">📞 {r.contact}<br/>{r.note}<br/>{new Date(r.created_at).toLocaleString('mn-MN')}</p></>}
   {tab!=='orders'&&<p className="meta">{r.approved?'✅ Батлагдсан':'⏳ Хүлээгдэж байна'}{r.urgent?' · 🔥 Яаралтай':''}{tab==='jobs'&&isF(r)?' · ⭐ Онцлох → '+new Date(r.featured_until||0).toLocaleDateString('mn-MN'):''}{r.created_at?' · '+new Date(r.created_at).toLocaleString('mn-MN'):''}</p>}</div>
   <div className="acts">
    {tab!=='orders'&&<button className={r.approved?'abtn':'abtn ok'} onClick={()=>upd(r.id,{approved:!r.approved})}>{r.approved?'Буцаах':'Батлах'}</button>}
    {tab==='jobs'&&r.approved&&<a className="abtn" href={'/jobs/'+r.id} target="_blank" rel="noreferrer">👁 Харах</a>}
    {tab==='jobs'&&<button className="abtn" onClick={()=>setEd({...r})}>✏️ Засах</button>}
    {tab!=='orders'&&<button className="abtn" onClick={()=>upd(r.id,{urgent:!r.urgent})}>🔥</button>}
    {tab==='jobs'&&<><button className="abtn" onClick={()=>upd(r.id,{featured:true,featured_until:D(7)})}>⭐ 7 хоног</button><button className="abtn" onClick={()=>upd(r.id,{featured:true,featured_until:D(30)})}>⭐ 30 хоног</button>{isF(r)&&<button className="abtn" onClick={()=>upd(r.id,{featured:false,featured_until:null})}>⭐ хасах</button>}</>}
    {tab==='orders'&&<><button className="abtn ok" onClick={()=>upd(r.id,{status:'paid'})}>Төлбөр авсан</button><button className="abtn" onClick={()=>upd(r.id,{status:'done'})}>Дууссан</button></>}
    <button className="abtn no" onClick={()=>del(r.id)}>Устгах</button></div></div>)}
  {list.length===0&&!err&&<p className="empty">{flt==='pend'&&tab!=='orders'?'Батлах зар алга 🎉':'Одоогоор алга.'}</p>}</main></>
}
