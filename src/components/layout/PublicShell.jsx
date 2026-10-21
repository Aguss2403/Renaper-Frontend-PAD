export function PublicShell({ children }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>
      <header className="site-header">
        <a className="brand" href="/" aria-label="Renaper Validation, inicio">
          <span className="brand-mark" aria-hidden="true">RV</span>
          <span className="brand-name">Renaper Validation</span>
        </a>
        <nav aria-label="Acceso a cuenta">
          <a className="text-link" href="/login">Iniciar sesión</a>
          <a className="button button--compact" href="/registro">Registrarse</a>
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <p>Entorno académico para validaciones sobre datos ficticios.</p>
      </footer>
    </div>
  )
}
