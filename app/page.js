'use client'
import { useEffect, useState } from 'react'
import { sb } from '../lib/supabase'
import { CITIES, CATS } from '../lib/useLoc'
import JobCard, { col } from '../components/JobCard'
const ICON={IT:'💻',Санхүү:'💰',Маркетинг:'📣',Борлуулалт:'🤝',Барилга:'🏗️',Үйлчилгээ:'🍽️',Боловсрол:'🎓',Бусад:'➕'}
export default function Home(){
 const [jobs,setJobs]=useState(null),[f,setF]=useState({q:'',loc:'',type:'',cat:''})
 useEffect(()=>{sb.from('jobs').select('*').eq('approved',true).order('created_at',{ascending:false}).then(({data})=>setJobs(data||[]))},[])
 const go=e=>{e.preventDefault();location.href='/jobs?'+new URLSearchParams(Object.fromEntries(Object.entries(f).filter(([,v])=>v)))}
 const s=k=>e=>setF({...f,[k]:e.target.value})
 const J=jobs||[],urg=J.filter(j=>j.urgent).slice(0,3),comps=[...new Set(J.map(j=>j.company))].slice(0,5)
 return <>
  <section className="hero"><div className="wrap hero-in"><div><h1>Танд тохирох ажлыг Холбоё-гоос</h1><p>Монгол орны хаанаас ч ажил хайж, байгууллагад тохирох ажилтан олоорой.</p></div><div className="ill">👩‍💼</div></div></section>
  <main className="wrap">
  <form className="search" onSubmit={go} style={{maxWidth:'none',margin:'-34px 0 28px'}}><input placeholder="🔍 Ажлын нэр, түлхүүр үг" value={f.q} onChange={s('q')}/>
   <select value={f.loc} onChange={s('loc')}><option value="">📍 Бүх байршил</option>{CITIES.map(x=><option key={x}>{x}</option>)}</select>
   <select value={f.type} onChange={s('type')}><option value="">Ажлын төрөл</option>{['Бүтэн цаг','Хагас цаг','Гэрээт'].map(x=><option key={x}>{x}</option>)}</select>
   <select value={f.cat} onChange={s('cat')}><option value="">Ангилал</option>{CATS.map(x=><option key={x}>{x}</option>)}</select>
   <button className="btn-p">🔍 Хайх</button></form>
  <div className="duo">
   <div className="pc"><h2>👤 Би ажил хайж байна</h2><p>Өөрт тохирох ажлаа олоорой.</p><ul><li>Ажлын зар хайх</li><li>Байршил, төрлөөр шүүх</li><li>Ажил олгогчтой шууд холбогдох</li></ul><a className="btn-p" href="/jobs">Ажил хайх →</a></div>
   <div className="pc"><h2>🏢 Би байгууллага</h2><p>Ажлын байр зарлаж, тохирох ажилтнаа олоорой.</p><ul><li>Нэвтрэлтгүйгээр зар нэмэх</li><li>Шалгагдсаны дараа нийтлэгдэнэ</li><li>Холбоо барих мэдээлэл үлдээх</li></ul><a className="btn-p" href="/post">Зар оруулах →</a></div></div>
  {urg.length>0&&<><div className="sec"><h2>🔥 ЯАРАЛТАЙ АЖИЛ</h2><a href="/jobs">Бүх яаралтай зар →</a></div><div className="row3">{urg.map(j=><JobCard key={j.id} j={j}/>)}</div></>}
  <div className="sec"><h2>Шинээр нэмэгдсэн ажил</h2><a href="/jobs">Бүх шинэ зар →</a></div>
  {jobs===null?<p className="empty">Уншиж байна…</p>:J.length===0?<p className="empty">Одоогоор зар алга. <a href="/post">Эхний зараа нэмээрэй.</a></p>:<div className="row3">{J.slice(0,6).map(j=><JobCard key={j.id} j={j}/>)}</div>}
  <div className="sec"><h2>Эрэлттэй ажлын ангилал</h2></div>
  <div className="cats">{CATS.map(c=><a key={c} className="cat" href={'/jobs?cat='+encodeURIComponent(c)}><span>{ICON[c]}</span>{c}</a>)}</div>
  {comps.length>0&&<><div className="sec"><h2>Онцлох байгууллагууд</h2></div><div className="logos">{comps.map(c=><a key={c} className="lg" style={{textDecoration:'none'}} href={'/jobs?q='+encodeURIComponent(c)}><span className="logo" style={{background:col(c)}}>{c[0]}</span>{c}</a>)}</div></>}
  <div className="cta"><h2>Илүү сайн ирээдүйн төлөө Холбоё</h2><p>Ажил ба хүний холбоо</p><a className="btn-s" href="/post">Зар нэмэх</a></div>
  </main></>
}
