const capabilities = [
  { icon: 'team', title: 'Registro de organización', description: 'Centralizá el acceso de tu equipo en una cuenta institucional.' },
  { icon: 'lock', title: 'Credenciales seguras', description: 'Administrá una clave de integración para tus consultas de prueba.' },
  { icon: 'check', title: 'Validación responsable', description: 'Practicá con datos ficticios y reglas claras, sin exponer información real.' },
]
export function LandingPage({ session, onNavigate }) {
  const navigate = (event, page) => { event.preventDefault(); onNavigate(page) }
  return <>
    <section className="hero" id="producto" aria-labelledby="hero-title">
      <div className="hero__copy"><p className="eyebrow">Plataforma de integración académica</p><h1 id="hero-title">Validá datos ficticios con <span>reglas claras.</span></h1><p className="hero__description">Una API simple para practicar integraciones de identidad de forma segura, trazable y responsable.</p><div className="hero__actions">{session ? <a className="button" href="/cuenta" onClick={(event) => navigate(event, 'account')}>Gestionar cuenta <span aria-hidden="true">→</span></a> : <><a className="button" href="/registro" onClick={(event) => navigate(event, 'register')}>Crear una cuenta <span aria-hidden="true">→</span></a><a className="button button--secondary" href="#como-funciona">Ver cómo funciona <span aria-hidden="true">↓</span></a></>}</div></div>
      <aside className="validation-preview" aria-label="Ejemplo visual de una validación completada"><div className="validation-preview__avatar" aria-hidden="true"><span className="validation-preview__head"/><span className="validation-preview__body"/><span className="validation-preview__badge">✓</span></div><h2>Validación completada</h2><ul><li><span aria-hidden="true">✓</span>Datos coinciden</li><li><span aria-hidden="true">✓</span>Cumple edad mínima</li></ul></aside>
    </section>
    <section className="capabilities" id="como-funciona" aria-labelledby="capabilities-title"><div className="section-heading"><p className="eyebrow">Todo en un mismo lugar</p><h2 id="capabilities-title">Prepará una integración en pocos pasos</h2><p>Una experiencia ordenada para registrar tu organización, gestionar el acceso y comprobar resultados.</p></div><ul className="capability-grid">{capabilities.map(({ icon, title, description }, index) => <li className="capability-card" key={title}><span className={`capability-icon capability-icon--${icon}`} aria-hidden="true">{index === 0 ? '●●●' : index === 1 ? '▣' : '✓'}</span><span className="capability-number" aria-hidden="true">0{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}</ul></section>
    <section className="academic-note" id="seguridad"><span className="academic-note__icon" aria-hidden="true">i</span><div><h2>Simulador académico</h2><p>No consulta registros reales de RENAPER. Todos los datos utilizados en este entorno son ficticios y tienen fines educativos.</p></div></section>
  </>
}

