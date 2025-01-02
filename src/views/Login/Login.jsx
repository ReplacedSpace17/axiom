import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";

import { Layout, Form, Input, Button, Checkbox, message, Steps } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from "axios";
const { Header, Content, Footer } = Layout;
const { Step } = Steps;
import BACKEND from '../../config/backend';

// import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.
import logo from '../../assets/logo/logo.svg';
import '../../assets/colors_palette.css';
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  //username y password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const [init, setInit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep] = useState(0); // Usado para mantener consistencia con el estilo
  const steps = [{ title: 'Inicio de sesión', content: 'Formulario de acceso' }];

  
  const onFinish = async (values) => {
    setLoading(true); //Cambiar el loader1
    //armar el json
    const data = {
      "username": username,
      "password": password
    }
    try {
      const response = await axios.post(BACKEND + '/login/user', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        // Obtener la respuesta del servidor
        const mensaje = response.data.message;
        message.success(mensaje);
        setLoading(false);

        //obatener el token y almacenarlo en cache
        const token = response.data.token;
        //almacenar el token en el local storage
        
        navigate('/admin/home');
      } 
    } catch (error) {
      // Manejar el error según el código de respuesta del servidor
      if (error.response) {
        setLoading(false);
       
        if (error.response.status === 401) {
          // Manejo de conflicto si es necesario (por ejemplo, institución ya existe)
          message.warning('Usuario o contraseña incorrectos.'); 
        } else {
          message.error(
            `Error del servidor (${error.response.status}): ${error.response.data.message || 'No se pudo crear la institución.'}`
          );
        }
      } else {
        console.error('Error en la solicitud:', error);
        //message.error('Error de conexión al servidor.');
      }
    }
    // enviar un request al servidor /login/user


 
  };

  const onOlvidarContrasena = () => {
    message.info('Por favor, contacte al administrador del sistema para recuperar su contraseña.');
  };

  const onFinishFailed = (errorInfo) => {
    message.error('Por favor, complete los campos correctamente.');
  };

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      // Evitar cambios innecesarios en el estado
    });
  }, []); // Solo se ejecuta una vez al montar el componente

  const particlesLoaded = (container) => {
    console.log(container);
  };

  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "none",
        },
      },
      fpsLimit: 144,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "grab",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          grab:{
            distance: 200,
          }
        },
      },
      particles: {
        color: {
          value: "#263057",
        },
        links: {
          color: "#263057",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 200,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 5 },
        },
      },
      detectRetina: true,
    }),
    [] // Solo se crea una vez
  );

  const Login =()=>{
    const data = {
      "username": username,
      "password": password
    }

    console.log(data);
  };

  const MemoizedParticles = useMemo(() => (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
    />
  ), [options]);  // Dependiendo de `options`, pero no de `username` o `password`
  

  return (
    <Layout style={{ width: '100vw', height: '100vh', margin: '-8px', padding: '0px', backgroundColor:'none' ,
      backgroundColor: 'rgb(222, 222, 222)', // Fondo semi-transparente
        backdropFilter: 'blur(390px)', // Aplicar el desenfoque
        WebkitBackdropFilter: 'blur(500px)',
    }}>
        {MemoizedParticles}
      

      <Header style={{ color: 'white', textAlign: 'center', fontSize: '20px', zIndex: 1 }}>
        Axiom 
      </Header>
      
      <Content style={{ padding: '20px', marginTop: '20px', backgroundColor:'none', display:'flex',flexDirection:'column', alignContent:'center', justifyContent:'center'}}>
        
        <div
          style={{
            padding: '10px',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'none',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '8px',
              width: '50%',
              maxWidth: '400px',
              minWidth: '350px',
              border: '1px solid #c3c3c3',
              zIndex: 1,
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img src={logo} alt="logo" style={{ width: '150px' }} />
              <p style={{ color: '#212121', fontSize: '16px', marginTop: '2.5em' }}>
                Por favor, inicie sesión para continuar
              </p>
            </div>
            <Form
              name="login"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
            >
              <Form.Item
                label="Usuario"
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese su usuario!',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Usuario"
                  allowClear
                />
              </Form.Item>

              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese su contraseña!',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  allowClear
                />
              </Form.Item>

              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox style={{ color: '#7d7d7d' }}>Recordarme</Checkbox>
                </Form.Item>
                <a 
  onClick={onOlvidarContrasena} 
  style={{ float: 'right', color: '#1890ff', cursor: 'pointer' }}
>
  ¿Olvidaste tu contraseña?
</a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  onClick={Login}
                  loading={loading}
                  style={{
                    backgroundColor: 'var(--primary-color)',
                    borderColor: 'none',
                    height: '45px',
                    fontSize: '16px',
                    marginBottom: '-2em',
                  }}
                >
                  Iniciar Sesión
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
     
 
    
      </Layout>
  );
  
};

export default LoginForm;