'use client'
import { useEffect, useState } from 'react'
import { sb } from '../../lib/supabase'
const day=n=>new Date(Date.now()+n*864e5).toISOString()
const PL={featured:'Онцлох зар',profile:'Профайл багц',banner:'Баннер'}
export default function Admin(){
 const [st,setSt]=useState('load'),[tab,setTab]=useState('jobs'),[jobs,setJobs]=useState([]),[sk,setSk]=useState([]),[ord,setOrd]=useState([]),[err,setErr]=useState('')
 async function load(){
  const [a,b,c]=await Promise.all([
   sb.from('jobs').select('*').order('approved').order('created_at',{ascending:false}),
   sb.from('seekers').select('*').order('approved').order('created_at',{ascending:false}),
   sb.from('ad_orders').select('*').order('created_at',{ascending:false})])
  setJobs(a.data||[]);setSk(b.data||[]);setOrd(c.data||[])}
 useEffect(()=>{sb.auth.getSession().then(async({data})=>{
  if(!data.session)return setSt('login')
  const {data:ok}=await sb.rpc('is_admin')
  if(ok){setSt('ok');load()}else setSt('no')})},[])
 async function upd(t,id,p){const {error}=await sb.from(t).update(p).eq('id',id);if(error)setErr(error.message);else{setErr('');load()}}
 async function del(t,id){if(!confirm('Устгах уу?'))return;const {error}=await sb.from(t).delete().eq('id',id);if(error)setErr(error.message);else{setErr('');load()}}
 if(st==='load')return <main className="wrap"><p className="empty">Уншиж байна…</p></main>
 if(st==='login')return <main className="wrap"><h1>Админ</h1><p>Эхлээд <a href="/login">нэвтэрнэ үү</a>.</p></main>
 if(st==='no')return <main className="wrap"><h1>Админ</h1><p>Танд энэ хуудсыг үзэх эрх байхгүй.</p></main>
 const pj=jobs.filter(j=>!j.approved).length,ps=sk.filter(s=>!s.approved).length
 return <><div className="hrow"><div className="wrap"><h1>Админ самбар</h1></div></div><main className="wrap">
  <div className="atabs">{[['jobs','Зар ('+pj+' шинэ)'],['sk','Ажил хайгч ('+ps+' шинэ)'],['ord','Захиалга ('+ord.length+')']].map(([k,l])=><button key={k} className={tab===k?'btn-p':'btn-s'} onClick={()=>setTab(k)}>{l}</button>)}</div>
  {err&&<p style={{color:'#c0392b'}}>Алдаа: {err}</p>}
  {tab==='jobs'&&jobs.map(j=><div className="jrow" key={j.id}><div className="mid">
   <h3>{j.title} <span className={j.approved?'new':'urg'}>{j.approved?'Нийтлэгдсэн':'Хүлээгдэж байна'}</span> {j.featured&&<span className="fe">★ Онцлох{j.featured_until?' → '+new Date(j.featured_until).toLocaleDateString('mn-MN'):''}</span>}</h3>
   <p className="co">{j.company} · {j.location} · {j.type}</p><p className="jl">📞 {j.contact}</p><p className="jt">{(j.description||'').slice(0,160)}</p>
   <div className="ab">{!j.approved?<button className="btn-p" onClick={()=>upd('jobs',j.id,{approved:true})}>Зөвшөөрөх</button>:<button className="btn-s" onClick={()=>upd('jobs',j.id,{approved:false})}>Нуух</button>}
    <button className="btn-s" onClick={()=>upd('jobs',j.id,{featured:true,featured_until:day(7)})}>★ 7 хоног</button>
    <button className="btn-s" onClick={()=>upd('jobs',j.id,{featured:true,featured_until:day(30)})}>★ 30 хоног</button>
    {j.featured&&<button className="btn-s" onClick={()=>upd('jobs',j.id,{featured:false,featured_until:null})}>Онцлох болих</button>}
    <button className="btn-s" onClick={()=>del('jobs',j.id)}>Устгах</button></div></div></div>)}
  {tab==='sk'&&sk.map(s=><div className="jrow" key={s.id}><div className="mid">
   <h3>{s.name} · {s.profession} <span className={s.approved?'new':'urg'}>{s.approved?'Нийтлэгдсэн':'Хүлээгдэж байна'}</span></h3>
   <p className="jl">📍 {s.aimag} · 📞 {s.contact}</p><p className="jt">{(s.about||'').slice(0,160)}</p>
   <div className="ab">{!s.approved?<button className="btn-p" onClick={()=>upd('seekers',s.id,{approved:true})}>Зөвшөөрөх</button>:<button className="btn-s" onClick={()=>upd('seekers',s.id,{approved:false})}>Нуух</button>}
    <button className="btn-s" onClick={()=>del('seekers',s.id)}>Устгах</button></div></div></div>)}
  {tab==='ord'&&(ord.length?ord.map(o=><div className="jrow" key={o.id}><div className="mid">
   <h3>{o.org} · {PL[o.plan]||o.plan}</h3><p className="jl">📞 {o.contact} · {new Date(o.created_at).toLocaleString('mn-MN')}</p>{o.note&&<p className="jt">{o.note}</p>}
   <div className="ab"><button className="btn-s" onClick={()=>del('ad_orders',o.id)}>Дууссан (устгах)</button></div></div></div>):<p className="empty">Захиалга алга.</p>)}
  </main></>
}
