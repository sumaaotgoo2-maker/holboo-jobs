import './globals.css'
import Header from '../components/Header'
export const metadata={title:'Холбоё | Ажил ба хүний холбоо',description:'Танд тохирох ажлыг Холбоёгоос'}
export default function L({children}){return <html lang="mn"><body><Header/>{children}<footer>© Холбоё · Ажил ба хүний холбоо</footer></body></html>}
