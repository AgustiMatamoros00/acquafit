# Sistema de Almacenamiento de Token JWT - AcquaFit Frontend

## Resumen

Este documento explica cómo funciona el sistema de almacenamiento del token JWT en la aplicación frontend de AcquaFit, diseñado para mantener la sesión del usuario incluso después de hacer refresh en el navegador.

## Arquitectura

### 1. StorageService (`src/app/services/storage.service.ts`)

Servicio centralizado que maneja todo el almacenamiento de datos de la aplicación:

- **Almacenamiento principal**: `localStorage` (persiste entre sesiones)
- **Fallback**: `sessionStorage` (si localStorage falla)
- **Manejo de errores**: Captura y maneja errores de almacenamiento
- **Verificación**: Comprueba si el almacenamiento está disponible

#### Métodos principales:

```typescript
// Token JWT
setToken(token: string): void
getToken(): string | null
removeToken(): void
hasToken(): boolean

// Datos del usuario
setUserData(userData: any): void
getUserData(): any | null
removeUserData(): void

// Utilidades
clearAll(): void
isStorageAvailable(): boolean
```

### 2. AuthService (`src/app/services/auth.service.ts`)

Servicio de autenticación que utiliza el StorageService:

- **Inicialización**: Verifica automáticamente el estado de autenticación al cargar
- **Persistencia**: Mantiene el token entre refreshes del navegador
- **Validación**: Verifica el token con el backend
- **Redirección**: Maneja la navegación basada en el estado de autenticación

#### Flujo de autenticación:

1. **Al cargar la app**: `checkAuthStatus()` verifica si hay un token almacenado
2. **Si hay token**: Valida con el backend
3. **Si es válido**: Establece el estado como autenticado
4. **Si no es válido**: Limpia el token y redirige al login

### 3. AuthInterceptor (`src/app/interceptors/auth.interceptor.ts`)

Interceptor HTTP que:

- **Añade automáticamente** el token JWT a todas las peticiones HTTP
- **Maneja errores 401**: Token expirado o inválido
- **Limpia automáticamente** el token inválido
- **Redirige al login** cuando es necesario

## Ventajas de esta implementación

### ✅ **Persistencia**
- El token se mantiene después de hacer refresh
- Funciona al cerrar y abrir el navegador
- No se pierde la sesión por accidente

### ✅ **Seguridad**
- Validación automática con el backend
- Limpieza automática de tokens expirados
- Manejo robusto de errores de autenticación

### ✅ **Experiencia de usuario**
- No hay que volver a hacer login después de refresh
- Redirección automática basada en el estado de autenticación
- Carga rápida de datos del usuario desde almacenamiento local

### ✅ **Robustez**
- Fallback a sessionStorage si localStorage falla
- Manejo de errores de almacenamiento
- Verificación de disponibilidad del almacenamiento

## Uso en componentes

### Login exitoso:
```typescript
// En el componente de login
this.authService.login(token, userData);
```

### Verificar estado de autenticación:
```typescript
// En cualquier componente
this.authService.isLoggedIn(); // boolean
this.authService.hasStoredToken(); // boolean
```

### Obtener datos del usuario:
```typescript
// Los datos se cargan automáticamente desde el almacenamiento local
const userData = await this.authService.getUserData();
```

### Logout:
```typescript
// Limpia todo el almacenamiento
this.authService.logout();
```

## Consideraciones para producción

### 🔒 **Seguridad**
- El token se almacena en texto plano en el navegador
- Considerar encriptación adicional para datos sensibles
- Implementar refresh tokens para mayor seguridad

### 📱 **Compatibilidad**
- Funciona en todos los navegadores modernos
- Fallback automático si localStorage no está disponible
- Manejo de errores para navegadores con almacenamiento limitado

### 🚀 **Performance**
- Los datos del usuario se cargan desde almacenamiento local
- Reducción de llamadas al backend
- Inicialización rápida de la aplicación

## Troubleshooting

### Token no se mantiene después de refresh:
1. Verificar que el StorageService esté funcionando
2. Comprobar que no haya errores en la consola
3. Verificar que el interceptor esté configurado correctamente

### Error 401 persistente:
1. Verificar que el token se esté enviando en los headers
2. Comprobar que el backend esté validando correctamente
3. Verificar la configuración del JWT_SECRET

### Datos del usuario no se cargan:
1. Verificar que se estén guardando en el almacenamiento
2. Comprobar que el formato de los datos sea correcto
3. Verificar que no haya errores de parsing JSON 