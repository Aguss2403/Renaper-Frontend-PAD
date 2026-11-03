import { useEffect, useState } from 'react'
import { Icon } from '../components/Icon'
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

export function AccountPage({ session, onSessionProfile, onNavigate }) {
  const [profile, setProfile] = useState(session.profile)
  const [apiKeyStatus, setApiKeyStatus] = useState(null)
  const [generatedKey, setGeneratedKey] = useState('')
  const [keyError, setKeyError] = useState('')
  const [copyNotice, setCopyNotice] = useState('')
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
    setCopyNotice('')
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
    setCopyNotice('')
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

  async function copyKey() {
    try {
      await navigator.clipboard.writeText(generatedKey)
      setCopyNotice('API key copiada.')
    } catch {
      setCopyNotice('No se pudo copiar. Seleccioná la clave para copiarla manualmente.')
    }
  }

  function updateValidation(event) {
    setValidationResult(null)
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
        <div>
          <p className="eyebrow">Tu espacio de trabajo</p>
          <h1 id="account-title">Gestionar cuenta</h1>
          <p>Tu organización, tus credenciales y tus consultas de prueba.</p>
        </div>
        <img src="/images/account-profile.webp" alt="" width="640" height="427" className="account-page__image" />
      </div>

      <div className="account-grid">
        <section className="account-card profile-card" aria-labelledby="profile-title">
          <div className="card-heading">
            <span className="card-icon"><Icon name="building" /></span>
            <div><p className="section-label">Organización</p><h2 id="profile-title">Datos de perfil</h2></div>
          </div>
          <dl className="profile-list">
            <div><dt>Organización</dt><dd>{profile?.nombreOrganizacion || 'Cargando…'}</dd></div>
            <div><dt>Correo de contacto</dt><dd>{profile?.emailContacto || 'Cargando…'}</dd></div>
            <div><dt>Cuenta creada</dt><dd>{formatDate(profile?.fechaCreacionUtc)}</dd></div>
          </dl>
          <p className="profile-card__note"><Icon name="shield" />Cuenta de organización</p>
        </section>

        <section className="account-card key-card" aria-labelledby="key-title" aria-busy={keyLoading}>
          <div className="card-heading">
            <span className="card-icon"><Icon name="key" /></span>
            <div><p className="section-label">Credenciales de integración</p><h2 id="key-title">API key</h2></div>
            {!keyLoading && !keyError && <span className={`status-badge ${apiKeyStatus?.activa ? 'status-badge--success' : ''}`}><span />{apiKeyStatus ? apiKeyStatus.activa ? 'Activa' : 'Revocada' : 'Sin generar'}</span>}
          </div>
          {keyError && <p className="form-error" role="alert">{keyError}</p>}
          {keyLoading ? <p className="account-muted key-loading" role="status"><span className="loading-dot" />Actualizando credenciales…</p> : apiKeyStatus ? <>
            <p className="account-muted">Usá esta credencial para conectar tu aplicación con el entorno de prueba.</p>
            <dl className="key-metadata">
              <div><dt>Prefijo de la clave</dt><dd><code>{apiKeyStatus.prefijo}</code></dd></div>
              <div><dt>Fecha de generación</dt><dd>{formatDate(apiKeyStatus.fechaCreacionUtc)}</dd></div>
            </dl>
            <div className="inline-actions">
              <button className="button button--secondary button--compact" type="button" onClick={generateKey}><Icon name="key" />{apiKeyStatus.activa ? 'Rotar API key' : 'Crear nueva API key'}</button>
              {apiKeyStatus.activa && <button className="text-button text-button--danger" type="button" onClick={revokeKey}>Revocar API key</button>}
            </div>
            {apiKeyStatus.activa && <p className="field-hint">Al rotar la clave, la anterior dejará de funcionar.</p>}
          </> : <div className="key-empty">
            <p className="account-muted">Todavía no tenés una API key. Generá la primera para empezar a integrar y realizar consultas.</p>
            <button className="button button--compact" type="button" onClick={generateKey}><Icon name="key" />Crear API key</button>
          </div>}
          {generatedKey && <div className="generated-key">
            <strong>Guardá esta API key ahora.</strong>
            <div className="generated-key__value"><code>{generatedKey}</code><button type="button" className="button button--secondary button--compact" onClick={copyKey}><Icon name="copy" />Copiar</button></div>
            <p>Solo se muestra una vez. Al salir de esta pantalla no podrás volver a verla.</p>
            <p className="copy-notice" role="status">{copyNotice}</p>
          </div>}
        </section>

        <section className="account-card account-card--wide validation-card" aria-labelledby="validation-title">
          <div className="validation-card__heading">
            <div className="card-heading">
              <span className="card-icon"><Icon name="scan" /></span>
              <div><p className="section-label">Consulta de prueba</p><h2 id="validation-title">Validar una persona ficticia</h2></div>
            </div>
            <a className="text-link documentation-link" href="/documentacion" onClick={(event) => { event.preventDefault(); onNavigate('documentation') }}><Icon name="book" />Ver documentación<Icon name="arrow" /></a>
          </div>
          <div className="validation-workspace">
            <form className="validation-form" onSubmit={submitValidation} noValidate aria-busy={validationLoading}>
              <p className="validation-form__intro account-muted">Completá los datos de prueba y elegí la edad mínima a comprobar.</p>
              {validationErrorMessage && <p className="form-error" role="alert">{validationErrorMessage}</p>}
              <label>DNI<input name="dni" inputMode="numeric" placeholder="Ej. 12345678" value={validationValues.dni} onChange={updateValidation} required /></label>
              <label>Edad mínima<input name="edadMinima" inputMode="numeric" value={validationValues.edadMinima} onChange={updateValidation} required /></label>
              <label>Nombres completos<input name="nombre" placeholder="Nombres de prueba" value={validationValues.nombre} onChange={updateValidation} maxLength="100" required /></label>
              <label>Apellido<input name="apellido" placeholder="Apellido de prueba" value={validationValues.apellido} onChange={updateValidation} maxLength="100" required /></label>
              <label className="validation-form__key">API key de prueba<input name="apiKey" type="password" autoComplete="off" placeholder="Ingresá tu API key" value={validationValues.apiKey} onChange={updateValidation} required /><span className="field-hint">La clave se usa únicamente para enviar esta consulta.</span></label>
              <label className="consent"><input name="acceptsBrowserKeyRisk" type="checkbox" checked={validationValues.acceptsBrowserKeyRisk} onChange={updateValidation} /><span>Entiendo que esta API key se envía desde este navegador solo para la práctica académica. No la guardaré ni la usaré en producción.</span></label>
              <button className="button validation-form__submit" type="submit" disabled={validationLoading}><Icon name="scan" />{validationLoading ? 'Validando…' : 'Validar datos'}<Icon name="arrow" /></button>
            </form>
            <aside className="validation-result" aria-labelledby="result-title" aria-live="polite" aria-atomic="true">
              <p className="section-label">Resultado de la consulta</p>
              {validationLoading ? <div className="validation-result__empty"><span className="result-icon"><Icon name="clock" /></span><h3 id="result-title">Validando datos…</h3><p>Estamos comprobando la información de prueba.</p></div> : validationResult ? <>
                <span className={`result-icon ${validationResult.datosCoinciden && validationResult.cumpleEdadMinima ? 'result-icon--success' : 'result-icon--warning'}`}><Icon name={validationResult.datosCoinciden && validationResult.cumpleEdadMinima ? 'check' : 'info'} /></span>
                <h3 id="result-title">Consulta completada</h3>
                <ul className="result-checks">
                  <li><span>Datos coinciden</span><strong className={validationResult.datosCoinciden ? 'result-yes' : 'result-no'}><Icon name={validationResult.datosCoinciden ? 'check' : 'close'} />{validationResult.datosCoinciden ? 'Sí' : 'No'}</strong></li>
                  <li><span>Cumple edad mínima</span><strong className={validationResult.cumpleEdadMinima ? 'result-yes' : 'result-no'}><Icon name={validationResult.cumpleEdadMinima ? 'check' : 'close'} />{validationResult.cumpleEdadMinima ? 'Sí' : 'No'}</strong></li>
                </ul>
                <p>Ambas condiciones deben cumplirse para aceptar el registro.</p>
              </> : <div className="validation-result__empty"><span className="result-icon"><Icon name={validationErrorMessage ? 'info' : 'scan'} /></span><h3 id="result-title">{validationErrorMessage ? 'No se completó la consulta' : 'Tu resultado aparecerá acá'}</h3><p>{validationErrorMessage ? 'Revisá el mensaje del formulario e intentá nuevamente.' : 'Vas a poder ver si los datos coinciden y si se cumple la edad mínima.'}</p></div>}
              <p className="validation-result__note"><Icon name="shield" />Solo se consultan datos ficticios.</p>
            </aside>
          </div>
        </section>

        <section className="credits-note" aria-labelledby="credits-title">
          <span className="card-icon"><Icon name="clock" /></span>
          <div><h2 id="credits-title">Créditos <span className="status-badge">Próximamente</span></h2><p>La compra de créditos y la integración con billetera todavía no están disponibles.</p></div>
          <button className="button button--secondary button--compact" type="button" disabled>Comprar créditos</button>
        </section>
      </div>
    </section>
  )
}
