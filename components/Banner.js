'use client'
import { useEffect, useState } from 'react'
import { sb } from '../lib/supabase'
// place: 'home' | 'jobs'. Идэвхтэй баннер байвал харуулна, үгүй бол сурталчилгааны урилга.
export default function Banner({place}){
 const [b,setB]=useState(undefined)
 useEffect(()=>{sb.from('banners').select('id,image_url,link').eq('place',place).order('created_at',{ascending:false}).limit(1).then(({data})=>setB((data&&data[0])||null))},[place])
 if(b===undefined)return null
 return b?<a className="ban img" href={b.link||'#'} target="_blank" rel="noopener sponsored"><small>Реклам</small><img src={b.image_url} alt="Реклам"/></a>
  :<div className="ban"><small>Реклам</small><b>Таны баннер энд байрлана</b> · <a href="/ads">Үнэ харах</a></div>
}
