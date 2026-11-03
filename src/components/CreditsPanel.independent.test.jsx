import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { CreditsPanel } from './CreditsPanel'
import { creditsApi } from '../services/authApi'

vi.mock('../services/authApi', () => ({ creditsApi: { balance: vi.fn(), checkout: vi.fn() } }))
afterEach(() => { cleanup(); vi.resetAllMocks(); window.history.replaceState({}, '', '/') })
const state = { saldo: 0, comprasHabilitadas: true, paquete: { consultas: 1000, precio: 1000, moneda: 'ARS' } }

it.each(['?status=approved', '?collection_status=approved&payment_id=42', '?success=true&credits=1000'])(
  'ignores forged checkout return flags %s', async flags => {
    window.history.replaceState({}, '', '/cuenta' + flags)
    creditsApi.balance.mockResolvedValue(state)
    render(<CreditsPanel accessToken="owner-session" />)
    expect(await screen.findByText('0')).toBeInTheDocument()
    expect(creditsApi.balance).toHaveBeenCalledWith('owner-session')
    expect(creditsApi.checkout).not.toHaveBeenCalled()
    expect(screen.queryByText(/pago aprobado/i)).not.toBeInTheDocument()
  },
)

it.each([
  'http://sandbox.mercadopago.com.ar/x', 'https://sandbox.mercadopago.com.ar.evil.invalid/x',
  'https://user:pass@sandbox.mercadopago.com.ar/x', 'https://sandbox.mercadopago.com.ar:444/x',
  'javascript:alert(1)', '',
])('rejects unsafe checkout redirect %s', async checkoutUrl => {
  creditsApi.balance.mockResolvedValue(state)
  creditsApi.checkout.mockResolvedValue({ checkoutUrl })
  render(<CreditsPanel accessToken="owner-session" />)
  await screen.findByText('0')
  fireEvent.click(screen.getByRole('button', { name: 'Pagar con Mercado Pago' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('El checkout recibido no es un entorno de prueba válido.')
  expect(screen.queryByRole('link', { name: /Ir a Mercado Pago/ })).not.toBeInTheDocument()
  expect(screen.getByText('0')).toBeInTheDocument()
})
