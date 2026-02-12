// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AppLayout from './Components/layout/AppLayout';
// import PaginaDeFormatosForm from './Paginas/Formularios/PaginaDeFormatosForm';
// import PaginaDeEquiposForm from './Paginas/Formularios/PaginaDeEquiposForm';
// import PaginaDeEquipos from './Paginas/Equipo/PaginaDeEquipos';
// import PaginaDeGestionDeFormatos from './Paginas/Formularios/PaginaDeGestionDeFormatos';
// import PaginaPreoperacionalOperador from './Paginas/Equipo/PaginaPreoperacionalOperador';


// import { Toaster } from 'react-hot-toast';
// import PaginaEditorFormato from './Paginas/Formularios/PaginaEditorFormato';

// function App() {


//   return (
//     <>
//       <Toaster position="top-right" reverseOrder={false} />
//       <Router>
//         <Routes>
//           <Route path="/" element={<AppLayout />} >
//             <Route path='preoperacional/:id' element={<PaginaPreoperacionalOperador />} />
//             <Route path='/equipo' element={<PaginaDeEquipos />} />
//             <Route path='/formulario' element={<PaginaDeGestionDeFormatos />} />
//             <Route path='/formulario/equipo' element={<PaginaDeEquiposForm />} />
//             <Route path='/formulario/formatos' element={<PaginaDeFormatosForm />} />
//             <Route path="/formatos/:id" element={<PaginaEditorFormato />} />
//           </Route>
//         </Routes>
//       </Router>
//     </>
//   )
// }

// export default App
import { Suspense, lazy } from 'react'; // 1. Importamos lazy y Suspense
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './Components/layout/AppLayout';

// 2. Carga dinámica de páginas
const PaginaDeFormatosForm = lazy(() => import('./Paginas/Formularios/PaginaDeFormatosForm'));
const PaginaDeEquiposForm = lazy(() => import('./Paginas/Formularios/PaginaDeEquiposForm'));
const PaginaDeEquipos = lazy(() => import('./Paginas/Equipo/PaginaDeEquipos'));
const PaginaDeGestionDeFormatos = lazy(() => import('./Paginas/Formularios/PaginaDeGestionDeFormatos'));
const PaginaPreoperacionalOperador = lazy(() => import('./Paginas/Equipo/PaginaPreoperacionalOperador'));
const PaginaEditorFormato = lazy(() => import('./Paginas/Formularios/PaginaEditorFormato'));

// Componente de carga simple
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        {/* 3. Suspense envuelve las rutas para manejar el estado de carga */}
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<AppLayout />} >
              {/* Rutas de Operación */}
              <Route path='preoperacional/:id' element={<PaginaPreoperacionalOperador />} />
              <Route path='equipo' element={<PaginaDeEquipos />} />
              
              {/* Rutas de Gestión/Admin */}
              <Route path='formulario' element={<PaginaDeGestionDeFormatos />} />
              <Route path='formulario/equipo' element={<PaginaDeEquiposForm />} />
              <Route path='formulario/formatos' element={<PaginaDeFormatosForm />} />
              
              {/* Editor Técnico */}
              <Route path="formatos/:id" element={<PaginaEditorFormato />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;