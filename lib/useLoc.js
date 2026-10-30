'use client'
import { useEffect, useState } from 'react'
export const CITIES=['Улаанбаатар','Дархан','Эрдэнэт','Алсаас']
export function useLoc(){
 const [loc,setLoc]=useState('Улаанбаатар')
 useEffect(()=>{const r=()=>{try{const v=localStorage.getItem('hb_loc');if(v!==null)setLoc(v)}catch{}};r();window.addEventListener('hb-loc',r);return()=>window.removeEventListener('hb-loc',r)},[])
 const set=v=>{setLoc(v);try{localStorage.setItem('hb_loc',v)}catch{};window.dispatchEvent(new Event('hb-loc'))}
 return [loc,set]
}
