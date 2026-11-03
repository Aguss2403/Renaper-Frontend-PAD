export function PublicShell({ children, session, page, onNavigate, onLogout }) {
  const navigate = (event, destination) => { event.preventDefault(); onNavigate(destination) }
  const showSiteChrome = page === 'home'
  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Saltar al contenido principal</a>
    {showSiteChrome && <header className="site-header">
      <a className="brand" href="/" aria-label="Renaper Validation, inicio" onClick={(event) => navigate(event, 'home')}>
        <span className="brand-mark" aria-hidden="true"><span>R</span><span>V</span></span>
        <span className="brand-name">Renaper Validation</span>
      </a>
      <nav aria-label="Navegación principal">
        <div className="site-header__actions">
          {session ? <><a className="text-link" href="/documentacion" onClick={(event) => navigate(event, 'documentation')}>Documentación de integración</a><a className="text-link" href="/cuenta" onClick={(event) => navigate(event, 'account')}>Gestionar cuenta</a><button className="text-button" type="button" onClick={onLogout}>Cerrar sesión</button></> : <><a className="text-link" href="/login" onClick={(event) => navigate(event, 'login')}>Iniciar sesión</a><a className="button button--compact" href="/registro" onClick={(event) => navigate(event, 'register')}>Crear cuenta</a></>}
        </div>
      </nav>
    </header>}
    <main id="main-content">{children}</main>
    {showSiteChrome && <footer className="site-footer"><div><a className="brand brand--footer" href="/" onClick={(event) => navigate(event, 'home')}><span className="brand-mark" aria-hidden="true">RV</span><span className="brand-name">Renaper Validation</span></a><p>Entorno académico para validaciones sobre datos ficticios.</p></div><p>Proyecto educativo · No es un servicio oficial de RENAPER.</p></footer>}
  </div>
}

