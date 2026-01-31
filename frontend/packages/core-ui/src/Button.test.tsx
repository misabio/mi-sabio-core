import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'
import { describe, it, expect, vi } from 'vitest'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles clicks', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByText('Secondary')
    // We defined secondary color as 'black' in the component
    expect(button).toHaveStyle({ color: 'rgb(0, 0, 0)' })
  })
})
