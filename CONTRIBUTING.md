# Contributing Guide

Gracias por tu interes en contribuir a GameTech Store.

## Alcance

Este repositorio contiene:
- Frontend estatico (HTML, CSS/SCSS, JavaScript)
- Backend ASP.NET Core Web API en `Backend/`

## Requisitos

- Git
- VS Code o Visual Studio
- .NET SDK compatible con el proyecto backend
- SQL Server (para pruebas del backend con EF Core)

## Estructura relevante

- `Backend/`: API, modelos, DbContext, migraciones
- `css/`, `js/`, `img/`: recursos frontend
- `*.html`: paginas frontend

## Flujo de ramas

Usamos Git Flow:
- `main`: produccion
- `develop`: integracion
- `feature/*`: nuevas funcionalidades
- `fix/*`: correcciones

Crea ramas desde `develop` y abre PR hacia `develop`, salvo indicacion distinta de los mantenedores.

## Como contribuir

1. Sincroniza tu rama local:
   - `git checkout develop`
   - `git pull origin develop`
2. Crea tu rama:
   - `git checkout -b feature/nombre-corto`
3. Implementa cambios pequenos y enfocados.
4. Valida que todo funcione (frontend y/o backend segun corresponda).
5. Crea commits claros.
6. Abre Pull Request a `develop`.

## Convenciones de commits

Formato sugerido:
- `feat: agrega endpoint de productos destacados`
- `fix: corrige validacion en checkout`
- `docs: actualiza guia de contribucion`
- `refactor: simplifica logica de carrito`
- `test: agrega pruebas de OrdersController`

Reglas:
- Usa mensajes en imperativo
- Un commit = un cambio logico
- Evita commits gigantes con cambios no relacionados

## Estilo de codigo

### Frontend

- Mantener nombres descriptivos en HTML/CSS/JS
- Evitar logica duplicada en scripts
- No romper paginas existentes (`index.html`, `products.html`, `shopping-cart.html`, etc.)
- Verificar responsive en vistas principales

### Backend (C#)

- Mantener separacion por capas actual (`Controllers`, `Models`, `Data`)
- Validar DTOs de entrada
- Devolver codigos HTTP correctos
- Evitar romper contratos de endpoints existentes

## Validaciones minimas antes de PR

### Frontend

- Cargar y navegar paginas principales sin errores en consola
- Verificar flujo basico: catalogo -> carrito -> checkout

### Backend

Desde `Backend/`:
- `dotnet restore`
- `dotnet build`
- `dotnet run`

Si realizas cambios de base de datos:
- Crear migracion nueva (si aplica)
- Verificar que las migraciones ejecuten correctamente

## Pull Request checklist

Incluye en tu PR:
- Resumen breve del cambio
- Motivacion del cambio
- Capturas (si hay cambios visuales)
- Pasos de prueba realizados
- Riesgos conocidos o deuda tecnica pendiente

Checklist recomendado:
- [ ] Compile sin errores
- [ ] No introduce cambios no relacionados
- [ ] Documentacion actualizada si aplica
- [ ] Revisado por al menos 1 persona

## Reporte de issues

Al abrir un issue, incluye:
- Comportamiento esperado
- Comportamiento actual
- Pasos para reproducir
- Entorno (navegador, SO, version .NET)
- Evidencia (logs, capturas)

## Seguridad

No subas:
- Secretos o credenciales
- Tokens JWT reales
- Cadenas de conexion productivas

Usa archivos de configuracion local para valores sensibles.

## Dudas

Si tienes dudas sobre arquitectura o alcance, abre primero un issue para acordar la solucion antes de implementar cambios grandes.
