import { Icon } from '../Icon'

export function PublicShell({ children, session, page, onNavigate, onLogout }) {
  const navigate = (event, destination) => { event.preventDefault(); onNavigate(destination) }
  const showSiteChrome = page === 'home' || page === 'account' || page === 'documentation'

  return <div className={`app-shell app-shell--${page}`}>
    <a className="skip-link" href="#main-content">Saltar al contenido principal</a>
    {showSiteChrome && <header className="site-header">
      <a className="brand" href="/" aria-label="Renaper Validation, inicio" onClick={(event) => navigate(event, 'home')}>
        <span className="brand-mark" aria-hidden="true">RV<span /></span>
        <span className="brand-name">Renaper<span>Validation</span></span>
      </a>
      <nav aria-label="Navegación principal" className="site-header__actions">
        {session ? <>
          <a className="text-link" href="/documentacion" aria-current={page === 'documentation' ? 'page' : undefined} onClick={(event) => navigate(event, 'documentation')}>Documentación</a>
          {page === 'account' ? <a className="text-link" href="/" onClick={(event) => navigate(event, 'home')}>Inicio</a> : <a className="button button--compact" href="/cuenta" onClick={(event) => navigate(event, 'account')}>Gestionar cuenta<Icon name="arrow" /></a>}
          <button className="text-button header-logout" type="button" onClick={onLogout}><Icon name="logout" /><span>Cerrar sesión</span></button>
        </> : <>
          <a className="text-link" href="/documentacion" aria-current={page === 'documentation' ? 'page' : undefined} onClick={(event) => navigate(event, 'documentation')}>Documentación</a>
          <a className="text-link" href="/login" onClick={(event) => navigate(event, 'login')}>Iniciar sesión</a>
          <a className="button button--compact" href="/registro" onClick={(event) => navigate(event, 'register')}>Crear cuenta<Icon name="arrow" /></a>
        </>}
      </nav>
    </header>}
    <main id="main-content" tabIndex="-1">{children}</main>
    {showSiteChrome && <footer className="site-footer">
      <p><span className="footer-dot" />Entorno académico · Datos ficticios</p>
      <p>No es un servicio oficial de RENAPER.</p>
    </footer>}
  </div>
}
