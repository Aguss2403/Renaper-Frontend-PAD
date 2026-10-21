import { useState } from 'react'

const initialValues = { nombreOrganizacion: '', emailContacto: '', password: '' }

function validate(values, isRegistration) {
  if (isRegistration && !values.nombreOrganizacion.trim()) return 'Ingresá el nombre de tu organización.'
  if (!/^\S+@\S+\.\S+$/.test(values.emailContacto)) return 'Ingresá un correo electrónico válido.'
  if (values.password.length < 12) return 'La contraseña debe tener al menos 12 caracteres.'
  return ''
}

export function AuthPage({ mode, onSubmit, onNavigate, notice }) {
  const isRegistration = mode === 'register'
  const [values, setValues] = useState(initialValues)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  async function submit(event) {
    event.preventDefault()
    const validationError = validate(values, isRegistration)
    if (validationError) return setError(validationError)
    setError('')
    setLoading(true)
    try {
      await onSubmit(values)
    } catch (submissionError) {
      setError(submissionError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page" aria-labelledby="auth-title">
      <div className="auth-page__intro">
        <p className="eyebrow">Acceso de organizaciones</p>
        <h1 id="auth-title">{isRegistration ? 'Creá la cuenta de tu equipo.' : 'Ingresá a tu cuenta.'}</h1>
        <p>{isRegistration
          ? 'Registrá una organización para comenzar a configurar su integración.'
          : 'Usá las credenciales de la organización para continuar.'}</p>
      </div>
      <form className="auth-form" onSubmit={submit} noValidate>
        {notice && <p className="form-notice" role="status">{notice}</p>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {isRegistration && <label>Nombre de la organización
          <input name="nombreOrganizacion" value={values.nombreOrganizacion} onChange={update} autoComplete="organization" required maxLength="100" />
        </label>}
        <label>Correo electrónico de contacto
          <input name="emailContacto" type="email" value={values.emailContacto} onChange={update} autoComplete="email" required maxLength="254" />
        </label>
        <label>Contraseña
          <input name="password" type="password" value={values.password} onChange={update} autoComplete={isRegistration ? 'new-password' : 'current-password'} required minLength="12" maxLength="128" />
        </label>
        <button className="button" type="submit" disabled={loading}>
          {loading ? 'Procesando…' : isRegistration ? 'Crear cuenta' : 'Iniciar sesión'}
        </button>
        <p className="form-switch">{isRegistration ? '¿Ya tenés una cuenta?' : '¿Todavía no tenés una cuenta?'}{' '}
          <a href={isRegistration ? '/login' : '/registro'} onClick={(event) => { event.preventDefault(); onNavigate(isRegistration ? 'login' : 'register') }}>
            {isRegistration ? 'Iniciá sesión' : 'Registrate'}
          </a>
        </p>
      </form>
    </section>
  )
}
