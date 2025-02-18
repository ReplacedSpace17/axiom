import React, { useState, useEffect } from 'react';
import { Layout, Steps, Form, Input, Select, Row, Col, Button, message, Space, List, Tooltip} from 'antd';
import { DatabaseOutlined, UserOutlined, ExperimentOutlined, UserAddOutlined, BankOutlined,SearchOutlined, QuestionCircleOutlined, ControlOutlined,
  WalletOutlined
} from '@ant-design/icons';
import Confetti from 'react-confetti';
import BACKEND from '../../config/backend';
import axios from 'axios';
import { use } from 'react';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate
import '../../assets/colors_palette.css';

//imports de antd
const { Header, Content, Footer } = Layout;
const { Step } = Steps;
const { Option } = Select;

//Función para configurar la aplicación
function SetUp() {
  const navigate = useNavigate();  // Inicializa el hook useNavigate


  //-------------------------------------------------------- Stage BASE DE DATOS (1) --------------------------------------------------------
  const [serverName, setServerName] = useState('');
  const [databaseName, setDatabaseName] = useState('');
  const [userDb, setUserDB] = useState('');
  const [passwordDb, setPasswordDB] = useState('');
  const [portDb, setPortDB] = useState('3306');
  const [connectionStatus, setConnectionStatus] = useState(false);

  //Función para probar la conexión con la base de datos
  const testConnectionDB = async () => {
  const data = {
      server: serverName,
      port: portDb,
      username: userDb,
      password: passwordDb,
      database: databaseName
    };
    try {
      const response = await axios.post(BACKEND + '/config/test/db', data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      //imprimir a donde se esta haciendo el post
      console.log(BACKEND + '/config/test/db');
      if(response.status === 200){
        setConnectionStatus(true);
        message.success('Conexión exitosa a la base de datos');
      }
      else{
        message.success('No se pudo realizar la conexión');
      }
    } catch (error) {
      // Manejar el error
      console.error('Error en la solicitud:', error);
      message.error('No se pudo conectar a la base de datos.');
    }
  };

  //Function para escribir en el server la configuración de la base de datos
  const writeConfigDB = async () => {
  try {
    const data = {
      server: serverName,
      port: portDb,
      username: userDb,
      password: passwordDb,
      database: databaseName
    };
    const response = await axios.post(BACKEND + '/config/set/state', data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if(response.status === 200){
      message.success('Configuración guardada en el servidor');
      next();
    }
    else{
      message.success('No se pudo guardar la configuración en el servidor');
    }
  }
  catch (error) {
    // Manejar el error
    console.error('Error en la solicitud:', error);
    message.error('No se pudo guardar la configuración en el servidor.');
  }
  };
  
  //-------------------------------------------------------- Stage Super usuario(2) --------------------------------------------------------
  const [superUser, setSuperUser] = useState('');
  const [superPassword, setSuperPassword] = useState('');
  const [superPassword2, setSuperPassword2] = useState('');
 
  //Function para crear la cuenta de super usuario
  const createAccount = async () => {
    //validar que los passwords sean iguales
    if(superPassword == superPassword2){
      try {
        const data = {
          username: superUser,
          password: superPassword,
        };
        const response = await axios.post(BACKEND + '/config/set/superuser', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 200) {
          message.success('Cuenta de superusuario creada exitosamente.');
          next();
        } else {
          message.error('No se pudo crear la cuenta de superusuario.');
        }
      } catch (error) {
        // Manejar el error según el código de respuesta del servidor
        if (error.response) {
          if (error.response.status === 409) {
            message.warning('Ya existe un superusuario con este nombre de usuario.');
          } else {
            message.error(
              `Error del servidor (${error.response.status}): ${error.response.data.message || 'No se pudo crear la cuenta de superusuario.'}`
            );
          }
        } else {
          console.error('Error en la solicitud:', error);
          message.error('Error de conexión al servidor.');
        }
      }
    }
    else{
      message.error('Las contraseñas no coinciden');
    };
  };

  //-------------------------------------------------------- Stage Laboratorios(3) --------------------------------------------------------
  const [laboratorio, setLaboratorio] = useState('');
  const [investigador, setInvestigador] = useState('');
  const [listLabs, setListLabs] = useState([]);
  const [btnContinue_lab, setBtnContinue] = useState(false);

  // Function para agregar un laboratorio
  const createLab = async () => {
    const data = {
      nombre: laboratorio,
      investigador: investigador,
    };

    // Validar si los campos 'laboratorio' o 'investigador' están vacíos
    if (!laboratorio || !investigador) {
      message.error('Debe agregar información en los campos "laboratorio" e "investigador".');
      return; // Detener la ejecución si algún campo está vacío
    }

    try {
      const response = await axios.post(BACKEND + '/config/set/laboratory', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // Obtener la respuesta del servidor
        const labData = response.data.laboratorio;
        setListLabs((prevLabs) => [...prevLabs, labData]); // Agrega el nuevo laboratorio a la lista existente
        setFilteredLabs((prevLabs) => [...prevLabs, labData]);
        message.success('Laboratorio agregado exitosamente');
        setBtnContinue(true);
      } else {
        message.error('No se pudo crear el laboratorio, revisa los datos');
      }
    } catch (error) {
      // Manejar el error según el código de respuesta del servidor
      if (error.response) {
        if (error.response.status === 409) {
          message.warning('Ya existe un laboratorio con este nombre.');
        } else {
          message.error(
            `Error del servidor (${error.response.status}): ${error.response.data.message || 'No se pudo crear el laboratorio.'}`
          );
        }
      } else {
        console.error('Error en la solicitud:', error);
        message.error('Error de conexión al servidor.');
      }
    }
  };

  //-------------------------------------------------------- Stage Usuarios(4) --------------------------------------------------------
  // Use listLabs para mostrar los laboratorios en el combobox
  const [selectedLabId, setSelectedLabId] = useState(null); // Para almacenar el ID del laboratorio seleccionado
  const [btnContinue_user, setBtnContinue_user] = useState(false);
  const [userNameLab, setUserNameLab] = useState('');
  const [passwordLab, setPasswordLab] = useState('');

  // Function para agregar un usuario a un laboratorio
  const createUsersToLab = async () => {
    const data = {
      username: userNameLab,
      password: passwordLab,
      lab_id: selectedLabId,
    };

    // Validar si los campos 'userNameLab', 'passwordLab' o 'selectedLabId' están vacíos
    if (!userNameLab || !passwordLab || !selectedLabId) {
      message.error('Debe agregar información en los campos "usuario", "contraseña" y seleccionar un laboratorio.');
      return; // Detener la ejecución si algún campo está vacío
    }

    try {
      const response = await axios.post(BACKEND + '/config/set/user', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        // Obtener la respuesta del servidor
        const mensaje = response.data.message;
        message.success(mensaje);
        setBtnContinue_user(true);
      } else {
        message.error('No se pudo agregar el usuario al laboratorio, revisa los datos');
      }
    } catch (error) {
      // Manejar el error según el código de respuesta del servidor
      if (error.response) {
        const mensaje = error.response.data.message;
        message.warning(mensaje);
        if (error.response.status === 409) {
          // Manejo para conflictos (por ejemplo, usuario ya existe)
        } else {
          message.error(
            `Error del servidor (${error.response.status}): ${error.response.data.message || 'No se pudo crear el usuario.'}`
          );
        }
      } else {
        console.error('Error en la solicitud:', error);
        message.error('Error de conexión al servidor.');
      }
    }
  };

  //-------------------------------------------------------- Stage Institute(5) --------------------------------------------------------
  const [schoolName, setSchoolName] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  const addInformationInstitute = async () => {
      const data = {
        name: schoolName,
        city: city,
        state: state,
        country: country
      };
    
      // Validar si los campos necesarios están vacíos
      if (!schoolName || !city || !state || !country) {
        message.error('Debe agregar información en todos los campos (nombre, ciudad, estado y país).');
        return; // Detener la ejecución si algún campo está vacío
      }
    
    
      try {
        const response = await axios.post(BACKEND + '/config/set/institute', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        if (response.status === 200) {
          // Obtener la respuesta del servidor
          const mensaje = response.data.message;
          message.success(mensaje);
          next();
         // finish(); // Llamar a la función de finalización si la solicitud es exitosa
        } else {
          message.error('No se pudo crear la institución, revisa los datos');
        }
      } catch (error) {
        // Manejar el error según el código de respuesta del servidor
        if (error.response) {
          const mensaje = error.response.data.message;
          message.warning(mensaje);
          if (error.response.status === 409) {
            // Manejo de conflicto si es necesario (por ejemplo, institución ya existe)
          } else {
            message.error(
              `Error del servidor (${error.response.status}): ${error.response.data.message || 'No se pudo crear la institución.'}`
            );
          }
        } else {
          console.error('Error en la solicitud:', error);
          message.error('Error de conexión al servidor.');
        }
      }
    };


    //-------------------------------------------------------- Stage Host(6) --------------------------------------------------------
    // Funciones para manejar las conexiones y pruebas
const testIPFSConnection = async () => {
  //hacer un post a /config/ipfs/test del backend con fetch, enviar en el body host: ipfsHost
  const data = {
    host: ipfsHost
  };
  try {
    const response = await axios.post(BACKEND + '/config/ipfs/test', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      //mostrar un message
      message.success('Conexión exitosa con el nodo IPFS');
      setIpfsConnected(true);
    } else {
      setIpfsConnected(false);
    }
  } catch (error) {
    message.error('No se pudo conectar con el nodo IPFS');
    setIpfsConnected(false);
  }
};

//Function test  con axios, testt blockchain controller
const testBlockchainConnection = async () => {
  
  console.log('host blockchain', blockchainHost+'/test');
  //hacerlo con fetch
  try {
    const response = await fetch(blockchainHost+'/test');
    
    if (response.ok) {
      //mostrar un message
      message.success('Conexión exitosa con el controlador de blockchain');
      setAlchemyApiKeyVerified(true);
      //setear el ipfshost y el blockchainHost
    
    } else {

      setAlchemyApiKeyVerified(false);
    }
  } catch (error) {
    message.error('No se pudo conectar con el controlador de blockchain');
    setAlchemyApiKeyVerified(false);
  }

};



const verifyHost = () => {

  //verificar que ipfsConnected y blockchainController sean true
  if(ipfsConnected && blockchainController == false){
    message.error('No se pudo guardar la configuración en el servidor');
    return;
  }
  // Lógica para finalizar la configuración, como almacenar los datos en el backend o continuar con el flujo.
  //guardar en el backend /config/host, con en el body host_ipfs y host_blockchain_controller
  const data = {
    host_ipfs: ipfsHost,
    host_blockchain_controller: blockchainHost
  };
  axios.post(BACKEND + '/config/host', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.status === 200) {
      message.success('Configuración guardada en el servidor');
      //setear el ipfshost y el blockchainHost

      next();
    } else {
      message.error('No se pudo guardar la configuración en el servidor');
    }
  }).catch((error) => {
    console.error('Error en la solicitud:', error);
    message.error('No se pudo guardar la configuración en el servidor.');
  });
};

// Estado para manejar las verificaciones de conexión
const [ipfsHost, setIpfsHost] = useState('');
const [ipfsConnected, setIpfsConnected] = useState(false);
const [blockchainController, setAlchemyApiKeyVerified] = useState(false);
const [blockchainHost, setBlockchainHost] = useState('');
//testBlockchainConnection

//----------------------------------------- fWALLET VARIABLES-----------------------------------------
const [walletPrivateKey, setWalletPrivateKey] = useState('');
const [walletAddress, setWalletAddress] = useState('');
const [alchemyApiKey, setAlchemyApiKey] = useState('');
const [walletConnected, setWalletConnected] = useState(false);


//testWallet
const testWallet = async () => {
  //verificar que los 3 campos no esten vacios
  if (!walletPrivateKey || !walletAddress || !alchemyApiKey) {
    message.error('Por favor completa todos los campos.');
    return;
  }
  //hacer un axios.post a /config/wallet del backend
  const data = {
    privateKey: walletPrivateKey,
    addressWallet: walletAddress,
    alchemyApiKey: alchemyApiKey
  };
  try {
    const response = await axios.post(BACKEND + '/config/wallet', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      //obtener el response data {message: "Blockchain API funcionando correctamente"}
      //mostrar un message
      message.success(response.data.message);
      setWalletConnected(true);
    } else {
      //mostrar el error de el response balance
      message.success(response.data.message);
      setWalletConnected(false);
    }
  } catch (error) {
    message.error('No se pudo conectar con la wallet');
    setWalletConnected(false);
  }
};
//verifyBlockchainSettings
const verifyBlockchainSettings = () => {
  // registrar las configuraciones en el backend
  //finish();
  //verificar que walletConnected y walletVerified sean true
  if(walletConnected == false){
    message.error('No se pudo guardar la configuración en el servidor');
    return;
  }
  finish();
};
//----------------------------------------- finalizar configuración -----------------------------------------
  //Efectos para terminar la configuración
  const [showConfetti, setShowConfetti] = useState(false);
  const [recycle, setRecycle] = useState(true);

  //Función para finalizar la configuración
const handleShowConfetti = () => {
    setShowConfetti(true);
    setRecycle(true); // Permitir que las partículas aparezcan
    setTimeout(() => setRecycle(false), 1500); // Detener gradualmente después de 3 segundos
    setTimeout(() => {
      setShowConfetti(false); // Ocultar el componente completamente después de 6 segundos
      // Redirige a la ruta /login después de 6 segundos
      navigate('/login');  // Redirige aquí
    }, 3000); 
  };

  //Generales
  const [filteredLabs, setFilteredLabs] = useState([]); // Para almacenar los resultados filtrados
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  //Función para avanzar en el formulario
  const next = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((errorInfo) => {
        console.error('Validation failed:', errorInfo);
      });
  };
  //Función para retroceder en el formulario
  const prev = () => setCurrentStep(currentStep - 1);
  //Función para finalizar la configuración
  const finish = () => {
    //message.success('Configuration Complete!');
    handleShowConfetti();
  };

  const steps = [

    { //-------------------------------------------- Sección de servidor 1--------------------------------------------
      title: 'Base de datos',
      content: (
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center' }}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <DatabaseOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
            Configuración del Servidor
          </h2>
          <div
            style={{
              borderTop: '1px solid #b9b9b9',
              marginTop: '10px',
              width: '100%',
              marginBottom: '0px',
            }}
          ></div>
          <p style={{ marginBottom: '0', color:'#272727'}}>
            Completa los siguientes campos para conectar tu aplicación al servidor y la base de datos.
          </p>
        </div>
  
        {/* Formulario */}
        <Form.Item
          label="Dirección del servidor"
          name="server_name"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input 
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          placeholder="Ingresa el nombre del servidor" />
        </Form.Item>
        <Form.Item
          label="Base de datos"
          name="database_name"
          rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
        >
          <Input 
          value={databaseName}
          onChange={(e) => setDatabaseName(e.target.value)}
          placeholder="Ingresa el nombre de la base de datos" />
        </Form.Item>
        <Form.Item
          label="Puerto"
          name="port"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input
          value={portDb}
          onChange={(e) => setPortDB(e.target.value)}
          placeholder="Ingresa el puerto. Ejemplo 3306" />
        </Form.Item>
        <Form.Item
          label="Usuario"
          name="user"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input 
          value={userDb}
          onChange={(e) => setUserDB(e.target.value)}
          placeholder="Ingresa el usuario" />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input.Password 
          value={passwordDb}
          onChange={(e) => setPasswordDB(e.target.value)}
          placeholder="Ingresa la contraseña" />
        </Form.Item>
            
        <Button type="default" style={{ marginRight: '10px' }} onClick={testConnectionDB}>
          Probar conexión
        </Button>
        <Button
        type="primary"
        onClick={writeConfigDB}
        disabled={!connectionStatus} // Deshabilita el botón si connectionStatus es false
      >
          Continuar
        </Button>
      </Form>
      
      ),
    },
    { //-------------------------------------------- Sección de super usuario 2--------------------------------------------
      title: 'Administrador',
      content: (
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center' }}>
      
        {/* Título con icono de base de datos */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <UserOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
            Administrador
          </h2>
          <div
            style={{
              borderTop: '1px solid #b9b9b9',
              marginTop: '10px',
              width: '100%',
              marginBottom: '0px',
            }}
          ></div>
          <p style={{ marginBottom: '0', color:'#272727'}}>
            Crea las credenciales de acceso para el administrador de la aplicación.
          </p>
        </div>
  
        {/* Formulario */}
 
        <Form.Item
          label="Usuario"
          name="user"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input 
          value={superUser}
          onChange={(e) => setSuperUser(e.target.value)}
          placeholder="Ingresa el usuario" />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input.Password 
          value={superPassword}
          onChange={(e) => setSuperPassword(e.target.value)}
          placeholder="Crear una contraseña" />
        </Form.Item>
        <Form.Item
          label="Confirmar contraseña"
          name="password2"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input.Password 
          value={superPassword2}
          onChange={(e) => setSuperPassword2(e.target.value)}
          placeholder="Confirmar la contraseña" />
        </Form.Item>
  
        <Button type="default" style={{ marginRight: '10px' }} onClick={prev}>
          Regresar
        </Button>
        <Button type="primary" onClick={createAccount}>
          Continuar
        </Button>
      </Form>
      
      ),
    },
    { //-------------------------------------------- Sección de laboratorios 3--------------------------------------------
      title: 'Laboratorios',
      content: (
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center' }}>
      
        {/* Título con icono de base de datos */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ExperimentOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
            Laboratorios
          </h2>
          <div
            style={{
              borderTop: '1px solid #b9b9b9',
              marginTop: '10px',
              width: '100%',
              marginBottom: '0px',
            }}
          ></div>
          <p style={{ marginBottom: '0', color:'#272727'}}>
            Crea los laboratorios que se utilizarán en la aplicación.
          </p>
        </div>
  
        {/* Formulario */}
        <Form.Item
          label="Agregar laboratorio"
          name="labname"
          rules={[{ required: false, message: 'Por favor completa este campo' }]}
          style={{marginTop: '10px'}}
        >
          <Input 
          value={laboratorio}
          onChange={(e) => setLaboratorio(e.target.value)}
          placeholder="Ingresa el nombre del laboratorio" />
        </Form.Item>
        <Form.Item
          label="Investigador"
          name="invname"
          rules={[{ required: false, message: 'Por favor completa este campo' }]}
        >
          <Input 
          value={investigador}
          onChange={(e) => setInvestigador(e.target.value)}
          placeholder="Ingresa el nombre del investigador" />
        </Form.Item>
        <Button type="default" style={{ marginTop: '-15px' }} onClick={createLab} >
          Agregar
        </Button>

        <div
            style={{
              borderTop: '1px solid #b9b9b9',
              marginTop: '20px',
              width: '100%',
              marginBottom: '10px',
            }}
          ></div>
           
      <List
  bordered
  dataSource={filteredLabs}
  style={{
    marginTop: '20px',
    marginBottom: '20px',
    height: '150px', // Establecer un alto fijo
    overflowY: 'auto', // Activar desplazamiento vertical
  }}
  renderItem={(item) => (
    <List.Item
      key={item.id}
      style={{
        transition: 'background-color 0.3s ease', // Transición suave
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      <div>
        <strong>{item.nombre}</strong> - {item.investigador}
      </div>
    </List.Item>
  )}
/>



       

  

        <Button type="primary" onClick={next} disabled={!btnContinue_lab}>
          Continuar
        </Button>
      </Form>
      
      ),
    },
    { //-------------------------------------------- Sección de usuarios -4-------------------------------------------
      title: 'Usuarios',
      content: (
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center' }}>
      
        {/* Título con icono de base de datos */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <UserAddOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
            Agregar usuarios
          </h2>
          <div
            style={{
              borderTop: '1px solid #b9b9b9',
              marginTop: '10px',
              width: '100%',
              marginBottom: '0px',
            }}
          ></div>
          <p style={{ marginBottom: '0', color:'#272727'}}>
            Agrega los usuarios que tendrán acceso a la aplicación.
          </p>
        </div>
  
        {/* Formulario */}
  {/* AGREGAR UN combobox DE LABORATORIO*/}
  <Form.Item
          label="Laboratorio"
          name="labName"
          rules={[{ required: false, message: 'Por favor completa este campo' }]}
        >
<Select
  placeholder="Selecciona un laboratorio"
  style={{ width: '100%', marginBottom: '10px' }}
  onChange={(value) => {
    setSelectedLabId(value);
  }}
>
  {listLabs.map((lab) => (
    <Option key={lab.id} value={lab.id}>
      {lab.nombre} - {lab.investigador}
    </Option>
  ))}
</Select>

        </Form.Item>
        <Form.Item
          label="Usuario"
          name="labname"
          rules={[{ required: false, message: 'Por favor completa este campo' }]}
        >
          <Input 
          value={userNameLab}
          onChange={(e) => setUserNameLab(e.target.value)}
          placeholder="Ingresa el nombre de usuario" />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: false, message: 'Por favor completa este campo' }]}
        >
          <Input.Password 
          value={passwordLab}
          onChange={(e) => setPasswordLab(e.target.value)}
          placeholder="Ingresa la contraseña" />
        </Form.Item>
        <Button type="default" style={{ marginTop: '-15px' }} onClick={createUsersToLab}>
          Agregar
        </Button>
        
        <p style={{ marginBottom: '20px', color:'#272727'}}>
            Recuerda que después podrás agregar más usuarios desde la aplicación.
          </p>
          
  
    
        <Button type="primary" onClick={next} disabled={!btnContinue_user}>
          Continuar
        </Button>
      </Form>
      
      ),
    },
    { //-------------------------------------------- Sección de institución 5--------------------------------------------
      title: 'Institución',
      content: (
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center' }}>
      
        {/* Título con icono de base de datos */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <BankOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
            Información de la institución
          </h2>
          <div
            style={{
              borderTop: '1px solid #b9b9b9',
              marginTop: '10px',
              width: '100%',
              marginBottom: '0px',
            }}
          ></div>
          <p style={{ marginBottom: '0', color:'#272727'}}>
            Agrega la Información de la institución perteneciente.
          </p>
        </div>
  
        {/* Formulario */}
  {/* AGREGAR UN combobox DE LABORATORIO*/}

        <Form.Item
          label="Instituto/Universidad"
          name="schoolName"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input 
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="Ingresa el nombre del instituto/universidad" />
        </Form.Item>
        
        <Form.Item
          label="País"
          name="country"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input 
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Ingresa tu país" />
        </Form.Item>
        <Form.Item
          label="Estado/Provincia"
          name="state"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input 
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="Ingresa el nombre del estado/provincia" />
        </Form.Item>
        <Form.Item
          label="Ciudad"
          name="city"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ingresa tu ciudad" />
        </Form.Item>

    
        <Button type="primary" onClick={addInformationInstitute} >
          Continuar
        </Button>
      </Form>
      
      ),
    },
    { //-------------------------------------------- Sección de configuración de IPFS y blockchain (6) --------------------------------------------
      title: 'IPFS',
      content: (
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center' }}>
    
          {/* Título con icono de base de datos */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ControlOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
              Configuración de controladores
            </h2>
            <div
              style={{
                borderTop: '1px solid #b9b9b9',
                marginTop: '10px',
                width: '100%',
                marginBottom: '0px',
              }}
            ></div>
            <p style={{ marginBottom: '0', color:'#272727'}}>
              Configura los parámetros para conectar con IPFS, y el controlador de blockchain.
            </p>
          </div>
    
          {/* Nodo IPFS Host */}
          <Form.Item
            label={
              <span>
                Nodo IPFS Host
                <Tooltip title="Ingresa la IP de tu nodo de IPFS para establecer la conexión.">
                  <QuestionCircleOutlined style={{ marginLeft: '8px', fontSize: '16px', cursor: 'pointer' }} />
                </Tooltip>
              </span>
            }
            name="ipfsHost"
          
          >
            <Input
              placeholder="Ingresa el host de tu nodo IPFS"
              value={ipfsHost}
              onChange={(e) => setIpfsHost(e.target.value)}
            />
            <Button type="default" style={{ marginTop: '8px' }} onClick={() => testIPFSConnection()} icon={<SearchOutlined />}>
              Probar Conexión
            </Button>
          </Form.Item>
    
          {/* Blockchain Controlador Host */}
          <Form.Item
            label={
              <span>
                Blockchain Controlador Host
                <Tooltip title="Ingresa la IP de tu controlador blockchain para la conexión. Ejemplo: (127.0.0.1:10000)">
                  <QuestionCircleOutlined style={{ marginLeft: '8px', fontSize: '16px', cursor: 'pointer' }} />
                </Tooltip>
              </span>
            }
            name="blockchainHost"
            
          >
            <Input
              placeholder="Ingresa el host de tu Blockchain"
              value={blockchainHost}
              onChange={(e) => setBlockchainHost(e.target.value)}
            />
            <Button type="default" style={{ marginTop: '8px' }} onClick={() => testBlockchainConnection()} icon={<SearchOutlined />}>
              Probar Conexión
            </Button>
          </Form.Item>
    
          {/* Labels para verificar las conexiones */}
          <div>
            <label style={{ color: ipfsConnected ? 'green' : 'gray' }}>
              {ipfsConnected ? '✅ Nodo de IPFS conectado' : 'Nodo de IPFS no conectado'}
            </label>
          </div>
    
          <div>
            <label style={{ color: blockchainController ? 'green' : 'gray' }}>
              {blockchainController ? '✅ Controlador blockchain conectado' : 'Controlador blockchain no conectado'}
            </label>
          </div>
    
          {/* Botón Finalizar */}
          <br/>
          <Button 
            type="primary" 
            onClick={verifyHost} 
            disabled={!ipfsConnected || !blockchainController}
          >
            Continuar
          </Button>
        </Form>
      ),
    },
    { //-------------------------------------------- Sección de Wallet (7) --------------------------------------------
      title: 'Wallet',
      content: (
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center' }}>
          
          {/* Título con icono de configuración */}
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <WalletOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
              Agrega tu Wallet
            </h2>
            <div
              style={{
                borderTop: '1px solid #b9b9b9',
                marginTop: '10px',
                width: '100%',
                marginBottom: '0px',
              }}
            ></div>
            <p style={{ marginBottom: '0', color:'#272727'}}>
              Configura los parámetros para conectar con Alchemy y tu wallet. Asegurate de tener por lo menos 1 Matic en tu wallet.
            </p>
          </div>
    
          {/* API Key de Alchemy */}
          <Form.Item
            label={
              <span>
                API Key de Alchemy
                <Tooltip title="Ingresa tu API Key de Alchemy para interactuar con la blockchain." >
                  <QuestionCircleOutlined style={{ marginLeft: '8px', fontSize: '16px', cursor: 'pointer' }} />
                </Tooltip>
              </span>
            }
            name="alchemyApiKey"
            
          >
            <Input
              placeholder="Ingresa tu API Key de Alchemy"
              value={alchemyApiKey}
              onChange={(e) => setAlchemyApiKey(e.target.value)}
            />
          </Form.Item>
    
          {/* Private Key de la Wallet */}
          <Form.Item
            label={
              <span>
                Private Key de la Wallet
                <Tooltip title="Ingresa tu Private Key, utilizada para firmar transacciones. Mantén este dato seguro.">
                  <QuestionCircleOutlined style={{ marginLeft: '8px', fontSize: '16px', cursor: 'pointer' }} />
                </Tooltip>
              </span>
            }
            name="walletPrivateKey"
            
          >
            <Input.Password
              placeholder="Ingresa tu Private Key"
              value={walletPrivateKey}
              onChange={(e) => setWalletPrivateKey(e.target.value)}
            />
          </Form.Item>
    
          {/* Dirección de la Wallet */}
          <Form.Item
            label={
              <span>
                Dirección de la Wallet
                <Tooltip title="Dirección pública de tu Wallet en la blockchain. De MetaMask, por ejemplo." >
                  <QuestionCircleOutlined style={{ marginLeft: '8px', fontSize: '16px', cursor: 'pointer' }} />
                </Tooltip>
              </span>
            }
            name="walletAddress"
          
          >
            <Input
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </Form.Item>
    
          {/* Botón de test*/}
          <Button type="default" style={{ marginTop: '8px' }} onClick={testWallet} icon={<SearchOutlined />}>
            Probar Conexión
          </Button>
          <br/><br/>
          <Button type="primary" onClick={verifyBlockchainSettings} disabled={!walletConnected}>
            Finalizar
          </Button>
        </Form>
      ),
    },
   
  ];

  return ( 
    <Layout style={{width:'100vw', height: '100vh', margin: '-10px', padding: '0px'}} >
      <Header style={{ color: 'white', textAlign: 'center', fontSize: '20px' }}>
        Logo
      </Header>
      <Content style={{ padding: '20px', marginTop: '20px' }}>
        <Content style={{width:'100%', marginBottom: '20px', backgroundColor:'none', display: 'flex', flexDirection: 'row', justifyContent:'center', alignContent:'center', alignItems: 'center'}}>
          <Steps current={currentStep} style={{ backgroundColor:'none', width: '80%'}}>
            {steps.map((step, index) => (
              <Step key={index} title={step.title} />
            ))}
          </Steps>
        </Content>
        <div style={{ padding: '20px', borderRadius: '8px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '50%', maxWidth: '450px', minWidth: '350px', border: '1px solid #d4d4d4' }}>
            {steps[currentStep].content}
          </div>
        </div>

      </Content>
      {showConfetti && (
        <Confetti
        
          recycle={recycle} // Controlar si las partículas se reciclan
          numberOfPieces={300} // Número inicial de partículas
          gravity={0.2} // Gravedad para caída más lenta
        />
      )}
      <Footer style={{ textAlign: 'center' }}>ReplacedSpace17 - Axiom</Footer>
    </Layout>
  );
}

export default SetUp;
