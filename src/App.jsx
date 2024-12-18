import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';


// Importa las páginas que creaste
import Home from './views/Home/Home';

//Importar la configuración de la aplicación
import CheckConfiguration from './views/Config/CheckConfig';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/check-configuration" element={<CheckConfiguration />} />
        
      </Routes>
    </Router>
  );
}

export default App;
