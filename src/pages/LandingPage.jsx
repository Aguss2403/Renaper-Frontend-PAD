const capabilities = [
  ['Registro de organización', 'Centralizá el acceso de tu equipo en una cuenta institucional.'],
  ['Credenciales de integración', 'Administrá la clave que utiliza tu backend consumidor.'],
  ['Validación responsable', 'Consultá datos ficticios con reglas claras y trazables.'],
]

export function LandingPage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow">Plataforma de integración académica</p>
          <h1 id="hero-title">Validación de datos, con una base clara para tu equipo.</h1>
          <p className="hero__description">
            Gestioná el acceso de tu organización a un simulador de validación construido
            para prácticas de aplicaciones distribuidas.
          </p>
          <div className="hero__actions">
            <a className="button" href="/registro">Crear una cuenta</a>
            <a className="button button--secondary" href="/login">Iniciar sesión</a>
          </div>
        </div>
        <aside className="hero__panel" aria-label="Alcance de la plataforma">
          <p className="panel-label">Diseñado para equipos</p>
          <p className="panel-value">Una integración, reglas explícitas.</p>
          <p className="panel-detail">
            No es un servicio oficial ni consulta registros reales de RENAPER.
          </p>
        </aside>
      </section>

      <section className="capabilities" aria-labelledby="capabilities-title">
        <div className="section-heading">
          <p className="eyebrow">Acceso ordenado</p>
          <h2 id="capabilities-title">Todo lo necesario para comenzar</h2>
        </div>
        <ul className="capability-grid">
          {capabilities.map(([title, description], index) => (
            <li className="capability-card" key={title}>
              <span className="capability-number" aria-hidden="true">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
