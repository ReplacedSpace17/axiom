import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, Button, Card, Row, Col } from 'antd';

import {
  HomeOutlined, UserOutlined, LaptopOutlined, ExperimentOutlined, BankOutlined,
  AppstoreAddOutlined, CalendarOutlined, UsergroupAddOutlined, PlusOutlined
} from '@ant-design/icons';
import BACKEND from '../../../config/backend';
import axios from 'axios';
import Sessions from '../../../utils/Sesions';
import { useNavigate } from 'react-router-dom';

import logo from '../../../assets/logo/log_blanco.svg';

const { Header, Content, Sider } = Layout;

const Institucion_home = () => {
  const [isLogged, setIsLogged] = useState(true);
  const [laboratorios, setLaboratorios] = useState([]); // Estado para almacenar laboratorios
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = async () => {
      try {
        const validate = await Sessions.validateSession();
        setIsLogged(validate);
        if (!validate) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error validando sesión:', error);
        setIsLogged(false);
        navigate('/login');
      }
    };
    validateSession();
  }, [navigate]);

  useEffect(() => {
    getLaboratorios();
  }, []); // Se ejecuta solo una vez al montar el componente

  const getLaboratorios = async () => {
    try {
      console.log('Obteniendo laboratorios...');
      const response = await axios.get(BACKEND+`/su/laboratorios`);
      console.log('Laboratorios:', response.data);
      setLaboratorios(response.data); // Guardar laboratorios en el estado
    } catch (error) {
      console.error('Error obteniendo laboratorios:', error);
    }
  };

  return (
    <Layout style={{ width: '100vw', height: '100vh', margin: '-8px', padding: '0px' }}>
      <Header className="site-layout-background" style={{ padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
         <img src={logo} alt="logo" style={{ width: '120px' }} />
      </Header>

      <Layout>
        <Sider width={250} className="site-layout-background">
          <Menu mode="inline" defaultSelectedKeys={['3']} style={{ height: '100%', borderRight: 0, padding: '10px' }}>
             <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => navigate('/su/home')}>
                          Inicio
                        </Menu.Item>
                        <Menu.Item key="2" icon={<AppstoreAddOutlined />} onClick={() => navigate('/laboratorios')}>
                          Mis laboratorios
                        </Menu.Item>
                        <Menu.Item key="3" icon={<UserOutlined />} onClick={() => navigate('/estudiantes')}>
                          Estudiantes
                        </Menu.Item>
            
                        <Menu.Item key="4" icon={<BankOutlined />} onClick={() => navigate('/institucion')}>
                          Institución
                        </Menu.Item>
            
                        <Menu.Item key="5" icon={<ExperimentOutlined />} onClick={() => navigate('/experimentos')}>
                          Experimentos
                        </Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Administrador</Breadcrumb.Item>
            <Breadcrumb.Item>Estudiantes</Breadcrumb.Item>
          </Breadcrumb>
          <Content style={{ padding: 24, margin: 0, minHeight: 280, backgroundColor: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h1 style={{color: '#212121'}}>Laboratorios</h1>
    <Button type="primary" size="large" icon={<PlusOutlined />} style={{ borderRadius: '8px' }}
      onClick={() => navigate('/laboratorios/add')}>
      Agregar
    </Button>
  </div>

  <div style={{ marginTop: '20px' }}>
    {laboratorios.length > 0 ? (
      <Row gutter={[16, 16]}>
        {laboratorios.map((lab) => (
          <Col xs={24} sm={12} md={8} lg={6} key={lab.id}>
            <Card 
              title={lab.nombre} 
              bordered={false} 
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                background: '#f9f9f9',
              }}
            >
              <p style={{ fontSize: '14px', color: '#555' }}>
                <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                <strong>Investigador:</strong> {lab.investigador}
              </p>
              <p style={{ fontSize: '14px', color: '#555' }}>
                <CalendarOutlined style={{ marginRight: 8, color: '#faad14' }} />
                <strong>Fecha de creación:</strong> {new Date(lab.fecha).toLocaleDateString()}
              </p>
              <p style={{ fontSize: '14px', color: '#555' }}>
                <UsergroupAddOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                <strong>Estudiantes:</strong> {lab.estudiantes.length}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    ) : (
      <p>No hay laboratorios disponibles.</p>
    )}
  </div>
</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Institucion_home;
