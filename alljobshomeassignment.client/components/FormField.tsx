import React from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

export default function FormField({ label, hint, ...props }: Props) {
  return (
    <div>
      {label && <label>{label}</label>}
      <input {...props} />
      {hint && <div style={{fontSize:12,color:'#64748b',marginTop:6}}>{hint}</div>}
    </div>
  )
}
