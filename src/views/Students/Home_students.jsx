import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import { HomeOutlined, UserOutlined, LaptopOutlined } from '@ant-design/icons';
import BACKEND from '../../config/backend';
import axios from 'axios';
import Sessions from '../../utils/Sesions';
import { useNavigate } from 'react-router-dom';
const { Header, Content, Sider } = Layout;

const HomeStudents = () => {
  // Estado para verificar si el usuario está logueado
  const [isLogged, setIsLogged] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = async () => {
      try {
        const validate = await Sessions.validateSession(); // Esperar a que se resuelva la promesa
        setIsLogged(validate);
        //alert(`¿Sesión válida?: ${validate}`);
        
        if (!validate) {
          navigate('/login'); // Redirigir si no está logueado
        }
      } catch (error) {
        console.error('Error validando sesión:', error);
        setIsLogged(false);
        navigate('/login'); // Redirigir en caso de error
      }
    };

    validateSession(); // Llamar a la función asíncrona
  }, [navigate]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header className="site-layout-background" style={{ padding: 0 }}>
        <div style={{ color: 'white', fontSize: '20px', textAlign: 'center' }}>
          Mi Aplicación Super Usuario
        </div>
      </Header>

      {/* Main Layout */}
      <Layout>
        {/* Sider */}
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item key="1" icon={<HomeOutlined />}>
              Inicio
            </Menu.Item>
            <Menu.Item key="2" icon={<UserOutlined />}>
              Perfil
            </Menu.Item>
            <Menu.Item key="3" icon={<LaptopOutlined />}>
              Configuración
            </Menu.Item>
          </Menu>
        </Sider>

        {/* Content */}
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Inicio</Breadcrumb.Item>
            <Breadcrumb.Item>Tablero</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              backgroundColor: 'white',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h1>Bienvenido ESTUDIANTE</h1>
              <Button type="primary">Nuevo Evento</Button>
            </div>
            <div style={{ marginTop: '20px' }}>
              <p>
                Este es el área de contenido principal donde puedes agregar
                información, tarjetas o cualquier tipo de componente relevante para
                tu aplicación.
              </p>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default HomeStudents;
