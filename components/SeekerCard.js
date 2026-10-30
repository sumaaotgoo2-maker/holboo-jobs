import { when } from './JobCard'
export default function SeekerCard({s,authed}){return <article className="jc">
 <div className="jc-top"><div className="logo" style={{background:'#0f6b4f',borderRadius:'50%'}}>{s.name[0]}</div><span className="co"><b>{s.name}</b></span>{s.urgent?<span className="urg">Яаралтай</span>:<span className="new">{when(s.created_at)}</span>}</div>
 <h3>{s.profession}</h3><p className="jl">📍 {s.aimag}</p>{s.salary&&<p className="js">{s.salary}</p>}{s.about&&<p className="jt">{s.about.slice(0,110)}</p>}
 {authed?<p className="js">📞 {s.contact}</p>:<p className="jt"><a href="/login">🔒 Холбоо барих мэдээллийг харахын тулд нэвтэрнэ үү</a></p>}</article>}
