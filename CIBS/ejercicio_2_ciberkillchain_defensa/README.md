# Ejercicio CiberKillChain - Defensa

Se realizó una copia del documento original utilizándolo como plantilla para la realización del ejercicio.

## Alumno

Ignacio Hernandorena

## Enunciado

Desarrollar la defensa en función del ataque planteado en orden inverso.

Para cada etapa elegir una sola defensa, la más importante, considerar recursos limitados.

## Resolución

* Actions on Objectives:

  - Defensa: plan de respuesta a incidentes
  - Un plan de respuesta a incidentes permitirá responder de manera rápida y efectiva una vez que se haya detectado el ataque de ransomware. Esto incluye tener procesos claros para lidiar con la extorsión y la restauración de datos desde copias de seguridad seguras.
    - Procesos Claros: Un plan de respuesta a incidentes debe establecer procesos claros y bien definidos para la gestión de incidentes de ransomware. Esto implica identificar roles y responsabilidades dentro del equipo de respuesta a incidentes.
    - Detección Temprana: Implementar soluciones de detección de amenazas que permitan identificar rápidamente la presencia de ransomware en la red.
    - Contención: Establecer medidas para contener la propagación del ransomware y evitar un mayor daño.
    - Restauración de Datos: Disponer de copias de seguridad seguras y probadas para la restauración de datos sin necesidad de pagar un rescate.

* Command & Control:

  - Defensa: monitoreo de red y tráfico
  - Establecer un monitoreo constante de la red para detectar patrones de tráfico inusuales o conexiones VPN no autorizadas. Esto puede ayudar a identificar y bloquear conexiones de comando y control.
    - Implementación de Herramientas de Monitoreo: Utilizar herramientas de monitoreo de red y tráfico que puedan analizar y alertar sobre actividades sospechosas.
    - Detección de Anomalías: Configurar sistemas para detectar comportamientos de red inusuales, como tráfico hacia ubicaciones no autorizadas o patrones de comunicación sospechosos.
    - Respuesta Rápida: Establecer procedimientos para responder rápidamente a las alertas y bloquear conexiones de comando y control.

* Installation:

  - Defensa: segmentación de red
  - Implementar una segmentación de red adecuada para aislar los dispositivos IoT y los servidores de la plataforma en la nube. Esto limitará la propagación del ransomware entre dispositivos y servidores.
    - Identificar Zonas Críticas: Clasificar y separar las áreas críticas de la red de aquellas menos críticas para reducir la superficie de ataque.
    - Políticas de Acceso: Establecer políticas de acceso y controles de firewall para restringir la comunicación no autorizada entre segmentos de red.
    - Monitorización: Supervisar la segmentación de red para garantizar que se mantenga y ajuste según sea necesario.

* Exploit:

  - Defensa: concientización sobre phishing
  - La concientización sobre phishing es una estrategia fundamental para reducir las posibilidades de que los empleados o usuarios del sistema caigan en ataques de ransomware. Las medidas de defensa incluyen:
    - Entrenamiento Continuo: Proporcionar capacitación y concientización periódica sobre ciberseguridad, con un enfoque especial en la identificación de correos electrónicos de phishing.
    - Simulaciones de Phishing: Realizar simulaciones de ataques de phishing para evaluar la resistencia de los empleados a este tipo de ataques y brindar retroalimentación para mejorar la concientización.

* Delivery:

  - Defensa: filtrado de correo electrónico
  - La implementación de un filtro de correo electrónico avanzado es una defensa efectiva para detectar correos electrónicos de phishing y bloquear enlaces y archivos maliciosos antes de que lleguen a la bandeja de entrada de los empleados o usuarios del sistema. Para reforzar esta defensa:
    - Configuración de Filtros: Configurar filtros de correo electrónico para examinar y bloquear correos electrónicos que contengan indicadores de phishing conocidos.
    - Actualización Continua: Mantener actualizadas las bases de datos de indicadores de phishing para garantizar una detección precisa.

* Weaponization:

  - Defensa: integridad de la cadena de abastecimiento
  - Garantizar la integridad de la cadena de suministro es fundamental para prevenir el suministro de software o actualizaciones comprometidas que puedan incluir ransomware. Las acciones defensivas incluyen:
    - Verificación de Origen: Validar la autenticidad de las actualizaciones de software y solo adquirir software de fuentes confiables.


* Reconnaissance:

  - Defensa: actualizaciones y parches
  - Mantener actualizado todo el software y los sistemas utilizados en el proyecto es esencial para prevenir ataques basados en vulnerabilidades conocidas. Las medidas de defensa incluyen:
    - Política de Parches: Establecer una política de gestión de parches que garantice la aplicación oportuna de actualizaciones de seguridad.
    - Evaluación de Vulnerabilidades: Realizar evaluaciones regulares de vulnerabilidades y pruebas de penetración para identificar posibles puntos débiles.



