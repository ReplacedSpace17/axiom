import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import { HomeOutlined, UserOutlined, SearchOutlined, LogoutOutlined, ExperimentOutlined, BlockOutlined, UserDeleteOutlined ,
  BranchesOutlined
} from '@ant-design/icons';
import BACKEND from '../../config/backend';
import axios from 'axios';
import Sessions from '../../utils/Sesions';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const HomeStudents = () => {
  // Estado para verificar si el usuario está logueado
  const [isLogged, setIsLogged] = useState(true);
  const navigate = useNavigate();

  

  useEffect(() => {
    const validateSession = async () => {
      try {
        const validate = await Sessions.validateSession(); // Esperar a que se resuelva la promesa
        setIsLogged(validate);
        
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
    <Layout style={{ minHeight: '100vh', margin: '-9.5px' }}>
      {/* Header */}
      <Header className="site-layout-background" style={{ padding: 0 }}>
        <div style={{ color: 'white', fontSize: '20px', textAlign: 'center' }}>
          Mi Aplicación Super Usuario
        </div>
      </Header>

      {/* Main Layout */}
      <Layout>
        {/* Sider */}
        <Sider width={250} className="site-layout-background">
          <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0, userSelect: 'none', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
            <Menu.Item key="1" icon={<HomeOutlined />}>
              Inicio
            </Menu.Item>
            <Menu.Item key="2" icon={<ExperimentOutlined />} onClick={() => navigate('/students/experiments')}>
              Mis experimentos
            </Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>
              Mi perfil
            </Menu.Item>
            
            {/* Submenú Blockchain */}
            <SubMenu key="sub4" icon={<BlockOutlined />} title="Blockchain">
              <Menu.Item key="4-1" icon={<ExperimentOutlined />}>Experimentos</Menu.Item>
              <Menu.Item key="4-2" icon={<UserDeleteOutlined />}>Autores</Menu.Item>
              <Menu.Item key="4-3" icon={<BranchesOutlined />}>Trazabilidad</Menu.Item>
            </SubMenu>

            <Menu.Item key="6" icon={<LogoutOutlined />}>
              Cerrar sesión
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
