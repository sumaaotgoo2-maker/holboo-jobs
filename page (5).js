'use client'
import { useEffect, useState } from 'react'
import { sb } from '../../lib/supabase'
import { CITIES } from '../../lib/useLoc'
import SeekerCard from '../../components/SeekerCard'
const PUB='id,name,profession,aimag,salary,about,urgent,created_at'
export default function Seekers(){
 const [L,setL]=useState(null),[authed,setA]=useState(false),[q,setQ]=useState(''),[aim,setAim]=useState('')
 useEffect(()=>{sb.auth.getSession().then(({data})=>{const a=!!data.session;setA(a)
  sb.from('seekers').select(a?'*':PUB).eq('approved',true).order('created_at',{ascending:false}).then(({data})=>setL(data||[]))})},[])
 const F=(L||[]).filter(s=>(!q||(s.name+s.profession+(s.about||'')).toLowerCase().includes(q.toLowerCase()))&&(!aim||s.aimag===aim))
 return <><div className="hrow"><div className="wrap"><h1>Ажил хайгчид</h1></div></div><main className="wrap">
  <div className="search" style={{gridTemplateColumns:'2fr 1fr auto'}}><input placeholder="🔍 Мэргэжил, нэр" value={q} onChange={e=>setQ(e.target.value)}/>
   <select value={aim} onChange={e=>setAim(e.target.value)}><option value="">📍 Бүх аймаг</option>{CITIES.map(c=><option key={c}>{c}</option>)}</select><a className="btn-p" href="/seekers/new">＋ Профайл үүсгэх</a></div>
  {!authed&&<p className="meta">🔒 Утас, имэйлийг зөвхөн нэвтэрсэн хэрэглэгч харна. <a href="/login">Нэвтрэх</a></p>}
  {L===null?<p className="empty">Уншиж байна…</p>:F.length===0?<p className="empty">Одоогоор ажил хайгч алга. <a href="/seekers/new">Эхний профайлаа үүсгээрэй.</a></p>:<div className="row3">{F.map(s=><SeekerCard key={s.id} s={s} authed={authed}/>)}</div>}</main></>
}
