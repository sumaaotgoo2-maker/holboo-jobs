'use client'
import { useState } from 'react'
import { sb } from '../../../lib/supabase'
import { CITIES } from '../../../lib/useLoc'
export default function NewSeeker(){
 const [m,setM]=useState(''),[busy,setBusy]=useState(false)
 async function go(e){e.preventDefault();const form=e.target,{website,urgent,...f}=Object.fromEntries(new FormData(form))
  if(website)return;setBusy(true);setM('')
  const {error}=await sb.from('seekers').insert({...f,urgent:urgent==='on'});setBusy(false)
  if(error)return setM('Алдаа гарлаа: '+error.message)
  form.reset();setM('✅ Профайл илгээгдлээ. Шалгагдсаны дараа сайтад гарна.')}
 return <main className="wrap"><h1>Ажил хайгчийн профайл</h1><p className="meta">Нэр, мэргэжил бусдад харагдана. Утас, имэйлийг зөвхөн нэвтэрсэн хэрэглэгч харна.</p>
  <form onSubmit={go}><input name="name" placeholder="Нэр *" required/><input name="profession" placeholder="Мэргэжил / хүссэн ажил *" required/>
  <select name="aimag">{CITIES.map(c=><option key={c}>{c}</option>)}</select><input name="salary" placeholder="Хүссэн цалин (жишээ: 1.5 сая ₮)"/>
  <textarea name="about" rows={5} placeholder="Өөрийгөө танилцуулах: туршлага, ур чадвар"/><input name="contact" placeholder="Утас эсвэл имэйл *" required/>
  <label><input type="checkbox" name="urgent"/>🔥 Яаралтай ажил хайж байна</label>
  <input name="website" tabIndex={-1} autoComplete="off" style={{position:'absolute',left:'-9999px'}} aria-hidden="true"/>
  <button disabled={busy}>{busy?'Илгээж байна…':'Илгээх'}</button><p className="msg">{m}</p></form></main>
}
