'use client'
import { useEffect, useState } from 'react'
import { sb } from '../lib/supabase'
export default function Header(){
 const [u,setU]=useState(null)
 useEffect(()=>{sb.auth.getSession().then(({data})=>setU(data.session?.user??null))
  const {data}=sb.auth.onAuthStateChange((_e,s)=>setU(s?.user??null));return()=>data.subscription.unsubscribe()},[])
 return <header><div className="bar wrap"><a className="brand" href="/">
  <svg width="38" height="38" viewBox="0 0 48 48"><path d="M24 43S5 30 5 18a10 10 0 0 1 19-4 10 10 0 0 1 19 4c0 12-19 25-19 25z" fill="#0f6b4f"/><path d="M13 25l8 6 5-4 9-6" stroke="#f5b942" strokeWidth="3.5" fill="none" strokeLinecap="round"/></svg><b>Холбоё</b></a>
  <nav><a href="/">Нүүр хуудас</a><a href="/jobs">Ажил хайх</a><a href="/post">Зар нэмэх</a></nav>
  <div className="auth">{u?<a className="lnk" href="#" onClick={e=>{e.preventDefault();sb.auth.signOut()}}>Гарах</a>:<><a className="lnk" href="/login">Нэвтрэх</a><a className="btn-p" href="/login">Бүртгүүлэх</a></>}</div></div></header>
}
