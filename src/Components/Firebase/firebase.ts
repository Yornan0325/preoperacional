// #region IMPORTS
import { type FirebaseApp, getApps, initializeApp } from 'firebase/app'
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth'
import {
    CACHE_SIZE_UNLIMITED,
    Firestore,
    getFirestore,
    initializeFirestore,
    persistentLocalCache,
    persistentMultipleTabManager
} from 'firebase/firestore'
// import { getMessaging, type Messaging } from 'firebase/messaging'
// import { type FirebaseStorage, getStorage } from 'firebase/storage'
// #endregion

// #region TYPES
/**
 * Interfaz de configuración de Firebase
 */
interface FirebaseConfig {
    apiKey: string
    appId: string
    authDomain: string
    measurementId: string
    messagingSenderId: string
    projectId: string
    storageBucket: string
}
// #endregion

// #region CONSTANTS
/**
 * Configuración de Firebase basada en variables de entorno
 */
const firebaseConfig: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
}
// #endregion

// #region FUNCTIONS
/**
 * Inicializa la instancia de la aplicación Firebase o devuelve la existente
 * @returns Aplicación Firebase inicializada
 */
const initializeFirebaseApp = (): FirebaseApp => {
    return getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
}

/**
 * Inicializa Firestore con capacidades offline
 * @param app Instancia de la aplicación Firebase
 * @returns Instancia de Firestore configurada
 */
const initializeFirestoreDB = (app: FirebaseApp): Firestore => {
    // console.log('Inicializando Firestore DB...')

    try {
        // Inicializar con caché persistente para soporte offline
        const db = initializeFirestore(app, {
            localCache: persistentLocalCache({
                // Establecer tamaño de caché ilimitado para mejor experiencia offline
                cacheSizeBytes: CACHE_SIZE_UNLIMITED,
                // Habilitamos el administrador de múltiples pestañas para permitir
                // que la aplicación funcione correctamente en múltiples pestañas
                tabManager: persistentMultipleTabManager()
            })
        })

        // console.log('Firestore inicializado con éxito usando initializeFirestore')
        return db
    } catch (error) {
        console.error(
            'Error al inicializar Firestore con initializeFirestore:',
            error
        )

        // Plan B: intentar con getFirestore
        console.log('Intentando inicializar con getFirestore como alternativa...')
        const db = getFirestore(app)
        console.log('Firestore inicializado con getFirestore')
        return db
    }
}

/**
 * Inicializa Firebase Storage
 * @param app Instancia de la aplicación Firebase
 * @returns Instancia de Firebase Storage configurada
 */
// const initializeFirebaseStorage = (app: FirebaseApp): FirebaseStorage => {
//   // console.log('Inicializando Firebase Storage...')

//   try {
//     const storage = getStorage(app)
//     // console.log('Firebase Storage inicializado con éxito')
//     return storage
//   } catch (error) {
//     console.error('Error al inicializar Firebase Storage:', error)
//     throw error
//   }
// }

/**
 * Inicializa Firebase Cloud Messaging
 * @param app Instancia de la aplicación Firebase
 * @returns Instancia de Firebase Messaging configurada o null si no está soportado
 */
// const initializeFirebaseMessaging = (app: FirebaseApp): Messaging | null => {
//   try {
//     // Verificar que estamos en un entorno que soporta messaging
//     if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
//       console.warn('Firebase Messaging no está soportado en este entorno')
//       return null
//     }

//     const messaging = getMessaging(app)
//     // console.log('Firebase Messaging inicializado con éxito')
//     return messaging
//   } catch (error) {
//     console.error('Error al inicializar Firebase Messaging:', error)
//     return null
//   }
// }
// #endregion

// #region INITIALIZATION
// Inicializamos la app
const app = initializeFirebaseApp()

// Inicializamos directamente Auth, Firestore y Storage
// Nota: Cambiamos de inicialización asíncrona a síncrona para asegurar que db y storage estén disponibles inmediatamente
const auth = getAuth(app)
// Configuramos persistencia de Auth (sin await para evitar problemas de inicialización)
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        // console.log('Persistencia de autenticación configurada')
    })
    .catch(error =>
        console.error('Error en persistencia de autenticación:', error)
    )

// Inicializamos Firestore
const db = initializeFirestoreDB(app)

// Inicializamos Firebase Storage
// const storage = initializeFirebaseStorage(app)

// Inicializamos Firebase Messaging (puede ser null si no está soportado)
// const messaging = initializeFirebaseMessaging(app)
// #endregion

// #region EXPORTS
export type { FirebaseConfig }
export { app, auth, db }
// #endregion
