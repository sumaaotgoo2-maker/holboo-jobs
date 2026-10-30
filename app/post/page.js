'use client'
import { useState } from 'react'
import { sb } from '../../lib/supabase'
import { CITIES, CATS } from '../../lib/useLoc'
export default function Post(){
 const [m,setM]=useState(''),[busy,setBusy]=useState(false)
 async function go(e){e.preventDefault();const form=e.target,{website,...f}=Object.fromEntries(new FormData(form))
  if(website)return;setBusy(true);setM('')
  const {error}=await sb.from('jobs').insert(f);setBusy(false)
  if(error)return setM('Алдаа гарлаа: '+error.message)
  form.reset();setM('✅ Зар илгээгдлээ. Админ баталгаажуулсны дараа сайтад гарна.')}
 return <main className="wrap"><h1>Ажлын зар нэмэх</h1><p className="meta">Нэвтрэх шаардлагагүй. Зар шалгагдсаны дараа нийтлэгдэнэ.</p>
  <form onSubmit={go}>
  <input name="title" placeholder="Ажлын нэр *" required/><input name="company" placeholder="Компанийн нэр *" required/>
  <select name="location">{CITIES.map(x=><option key={x}>{x}</option>)}</select>
  <select name="type">{['Бүтэн цаг','Хагас цаг','Гэрээт'].map(x=><option key={x}>{x}</option>)}</select>
  <select name="category">{CATS.map(x=><option key={x}>{x}</option>)}</select>
  <input name="salary" placeholder="Цалин (жишээ: 2–3 сая ₮)"/><textarea name="description" rows={6} placeholder="Ажлын тайлбар, шаардлага *" required/>
  <input name="contact" placeholder="Холбогдох имэйл эсвэл утас *" required/>
  <input name="website" tabIndex={-1} autoComplete="off" style={{position:'absolute',left:'-9999px'}} aria-hidden="true"/>
  <button disabled={busy}>{busy?'Илгээж байна…':'Илгээх'}</button><p className="msg">{m}</p></form></main>
}
