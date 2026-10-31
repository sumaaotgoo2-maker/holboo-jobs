'use client'
import { useEffect, useState } from 'react'
import { sb } from '../../lib/supabase'
export default function Login(){
 const [em,setEm]=useState(''),[pw,setPw]=useState(''),[reg,setReg]=useState(false),[m,setM]=useState('')
 useEffect(()=>{setReg(new URLSearchParams(location.search).get('reg')==='1')},[])
 async function go(e){e.preventDefault();setM('')
  const r=reg?await sb.auth.signUp({email:em,password:pw}):await sb.auth.signInWithPassword({email:em,password:pw})
  if(r.error)return setM(r.error.message)
  if(reg&&!r.data.session)return setM('Имэйлээ шалгаад холбоосыг дарж баталгаажуулна уу.')
  location.href='/'}
 return <main className="wrap"><h1>{reg?'Бүртгүүлэх':'Нэвтрэх'}</h1>
  <form onSubmit={go}><input type="email" placeholder="Имэйл" required value={em} onChange={e=>setEm(e.target.value)}/>
   <input type="password" placeholder="Нууц үг (6+ тэмдэгт)" minLength={6} required value={pw} onChange={e=>setPw(e.target.value)}/>
   <button>{reg?'Бүртгүүлэх':'Нэвтрэх'}</button><p className="msg">{m}</p>
   <p className="meta"><a href="#" onClick={e=>{e.preventDefault();setReg(!reg)}}>{reg?'Бүртгэлтэй юу? Нэвтрэх':'Бүртгэлгүй юу? Бүртгүүлэх'}</a></p></form></main>
}
