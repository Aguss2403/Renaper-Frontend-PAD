import { useCallback, useEffect, useState } from 'react'
import { creditsApi } from '../services/authApi'

function isSandbox(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password && !url.port
      && ['sandbox.mercadopago.com.ar', 'sandbox.mercadopago.com'].includes(url.hostname)
  } catch { return false }
}

export function CreditsPanel({ accessToken, refreshKey = 0 }) {
  const [balance, setBalance] = useState(null)
  const [error, setError] = useState('')
  const [checkoutUrl, setCheckoutUrl] = useState('')
  const [buying, setBuying] = useState(false)
  const [loading, setLoading] = useState(true)
  const [revision, setRevision] = useState(0)

  const refresh = useCallback(() => setRevision(value => value + 1), [])
  useEffect(() => {
    let active = true
    setLoading(true)
    creditsApi.balance(accessToken)
      .then(value => { if (active) { setBalance(value); setError('') } })
      .catch(() => { if (active) { setBalance(null); setError('No se pudo consultar el saldo. Intentá actualizarlo.') } })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [accessToken, refreshKey, revision])

  async function purchase() {
    setError('')
    setCheckoutUrl('')
    setBuying(true)
    try {
      const checkout = await creditsApi.checkout(accessToken)
      if (!isSandbox(checkout.checkoutUrl)) throw new Error('El checkout recibido no es un entorno de prueba válido.')
      setCheckoutUrl(checkout.checkoutUrl)
    } catch (failure) {
      setError(failure.message || 'No se pudo iniciar el checkout.')
    } finally { setBuying(false) }
  }

  return <section className="credit-panel" aria-labelledby="credits-title">
    <div className="credit-panel__heading"><h2 id="credits-title">Créditos</h2></div>
    <p>Saldo disponible: <strong aria-live="polite">{loading ? 'Consultando…' : balance?.saldo ?? 'No disponible'}</strong> consultas.</p>
    <p>Paquete: {balance?.paquete.consultas ?? 1000} consultas por ARS {balance?.paquete.precio ?? 1000}. Cada validación procesada consume una consulta, aunque los datos no coincidan. Los errores no descuentan.</p>
    <p>Consultá los datos de pago en la documentación antes de continuar.</p>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="credit-panel__actions">
      <button className="button" type="button" disabled={loading || buying || !balance?.comprasHabilitadas} onClick={purchase}>{buying ? 'Preparando checkout…' : 'Comprar créditos'}</button>
      <button className="text-button" type="button" disabled={loading} onClick={refresh}>Actualizar saldo</button>
    </div>
    {balance && !balance.comprasHabilitadas && <p>El equipo proveedor todavía no habilitó las compras.</p>}
    {checkoutUrl && <p role="status"><a className="button mercado-pago-button" href={checkoutUrl}>Pagar con Mercado Pago</a></p>}
    <p className="credit-panel__note">Al volver del checkout, actualizá el saldo. Solo se acredita cuando nuestro servidor confirma el pago con Mercado Pago; la página de retorno no confirma la compra.</p>
  </section>
}
