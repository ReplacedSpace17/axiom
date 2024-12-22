import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";

import { Layout, Form, Input, Button, Checkbox, message, Steps } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Step } = Steps;

// import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

const LoginForm = () => {
  //username y password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [init, setInit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep] = useState(0); // Usado para mantener consistencia con el estilo
  const steps = [{ title: 'Inicio de sesión', content: 'Formulario de acceso' }];

  const onFinish = async (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('¡Ingreso exitoso!');
      console.log('Login successful:', values);
    }, 1000);
  };

  const onFinishFailed = (errorInfo) => {
    message.error('Por favor, complete los campos correctamente.');
  };

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

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
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: "push",
          },
          onHover: {
            enable: false,
            mode: "repulse",
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
        },
      },
      particles: {
        color: {
          value: "#2b2b2b",
        },
        links: {
          color: "#2b2b2b",
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
    [],
  );

  const Login =()=>{
    const data = {
      "username": username,
      "password": password
    }

    console.log(data);
  };


  return (
    <Layout style={{ width: '100vw', height: '100vh', margin: '-8px', padding: '0px', backgroundColor:'yellow' }}>
         <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
      <Header style={{ color: 'white', textAlign: 'center', fontSize: '20px', zIndex: 1 }}>
        Logo
      </Header>
      
      <Content style={{ padding: '20px', marginTop: '20px', backgroundColor:'orange', display:'flex',flexDirection:'column', alignContent:'center', justifyContent:'center'}}>
        
        <div
          style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'red',
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
              border: '1px solid #d4d4d4',
              zIndex: 1,
            }}
          >
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
                <a href="#" style={{ float: 'right', color: '#1890ff' }}>
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
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    height: '45px',
                    fontSize: '16px',
                  }}
                >
                  Iniciar Sesión
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>ReplacedSpace17 - Axiom</Footer>
 
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
      </Layout>
  );
  
};

export default LoginForm;