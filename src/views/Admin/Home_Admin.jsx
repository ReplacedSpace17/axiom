import React from 'react';
import { Layout, Menu, Breadcrumb, Button } from 'antd';
import { HomeOutlined, UserOutlined, LaptopOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const HomeAdmin = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <Header className="site-layout-background" style={{ padding: 0 }}>
        <div style={{ color: 'white', fontSize: '20px', textAlign: 'center' }}>
          Mi Aplicación
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
              <h1>Bienvenido a la Página Principal</h1>
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

export default HomeAdmin;
