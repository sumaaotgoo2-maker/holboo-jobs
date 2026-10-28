'use client'
import { useEffect, useState } from 'react'
import { sb } from '../lib/supabase'
export default function Home(){
 const [jobs,setJobs]=useState(null),[q,setQ]=useState(''),[loc,setLoc]=useState(''),[cat,setCat]=useState('')
 useEffect(()=>{sb.from('jobs').select('*').eq('approved',true).order('created_at',{ascending:false}).then(({data})=>setJobs(data||[]))},[])
 const L=(jobs||[]).filter(j=>(!q||(j.title+j.company).toLowerCase().includes(q.toLowerCase()))&&(!loc||j.location===loc)&&(!cat||j.category===cat))
 return <main className="wrap">
  <section className="hero"><div className="hero-in"><h1>Мөрөөдлийн ажлаа олоорой</h1><p>Ажлын байрыг нэг дороос хайж, ажил олгогчтой шууд холбогдоорой.</p></div></section>
  <div className="search"><input placeholder="Ажлын нэр, компани…" value={q} onChange={e=>setQ(e.target.value)}/>
   <select value={loc} onChange={e=>setLoc(e.target.value)}><option value="">Бүх байршил</option>{['Улаанбаатар','Дархан','Эрдэнэт','Алсаас'].map(x=><option key={x}>{x}</option>)}</select>
   <select value={cat} onChange={e=>setCat(e.target.value)}><option value="">Бүх ангилал</option>{['IT','Санхүү','Маркетинг','Борлуулалт','Барилга'].map(x=><option key={x}>{x}</option>)}</select></div>
  <h2>Ажлын байр {jobs&&`· ${L.length}`}</h2>
  {jobs===null?<p className="empty">Уншиж байна…</p>:L.length===0?<p className="empty">Одоогоор зар алга. <a href="/post">Эхний зараа нэмээрэй.</a></p>:
  <div className="grid">{L.map(j=><a key={j.id} href={`/jobs/${j.id}`} style={{textDecoration:'none'}}><article className="jc">
   <div className="jc-top"><div className="logo">{j.company[0]}</div><span className="co">{j.company}</span></div><h3>{j.title}</h3>
   <div className="tags">{j.type&&<span className="tag">{j.type}</span>}{j.category&&<span className="tag alt">{j.category}</span>}</div>
   <p className="jl">📍 {j.location}</p><p className="js">{j.salary}</p><p className="jd">{j.description}</p></article></a>)}</div>}
 </main>
}
