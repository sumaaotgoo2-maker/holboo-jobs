import './globals.css'
import Header from '../components/Header'
export const metadata={title:'Холбоо – Ажлын байр',description:'Ажил хайгч ба ажил олгогчийг холбоно'}
export default function L({children}){return <html lang="mn"><body><Header/>{children}</body></html>}
