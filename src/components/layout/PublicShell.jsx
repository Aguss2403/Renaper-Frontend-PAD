export function PublicShell({ children, session, onNavigate, onLogout }) {
  const navigate = (event, page) => {
    event.preventDefault()
    onNavigate(page)
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Renaper Validation, inicio" onClick={(event) => navigate(event, 'home')}>
          <span className="brand-mark" aria-hidden="true">RV</span>
          <span className="brand-name">Renaper Validation</span>
        </a>
        <nav aria-label="Acceso a cuenta">
          {session ? <>
            <a className="text-link" href="/cuenta" onClick={(event) => navigate(event, 'home')}>Gestionar cuenta</a>
            <button className="text-button" type="button" onClick={onLogout}>Cerrar sesión</button>
          </> : <>
            <a className="text-link" href="/login" onClick={(event) => navigate(event, 'login')}>Iniciar sesión</a>
            <a className="button button--compact" href="/registro" onClick={(event) => navigate(event, 'register')}>Registrarse</a>
          </>}
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <p>Entorno académico para validaciones sobre datos ficticios.</p>
      </footer>
    </div>
  )
}
