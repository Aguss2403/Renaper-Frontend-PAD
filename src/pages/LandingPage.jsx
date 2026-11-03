import { Icon } from '../components/Icon'

export function LandingPage({ session, onNavigate }) {
  const navigate = (event, page) => { event.preventDefault(); onNavigate(page) }

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="eyebrow"><span className="eyebrow__rule" />Plataforma de integración académica</p>
        <h1 id="hero-title">Validá datos ficticios con <span>reglas claras.</span></h1>
        <p className="hero__description">Una API simple para practicar integraciones de identidad de forma segura, trazable y responsable.</p>
        <div className="hero__actions">
          <a className="button" href={session ? '/cuenta' : '/registro'} onClick={(event) => navigate(event, session ? 'account' : 'register')}>
            {session ? 'Gestionar cuenta' : 'Crear una cuenta'}<Icon name="arrow" />
          </a>
          {session && <a className="hero__docs-link" href="/documentacion" onClick={(event) => navigate(event, 'documentation')}>Ver documentación<Icon name="book" /></a>}
        </div>
        <p className="hero__note"><Icon name="shield" />Solo datos ficticios. Sin consultar registros reales.</p>
      </div>

      <figure className="hero-visual">
        <div className="hero-visual__label"><span />Identidad digital, en un entorno de prueba</div>
        <img className="hero-visual__image" src="/images/identity-validation.webp" alt="Ilustración de una tarjeta de identidad ficticia protegida por un escudo" width="1200" height="800" fetchPriority="high" />
        <figcaption className="validation-preview">
          <span className="validation-preview__icon"><Icon name="check" /></span>
          <div>
            <span className="validation-preview__label">Ejemplo de respuesta</span>
            <strong>Validación completada</strong>
            <ul><li><Icon name="check" />Datos coinciden</li><li><Icon name="check" />Cumple edad mínima</li></ul>
          </div>
        </figcaption>
      </figure>
    </section>
  )
}
