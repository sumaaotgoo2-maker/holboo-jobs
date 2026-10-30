const COL=['#1d3a6b','#0f6b4f','#6b4de6','#c2410c','#0e7490','#9d174d']
export const col=c=>COL[c.length%COL.length]
export const when=d=>{const n=Math.floor((Date.now()-new Date(d))/864e5);return n<1?'Өнөөдөр':n<7?`${n} өдрийн өмнө`:new Date(d).toLocaleDateString('mn-MN')}
export default function JobCard({j}){return <a href={`/jobs/${j.id}`} className="jcw"><article className="jc">
 <div className="jc-top"><div className="logo" style={{background:col(j.company)}}>{j.company[0]}</div><span className="co">{j.company}</span>{j.urgent?<span className="urg">Яаралтай</span>:<span className="new">{when(j.created_at)}</span>}</div>
 <h3>{j.title}</h3>{j.salary&&<p className="js">{j.salary}</p>}<p className="jl">📍 {j.location}{j.type&&` · ${j.type}`}</p><p className="jt">{when(j.created_at)}</p></article></a>}
