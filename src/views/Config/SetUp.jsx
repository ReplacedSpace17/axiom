import React, { useState, useEffect } from 'react';

import { Layout, Steps, Form, Input, Select, Button, message, Space, List} from 'antd';
import { DatabaseOutlined, UserOutlined, ExperimentOutlined, UserAddOutlined} from '@ant-design/icons';
import Confetti from 'react-confetti';
import BACKEND from '../../config/backend';
import axios from 'axios';

const { Header, Content, Footer } = Layout;
const { Step } = Steps;
const { Option } = Select;

function SetUp() {


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
      
      console.log('Respuesta:', response.status);
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
    console.log('Usuario:', superUser);
    console.log('Contraseña:', superPassword);
    console.log('Contraseña2:', superPassword2);

    //validar que los passwords sean iguales
    if(superPassword == superPassword2){
      try {
        const data = {
          username: superUser,
          password: superPassword
        };
        const response = await axios.post(BACKEND + '/config/set/superuser', data, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if(response.status === 200){
          message.success('Cuenta de super usuario creada');
          next();
        }
        else{
          message.success('No se pudo crear la cuenta de super usuario');
        }
      }
      catch (error) {
        // Manejar el error
        console.error('Error en la solicitud:', error);
        message.error('No se pudo crear la cuenta de super usuario.');
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

  useEffect(() => {
    console.log('Lista de laboratorios actualizada:', listLabs);
  }, [listLabs]);


  //Function para agregar un laboratorio
  const createLab = async () => {
    const data = {
      nombre: laboratorio,
      investigador: investigador,
    };
  
    try {
      const response = await axios.post(BACKEND + '/config/set/laboratory', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        setListLabs(data); // Agrega el nuevo laboratorio a la lista existente
        setFilteredLabs((prevLabs) => [...prevLabs, data]);
        console.log('Lista de laboratorios:', listLabs);
        
        message.success('Laboratorio agregado exitosamente');
        //handleReset();
      } else {
        message.error('No se pudo crear el laboratorio, revisa los datos');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      message.error('No se pudo crear el laboratorio');
    }
  };
  
  const handleReset = () => {
    setLaboratorio('');  // Resetea el valor a blanco
    setInvestigador(''); // Resetea el valor a blanco
    //imprimir
    console.log('Laboratorio:', laboratorio);
    console.log('Investigador:', investigador);
  };
  

  //Function para obtener la lista de laboratorios
  const getListLabs = async () => {
    //validar que los passwords sean iguales
    try {

      const response = await axios.get(BACKEND + '/config/get/laboratories', {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if(response.status === 200){
        setListLabs(response.data.laboratories);
        //setFilteredLabs(response.data.laboratories);
        console.log('Lista de laboratorios:', listLabs);
        setFilteredLabs(listLabs);
        
        //console.log('Lista de laboratorios:', listLabs);
      }
      else{
        message.success('No se pudo crear la cuenta de super usuario');
      }
    }
    catch (error) {
      // Manejar el error
      console.error('Error en la solicitud:', error);
      message.error('No se pudo crear la cuenta de super usuario.');
    }
  };
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [recycle, setRecycle] = useState(true);
  const handleShowConfetti = () => {
    setShowConfetti(true);
    setRecycle(true); // Permitir que las partículas aparezcan
    setTimeout(() => setRecycle(false), 1500); // Detener gradualmente después de 3 segundos
    setTimeout(() => setShowConfetti(false), 3000); // Ocultar el componente completamente después de 6 segundos
  };


//--------




//--------



  const [searchTerm, setSearchTerm] = useState(''); // Para almacenar el término de búsqueda
  const [filteredLabs, setFilteredLabs] = useState([]); // Para almacenar los resultados filtrados


  // Filtra los laboratorios en base al término ingresado
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredLabs(
      listLabs.filter((lab) =>
        lab.nombre.toLowerCase().includes(term) // Filtra por nombre del laboratorio
      )
    );
  };
  //

  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

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

  const prev = () => setCurrentStep(currentStep - 1);

  const finish = () => {
    //message.success('Configuration Complete!');
    handleShowConfetti();
  };

  const msj = () => {
    message.success('Configuration Complete!');
    //handleShowConfetti();
  };

  const steps = [
    {
      title: 'Base de datos',
      content: (
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center' }}>
      
        {/* Título con icono de base de datos */}
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
    {
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
    {
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
        <Button type="default" style={{ marginTop: '-15px' }} onClick={createLab}>
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
          
  {/* AGREGAR UN BUSCADOR DE LABORATORIO*/}
  
        <Input
          placeholder="Buscar laboratorio por nombre"
          value={searchTerm}
          onChange={handleSearch}
          style={{ marginBottom: '20px' }}
        />
      
      <List
  bordered
  dataSource={filteredLabs}
  style={{
    marginTop: '-10px',
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



       

  
        <Button type="default" style={{ marginRight: '10px' }} onClick={prev}>
          Regresar
        </Button>
        <Button type="primary" onClick={next}>
          Continuar
        </Button>
      </Form>
      
      ),
    },
    {
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
  <Select placeholder="Selecciona un laboratorio" style={{width:'100%', marginBottom:'10px'}}>
          <Option value="opcion1">Opción 1</Option>
          <Option value="opcion2">Opción 2</Option>
          <Option value="opcion3">Opción 3</Option>
        </Select>
        </Form.Item>
        <Form.Item
          label="Usuario"
          name="labname"
          rules={[{ required: false, message: 'Por favor completa este campo' }]}
        >
          <Input placeholder="Ingresa el nombre de usuario" />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: false, message: 'Por favor completa este campo' }]}
        >
          <Input.Password placeholder="Ingresa la contraseña" />
        </Form.Item>
        <Button type="default" style={{ marginTop: '-15px' }} onClick={prev}>
          Agregar
        </Button>
        
        <p style={{ marginBottom: '20px', color:'#272727'}}>
            Recuerda que después podrás agregar más usuarios desde la aplicación.
          </p>
          
  
        <Button type="default" style={{ marginRight: '10px' }} onClick={prev}>
          Regresar
        </Button>
        <Button type="primary" onClick={finish}>
          Finalizar
        </Button>
      </Form>
      
      ),
    },
  ];

  return (
    <Layout style={{width:'100%', height: '100vh', margin: '0px', padding: '0px'}} >
      <Header style={{ color: 'white', textAlign: 'center', fontSize: '20px' }}>
        Configuration Wizard
      </Header>
      <Content style={{ padding: '20px', marginTop: '20px' }}>
        <Steps current={currentStep} style={{ marginBottom: '30px' }}>
          {steps.map((step, index) => (
            <Step key={index} title={step.title} />
          ))}
        </Steps>
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
