'use client'
import { useEffect, useState } from 'react'
import { sb } from '../lib/supabase'
export default function Header(){
 const [u,setU]=useState(null)
 useEffect(()=>{sb.auth.getSession().then(({data})=>setU(data.session?.user??null))
  const {data}=sb.auth.onAuthStateChange((_e,s)=>setU(s?.user??null));return()=>data.subscription.unsubscribe()},[])
 return <header><div className="wrap bar"><a className="brand" href="/"><span style={{fontSize:'1.8rem'}}>🤝</span><span><b>Холбоо</b><small>Ажил ба хүний холбоо</small></span></a>
  <nav><a href="/">Ажлын байр</a><a href="/post">Зар нэмэх</a></nav>
  <div className="auth">{u?<a className="btn-o" href="#" onClick={e=>{e.preventDefault();sb.auth.signOut()}}>Гарах</a>:<a className="btn-f" href="/login">Нэвтрэх</a>}</div></div></header>
}
