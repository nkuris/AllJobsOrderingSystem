import React from 'react'

export default function Confirm({ open, title, message, onConfirm, onCancel }: { open: boolean; title?: string; message?: string; onConfirm?: () => void; onCancel?: () => void }) {
  if (!open) return null
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(2,6,23,0.35)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:70}}>
      <div style={{width:360,background:'#fff',borderRadius:10,padding:16,boxShadow:'0 8px 20px rgba(2,6,23,0.15)'}}>
        {title && <div style={{fontWeight:800,marginBottom:8}}>{title}</div>}
        {message && <div style={{marginBottom:12}}>{message}</div>}
        <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
          <button onClick={onCancel} style={{background:'#e2e8f0',border:'none',padding:'8px 12px',borderRadius:8}}>Cancel</button>
          <button onClick={onConfirm} style={{background:'#ef4444',color:'#fff',border:'none',padding:'8px 12px',borderRadius:8}}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
