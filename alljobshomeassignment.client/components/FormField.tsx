import React from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

export default function FormField({ label, hint, id, ...props }: Props) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div>
      {label && <label htmlFor={fieldId}>{label}</label>}
      <input id={fieldId} name={fieldId} {...props} />
      {hint && <div style={{fontSize:12,color:'#64748b',marginTop:6}}>{hint}</div>}
    </div>
  )
}
