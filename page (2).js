'use client'
import { useEffect, useState } from 'react'
import { sb } from '../lib/supabase'
import { CITIES, CATS } from '../lib/useLoc'
import JobCard, { col, isFeat } from '../components/JobCard'
import Banner from '../components/Banner'
import SeekerCard from '../components/SeekerCard'
const ICON={IT:'💻',Санхүү:'💰',Маркетинг:'📣',Борлуулалт:'🤝',Барилга:'🏗️',Үйлчилгээ:'🍽️',Боловсрол:'🎓',Бусад:'➕'}
export default function Home(){
 const [jobs,setJobs]=useState(null),[sk,setSk]=useState([]),[f,setF]=useState({q:'',loc:'',type:'',cat:''})
 useEffect(()=>{sb.from('jobs').select('*').eq('approved',true).order('created_at',{ascending:false}).then(({data})=>setJobs(data||[]))
  sb.from('seekers').select('id,name,profession,aimag,salary,about,urgent,created_at').eq('approved',true).eq('urgent',true).order('created_at',{ascending:false}).limit(3).then(({data})=>setSk(data||[]))},[])
 const go=e=>{e.preventDefault();location.href='/jobs?'+new URLSearchParams(Object.fromEntries(Object.entries(f).filter(([,v])=>v)))}
 const s=k=>e=>setF({...f,[k]:e.target.value})
 const J=[...(jobs||[])].sort((a,b)=>isFeat(b)-isFeat(a)),urg=J.filter(j=>j.urgent).slice(0,3),comps=[...new Set(J.map(j=>j.company))].slice(0,5)
 return <>
  <section className="hero"><div className="wrap hero-in"><div className="ht"><h1>Танд тохирох ажлыг Холбоё-гоос</h1><p>Монгол орны бүх аймгаас ажил хайж, байгууллагад тохирох ажилтан олоорой.</p></div></div></section>
  <main className="wrap">
  <form className="search" onSubmit={go}><input placeholder="🔍 Ажлын нэр, түлхүүр үг" value={f.q} onChange={s('q')}/>
   <select value={f.loc} onChange={s('loc')}><option value="">📍 Бүх аймаг</option>{CITIES.map(x=><option key={x}>{x}</option>)}</select>
   <select value={f.type} onChange={s('type')}><option value="">Ажлын төрөл</option>{['Бүтэн цаг','Хагас цаг','Гэрээт','Вахтын ажил'].map(x=><option key={x}>{x}</option>)}</select>
   <select value={f.cat} onChange={s('cat')}><option value="">Ангилал</option>{CATS.map(x=><option key={x}>{x}</option>)}</select>
   <button className="btn-p">🔍 Хайх</button></form>
  <div className="duo">
   <div className="pc"><h2>👤 Би ажил хайж байна</h2><p>Профайлаа үүсгээд байгууллагуудад танигдаарай, эсвэл зарыг хайгаарай.</p><ul><li>Нэр, мэргэжлээ бүртгүүлэх</li><li>Байгууллага таныг олж холбогдоно</li><li>Бүх аймгийн зарыг харах</li></ul><div className="btns"><a className="btn-p" href="/seekers/new">Профайл үүсгэх →</a><a className="btn-s" href="/jobs">Ажил хайх</a></div></div>
   <div className="pc"><h2>🏢 Би байгууллага</h2><p>Ажлын зараа тавьж, эсвэл ажил хайгчдын жагсаалтаас тохирох хүнээ олоорой.</p><ul><li>Нэвтрэлтгүйгээр зар нэмэх</li><li>Ажил хайгчдын профайлыг үзэх</li><li>Яаралтай зараа онцлох</li></ul><div className="btns"><a className="btn-p" href="/post">Зар оруулах →</a><a className="btn-s" href="/seekers">Ажил хайгчдыг харах</a></div></div></div>
  {(urg.length>0||sk.length>0)&&<><div className="sec"><h2>🔥 ЯАРАЛТАЙ</h2></div><div className="two">
   <div><h4>Ажилтан хэрэгтэй байгууллагууд</h4>{urg.length?<div className="col1">{urg.map(j=><JobCard key={j.id} j={j}/>)}</div>:<p className="empty">Одоогоор алга</p>}</div>
   <div><h4>Яаралтай ажил хайж буй хүмүүс</h4>{sk.length?<div className="col1">{sk.map(x=><SeekerCard key={x.id} s={x} authed={false}/>)}</div>:<p className="empty">Одоогоор алга</p>}</div></div></>}
  <div className="sec"><h2>Шинээр нэмэгдсэн ажил</h2><a href="/jobs">Бүх зар →</a></div>
  {jobs===null?<p className="empty">Уншиж байна…</p>:J.length===0?<p className="empty">Одоогоор зар алга. <a href="/post">Эхний зараа нэмээрэй.</a></p>:<div className="row3">{J.slice(0,6).map(j=><JobCard key={j.id} j={j}/>)}</div>}
  <Banner place="home"/>
  <div className="sec"><h2>Эрэлттэй ажлын ангилал</h2></div>
  <div className="cats">{CATS.map(c=><a key={c} className="cat" href={'/jobs?cat='+encodeURIComponent(c)}><span>{ICON[c]}</span>{c}</a>)}</div>
  {comps.length>0&&<><div className="sec"><h2>Байгууллагууд</h2></div><div className="logos">{comps.map(c=><a key={c} className="lg" style={{textDecoration:'none'}} href={'/company?name='+encodeURIComponent(c)}><span className="logo" style={{background:col(c)}}>{c[0]}</span>{c}</a>)}</div></>}
  <div className="cta"><h2>Илүү сайн ирээдүйн төлөө Холбоё</h2><p>Ажил ба хүний холбоо</p><a className="btn-s" href="/post">Зар нэмэх</a></div>
  </main></>
}
