import { useEffect, useState } from 'react'
import { ApiError, apiKeyApi, authApi, personApi } from '../services/authApi'

const initialValidation = { dni: '', nombre: '', apellido: '', edadMinima: '18', apiKey: '', acceptsBrowserKeyRisk: false }

function formatDate(value) {
  return value ? new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'No disponible'
}

function validationError(values) {
  if (!/^\d+$/.test(values.dni) || Number(values.dni) < 1) return 'Ingresá un DNI positivo.'
  if (!values.nombre.trim() || values.nombre.trim().length > 100) return 'Ingresá los nombres completos (hasta 100 caracteres).'
  if (!values.apellido.trim() || values.apellido.trim().length > 100) return 'Ingresá el apellido (hasta 100 caracteres).'
  if (!/^\d+$/.test(values.edadMinima) || Number(values.edadMinima) > 120) return 'La edad mínima debe estar entre 0 y 120.'
  if (!values.apiKey.trim()) return 'Ingresá una API key para validar.'
  if (!values.acceptsBrowserKeyRisk) return 'Confirmá el uso de la API key en este navegador académico.'
  return ''
}

export function AccountPage({ session, onSessionProfile }) {
  const [profile, setProfile] = useState(session.profile)
  const [apiKeyStatus, setApiKeyStatus] = useState(null)
  const [generatedKey, setGeneratedKey] = useState('')
  const [keyError, setKeyError] = useState('')
  const [keyLoading, setKeyLoading] = useState(true)
  const [validationValues, setValidationValues] = useState(initialValidation)
  const [validationResult, setValidationResult] = useState(null)
  const [validationErrorMessage, setValidationErrorMessage] = useState('')
  const [validationLoading, setValidationLoading] = useState(false)

  useEffect(() => {
    let active = true
    authApi.me(session.accessToken)
      .then((nextProfile) => {
        if (!active) return
        setProfile(nextProfile)
        onSessionProfile(nextProfile)
      })
      .catch(() => active && setKeyError('No fue posible actualizar los datos de la cuenta. Intentá nuevamente.'))
    apiKeyApi.status(session.accessToken)
      .then((status) => active && setApiKeyStatus(status))
      .catch((error) => {
        if (!active) return
        if (error instanceof ApiError && error.status === 404) setApiKeyStatus(null)
        else setKeyError('No fue posible consultar el estado de la API key. Intentá nuevamente.')
      })
      .finally(() => active && setKeyLoading(false))
    return () => { active = false }
  }, [session.accessToken, onSessionProfile])

  async function generateKey() {
    setKeyError('')
    setGeneratedKey('')
    setKeyLoading(true)
    try {
      const created = await apiKeyApi.generate(session.accessToken)
      setApiKeyStatus(created.metadata)
      setGeneratedKey(created.apiKey)
    } catch {
      setKeyError('No fue posible generar la API key. Intentá nuevamente.')
    } finally {
      setKeyLoading(false)
    }
  }

  async function revokeKey() {
    setKeyError('')
    setGeneratedKey('')
    setKeyLoading(true)
    try {
      await apiKeyApi.revoke(session.accessToken)
      setApiKeyStatus((current) => current ? { ...current, activa: false } : null)
    } catch {
      setKeyError('No fue posible revocar la API key. Intentá nuevamente.')
    } finally {
      setKeyLoading(false)
    }
  }

  function updateValidation(event) {
    const { name, type, checked, value } = event.target
    setValidationValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function submitValidation(event) {
    event.preventDefault()
    const error = validationError(validationValues)
    if (error) return setValidationErrorMessage(error)
    setValidationErrorMessage('')
    setValidationResult(null)
    setValidationLoading(true)
    try {
      const result = await personApi.validate(validationValues.apiKey.trim(), {
        dni: Number(validationValues.dni),
        nombre: validationValues.nombre.trim(),
        apellido: validationValues.apellido.trim(),
        edadMinima: Number(validationValues.edadMinima),
      })
      setValidationResult(result)
    } catch (errorResponse) {
      setValidationErrorMessage(errorResponse.message || 'No fue posible validar los datos. Intentá nuevamente.')
    } finally {
      setValidationLoading(false)
    }
  }

  return (
    <section className="account-page" aria-labelledby="account-title">
      <div className="account-page__intro">
        <p className="eyebrow">Área autenticada</p>
        <h1 id="account-title">Gestioná la cuenta de tu organización.</h1>
        <p>Administrá las credenciales de integración y realizá consultas de prueba sobre datos ficticios.</p>
      </div>

      <div className="account-grid">
        <section className="account-card" aria-labelledby="profile-title">
          <p className="section-label">Cuenta</p>
          <h2 id="profile-title">Datos de perfil</h2>
          <dl className="profile-list">
            <div><dt>Organización</dt><dd>{profile?.nombreOrganizacion || 'Cargando…'}</dd></div>
            <div><dt>Correo de contacto</dt><dd>{profile?.emailContacto || 'Cargando…'}</dd></div>
            <div><dt>Cuenta creada</dt><dd>{formatDate(profile?.fechaCreacionUtc)}</dd></div>
          </dl>
        </section>

        <section className="account-card" aria-labelledby="key-title">
          <p className="section-label">Integración</p>
          <h2 id="key-title">API key</h2>
          {keyError && <p className="form-error" role="alert">{keyError}</p>}
          {keyLoading ? <p className="account-muted">Consultando estado…</p> : apiKeyStatus ? <>
            <dl className="profile-list profile-list--compact">
              <div><dt>Prefijo</dt><dd>{apiKeyStatus.prefijo}</dd></div>
              <div><dt>Estado</dt><dd>{apiKeyStatus.activa ? 'Activa' : 'Revocada'}</dd></div>
              <div><dt>Generada</dt><dd>{formatDate(apiKeyStatus.fechaCreacionUtc)}</dd></div>
            </dl>
            <div className="inline-actions">
              <button className="button button--secondary" type="button" onClick={generateKey}>Rotar API key</button>
              <button className="text-button text-button--danger" type="button" onClick={revokeKey}>Revocar API key</button>
            </div>
          </> : <>
            <p className="account-muted">Todavía no generaste una API key para esta organización.</p>
            <button className="button" type="button" onClick={generateKey}>Crear API key</button>
          </>}
          {generatedKey && <div className="generated-key" role="status">
            <strong>Guardá esta API key ahora.</strong>
            <code>{generatedKey}</code>
            <p>Por seguridad, no se podrá volver a mostrar después de salir de esta pantalla.</p>
          </div>}
        </section>

        <section className="account-card account-card--wide" aria-labelledby="validation-title">
          <p className="section-label">Consulta de prueba</p>
          <h2 id="validation-title">Validar una persona ficticia</h2>
          <p className="account-muted">POST <code>/api/v1/personas/validar</code> requiere <code>X-API-Key</code>. Los dos resultados son independientes; para aceptar un registro, ambos deben ser verdaderos.</p>
          <form className="validation-form" onSubmit={submitValidation} noValidate>
            {validationErrorMessage && <p className="form-error" role="alert">{validationErrorMessage}</p>}
            {validationResult && <p className="form-notice" role="status">Datos coinciden: <strong>{validationResult.datosCoinciden ? 'sí' : 'no'}</strong>. Cumple edad mínima: <strong>{validationResult.cumpleEdadMinima ? 'sí' : 'no'}</strong>.</p>}
            <label>DNI<input name="dni" inputMode="numeric" value={validationValues.dni} onChange={updateValidation} required /></label>
            <label>Nombres completos<input name="nombre" value={validationValues.nombre} onChange={updateValidation} maxLength="100" required /></label>
            <label>Apellido<input name="apellido" value={validationValues.apellido} onChange={updateValidation} maxLength="100" required /></label>
            <label>Edad mínima<input name="edadMinima" inputMode="numeric" value={validationValues.edadMinima} onChange={updateValidation} required /></label>
            <label className="validation-form__key">API key de prueba<input name="apiKey" type="password" autoComplete="off" value={validationValues.apiKey} onChange={updateValidation} required /></label>
            <label className="consent"><input name="acceptsBrowserKeyRisk" type="checkbox" checked={validationValues.acceptsBrowserKeyRisk} onChange={updateValidation} /> Entiendo que esta API key se envía desde este navegador solo para la práctica académica. No la guardaré ni la usaré en producción.</label>
            <button className="button" type="submit" disabled={validationLoading}>{validationLoading ? 'Validando…' : 'Validar datos'}</button>
          </form>
        </section>

        <section className="account-card" aria-labelledby="credits-title">
          <p className="section-label">Próximamente</p>
          <h2 id="credits-title">Créditos</h2>
          <p className="account-muted">Los créditos, el saldo y la integración con billetera todavía están pendientes. No hay compras ni cobros disponibles.</p>
          <button className="button" type="button" disabled aria-describedby="credits-note">Comprar créditos (próximamente)</button>
          <p id="credits-note" className="visually-hidden">La compra de créditos no está disponible todavía.</p>
        </section>
      </div>
    </section>
  )
}
