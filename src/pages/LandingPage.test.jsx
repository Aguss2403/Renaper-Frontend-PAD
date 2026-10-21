import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../app/App'

describe('public landing page', () => {
  it('renders the landing page and account entry points', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /validación de datos/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /iniciar sesión/i })).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: /registrarse|crear una cuenta/i })).toHaveLength(2)
  })
})
