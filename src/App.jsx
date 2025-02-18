import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';


// Importa las páginas que creaste
import SetUp from './views/Config/SetUp';
//Importar la configuración de la aplicación
import CheckConfiguration from './views/Config/CheckConfig';

import LoginForm from './views/Login/Login';

// ------------------------------------------------------------- Admin

import HomeAdmin from './views/Admin/Home_Admin';
import LaboratoriosAdmin from './views/Admin/laboratorios/Laboratorios_Admin';
import Lab_add from './views/Admin/laboratorios/Laboratorios_Add';

import Estudiantes_home from './views/Admin/Estudiantes/Estudiantes_home';
import Institucion_home from './views/Admin/Institucion/Institucion_home';
import Experimentos_home from './views/Admin/Experimentos/Experimentos_home';

// ------------------------------------------------------------- Students
import HomeStudents from './views/Students/Home_students';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SetUp />} />
        <Route path="/setup" element={<SetUp />} />
        <Route path="/check-configuration" element={<CheckConfiguration />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/su/home" element={<HomeAdmin />} />
        <Route path="/students/home" element={<HomeStudents />} />

        <Route path="/laboratorios" element={<LaboratoriosAdmin />} />
        <Route path="/laboratorios/add" element={<Lab_add />} />

        <Route path="/estudiantes" element={<Estudiantes_home />} />

        <Route path="/institucion" element={<Institucion_home />} />

        <Route path="/experimentos" element={<Experimentos_home />} />
        
      </Routes>
    </Router>
  );
}

export default App;
