# Instrucciones para agentes

Estas directrices aplican a cualquier cambio en este repositorio.

## Estilo de código
- El proyecto utiliza TypeScript sobre Node.js 20.
- Usa una indentación de 4 espacios y termina las sentencias con punto y coma.
- Antes de enviar cambios intenta ejecutar `npx eslint .` para verificar el estilo. Si faltan dependencias o no puedes instalar paquetes, indica el motivo en la sección de pruebas del PR.

## Commits
- Los mensajes de commit deben seguir el estándar [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
- Escribe los mensajes de commit en inglés.

## Pull Requests
- Incluye una sección **Summary** explicando los cambios realizados.
- Incluye una sección **Testing** con el resultado de `npx eslint .` u otras pruebas. Si algún comando no puede ejecutarse (por ejemplo, por restricciones de red), menciónalo de forma breve.
- No modifiques archivos de licencia.
