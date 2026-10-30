'use client'
import { useEffect, useState } from 'react'
import { sb } from '../../lib/supabase'
import { CITIES, CATS } from '../../lib/useLoc'
import { col, when } from '../../components/JobCard'
const PER=8,TYPES=['Бүтэн цаг','Хагас цаг','Гэрээт','Вахтын ажил']
export default function Jobs(){
 const [jobs,setJobs]=useState(null),[q,setQ]=useState(''),[locs,setLocs]=useState([]),[types,setTypes]=useState([]),[cat,setCat]=useState(''),[comp,setComp]=useState(''),[sort,setSort]=useState('new'),[page,setPage]=useState(1)
 useEffect(()=>{const p=new URLSearchParams(location.search);setQ(p.get('q')||'');if(p.get('loc'))setLocs([p.get('loc')]);if(p.get('type'))setTypes([p.get('type')]);setCat(p.get('cat')||'')
  sb.from('jobs').select('*').eq('approved',true).order('created_at',{ascending:false}).then(({data})=>setJobs(data||[]))},[])
 const tog=(a,set,v)=>{set(a.includes(v)?a.filter(x=>x!==v):[...a,v]);setPage(1)}
 const clear=()=>{setQ('');setLocs([]);setTypes([]);setCat('');setComp('');setPage(1)}
 let L=(jobs||[]).filter(j=>(!q||(j.title+j.company+(j.description||'')).toLowerCase().includes(q.toLowerCase()))&&(!locs.length||locs.includes(j.location))&&(!types.length||types.includes(j.type))&&(!cat||j.category===cat)&&(!comp||j.company.toLowerCase().includes(comp.toLowerCase())))
 if(sort==='urg')L=[...L].sort((a,b)=>(b.urgent?1:0)-(a.urgent?1:0))
 const pages=Math.max(1,Math.ceil(L.length/PER)),P=L.slice((page-1)*PER,page*PER)
 return <><div className="hrow"><div className="wrap"><h1>Ажил хайх</h1></div></div><main className="wrap"><div className="lay">
  <aside className="filt"><input placeholder="🔍 Ажлын нэр, түлхүүр үг" value={q} onChange={e=>{setQ(e.target.value);setPage(1)}}/>
   <div><h4>Байршил</h4><div className="scr">{CITIES.map(c=><label key={c}><input type="checkbox" checked={locs.includes(c)} onChange={()=>tog(locs,setLocs,c)}/>{c}</label>)}</div></div>
   <div><h4>Ажлын төрөл</h4>{TYPES.map(c=><label key={c}><input type="checkbox" checked={types.includes(c)} onChange={()=>tog(types,setTypes,c)}/>{c}</label>)}</div>
   <div><h4>Ангилал</h4><select value={cat} onChange={e=>{setCat(e.target.value);setPage(1)}}><option value="">Бүгд</option>{CATS.map(c=><option key={c}>{c}</option>)}</select></div>
   <div><h4>Компанийн нэр</h4><input placeholder="Компани хайх" value={comp} onChange={e=>{setComp(e.target.value);setPage(1)}}/></div>
   <button type="button" className="btn-s" onClick={clear}>Шүүлтүүрээ цэвэрлэх</button></aside>
  <section><div className="top"><span>Нийт {jobs?L.length:0} зар</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="new">Хамгийн шинэ</option><option value="urg">Яаралтай эхэнд</option></select></div>
   {jobs===null?<p className="empty">Уншиж байна…</p>:P.length===0?<p className="empty">Тохирох зар олдсонгүй.</p>:P.map(j=><div className="jrow" key={j.id}><div className="logo" style={{background:col(j.company)}}>{j.company[0]}</div>
    <div className="mid"><h3>{j.title} {j.urgent&&<span className="urg">Яаралтай</span>}</h3><p className="co">{j.company}</p><p className="jl">📍 {j.location}{j.type&&` · ${j.type}`}{j.category&&` · ${j.category}`} · {when(j.created_at)}</p>{j.salary&&<p className="js">{j.salary}</p>}</div>
    <a className="btn-p" href={`/jobs/${j.id}`}>Дэлгэрэнгүй</a></div>)}
   {pages>1&&<div className="pg">{Array.from({length:pages},(_,i)=><button key={i} className={page===i+1?'on':''} onClick={()=>setPage(i+1)}>{i+1}</button>)}</div>}</section></div></main></>
}
