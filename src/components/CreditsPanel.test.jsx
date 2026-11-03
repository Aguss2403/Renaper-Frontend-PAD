import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { CreditsPanel } from './CreditsPanel'
import { creditsApi } from '../services/authApi'

vi.mock('../services/authApi', () => ({ creditsApi: { balance: vi.fn(), checkout: vi.fn() } }))
const balance = { saldo: 25, comprasHabilitadas: true, paquete: { consultas: 1000, precio: 1000, moneda: 'ARS' } }
beforeEach(() => { vi.resetAllMocks(); creditsApi.balance.mockResolvedValue(balance) })
afterEach(cleanup)

it('shows server balance and prepares a sandbox checkout without trusting return parameters', async () => {
  window.history.replaceState({}, '', '/cuenta?status=approved')
  creditsApi.checkout.mockResolvedValue({ id: 'order', checkoutUrl: 'https://sandbox.mercadopago.com.ar/checkout' })
  render(<CreditsPanel accessToken="session" />)
  expect(await screen.findByText('25')).toBeInTheDocument()
  fireEvent.click(screen.getByRole('button', { name: 'Comprar créditos — demostración' }))
  const link = await screen.findByRole('link', { name: /ir a mercado pago de prueba/i })
  expect(link).toHaveAttribute('href', 'https://sandbox.mercadopago.com.ar/checkout')
  expect(creditsApi.checkout).toHaveBeenCalledWith('session')
  expect(screen.queryByText(/pago aprobado/i)).not.toBeInTheDocument()
  expect(screen.getByText('25')).toBeInTheDocument()
})

it('disables purchase when server configuration is unavailable', async () => {
  creditsApi.balance.mockResolvedValue({ ...balance, comprasHabilitadas: false })
  render(<CreditsPanel accessToken="session" />)
  expect(await screen.findByRole('button', { name: 'Comprar créditos — demostración' })).toBeDisabled()
  expect(creditsApi.checkout).not.toHaveBeenCalled()
})

it('refreshes authoritative balance and recovers from checkout errors', async () => {
  creditsApi.checkout.mockRejectedValue(new Error('Checkout no disponible.'))
  render(<CreditsPanel accessToken="session" />)
  await screen.findByText('25')
  fireEvent.click(screen.getByRole('button', { name: 'Comprar créditos — demostración' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Checkout no disponible.')
  expect(screen.getByRole('button', { name: 'Comprar créditos — demostración' })).toBeEnabled()
  creditsApi.balance.mockResolvedValue({ ...balance, saldo: 1025 })
  fireEvent.click(screen.getByRole('button', { name: /actualizar saldo/i }))
  expect(await screen.findByText('1025')).toBeInTheDocument()
})

it('rejects non-sandbox checkout redirects', async () => {
  creditsApi.checkout.mockResolvedValue({ checkoutUrl: 'https://attacker.example' })
  render(<CreditsPanel accessToken="session" />)
  await screen.findByText('25')
  fireEvent.click(screen.getByRole('button', { name: 'Comprar créditos — demostración' }))
  expect(await screen.findByRole('alert')).toHaveTextContent(/no es un entorno de prueba/i)
  expect(screen.queryByRole('link', { name: /ir a mercado pago/i })).not.toBeInTheDocument()
})
