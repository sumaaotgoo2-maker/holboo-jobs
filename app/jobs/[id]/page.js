'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { sb } from '../../../lib/supabase'
import JobCard, { col, when, isFeat } from '../../../components/JobCard'

export default function JobDetail(){
 const { id } = useParams()
 const [j,setJ]=useState(undefined),[sim,setSim]=useState([]),[copied,setCopied]=useState(false)

 useEffect(()=>{
  if(!id)return
  sb.from('jobs').select('*').eq('id',id).eq('approved',true).maybeSingle().then(({data})=>{
   setJ(data||null)
   if(data){
    document.title=`${data.title} - ${data.company} | Холбоё`
    sb.from('jobs').select('*').eq('approved',true).eq('category',data.category).neq('id',data.id)
     .order('created_at',{ascending:false}).limit(3).then(({data:s})=>setSim(s||[]))
   }
  })
 },[id])

 const share=async()=>{
  const url=location.href
  try{
   if(navigator.share){await navigator.share({title:j.title,url})}
   else{await navigator.clipboard.writeText(url);setCopied(true);setTimeout(()=>setCopied(false),2000)}
  }catch(e){}
 }

 if(j===undefined)return <main className="wrap"><p className="empty">Уншиж байна…</p></main>
 if(j===null)return <main className="wrap"><p className="empty">Зар олдсонгүй эсвэл хугацаа нь дууссан. <a href="/jobs">Бүх зар үзэх</a></p></main>

 const contact=j.contact||''
 const isMail=contact.includes('@')
 const tel=contact.replace(/[^\d+]/g,'')

 return <>
  <div className="hrow"><div className="wrap"><a href="/jobs">← Бүх зар</a></div></div>
  <main className="wrap">
   <div className="jrow">
    <div className="logo" style={{background:col(j.company)}}>{j.company[0]}</div>
    <div className="mid">
     <h1>{j.title} {isFeat(j)&&<span className="fe">★ Онцлох</span>} {j.urgent&&<span className="urg">Яаралтай</span>}</h1>
     <p className="co"><a href={'/company?name='+encodeURIComponent(j.company)}>{j.company}</a></p>
     <p className="jl">📍 {j.location}{j.type&&` · ${j.type}`}{j.category&&` · ${j.category}`} · {when(j.created_at)}</p>
     {j.salary&&<p className="js">{j.salary}</p>}
     {j.experience&&<p className="jl">Туршлага: {j.experience}</p>}
    </div>
   </div>

   <div className="sec"><h2>Ажлын тайлбар, шаардлага</h2></div>
   <p style={{whiteSpace:'pre-wrap',maxWidth:760,lineHeight:1.7}}>{j.description}</p>

   <div className="sec"><h2>Холбогдох</h2></div>
   <p style={{fontSize:18}}>{contact}</p>
   <div className="btns">
    {contact&&(isMail
     ?<a className="btn-p" href={'mailto:'+contact}>✉️ Имэйл илгээх</a>
     :<a className="btn-p" href={'tel:'+tel}>📞 Залгах</a>)}
    <button type="button" className="btn-s" onClick={share}>{copied?'✅ Холбоос хуулагдлаа':'🔗 Хуваалцах'}</button>
   </div>

   {sim.length>0&&<><div className="sec"><h2>Ижил төстэй зарууд</h2></div>
    <div className="row3">{sim.map(x=><JobCard key={x.id} j={x}/>)}</div></>}
  </main>
 </>
}
