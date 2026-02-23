import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import AppLayout from './Components/layout/AppLayout';
import { Toaster } from 'react-hot-toast';
import PaginaDeEquiposForm from './Paginas/Formularios/PaginaDeEquiposForm';
import { autenticarUsuarioAdmin } from './Components/Hoock/autenticarUsuarioAdmin';
import TestFb from './testfb';
// import PaginaDeEquipos from './Paginas/Equipo/PaginaDeEquipos';
// import EditorDePlantillaFormato from './Paginas/Formularios/EditorDePlantillaFormato';

// Carga perezosa (Lazy Loading) para rendimiento
const PaginaDeEquipos = lazy(() => import('./Paginas/Equipo/PaginaDeEquipos'));
const PaginaDeGestionDeFormatos = lazy(() => import('./Paginas/Formularios/PaginaDeGestionDeFormatos'));
const CheckListOperador = lazy(() => import('./Components/Modulos/Equipos/CheckListOperador'));
const EditorDePlantillaFormato = lazy(() => import('./Components/Modulos/Formularios/EditorDePlantillaFormato'));

// Fallback de carga
const Loading = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  useEffect(() => {
    autenticarUsuarioAdmin();
  }, [])

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Layout Principal */}
            <Route path="/" element={<AppLayout />}>

              <Route path="/prueba" element={<TestFb />} />

              {/* --- VISTA OPERADOR (DÍA A DÍA) --- */}
              {/* Lista de equipos para inspeccionar */}
              <Route path="equipo" element={<PaginaDeEquipos />} />
              {/* El proceso de inspección por pasos */}
              <Route path="equipo/preoperacional/:id" element={<CheckListOperador />} />

              {/* --- VISTA GESTIÓN (ADMINISTRATIVA) --- */}
              {/* Dashboard de formatos: aquí ves las cards de Equipo y Formato */}
              <Route path="formulario" element={<PaginaDeGestionDeFormatos />} />

              {/* Gestión de Plantillas (El editor técnico que acabamos de crear) */}
              {/* Ruta para crear uno desde cero */}
              <Route path="formulario/formatos/nuevo" element={<EditorDePlantillaFormato />} />
              {/* Ruta para editar uno existente usando su ID */}
              <Route path="formulario/formatos/:id" element={<EditorDePlantillaFormato />} />

              {/* Otras rutas de formularios si las necesitas */}
              <Route path="formulario/equipo" element={<PaginaDeEquiposForm />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;