# Guía de Deployment - PsicoGuía

## Información del Proyecto

- **Nombre**: PsicoGuía - Sistema de Estudio Adaptativo
- **Tecnologías**: Next.js 15.3.3, Firebase, Genkit AI
- **Repositorio**: https://github.com/kimberlyvargas1723-cmd/studio
- **Firebase Project**: studio-7785277282-cd0f6

## URLs de Producción

- **App Hosting**: https://studio--studio-7785277282-cd0f6.us-central1.hosted.app
- **Cloud Run**: https://studio-524788938527.us-central1.run.app
- **Firebase Console**: https://console.firebase.google.com/project/studio-7785277282-cd0f6
- **Hosting Site**: https://console.firebase.google.com/u/0/project/studio-7785277282-cd0f6/hosting/sites/studio-7785277282-cd0f6

## Pasos para Deployment

### 1. Configurar Secrets en Firebase Console

Antes de hacer el deployment, necesitas configurar los secrets en Firebase:

1. Ve a la Firebase Console: https://console.firebase.google.com/project/studio-7785277282-cd0f6/settings/secrets

2. Crea los siguientes secrets:

   **FIREBASE_API_KEY**
   ```
   AIzaSyAu_bEapuweP2YMnsDkWQJqX2bqNCR6cDs
   ```

   **GEMINI_API_KEY**
   ```
   AIzaSyA5pWruUHzo3dX1A1ITsc04rdKsGVtkqXw
   ```

### 2. Commit y Push a GitHub

```bash
# Agregar archivos actualizados
git add apphosting.yaml .env.local DEPLOYMENT_GUIDE.md

# Crear commit
git commit -m "Configure deployment for Firebase App Hosting

- Update apphosting.yaml with environment variables
- Configure Firebase and Gemini API secrets
- Add deployment documentation

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push a GitHub
git push origin main
```

### 3. Configurar App Hosting en Firebase Console

1. Ve a **App Hosting**: https://console.firebase.google.com/project/studio-7785277282-cd0f6/apphosting

2. Si no existe el backend 'studio', créalo:
   - Click en "Add backend"
   - Selecciona el repositorio: `kimberlyvargas1723-cmd/studio`
   - Branch: `main`
   - Root directory: `.` (raíz del proyecto)

3. Si ya existe, verifica que esté conectado correctamente al repositorio.

### 4. Deployment Automático

Una vez configurado, cada push a la rama `main` en GitHub activará automáticamente:

1. **Build**: Firebase ejecutará `npm run build`
2. **Tests**: Se verificará que el build sea exitoso
3. **Deploy**: Se desplegará automáticamente a App Hosting
4. **Rollout**: El tráfico se dirigirá a la nueva versión

### 5. Deployment Manual (Alternativa)

Si prefieres hacer deployment manual:

```bash
# Instalar Firebase CLI si no lo tienes
npm install -g firebase-tools

# Login a Firebase
firebase login

# Seleccionar proyecto
firebase use studio-7785277282-cd0f6

# Deploy a App Hosting
firebase apphosting:backends:deploy studio --project studio-7785277282-cd0f6
```

## Variables de Entorno Configuradas

### Variables Públicas (en apphosting.yaml)
- `NODE_ENV`: production
- `NEXT_TELEMETRY_DISABLED`: 1
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: studio-7785277282-cd0f6
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: studio-7785277282-cd0f6.firebaseapp.com
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: studio-7785277282-cd0f6.firebasestorage.app
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: 524788938527
- `NEXT_PUBLIC_FIREBASE_APP_ID`: 1:524788938527:web:44df26f55d2b325ae8e22a
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`: https://studio-7785277282-cd0f6-default-rtdb.firebaseio.com

### Secrets (configurar en Firebase Console)
- `FIREBASE_API_KEY`: API Key de Firebase
- `GEMINI_API_KEY`: API Key de Google Gemini

## Verificación Post-Deployment

### 1. Verificar que el sitio esté activo

```bash
curl -I https://studio--studio-7785277282-cd0f6.us-central1.hosted.app
```

### 2. Verificar logs

```bash
# Ver logs de Cloud Run
gcloud run services logs read studio --project studio-7785277282-cd0f6 --region us-central1
```

### 3. Verificar en Firebase Console

1. Ve a **App Hosting > Rollouts**: https://console.firebase.google.com/project/studio-7785277282-cd0f6/apphosting/studio/rollouts
2. Verifica que el último rollout sea exitoso
3. Revisa los logs de build y deployment

## Troubleshooting

### Error: Secrets no configurados
Si ves errores de variables de entorno faltantes:
1. Ve a Firebase Console > Settings > Secrets
2. Verifica que `FIREBASE_API_KEY` y `GEMINI_API_KEY` estén configurados
3. Re-deploy el backend

### Error: Build falla
Si el build falla:
1. Verifica los logs en Firebase Console
2. Asegúrate de que `package.json` tenga el script `build`
3. Verifica que todas las dependencias estén en `package.json`

### Error: 404 en la URL
Si la URL devuelve 404:
1. Verifica que el backend esté desplegado correctamente
2. Verifica que el tráfico esté dirigido a la última versión
3. Revisa la configuración de `apphosting.yaml`

## Recursos Adicionales

- [Firebase App Hosting Docs](https://firebase.google.com/docs/app-hosting)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Console](https://console.firebase.google.com)

## Notas Importantes

1. **Secrets**: Las API keys sensibles NUNCA deben estar en el código. Usa siempre Firebase Secrets.
2. **Environment Variables**: Las variables públicas (NEXT_PUBLIC_*) pueden estar en `apphosting.yaml`, pero las privadas deben ser secrets.
3. **Builds**: El build se ejecuta automáticamente en cada push. Asegúrate de que `npm run build` funcione localmente antes de hacer push.
4. **Costos**: Monitorea el uso de Cloud Run y App Hosting para evitar costos inesperados.

---

**Última actualización**: 2025-10-23
