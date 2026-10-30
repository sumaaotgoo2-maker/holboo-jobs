'use client'
import { useEffect, useState } from 'react'
import { sb } from '../lib/supabase'
export default function Header(){
 const [u,setU]=useState(null)
 useEffect(()=>{sb.auth.getSession().then(({data})=>setU(data.session?.user??null))
  const {data}=sb.auth.onAuthStateChange((_e,s)=>setU(s?.user??null));return()=>data.subscription.unsubscribe()},[])
 return <header><div className="bar wrap"><a className="brand" href="/"><img src="/logo.png" alt="Холбоё" height="54"/></a>
  <nav><a href="/">Нүүр хуудас</a><a href="/jobs">Ажлын байр</a><a href="/seekers">Ажил хайгчид</a><a href="/post">Зар нэмэх</a></nav>
  <div className="auth">{u?<a className="lnk" href="#" onClick={e=>{e.preventDefault();sb.auth.signOut()}}>Гарах</a>:<><a className="lnk" href="/login">Нэвтрэх</a><a className="btn-p" href="/login">Бүртгүүлэх</a></>}</div></div></header>
}
