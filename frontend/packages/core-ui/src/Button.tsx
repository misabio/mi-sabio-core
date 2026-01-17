import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', style, ...props }) => {
  const baseStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    ...style
  }
  
  const variantStyles = {
    primary: { backgroundColor: '#0070f3', color: 'white' },
    secondary: { backgroundColor: '#eaeaea', color: 'black' }
  }

  return (
    <button style={{ ...baseStyle, ...variantStyles[variant] }} {...props} />
  )
}
