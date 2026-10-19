# 09 · Presentación MARKA con Elena y Aitana (clips con IA)

Vertical 9:16, ~40 s. Clips de Veo (máx. 8 s cada uno) + montaje con el motor (`motor/`): textos, K, voces, música.
Tono: `BRAND.md` (directo, seguro, breve, se tutea, sin exclamaciones).

## Referencia de personajes (imagen que subió Elena; usar como imagen de referencia en TODOS los clips)
- **Elena:** alta, pelo largo liso castaño con mechas doradas, ojos marrones, aros dorados, piel morena. Sudadera negra oversize abierta, top blanco corto, pantalón de chándal gris.
- **Aitana:** más baja, pelo largo rubio ondulado, ojos verdes, perlas. Jersey azul marino de pico sobre camisa blanca, pantalón beige con cinturón marrón, bolso marrón.
- **Estilo:** ilustración tipo animación Disney/Pixar, trazo limpio, tonos cálidos. Fondo liso arena `#D9D5CC`, sin elementos ni texto.

## Reglas comunes de todos los prompts
Animación fluida de animador profesional: peso, anticipación, solapamiento (pelo y ropa con inercia), brazos y manos expresivos, giros de cuerpo y cabeza en 3D, no plano ni de frente fijo. Cámara estática, plano medio-americano. Sin texto en pantalla, sin logos, sin subtítulos. Mismos personajes y ropa que la referencia.

## Plano a plano
| # | Seg. | Voz (se añade después, no en el clip) | Prompt Veo |
|---|---|---|---|
| 1 | 0–5 | E: "Hola. Somos MARKA." | Las dos chicas entran caminando a plano, se giran hacia cámara y saludan. Elena saluda con la mano, Aitana sonríe y se coloca el pelo. Se miran y se chocan el hombro con complicidad. |
| 2 | 5–11 | E: "Yo soy Elena. Pienso la marka." | Elena da un paso al frente, Aitana se hace a un lado. Elena habla a cámara con gestos de mano claros, se señala el pecho, luego se toca la sien y sonríe. Hace un giro suave de tres cuartos. |
| 3 | 11–17 | A: "Yo soy Aitana. Y la pongo a moverse." | Aitana da un paso al frente, Elena se aparta. Aitana se presenta con energía, se señala a sí misma y hace un giro completo sobre sí misma con el pelo ondeando. Acaba con las manos en la cintura. |
| 4 | 17–23 | E: "Yo ordeno." A: "Yo lo pongo patas arriba." | Elena cruza los brazos con gesto de ordenar, ladea la cabeza. Aitana, a su lado, hace un gesto divertido de desordenar con las manos y se ríe. Elena la mira de reojo y niega sonriendo. |
| 5 | 23–29 | A: "Por eso funciona." E: "Lo que hace una, lo revisa la otra." | Se miran, se dan un choque de manos y se giran juntas hacia cámara. Elena señala a Aitana y Aitana a Elena. |
| 6 | 29–35 | B: "Y juntas hemos montado MARKA." | Se ponen hombro con hombro y levantan las manos como presentando algo en el centro, encima de ellas (hueco limpio para colocar la K después). Miran hacia arriba y luego a cámara. |
| 7 | 35–40 | E: "Para que tu marka se parezca a ti. ¿Hablamos?" A: "Escríbenos." | Elena abre los brazos hacia cámara invitando, Aitana se acerca y guiña un ojo. Las dos hacen un gesto de "ven" con la mano y se despiden con la mano. |

## Montaje (con el motor)
- Sobre cada clip: texto en pantalla con la tipografía de marca, la K grande en el plano 6, cierre con `MARKA · Ideas que toman forma · markaestudio.app`.
- Voces: nuevas, con `motor/voz.py` o voz generada; música con `motor/musica.py`/`audio.py`.
- Coherencia entre clips: si la cara o la ropa cambian, regenerar con la misma imagen de referencia y la semilla del primero.

## Pendiente
- `GEMINI_API_KEY` (sesión nueva) para lanzar los clips con Veo.
- Imagen de referencia guardada en el repo (`contenido/piezas/assets/referencia-elena-aitana.webp`).
