import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';


// Importa las páginas que creaste
import SetUp from './views/Config/SetUp';
//Importar la configuración de la aplicación
import CheckConfiguration from './views/Config/CheckConfig';

import LoginForm from './views/Login/Login';

import HomeAdmin from './views/Admin/Home_Admin';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SetUp />} />
        <Route path="/setup" element={<SetUp />} />
        <Route path="/check-configuration" element={<CheckConfiguration />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin/home" element={<HomeAdmin />} />
        
      </Routes>
    </Router>
  );
}

export default App;
