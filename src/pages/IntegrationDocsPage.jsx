export function IntegrationDocsPage({ onNavigate }) {
  return <section className="integration-docs" aria-labelledby="integration-docs-title">
    <button className="text-button integration-docs__back" type="button" onClick={() => onNavigate('home')}>← Volver al inicio</button>
    <p className="eyebrow">Documentación de integración</p>
    <h1 id="integration-docs-title">Implementá Renaper Validation en tu backend.</h1>
    <p className="integration-docs__lead">Tu grupo administra la cuenta y la API key desde esta plataforma. La integración de su sistema usa únicamente esa clave para validar personas ficticias.</p>

    <ol className="integration-docs__steps">
      <li><strong>Generá una API key.</strong><span>Desde Gestionar cuenta, creala y guardala de inmediato: la clave completa se muestra una sola vez.</span></li>
      <li><strong>Guardala en el servidor.</strong><span>Usá una variable privada como <code>RENAPER_API_KEY</code>. Nunca la expongas en el frontend, una app móvil, logs o Git.</span></li>
      <li><strong>Consultá desde tu backend.</strong><span>Enviá <code>X-API-Key</code> al endpoint de validación y aceptá solo si ambas comprobaciones son verdaderas.</span></li>
    </ol>

    <section className="integration-docs__notice" aria-labelledby="purchase-guide-title">
      <h2 id="purchase-guide-title">Comprar créditos de demostración</h2>
      <p>Desde Gestionar cuenta, seleccioná Comprar créditos — demostración. El paquete incluye <strong>1.000 consultas por ARS 1.000 ficticios</strong>. Abrí el checkout en una ventana privada usando una cuenta compradora de prueba, distinta de la vendedora. Pedí al equipo proveedor los datos de acceso de prueba por un canal privado.</p>
      <p><strong>No uses tu cuenta de Mercado Pago ni tarjetas reales.</strong> Estos datos públicos sirven únicamente para el checkout de prueba:</p>
      <dl><dt>Mastercard de prueba</dt><dd><code>5031 7557 3453 0604</code></dd><dt>Código de seguridad</dt><dd>123</dd><dt>Vencimiento</dt><dd>11/30</dd><dt>Titular para aprobar</dt><dd>APRO</dd><dt>DNI de prueba</dt><dd>12345678</dd></dl>
      <p>Para simular un rechazo usá el titular <code>OTHE</code>; para un pago pendiente, <code>CONT</code>. Ninguno acredita saldo hasta que el proveedor informe aprobación.</p>
      <p>Al volver, pulsá Actualizar saldo. El retorno del checkout no prueba que el pago esté aprobado: el servidor verifica la notificación y acredita una sola vez.</p>
      <p>Cada validación procesada descuenta una consulta, aun si los datos no coinciden o no existe el DNI. Los errores no descuentan. Si recibís <code>402 Saldo insuficiente</code>, comprá otro paquete desde esta web.</p>
      <a href="https://www.mercadopago.com.ar/developers/es/docs/checkout-pro-preferences/integration-test/test-purchases" target="_blank" rel="noreferrer">Consultar tarjetas y escenarios oficiales de Mercado Pago</a>
    </section>

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
