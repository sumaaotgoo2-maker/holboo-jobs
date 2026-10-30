'use client'
import { useEffect, useState } from 'react'
import { sb } from '../lib/supabase'
import { useLoc, CITIES } from '../lib/useLoc'
const COL=['#1d3a6b','#1d7a6c','#6b4de6','#c2410c','#0e7490','#9d174d']
const when=d=>{const n=Math.floor((Date.now()-new Date(d))/864e5);return n<1?'Өнөөдөр':n<7?`${n} өдрийн өмнө`:new Date(d).toLocaleDateString('mn-MN')}
export default function Home(){
 const [jobs,setJobs]=useState(null),[q,setQ]=useState(''),[typ,setTyp]=useState(''),[loc,setLoc]=useLoc()
 useEffect(()=>{sb.from('jobs').select('*').eq('approved',true).order('created_at',{ascending:false}).then(({data})=>setJobs(data||[]))},[])
 const L=(jobs||[]).filter(j=>(!q||(j.title+j.company).toLowerCase().includes(q.toLowerCase()))&&(!loc||j.location===loc)&&(!typ||j.type===typ))
 return <main className="wrap">
  <section className="hero"><h1>Өөрт тохирох ажлаа олоорой</h1><p>Монгол орны хаанаас ч ажил хайж, зар нийтлээрэй.</p></section>
  <div className="duo">
   <div className="pc"><div className="ill">👩‍💼</div><div style={{flex:1}}><h2>Ажил хайж байна уу?</h2><p>Ажлын заруудыг хайж, өөрт тохирох ажлаа олоорой.</p><a className="btn-p" href="#search">🔍 Ажил хайх →</a></div></div>
   <div className="pc"><div className="ill">🧑‍💼</div><div style={{flex:1}}><h2>Ажилтан хайж байна уу?</h2><p>Байгууллагынхаа ажлын зарыг нийтэлж, тохирох ажилтнаа олоорой.</p><a className="btn-p" href="/post">＋ Зар нэмэх →</a></div></div></div>
  <div className="search" id="search"><input placeholder="🔍 Ажлын нэр эсвэл түлхүүр үг" value={q} onChange={e=>setQ(e.target.value)}/>
   <select value={loc} onChange={e=>setLoc(e.target.value)}><option value="">📍 Байршил сонгох</option>{CITIES.map(x=><option key={x}>{x}</option>)}</select>
   <select value={typ} onChange={e=>setTyp(e.target.value)}><option value="">💼 Ажлын төрөл</option>{['Бүтэн цаг','Хагас цаг','Гэрээт'].map(x=><option key={x}>{x}</option>)}</select>
   <a className="btn-p" href="#jobs">🔍 Хайх</a></div>
  <div className="sec" id="jobs"><h2>💼 Шинээр нэмэгдсэн ажлын зарууд {jobs&&`(${L.length})`}</h2></div>
  {jobs===null?<p className="empty">Уншиж байна…</p>:L.length===0?<p className="empty">{jobs.length&&(loc||q||typ)?<>Тохирох зар олдсонгүй. <a href="#" onClick={e=>{e.preventDefault();setLoc('');setQ('');setTyp('')}}>Бүх зарыг харах</a></>:<>Одоогоор зар алга. <a href="/post">Эхний зараа нэмээрэй.</a></>}</p>:
  <div className="grid">{L.map(j=><a key={j.id} href={`/jobs/${j.id}`}><article className="jc">
   <div className="jc-top"><div className="logo" style={{background:COL[j.company.length%COL.length]}}>{j.company[0]}</div><span className="co">{j.company}</span><span className="new">{when(j.created_at)}</span></div>
   <h3>{j.title}</h3><div className="tags">{j.type&&<span className="tag">{j.type}</span>}{j.category&&<span className="tag">{j.category}</span>}</div>
   <p className="jl">📍 {j.location}</p>{j.salary&&<p className="js">{j.salary}</p>}</article></a>)}</div>}
 </main>
}
