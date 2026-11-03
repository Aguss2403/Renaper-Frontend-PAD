import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../app/App'
afterEach(() => { cleanup(); localStorage.clear(); window.history.pushState({}, '', '/'); vi.unstubAllGlobals() })
describe('public experience', () => {
  it('renders the redesigned landing page without code samples', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /validá datos ficticios/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /iniciar sesión/i })).toHaveLength(1)
    expect(screen.getAllByRole('link', { name: /crear (una )?cuenta/i })).toHaveLength(2)
    expect(screen.getByText(/validación completada/i)).toBeInTheDocument()
    expect(screen.queryByText(/post \/api/i)).not.toBeInTheDocument()
    expect(screen.getByText(/sin consultar registros reales/i)).toBeInTheDocument()
    expect(screen.queryByText(/todo en un mismo lugar/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /ver cómo funciona/i })).not.toBeInTheDocument()
  })
  it('shows the registration experience', () => {
    window.history.pushState({}, '', '/registro'); render(<App />)
    expect(screen.getByRole('heading', { name: /creá la cuenta de tu equipo/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /crear una cuenta/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/nombre de la organización/i)).toBeInTheDocument()
  })
  it('authenticates a user and shows account actions', async () => {
    window.history.pushState({}, '', '/login')
    const fetch = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify({ accessToken: 'token' }), { status: 200 })).mockResolvedValueOnce(new Response(JSON.stringify({ nombreOrganizacion: 'Equipo PAD', emailContacto: 'equipo@example.com' }), { status: 200 }))
    vi.stubGlobal('fetch', fetch); render(<App />)
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'equipo@example.com' } }); fireEvent.change(screen.getByLabelText(/^contraseña/i), { target: { value: 'una-contraseña-segura' } }); fireEvent.click(screen.getByRole('button', { name: /^iniciar sesión$/i }))
    await waitFor(() => expect(screen.getAllByRole('link', { name: /gestionar cuenta/i })).toHaveLength(2))
    fireEvent.click(screen.getByRole('link', { name: /documentación de integración/i }))
    expect(screen.getByRole('heading', { name: /implementá renaper validation/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /volver al inicio/i }))
    expect(window.location.pathname).toBe('/')
    expect(screen.getByRole('heading', { name: /validá datos ficticios/i })).toBeInTheDocument()
  })
  it('shows validation before submitting an invalid login', () => {
    window.history.pushState({}, '', '/login'); const fetch = vi.fn(); vi.stubGlobal('fetch', fetch); render(<App />)
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'invalido' } }); fireEvent.click(screen.getByRole('button', { name: /^iniciar sesión$/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/correo electrónico válido/i); expect(fetch).not.toHaveBeenCalled()
  })
  it('redirects an unauthenticated account route to login', () => {
    window.history.pushState({}, '', '/cuenta'); render(<App />)
    expect(screen.getByRole('heading', { name: /volvé a tu espacio de trabajo/i })).toBeInTheDocument()
    expect(screen.getByText(/iniciá sesión para gestionar tu cuenta/i)).toBeInTheDocument()
  })
})

