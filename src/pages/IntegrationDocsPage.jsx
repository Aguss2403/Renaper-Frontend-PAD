import { useEffect, useState } from 'react'

const sections = [
  ['primeros-pasos', 'Primeros pasos'],
  ['acceso', 'Registrarse e iniciar sesión'],
  ['creditos', 'Comprar créditos'],
  ['api-key', 'Obtener tu API key'],
  ['integracion', 'Integrar la validación'],
  ['resultados', 'Interpretar los resultados'],
  ['errores', 'Errores y soluciones'],
]

function GuideImage({ file, alt, portrait = false }) {
  return <figure className={`docs-image${portrait ? ' docs-image--portrait' : ''}`}><img src={`/images/documentation/${file}`} alt={alt} loading="lazy" /><figcaption>{alt}</figcaption></figure>
}

function Table({ caption, headers, rows }) {
  return <div className="docs-table-wrap"><table><caption>{caption}</caption><thead><tr>{headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>
}

export function IntegrationDocsPage() {
  const [activeSection, setActiveSection] = useState(sections[0][0])
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined
    const headings = sections.map(([id]) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin: '-18% 0px -68% 0px', threshold: 0 })
    headings.forEach(heading => observer.observe(heading))
    return () => observer.disconnect()
  }, [])

  return <section className="documentation-page" aria-labelledby="documentation-title">
    <aside className="documentation-sidebar"><a className="documentation-sidebar__brand" href="#primeros-pasos">Renaper <span>Validation</span></a><nav aria-label="Contenido de la documentación"><p>En esta guía</p><ol>{sections.map(([id, label], index) => <li key={id}><a href={`#${id}`} aria-current={activeSection === id ? 'location' : undefined}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{label}</a></li>)}</ol></nav></aside>
    <article className="documentation-content">
      <header className="documentation-hero" id="primeros-pasos" data-doc-section>
        <p className="eyebrow">Renaper Validation</p><h1 id="documentation-title">Documentación</h1>
        <p>Todo lo necesario para crear una cuenta, comprar créditos, generar una API key e integrar validaciones de personas ficticias desde tu backend.</p>
        <div className="documentation-hero__notice"><strong>Entorno académico.</strong> El sistema usa datos ficticios y no acredita identidad, titularidad, vigencia documental ni estado vital.</div>
      </header>

      <section id="acceso" data-doc-section><p className="docs-section-label">01 · Acceso</p><h2>Registrarse e iniciar sesión</h2><p>Para crear una cuenta, prepará el nombre de tu organización, un correo de contacto y una contraseña de al menos 12 caracteres.</p>
        <h3>Elegí cómo acceder</h3><p>En el inicio encontrás <strong>Iniciar sesión</strong> y <strong>Crear cuenta</strong>. Si tu organización ya tiene una cuenta, usá sus credenciales existentes.</p><GuideImage file="01-inicio.png" alt="Página de inicio con las opciones Iniciar sesión y Crear cuenta." />
        <h3>Crear una cuenta</h3><Table caption="Datos solicitados al registrarte" headers={['Campo', 'Qué ingresar']} rows={[[<strong>Nombre de la organización</strong>, 'El nombre de tu organización o equipo.'], [<strong>Correo electrónico de contacto</strong>, 'El correo que usarás para iniciar sesión.'], [<strong>Contraseña</strong>, 'Una contraseña de al menos 12 caracteres.']]} /><GuideImage file="02-crear-cuenta.png" alt="Formulario Crear una cuenta con los campos requeridos." />
        <h3>Ingresar con una cuenta existente</h3><p>Ingresá el correo utilizado en el registro, escribí la contraseña y pulsá <strong>Iniciar sesión</strong>. El correo y la contraseña administran la plataforma; tu backend usa una API key distinta.</p><GuideImage file="03-iniciar-sesion.png" alt="Formulario de inicio de sesión de Renaper Validation." />
      </section>

      <section id="creditos" data-doc-section><p className="docs-section-label">02 · Créditos</p><h2>Comprar créditos</h2><p>El paquete incluye <strong>1.000 consultas por ARS 1.000</strong>. Cada validación procesada consume una consulta, incluso si los datos no coinciden o el DNI no existe. Los errores no descuentan saldo.</p>
        <div className="docs-callout"><strong>Antes de pagar.</strong> Usá exclusivamente la cuenta compradora tester y las tarjetas indicadas por el equipo. No uses cuentas ni tarjetas personales.</div>
        <h3>Entrá en Gestionar cuenta</h3><p>Después de iniciar sesión, seleccioná <strong>Gestionar cuenta</strong> desde el inicio.</p><GuideImage file="04-gestionar-cuenta.png" alt="Página de inicio con el acceso Gestionar cuenta." />
        <h3>Prepará el checkout</h3><p>En la sección <strong>Créditos</strong>, consultá el saldo y pulsá <strong>Comprar créditos</strong>. Luego se mostrará <strong>Pagar con Mercado Pago</strong>.</p><GuideImage file="05-comprar-creditos.png" alt="Sección Créditos con el botón Comprar créditos." portrait /><GuideImage file="06-pagar-con-mercado-pago.png" alt="Opción Pagar con Mercado Pago visible tras preparar el checkout." />
        <h3>Accedé con la cuenta tester</h3><p>En Mercado Pago, ingresá con el usuario tester proporcionado para este entorno. Si aparece una cuenta personal, cambiala antes de pagar.</p><GuideImage file="07-acceso-tester.png" alt="Acceso de Mercado Pago con el identificador de la cuenta tester." />
        <h3>Datos de acceso tester</h3><p>Completá estos valores manualmente antes de compartir esta guía en el canal que corresponda.</p><Table caption="Datos de acceso de la cuenta tester" headers={['Dato', 'Valor']} rows={[[<strong>Contraseña</strong>, <code>rvz3Ajadmf</code>], [<strong>Código de verificación</strong>, <code>160434</code>]]} /><GuideImage file="13-acceso-tester.png" alt="Acceso a la cuenta tester de Mercado Pago." /><GuideImage file="14-verificacion-tester.png" alt="Verificación de la cuenta tester de Mercado Pago." />
        <h3>Elegí la tarjeta y pagá</h3><p>Verificá la marca <strong>Sandbox</strong>, elegí una tarjeta de prueba, completá el código de seguridad, seleccioná una cuota y confirmá el total antes de pulsar <strong>Pagar</strong>.</p><GuideImage file="08-checkout-prueba.png" alt="Checkout Sandbox de Mercado Pago con datos de tarjeta y botón Pagar." />
        <Table caption="Tarjetas de referencia" headers={['Tarjeta', 'Número', 'Código', 'Vencimiento']} rows={[["Mastercard crédito", <code>5031 7557 3453 0604</code>, '123', '11/30'], ['Visa crédito', <code>4509 9535 6623 3704</code>, '123', '11/30'], ['American Express', <code>3711 8030 3257 522</code>, '1234', '11/30'], ['Mastercard débito', <code>5287 3338 1025 3304</code>, '123', '11/30'], ['Visa débito', <code>4002 7686 9439 5619</code>, '123', '11/30']]} />
        <h3>Volvé y actualizá el saldo</h3><p>Cuando Mercado Pago confirme el pago, pulsá <strong>Volver a la tienda</strong>. En Créditos, usá <strong>Actualizar saldo</strong> si el nuevo saldo no aparece de inmediato.</p><GuideImage file="09-pago-aprobado.png" alt="Confirmación de pago aprobado en Mercado Pago Sandbox." /><div className="docs-callout"><strong>Confirmación del pago.</strong> El retorno no acredita por sí solo. El servidor confirma el pago y acredita las consultas una sola vez.</div>
      </section>

      <section id="api-key" data-doc-section><p className="docs-section-label">03 · Credenciales</p><h2>Obtener tu API key</h2><p>La API key permite que tu backend consulte el servicio en nombre de tu organización.</p><h3>Creala y guardala una sola vez</h3><p>En Gestionar cuenta, buscá la tarjeta <strong>API key</strong> y pulsá <strong>Crear API key</strong>. Copiá el valor completo al generarlo: después solo verás el prefijo. Rotar la clave invalida la anterior.</p><GuideImage file="12-crear-api-key.png" alt="Tarjeta API key con el botón Crear API key." portrait />
        <pre><code>{`RENAPER_API_KEY=rnp_test_TU_CLAVE_SECRETA`}</code></pre><p>Guardala en una variable privada del servidor. Nunca la publiques en frontend, aplicaciones móviles, capturas, logs o Git.</p>
      </section>

      <section id="integracion" data-doc-section><p className="docs-section-label">04 · API</p><h2>Integrar la validación</h2><p>La integración se realiza desde tu backend. El correo y contraseña de la plataforma no se envían en esta solicitud.</p><Table caption="Configuración de la consulta" headers={['Configuración', 'Valor']} rows={[["Método HTTP", <code>POST</code>], ['URL', <code>https://146.181.31.154.nip.io/api/v1/personas/validar</code>], ['Contenido', <code>application/json</code>], ['Autenticación', <code>X-API-Key: TU_API_KEY_COMPLETA</code>]]} />
        <h3>Enviá una primera consulta</h3><pre><code>{`curl --request POST \\
  'https://146.181.31.154.nip.io/api/v1/personas/validar' \\
  --header 'Content-Type: application/json' \\
  --header "X-API-Key: \${RENAPER_API_KEY}" \\
  --data '{
    "dni": 40111222,
    "nombre": "Lucas Matias",
    "apellido": "Gomez",
    "edadMinima": 18
  }'`}</code></pre>
        <Table caption="Campos del cuerpo JSON" headers={['Campo', 'Descripción']} rows={[[<code>dni</code>, 'Número entero sin puntos ni separadores.'], [<code>nombre</code>, 'Nombre o nombres completos a contrastar.'], [<code>apellido</code>, 'Apellido a contrastar.'], [<code>edadMinima</code>, 'Umbral mínimo que requiere tu sistema.']]} />
      </section>

      <section id="resultados" data-doc-section><p className="docs-section-label">05 · Resultados</p><h2>Interpretar los resultados</h2><p>Solo aceptá un registro si <code>datosCoinciden</code> y <code>cumpleEdadMinima</code> son ambos <code>true</code>.</p><pre><code>{`{
  "datosCoinciden": true,
  "cumpleEdadMinima": true
}`}</code></pre><Table caption="Regla de decisión" headers={['Datos', 'Edad', 'Decisión']} rows={[[<code>true</code>, <code>true</code>, 'Aceptar la validación.'], [<code>true</code>, <code>false</code>, 'No aceptar: no cumple la edad mínima.'], [<code>false</code>, <code>true</code>, 'No aceptar: los datos no coinciden.'], [<code>false</code>, <code>false</code>, 'No aceptar la validación.']]} /><p>Una respuesta HTTP exitosa no alcanza por sí sola. Si falta un campo o tiene un tipo inesperado, no lo interpretes como una validación positiva.</p>
      </section>

      <section id="errores" data-doc-section><p className="docs-section-label">06 · Ayuda</p><h2>Errores y soluciones</h2><h3>Saldo insuficiente</h3><p>Si recibís <code>402 Saldo insuficiente</code>, ingresá a Gestionar cuenta, comprobá el saldo, comprá créditos y actualizalo antes de reintentar desde tu backend.</p><Table caption="Comprobaciones generales" headers={['Situación', 'Qué revisar']} rows={[["Problema con la credencial", 'Usá la clave completa en X-API-Key; el prefijo no alcanza.'], ['Clave rotada', 'Actualizá RENAPER_API_KEY en los sistemas que usan la anterior.'], ['Problema al enviar datos', 'Revisá POST, URL, Content-Type y el cuerpo JSON.'], ['No se obtiene respuesta', 'Comprobá conectividad y no aceptes el registro sin una respuesta válida.'], ['El saldo no aparece', 'Usá Actualizar saldo; la acreditación depende de la confirmación del pago.']]} /><div className="docs-callout"><strong>Protegé tus credenciales.</strong> Si necesitás ayuda, compartí el momento aproximado, código HTTP y mensaje recibido; nunca una API key ni una contraseña.</div>
      </section>
    </article>
  </section>
}
