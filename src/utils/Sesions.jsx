import axios from 'axios';
import BACKEND from '../config/backend';


const Sessions = {
  // Guarda valores en localStorage
  setToken(token) {
    localStorage.setItem('token', token);
  },
  setUserID(userID) {
    localStorage.setItem('userID', userID);
  },
  setUserRole(userRole) {
    localStorage.setItem('userRole', userRole);
  },
  setUsername(username) {
    localStorage.setItem('username', username);
  },

  // Obtiene valores de localStorage
  getToken() {
    return localStorage.getItem('token');
  },
  getUserID() {
    return localStorage.getItem('userID');
  },
  getUserRole() {
    return localStorage.getItem('userRole');
  },
  getUsername() {
    return localStorage.getItem('username');
  },

  // Limpia todos los datos almacenados
  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
  },

  // Valida si la sesión es válida mediante un endpoint
  async validateSession() {
    const token = this.getToken();
    if (!token) return false; // No hay token, sesión no válida
  
    try {
      const response = await axios.post(
        `${BACKEND}/login/session`, // Endpoint de validación
        { "token": token }, // Enviar el token en el cuerpo de la solicitud
        {
          headers: {
            'Content-Type': 'application/json', // Asegurar que el tipo de contenido sea JSON
          },
        }
      );
  
      return response.status === 200; // Si la respuesta es 200, la sesión es válida
    } catch (error) {
      console.error('Error validando sesión:', error);
      return false; // Si ocurre un error, la sesión no es válida
    }
  }
  
};

export default Sessions;
