# Public documentation experience
Objective: publish the supplied end-user guide as a public, visual, single-page documentation experience.
Branch: `feat/mercado-pago-demo`. Delivery: ask-on-risk; runner: Vitest and Vite build.

## Specs

S1. User: “mi idea que sea parecido a como muestran la documentacion los de mercado libre, algo asi https://www.mercadopago.com.ar/developers/es/docs/getting-started pero con la idea que te describi que sea una cascada con indices en una sidebar etc.” Create one continuous documentation page with a sidebar table of contents that tracks the active section while scrolling.

S2. User: “Y ahora hagamos que cualquiera pueda ver como la documentacion, cambia el nombre de "documentacion de la integracion" a documentacion nomas, y que sin estar logueado la puedas ver”. Make `/documentacion` public and use “Documentación” in public navigation.

S3. User: “quiero agregar fotos y todas esas cosas con flechas y todo eso” and supplied `/home/leandrovillanueva/Downloads/renaper-documentacion-20261103T211943Z-1-001/renaper-documentacion`. Publish its end-user steps and screenshots; the supplied tester-account identifier may be public, but never publish a password or API secret.

S4. User: “Quiero aclarar que quiero un estilo mderno redondeado con bordes grises en las tablas”. Use a modern rounded visual system with gray table borders.

## Tasks

- T1 | S2,S3 | inline | complete | Imported 10 supplied PNGs and built public guide structure; commit pending; Risk: item 3 (public documentation contract).
- T2 | S1,S4 | inline | complete | Added accessible scroll-synced sidebar, responsive modern styling, rounded panels and gray-bordered tables; commit pending; Risk: none.
- T3 | S1-S4 | inline | complete | Public route/navigation and behavioral tests passed; commit pending; Risk: item 3 (existing navigation contract).

## Log

- L1: User original request: “Ok, ya esta, el md esta en /home/leandrovillanueva/Downloads/renaper-documentacion-20261103T211943Z-1-001 mi idea que sea parecido a como muestran la documentacion los de mercado libre, algo asi https://www.mercadopago.com.ar/developers/es/docs/getting-started pero con la idea que te describi que sea una cascada con indices en una sidebar etc. Y ahora hagamos que cualquiera pueda ver como la documentacion, cambia el nombre de \"documentacion de la integracion\" a documentacion nomas, y que sin estar logueado la puedas ver”.
- L2: User clarification: “Quiero aclarar que quiero un estilo mderno redondeado con bordes grises en las tablas”.
- L3: Source guide includes 12 screenshots and explicitly excludes tester passwords/API keys. Use the Markdown as the published content source; do not publish `Notas_de_continuacion.md`, DOCX or PDF.
- L4: User decision, verbatim: “dejala que se vea publica ya que el otro usuario tiene que acceder con esa cuenta y es una cuenta tester”. The visible tester-account identifier in the supplied screenshot is authorized for public publication; passwords and API keys remain excluded.
- L5: T1-T3 complete: published guide content from the supplied Markdown, copied only the ten referenced PNG screenshots, made `/documentacion` public, renamed public navigation to `Documentación`, and added a responsive sticky/table-of-contents layout. `IntersectionObserver` updates `aria-current="location"`; no-JS/unsupported browsers retain anchor navigation. 26 Vitest tests and Vite build passed. Independent verification remains due for public route and documentation contract changes.
