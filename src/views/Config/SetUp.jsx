import React, { useState, useEffect } from 'react';
import { Layout, Steps, Form, Input, Select, Button, message, Space, List} from 'antd';
import { DatabaseOutlined, UserOutlined, ExperimentOutlined, UserAddOutlined, BankOutlined} from '@ant-design/icons';
import Confetti from 'react-confetti';
import BACKEND from '../../config/backend';
import axios from 'axios';
import { use } from 'react';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate

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
          finish(); // Llamar a la función de finalización si la solicitud es exitosa
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
    { //-------------------------------------------- Sección de servidor --------------------------------------------
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
    { //-------------------------------------------- Sección de super usuario --------------------------------------------
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
    { //-------------------------------------------- Sección de laboratorios --------------------------------------------
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
    { //-------------------------------------------- Sección de usuarios --------------------------------------------
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
    { //-------------------------------------------- Sección de institución --------------------------------------------
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
