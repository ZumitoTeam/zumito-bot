# Instrucciones para agentes

Estas directrices aplican a cualquier cambio en este repositorio.

## Estilo de código
- El proyecto utiliza TypeScript sobre Node.js 20.
- Usa una indentación de 4 espacios y termina las sentencias con punto y coma.
- Antes de enviar cambios intenta ejecutar `npx eslint .` para verificar el estilo. Si faltan dependencias o no puedes instalar paquetes, indica el motivo en la sección de pruebas del PR.
- Escribe todo el código y los comentarios en inglés.

## Creación de comandos
- Cada comando debe soportar su ejecución tanto en canales de servidor como en mensajes directos (MD).
- Considera que el bot puede estar instalado en un servidor o como aplicación de usuario. Maneja ambos contextos para evitar errores de ejecución.

## Módulos
- No listes manualmente comandos, rutas ni activos.
- La clase base del módulo detecta y registra automáticamente estos elementos.

## Servicios
- Crea servicios siempre que sea posible para modularizar la lógica.
- Genera embeds, botones u otros componentes dentro de los servicios de cada módulo.
- Organiza estos servicios en la carpeta `services` del módulo, con subcarpetas específicas como `embedBuilder`, `buttonBuilder`, etc.

## Internacionalización
- Evita texto codificado; utiliza siempre el sistema de traducciones.
- Proporciona traducciones en inglés y español para cada cadena visible por el usuario.

## Commits
- Los mensajes de commit deben seguir el estándar [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- Escribe los mensajes de commit en inglés.

## Pull Requests
- Incluye una sección **Summary** explicando los cambios realizados.
- Incluye una sección **Testing** con el resultado de `node_modules/.bin/eslint .` u otras pruebas. Si algún comando no puede ejecutarse (por ejemplo, por restricciones de red), menciónalo de forma breve.
- No modifiques archivos de licencia.
