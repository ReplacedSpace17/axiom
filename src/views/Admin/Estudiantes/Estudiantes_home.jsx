import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, Button, Card, Row, Col, Popconfirm } from 'antd';
import { HomeOutlined, UserOutlined, CalendarOutlined, UsergroupAddOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import BACKEND from '../../../config/backend';
import axios from 'axios';
import Sessions from '../../../utils/Sesions';
import { useNavigate } from 'react-router-dom';

import logo from '../../../assets/logo/log_blanco.svg';

const { Header, Content, Sider } = Layout;

const Estudiantes_home = () => {
  const [isLogged, setIsLogged] = useState(true);
  const [estudiantes, setEstudiantes] = useState([]); // Cambié 'laboratorios' por 'estudiantes'
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
    getEstudiantes();
  }, []); // Se ejecuta solo una vez al montar el componente

  const getEstudiantes = async () => {
    try {
      console.log('Obteniendo estudiantes...');
      const response = await axios.get(BACKEND+`/su/usuarios`);
      console.log('Estudiantes:', response.data);
      setEstudiantes(response.data.usuarios); // Ajusté el estado para los estudiantes
    } catch (error) {
      console.error('Error obteniendo estudiantes:', error);
    }
  };

  const handleDelete = async (username) => {
    // Aquí va la lógica para borrar al estudiante por su username
    console.log(`Borrar estudiante con username: ${username}`);
  
    // Lógica para eliminar el estudiante de la lista de estudiantes
    setEstudiantes((prevEstudiantes) => prevEstudiantes.filter((estudiante) => estudiante.username !== username));
  
    // Aquí puedes agregar la lógica para realizar la solicitud DELETE al backend, por ejemplo:
    
    try {
      await axios.delete(BACKEND + `/su/usuarios/${username}`);
      console.log("Estudiante eliminado con éxito");
    } catch (error) {
      console.error("Error eliminando estudiante:", error);
    }
    
  };
  
  const handleEdit = (username) => {
    // Aquí va la lógica para editar al estudiante
    console.log(`Editar estudiante con username: ${username}`);
    navigate(`/estudiantes/edit/${username}`); // Por ejemplo, para redirigir a la página de edición
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
                        <Menu.Item key="2" icon={<UserOutlined />} onClick={() => navigate('/estudiantes')}>
                          Estudiantes
                        </Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Administrador</Breadcrumb.Item>
            <Breadcrumb.Item>Estudiantes</Breadcrumb.Item>
          </Breadcrumb>
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 style={{color: '#212121'}}>Estudiantes</h1>
              <Button type="primary" size="large" icon={<PlusOutlined />} style={{ borderRadius: '8px' }}
                onClick={() => navigate('/estudiantes/add')}>
                Agregar
              </Button>
            </div>

            <div style={{ marginTop: '20px' }}>
              {estudiantes.length > 0 ? (
                <Row gutter={[16, 16]}>
                  {estudiantes.map((estudiante) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={estudiante.username}>
                      <Card 
                        title={estudiante.username} 
                        bordered={false} 
                        style={{
                          borderRadius: '12px',
                          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                          background: '#f9f9f9',
                        }}
                      >
                        <p style={{ fontSize: '14px', color: '#555' }}>
                          <CalendarOutlined style={{ marginRight: 8, color: '#faad14' }} />
                          <strong>Fecha de registro:</strong> {new Date(estudiante.date_time).toLocaleDateString()}
                        </p>
                        <p style={{ fontSize: '14px', color: '#555' }}>
                          <UsergroupAddOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                          <strong>Laboratorio:</strong> {estudiante.laboratorio}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                          <Button 
                            icon={<EditOutlined />} 
                            onClick={() => handleEdit(estudiante.username)} 
                            type="link"
                          >
                            Editar
                          </Button>
                          <Popconfirm 
                            title="¿Estás seguro de que deseas eliminar este estudiante?" 
                            onConfirm={() => handleDelete(estudiante.username)}
                          >
                            <Button 
                              icon={<DeleteOutlined />} 
                              type="link" 
                              danger
                            >
                              Eliminar
                            </Button>
                          </Popconfirm>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <p>No hay estudiantes disponibles.</p>
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Estudiantes_home;
