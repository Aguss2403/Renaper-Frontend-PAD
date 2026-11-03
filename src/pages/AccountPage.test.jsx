import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AccountPage } from './AccountPage'
import { ApiError, apiKeyApi, authApi, personApi } from '../services/authApi'

vi.mock('../services/authApi', async (importOriginal) => {
  const original = await importOriginal()
  return { ...original, authApi: { me: vi.fn() }, apiKeyApi: { status: vi.fn(), generate: vi.fn(), revoke: vi.fn() }, personApi: { validate: vi.fn() } }
})
const profile = { nombreOrganizacion: 'Equipo de prueba', emailContacto: 'equipo@example.com', fechaCreacionUtc: '2026-10-20T14:00:00Z' }
const metadata = { prefijo: 'rv_demo', activa: true, fechaCreacionUtc: '2026-11-01T14:00:00Z' }
const session = { accessToken: 'test-token', profile }
const onNavigate = vi.fn()
const renderAccount = () => render(<AccountPage session={session} onSessionProfile={vi.fn()} onNavigate={onNavigate} />)

function fillValidation() {
  for (const [label, value] of [[/^DNI$/, '12345678'], [/nombres completos/i, 'Persona'], [/^Apellido$/, 'Ficticia'], [/api key de prueba/i, 'test-api-key']]) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
  }
  fireEvent.click(screen.getByRole('checkbox'))
}

beforeEach(() => {
  vi.resetAllMocks()
  authApi.me.mockResolvedValue(profile)
  apiKeyApi.status.mockResolvedValue(metadata)
})
afterEach(() => { cleanup(); vi.unstubAllGlobals(); localStorage.clear() })

describe('account workspace', () => {
  it('keeps the two validation outcomes independent and clears stale results after edits', async () => {
    personApi.validate.mockResolvedValue({ datosCoinciden: true, cumpleEdadMinima: false })
    renderAccount()
    await screen.findByText('Activa')
    fillValidation()
    fireEvent.click(screen.getByRole('button', { name: 'Validar datos' }))
    await screen.findByRole('heading', { name: 'Consulta completada' })
    expect(personApi.validate).toHaveBeenCalledWith('test-api-key', { dni: 12345678, nombre: 'Persona', apellido: 'Ficticia', edadMinima: 18 })
    expect(within(screen.getByText('Datos coinciden').closest('li')).getByText('Sí')).toBeInTheDocument()
    expect(within(screen.getByText('Cumple edad mínima').closest('li')).getByText('No')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('DNI'), { target: { value: '87654321' } })
    expect(screen.queryByRole('heading', { name: 'Consulta completada' })).not.toBeInTheDocument()
  })

  it('requires valid inputs and explicit browser-key consent before sending a query', async () => {
    renderAccount()
    await screen.findByText('Activa')
    fireEvent.click(screen.getByRole('button', { name: 'Validar datos' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Ingresá un DNI positivo.')
    expect(personApi.validate).not.toHaveBeenCalled()
    fillValidation()
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: 'Validar datos' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Confirmá el uso de la API key')
    expect(personApi.validate).not.toHaveBeenCalled()
  })

  it('recovers from a failed query without displaying a successful result', async () => {
    personApi.validate.mockRejectedValueOnce(new Error('Servicio no disponible.')).mockResolvedValueOnce({ datosCoinciden: true, cumpleEdadMinima: true })
    renderAccount()
    await screen.findByText('Activa')
    fillValidation()
    fireEvent.click(screen.getByRole('button', { name: 'Validar datos' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Servicio no disponible.')
    expect(screen.getByRole('heading', { name: 'No se completó la consulta' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Validar datos' })).toBeEnabled()
    fireEvent.click(screen.getByRole('button', { name: 'Validar datos' }))
    await screen.findByRole('heading', { name: 'Consulta completada' })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('creates and copies a one-time key without persisting it, then clears it on revocation', async () => {
    apiKeyApi.status.mockRejectedValue(new ApiError('Sin clave', 404))
    apiKeyApi.generate.mockResolvedValue({ apiKey: 'one-time-test-key', metadata })
    apiKeyApi.revoke.mockResolvedValue(null)
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    renderAccount()
    fireEvent.click(await screen.findByRole('button', { name: 'Crear API key' }))
    await screen.findByText('one-time-test-key')
    fireEvent.click(screen.getByRole('button', { name: 'Copiar' }))
    await screen.findByText('API key copiada.')
    expect(writeText).toHaveBeenCalledWith('one-time-test-key')
    expect(localStorage.length).toBe(0)
    fireEvent.click(screen.getByRole('button', { name: 'Revocar API key' }))
    await screen.findByText('Revocada')
    expect(screen.queryByText('one-time-test-key')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Revocar API key' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Crear nueva API key' })).toBeEnabled()
  })

  it('provides a manual-copy fallback when clipboard access fails and links to documentation', async () => {
    apiKeyApi.generate.mockResolvedValue({ apiKey: 'one-time-test-key', metadata })
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('Denied')) } })
    renderAccount()
    fireEvent.click(await screen.findByRole('button', { name: 'Rotar API key' }))
    fireEvent.click(await screen.findByRole('button', { name: 'Copiar' }))
    await screen.findByText(/seleccioná la clave para copiarla manualmente/i)
    fireEvent.click(screen.getByRole('link', { name: 'Ver documentación' }))
    expect(onNavigate).toHaveBeenCalledWith('documentation')
  })
})
