import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../app/App'

afterEach(() => {
  cleanup()
  localStorage.clear()
  window.history.pushState({}, '', '/')
  vi.unstubAllGlobals()
})

describe('public landing page', () => {
  it('renders the landing page and account entry points', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /validación de datos/i })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /iniciar sesión/i })).toHaveLength(2)
    expect(screen.getAllByRole('link', { name: /registrarse|crear una cuenta/i })).toHaveLength(2)
  })

  it('authenticates a user and shows account actions on the public home', async () => {
    window.history.pushState({}, '', '/login')
    const fetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ accessToken: 'token', tokenType: 'Bearer', expiraUtc: '2026-10-22T00:00:00Z' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ nombreOrganizacion: 'Equipo PAD', emailContacto: 'equipo@example.com' }), { status: 200 }))
    vi.stubGlobal('fetch', fetch)

    render(<App />)
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'equipo@example.com' } })
    fireEvent.change(screen.getByLabelText(/^contraseña/i), { target: { value: 'una-contraseña-segura' } })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    await waitFor(() => expect(screen.getAllByRole('link', { name: /gestionar cuenta/i })).toHaveLength(2))
    expect(fetch).toHaveBeenNthCalledWith(1, 'http://localhost:5080/api/v1/auth/login', expect.objectContaining({ method: 'POST' }))
    expect(JSON.parse(localStorage.getItem('renaper-session')).accessToken).toBe('token')
  })

  it('shows a validation error before submitting an invalid login', () => {
    window.history.pushState({}, '', '/login')
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)

    render(<App />)
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'invalido' } })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(/correo electrónico válido/i)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('redirects an unauthenticated account route to login', () => {
    window.history.pushState({}, '', '/cuenta')

    render(<App />)

    expect(screen.getByRole('heading', { name: /ingresá a tu cuenta/i })).toBeInTheDocument()
    expect(screen.getByText(/iniciá sesión para gestionar tu cuenta/i)).toBeInTheDocument()
    expect(window.location.pathname).toBe('/login')
  })

  it('navigates to account management and keeps credit purchase disabled', async () => {
    window.history.pushState({}, '', '/login')
    const fetch = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ accessToken: 'token', tokenType: 'Bearer', expiraUtc: '2026-10-22T00:00:00Z' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ nombreOrganizacion: 'Equipo PAD', emailContacto: 'equipo@example.com', fechaCreacionUtc: '2026-10-21T00:00:00Z' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ nombreOrganizacion: 'Equipo PAD', emailContacto: 'equipo@example.com', fechaCreacionUtc: '2026-10-21T00:00:00Z' }), { status: 200 }))
      .mockResolvedValueOnce(new Response('', { status: 404 }))
    vi.stubGlobal('fetch', fetch)

    render(<App />)
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'equipo@example.com' } })
    fireEvent.change(screen.getByLabelText(/^contraseña/i), { target: { value: 'una-contraseña-segura' } })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))
    await screen.findAllByRole('link', { name: /gestionar cuenta/i })
    fireEvent.click(screen.getAllByRole('link', { name: /gestionar cuenta/i })[0])

    expect(await screen.findByRole('heading', { name: /gestioná la cuenta/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /comprar créditos/i })).toBeDisabled()
  })
})
