export function IntegrationDocsPage({ onNavigate }) {
  return <section className="integration-docs" aria-labelledby="integration-docs-title">
    <button className="text-button integration-docs__back" type="button" onClick={() => onNavigate('account')}>← Volver a mi cuenta</button>
    <p className="eyebrow">Documentación de integración</p>
    <h1 id="integration-docs-title">Implementá Renaper Validation en tu backend.</h1>
    <p className="integration-docs__lead">Tu grupo administra la cuenta y la API key desde esta plataforma. La integración de su sistema usa únicamente esa clave para validar personas ficticias.</p>

    <ol className="integration-docs__steps">
      <li><strong>Generá una API key.</strong><span>Desde Gestionar cuenta, creala y guardala de inmediato: la clave completa se muestra una sola vez.</span></li>
      <li><strong>Guardala en el servidor.</strong><span>Usá una variable privada como <code>RENAPER_API_KEY</code>. Nunca la expongas en el frontend, una app móvil, logs o Git.</span></li>
      <li><strong>Consultá desde tu backend.</strong><span>Enviá <code>X-API-Key</code> al endpoint de validación y aceptá solo si ambas comprobaciones son verdaderas.</span></li>
    </ol>

    <section className="integration-docs__card" aria-labelledby="request-title">
      <h2 id="request-title">Solicitud de validación</h2>
      <pre><code>{`POST https://146.181.31.154.nip.io/api/v1/personas/validar
Content-Type: application/json
X-API-Key: rnp_test_TU_CLAVE_SECRETA

{
  "dni": 40111222,
  "nombre": "Lucas Matias",
  "apellido": "Gomez",
  "edadMinima": 18
}`}</code></pre>
      <p>La respuesta devuelve <code>datosCoinciden</code> y <code>cumpleEdadMinima</code>. El registro solo debe aceptarse cuando los dos valores sean <code>true</code>.</p>
    </section>

    <aside className="integration-docs__notice"><strong>Importante:</strong> este es un simulador académico con datos ficticios. No acredita identidad, titularidad, vigencia documental ni estado vital.</aside>
  </section>
}
