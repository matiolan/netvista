import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
export const metadata: Metadata={title:'NetVista | Gestión FTTH y MikroTik',description:'Sistema NOC para monitoreo centralizado de redes FTTH, routers MikroTik y OLTs GPON.',generator:'v0.app'}
export const viewport: Viewport={colorScheme:'dark',themeColor:'#0b111a'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="es" className="dark bg-background"><body className="antialiased">{children}{process.env.NODE_ENV==='production'&&<Analytics/>}</body></html>}
