import React from 'react'

export default function Modal({ open, title, onClose, children }: { open: boolean; title?: string; onClose?: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(2,6,23,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:60}}>
      <div style={{width:'100%',maxWidth:720,background:'#fff',borderRadius:10,padding:18,boxShadow:'0 10px 30px rgba(2,6,23,0.2)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
          <div style={{fontWeight:700}}>{title}</div>
          <button onClick={onClose} style={{background:'transparent',border:'none',fontSize:18,cursor:'pointer'}}>×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
