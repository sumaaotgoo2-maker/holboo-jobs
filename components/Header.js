'use client'
import { useEffect, useState } from 'react'
import { sb } from '../lib/supabase'
import { useLoc, CITIES } from '../lib/useLoc'
export default function Header(){
 const [u,setU]=useState(null),[loc,setLoc]=useLoc()
 useEffect(()=>{sb.auth.getSession().then(({data})=>setU(data.session?.user??null))
  const {data}=sb.auth.onAuthStateChange((_e,s)=>setU(s?.user??null));return()=>data.subscription.unsubscribe()},[])
 return <header><div className="bar wrap"><a className="brand" href="/">
  <svg width="46" height="46" viewBox="0 0 48 48"><path d="M24 43S5 30 5 18a10 10 0 0 1 19-4 10 10 0 0 1 19 4c0 12-19 25-19 25z" fill="#1d7a6c"/><path d="M13 25l8 6 5-4 9-6" stroke="#f5b942" strokeWidth="3.5" fill="none" strokeLinecap="round"/></svg>
  <span><b>Холбоё</b><small>Ажил ба хүний холбоо</small></span></a>
  <nav><a className="btn-p" href="/#search">🔍 Ажил хайх</a><a className="btn-s" href="/post">＋ Зар нэмэх</a></nav>
  <div className="auth"><label className="locsel">📍<select aria-label="Байршил" value={loc} onChange={e=>setLoc(e.target.value)}><option value="">Бүх байршил</option>{CITIES.map(x=><option key={x}>{x}</option>)}</select></label>
  {u?<a className="me" href="#" onClick={e=>{e.preventDefault();sb.auth.signOut()}}><span className="av">👤</span>Гарах</a>:<a className="me" href="/login"><span className="av">👤</span>Нэвтрэх</a>}</div></div></header>
}
