'use client'
import { useEffect, useState } from 'react'
import { sb } from '../../lib/supabase'
const PLANS=[
 {id:'featured',h:'★ Онцлох зар',pr:'50,000₮',per:'/ 7 хоног',hot:1,d:'Зар жагсаалтын эхэнд, алтлаг хүрээтэй гарна.',li:['Жагсаалтын эхэнд байрлана','Онцлох тэмдэг','Нүүр хуудсанд гарна','30 хоног: 150,000₮']},
 {id:'profile',h:'Байгууллагын профайл багц',pr:'99,000₮',per:'/ сар',d:'Компанийн бүрэн хуудастай болж, итгэл төрүүлнэ.',li:['Лого, нүүр зураг, танилцуулга','Бүх нээлттэй зар нэг дор','Premium тэмдэг','Холбоо барих мэдээлэл, хаяг']},
 {id:'banner',h:'Баннер реклам',pr:'300,000₮',per:'/ сар',d:'Нүүр болон ажил хайх хуудсанд таны баннер.',li:['Нүүр хуудас, ажил хайх хуудас','Өөрийн холбоос руу шилжүүлнэ','Хугацаа дуустал байрлана']}]
export default function Ads(){
 const [plan,setPlan]=useState('featured'),[m,setM]=useState(''),[busy,setBusy]=useState(false),[bank,setBank]=useState(null),[done,setDone]=useState(null),[cp,setCp]=useState(false)
 useEffect(()=>{sb.from('settings').select('value').eq('key','bank').maybeSingle().then(({data})=>setBank(data?data.value:null))},[])
 async function go(e){e.preventDefault();const form=e.target,{website,...f}=Object.fromEntries(new FormData(form))
  if(website)return;setBusy(true);setM('')
  const {error}=await sb.from('ad_orders').insert({...f,plan});setBusy(false)
  if(error)return setM('Алдаа гарлаа: '+error.message)
  setDone({org:f.org,plan});form.reset();setM('✅ Хүсэлт илгээгдлээ. Төлбөрийн мэдээллийг доороос харна уу.')}
 return <><div className="hrow"><div className="wrap"><h1>Сурталчилгаа ба үнэ</h1></div></div><main className="wrap">
  <div className="plans">{PLANS.map(p=><div key={p.id} className={p.hot?'plan hot':'plan'}><h3>{p.h}</h3><p className="meta">{p.d}</p><div className="pr">{p.pr} <small>{p.per}</small></div><ul>{p.li.map(x=><li key={x}>{x}</li>)}</ul>
   <a className="btn-p" href="#order" onClick={()=>setPlan(p.id)}>Захиалах</a></div>)}</div>
  <p className="meta">Үнэ жишээ бөгөөд өөрчлөгдөж болно.</p>
  <h2 id="order">Захиалгын хүсэлт</h2>
  <form onSubmit={go}><select value={plan} onChange={e=>setPlan(e.target.value)}>{PLANS.map(p=><option key={p.id} value={p.id}>{p.h} · {p.pr} {p.per}</option>)}</select>
   <input name="org" placeholder="Байгууллагын нэр *" required/><input name="contact" placeholder="Утас эсвэл имэйл *" required/>
   <textarea name="note" rows={4} placeholder="Нэмэлт тайлбар (заавал биш)"/>
   <input name="website" tabIndex={-1} autoComplete="off" style={{position:'absolute',left:'-9999px'}} aria-hidden="true"/>
   <button disabled={busy}>{busy?'Илгээж байна…':'Хүсэлт илгээх'}</button><p className="msg">{m}</p></form>
  {done&&(()=>{const P=PLANS.find(p=>p.id===done.plan);return <div className="pay"><h3>Төлбөрийн мэдээлэл</h3>
   {bank?<><p>Доорх данс руу шилжүүлнэ үү. Мөнгө орсны дараа таны захиалгыг идэвхжүүлнэ.</p>
    <dl><dt>Банк</dt><dd>{bank.bank}</dd><dt>Дансны дугаар</dt><dd>{bank.account} <button type="button" className="btn-s" onClick={()=>{navigator.clipboard&&navigator.clipboard.writeText(bank.account);setCp(true)}}>{cp?'Хуулсан ✓':'Хуулах'}</button></dd>
    <dt>Хүлээн авагч</dt><dd>{bank.name}</dd><dt>Гүйлгээний утга</dt><dd>{'Холбоё '+P.h.replace('★ ','')+' - '+done.org}</dd><dt>Дүн</dt><dd>{P.pr} {P.per}</dd></dl>
    <p className="meta">Шилжүүлсний дараа гүйлгээний зургийг бидэнд илгээнэ үү.</p></>
   :<p>Бид тантай удахгүй холбогдож төлбөрийн мэдээллийг өгнө.</p>}</div>})()}
  </main></>
}
