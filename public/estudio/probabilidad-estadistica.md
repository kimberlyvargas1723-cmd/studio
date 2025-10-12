# Probabilidad y Estadística: Entendiendo la Incertidumbre y los Datos

Esta área del pensamiento matemático es crucial para la psicología y la vida diaria. Se trata de tomar decisiones informadas cuando las cosas no son 100% seguras y de interpretar conjuntos de datos para encontrar patrones significativos.

### 1. Estadística Descriptiva: Resumiendo los Datos

La estadística descriptiva se usa para organizar y resumir un conjunto de datos. Las medidas más importantes son las de tendencia central.

#### Medidas de Tendencia Central
Buscan el "centro" o el valor más típico de un conjunto de datos.

- **Media (Promedio):** La suma de todos los valores dividida por el número total de valores.
  - **Ejemplo:** Datos: `[2, 3, 5, 8, 12]`
    - `Suma = 2 + 3 + 5 + 8 + 12 = 30`
    - `Número de datos = 5`
    - `Media = 30 / 5 = 6`
  - **Sensibilidad:** La media es muy sensible a valores extremos (outliers). Si tuviéramos `[2, 3, 5, 8, 100]`, la media sería `23.6`, que no representa bien al grupo.

- **Mediana:** El valor que se encuentra **exactamente en el medio** de un conjunto de datos **ordenado**.
  - **Estrategia:**
    1.  Ordena los datos de menor a mayor.
    2.  Si el número de datos es **impar**, la mediana es el número del centro.
        - Ejemplo: `[2, 3, **5**, 8, 12]`. La mediana es 5.
    3.  Si el número de datos es **par**, la mediana es el promedio de los dos números del centro.
        - Ejemplo: `[2, 3, **5, 8**, 12, 14]`. La mediana es `(5 + 8) / 2 = 6.5`.
  - **Sensibilidad:** La mediana es mucho menos sensible a valores extremos que la media. Es una mejor medida del "centro" cuando hay outliers.

- **Moda:** El valor que **más se repite** en un conjunto de datos.
  - **Ejemplo:** `[2, 5, 8, 5, 12, 5, 3]`. La moda es 5.
  - Un conjunto de datos puede tener más de una moda (bimodal, trimodal...) o ninguna moda si ningún valor se repite.

### 2. Probabilidad: Midiendo la Incertidumbre

La probabilidad es un número entre 0 y 1 (o 0% y 100%) que mide la posibilidad de que ocurra un evento.
- **Probabilidad = 0:** El evento es imposible.
- **Probabilidad = 1:** El evento es seguro.

#### Fórmula Básica de Probabilidad
`P(A) = (Número de Casos Favorables) / (Número Total de Casos Posibles)`

**Ejemplos Clásicos:**

- **Lanzar un dado de 6 caras:**
  - ¿Cuál es la probabilidad de sacar un 4?
    - `Casos Favorables = 1` (solo hay una cara con un 4)
    - `Casos Totales = 6`
    - `P(sacar un 4) = 1/6`
  - ¿Cuál es la probabilidad de sacar un número par?
    - `Casos Favorables = 3` (las caras 2, 4, 6)
    - `Casos Totales = 6`
    - `P(sacar par) = 3/6 = 1/2 = 50%`

- **Una baraja de 52 cartas:**
  - ¿Cuál es la probabilidad de sacar un As?
    - `Casos Favorables = 4` (hay 4 Ases)
    - `Casos Totales = 52`
    - `P(sacar As) = 4/52 = 1/13`

#### Reglas de Probabilidad

- **Regla de la Suma (Eventos Mutuamente Excluyentes):** Se usa para encontrar la probabilidad de que ocurra **uno u otro** evento (se usa la palabra "o").
  - Si los eventos no pueden ocurrir al mismo tiempo.
  - `P(A o B) = P(A) + P(B)`
  - **Ejemplo:** ¿Probabilidad de sacar un 3 o un 5 en un dado?
    - `P(3 o 5) = P(3) + P(5) = 1/6 + 1/6 = 2/6 = 1/3`

- **Regla del Producto (Eventos Independientes):** Se usa para encontrar la probabilidad de que ocurran **ambos** eventos (se usa la palabra "y").
  - Si el resultado de un evento no afecta al otro.
  - `P(A y B) = P(A) * P(B)`
  - **Ejemplo:** ¿Probabilidad de lanzar una moneda y que salga cara (1/2) **y** lanzar un dado y que salga un 6 (1/6)?
    - `P(cara y 6) = P(cara) * P(6) = 1/2 * 1/6 = 1/12`

Consejo Final: Para problemas de probabilidad, el primer paso es siempre el más importante: identificar claramente cuáles son TODOS los resultados posibles y cuáles son los resultados que cumplen la condición que te piden (casos favorables). Si puedes listar eso, el resto es solo una simple división.
