'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { sb } from '../../../lib/supabase'
export default function Job(){
 const {id}=useParams(),[j,setJ]=useState(undefined)
 useEffect(()=>{sb.from('jobs').select('*').eq('id',id).maybeSingle().then(({data})=>setJ(data))},[id])
 if(j===undefined)return <main className="wrap"><p className="empty">Уншиж байна…</p></main>
 if(!j)return <main className="wrap"><h1>Зар олдсонгүй</h1></main>
 return <main className="wrap"><h1>{j.title}</h1><p className="co">{j.company} · 📍 {j.location}</p>
  <div className="tags">{j.type&&<span className="tag">{j.type}</span>}{j.category&&<span className="tag alt">{j.category}</span>}</div>
  <p className="js">{j.salary}</p><p style={{whiteSpace:'pre-wrap'}}>{j.description}</p>
  <div className="side"><h3>Холбогдох</h3><p>{j.contact}</p></div></main>
}
