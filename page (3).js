'use client'
import { useEffect, useState } from 'react'
import { sb } from '../../lib/supabase'
import JobCard, { col } from '../../components/JobCard'
export default function Company(){
 const [name,setName]=useState(''),[c,setC]=useState(null),[jobs,setJobs]=useState(null)
 useEffect(()=>{const n=new URLSearchParams(location.search).get('name')||'';setName(n)
  if(!n){setJobs([]);return}
  sb.from('companies').select('*').eq('name',n).maybeSingle().then(({data})=>setC(data||null))
  sb.from('jobs').select('*').eq('approved',true).eq('company',n).order('created_at',{ascending:false}).then(({data})=>setJobs(data||[]))},[])
 const prem=!!(c&&c.premium_until&&new Date(c.premium_until)>new Date())
 if(!name&&jobs)return <main className="wrap"><p className="empty">Байгууллага сонгоогүй байна. <a href="/jobs">Ажлын байр харах</a></p></main>
 return <><div className="ch" style={prem&&c.cover_url?{backgroundImage:`linear-gradient(rgba(10,74,56,.75),rgba(10,74,56,.75)),url(${c.cover_url})`}:undefined}><div className="wrap in">
  <div className="logo" style={{background:col(name||'Х')}}>{prem&&c.logo_url?<img src={c.logo_url} alt={name}/>:(name||'Х')[0]}</div>
  <div><h1>{name} {prem&&<span className="fe">★ Premium</span>}</h1>
   {prem&&c.address&&<p>📍 {c.address}</p>}{prem&&c.phone&&<p>📞 {c.phone}</p>}{prem&&c.website&&<p>🌐 <a style={{color:'#fff'}} href={c.website} target="_blank" rel="noopener">{c.website}</a></p>}
   {!prem&&<p>Нээлттэй ажлын байр: {jobs?jobs.length:'…'}</p>}</div></div></div>
  <main className="wrap">
  {prem&&c.about&&<><div className="sec"><h2>Бидний тухай</h2></div><p style={{maxWidth:760,color:'var(--m)'}}>{c.about}</p></>}
  <div className="sec"><h2>Нээлттэй ажлын байр</h2><a href="/jobs">Бүх зар →</a></div>
  {jobs===null?<p className="empty">Уншиж байна…</p>:jobs.length===0?<p className="empty">Одоогоор нээлттэй зар алга.</p>:<div className="row3">{jobs.map(j=><JobCard key={j.id} j={j}/>)}</div>}
  {!prem&&<div className="cta"><h2>Таны байгууллага энд бүрэн профайлтай болно</h2><p>Лого, танилцуулга, холбоо барих мэдээлэл бүхий Premium профайл.</p><a className="btn-s" href="/ads">Багцыг харах</a></div>}
  </main></>
}
