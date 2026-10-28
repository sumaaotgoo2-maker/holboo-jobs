'use client'
import { useEffect, useState } from 'react'
import { sb } from '../../lib/supabase'
export default function Post(){
 const [ok,setOk]=useState(false),[m,setM]=useState('')
 useEffect(()=>{sb.auth.getSession().then(({data})=>data.session?setOk(true):location.href='/login')},[])
 async function go(e){e.preventDefault();const f=Object.fromEntries(new FormData(e.target))
  const {error}=await sb.from('jobs').insert(f)
  if(error)return setM(error.message);e.target.reset();setM('Зар илгээгдлээ. Админ баталгаажуулсны дараа сайтад гарна.')}
 if(!ok)return null
 return <main className="wrap"><h1>Ажлын зар нэмэх</h1><form onSubmit={go}>
  <input name="title" placeholder="Ажлын нэр" required/><input name="company" placeholder="Компанийн нэр" required/>
  <select name="location">{['Улаанбаатар','Дархан','Эрдэнэт','Алсаас'].map(x=><option key={x}>{x}</option>)}</select>
  <select name="type">{['Бүтэн цаг','Хагас цаг','Гэрээт'].map(x=><option key={x}>{x}</option>)}</select>
  <select name="category">{['IT','Санхүү','Маркетинг','Борлуулалт','Барилга'].map(x=><option key={x}>{x}</option>)}</select>
  <input name="salary" placeholder="Цалин (жишээ: 2–3 сая ₮)"/><textarea name="description" rows={6} placeholder="Ажлын тайлбар, шаардлага" required/>
  <input name="contact" placeholder="Холбогдох имэйл эсвэл утас" required/><button>Илгээх</button><p className="msg">{m}</p></form></main>
}
