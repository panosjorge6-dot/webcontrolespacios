# 🏢 Genion Lab Petrer - Gestión de Coworking Inteligente

**Genion Lab Petrer** es una plataforma moderna diseñada para la gestión en tiempo real de espacios de coworking, permitiendo a los usuarios reservar escritorios, salas de reuniones y oficinas privadas de forma interactiva y sin conflictos en el corazón de Petrer.

![App Icon](/icons/icon-192x192.png)

## 🚀 Características Principales

- **Mapa Interactivo de Planta**: Visualización en tiempo real de la disponibilidad de espacios con filtros dinámicos por zona y tipo.
- **Reserva en un Clic**: Proceso de reserva simplificado con persistencia en Firebase Firestore para evitar solapamientos.
- **Hot Desking**: Sistema de auto-asignación rápida para miembros con pases flexibles.
- **Panel de Usuario**: Gestión completa de reservas activas e histórico pasado.
- **Panel Administrativo**: Estadísticas globales, monitorización de actividad y control de espacios.
- **Notificaciones en Tiempo Real**: Alertas instantáneas sobre confirmaciones y cancelaciones.
- **Soporte para Tema Oscuro**: Interfaz adaptada con selector de tema para una experiencia personalizada.
- **Diseño Premium & Adaptable**: Interfaz moderna con animaciones fluidas (Framer Motion) y soporte completo para dispositivos móviles.
- **PWA Ready**: Configurado para instalarse como una aplicación nativa.

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS.
- **UI & Animaciones**: Base UI, Shadcn-like patterns, Framer Motion, Lucide Icons.
- **Backend / DB**: Firebase 11 (Authentication, Firestore, Storage).
- **Utilidades**: date-fns (manejo de fechas), Sonner (notificaciones toast), SWR.

## ⚙️ Configuración del Proyecto

### 1. Variables de Entorno
Crea un archivo `.env.local` en la raíz con las siguientes claves de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 2. Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📂 Estructura de Archivos

- `/app`: Rutas del sistema (Mapa, Hot Desking, Admin, Perfil).
- `/components`: Componentes visuales y lógica de UI.
- `/hooks`: Ganchos personalizados para Auth, Reservas y Notificaciones.
- `/lib`: Configuración de Firebase y utilidades de backend.
- `/types`: Definiciones de tipos para toda la aplicación.
- `/constants`: Datos estáticos y configuración de espacios iniciales.

---
© 2024 Genion Lab Petrer - El futuro del trabajo colaborativo.
