import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, Button, Form, Input, List, message } from 'antd';
import { HomeOutlined, UserOutlined, ExperimentOutlined, BankOutlined, AppstoreAddOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import BACKEND from '../../../config/backend';
import axios from 'axios';
import Sessions from '../../../utils/Sesions';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo/log_blanco.svg';

const { Header, Content, Sider } = Layout;

const Lab_add = () => {
  const [isLogged, setIsLogged] = useState(true);
  const [laboratorios, setLaboratorios] = useState([]);
  const [laboratorio, setLaboratorio] = useState('');
  const [investigador, setInvestigador] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const validateSession = async () => {
      try {
        const validate = await Sessions.validateSession();
        setIsLogged(validate);
        if (!validate) navigate('/login');
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
  }, []);

  const getLaboratorios = async () => {
    try {
      const response = await axios.get(`${BACKEND}/su/laboratorios`);
      setLaboratorios(response.data);
    } catch (error) {
      console.error('Error obteniendo laboratorios:', error);
    }
  };

  // Función para agregar un laboratorio
  const createLab = async () => {
    // Validar si los campos 'laboratorio' o 'investigador' están vacíos
    if (!laboratorio.trim() || !investigador.trim()) {
      message.error('Debe agregar información en los campos "laboratorio" e "investigador".');
      return; // Detener la ejecución si algún campo está vacío
    }

    const data = {
      nombre: laboratorio,
      investigador: investigador,
    };

    try {
      const response = await axios.post(`${BACKEND}/su/laboratorios`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        const labData = response.data.laboratorio;
        setLaboratorios((prevLabs) => [...prevLabs, labData]);
        setLaboratorio('');
        setInvestigador('');
        message.success('Laboratorio agregado exitosamente');
      } else {
        message.error('No se pudo crear el laboratorio, revisa los datos');
      }
    } catch (error) {
      // Manejo de errores
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

  return (
    <Layout style={{ width: '100vw', height: '100vh', margin: '-8px', padding: '0px' }}>
      <Header className="site-layout-background" style={{ padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={logo} alt="logo" style={{ width: '120px' }} />
      </Header>
      <Layout>
        <Sider width={250} className="site-layout-background">
          <Menu mode="inline" defaultSelectedKeys={['2']} style={{ height: '100%', borderRight: 0, padding: '10px' }}>
            <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => navigate('/su/home')}>
              Inicio
            </Menu.Item>
            <Menu.Item key="2" icon={<AppstoreAddOutlined />}>Mis laboratorios</Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>Estudiantes</Menu.Item>
            <Menu.Item key="4" icon={<BankOutlined />}>Institución</Menu.Item>
            <Menu.Item key="5" icon={<ExperimentOutlined />}>Experimentos</Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Administrador</Breadcrumb.Item>
            <Breadcrumb.Item onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>Laboratorios</Breadcrumb.Item>
            <Breadcrumb.Item>Agregar</Breadcrumb.Item>
          </Breadcrumb>
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
            <Form form={form} layout="vertical" style={{ width: '80%', margin: '0 auto', maxWidth: '400px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid rgb(213, 213, 213)' }}>
              <ArrowLeftOutlined style={{ fontSize: '24px', cursor: 'pointer', marginRight: '15px' }} onClick={() => navigate(-1)} />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <h2>
                    <ExperimentOutlined style={{ fontSize: '24px', marginRight: '8px' }} /> Laboratorios
                  </h2>
                  <p>Crea los laboratorios que se utilizarán en la aplicación.</p>
                </div>
              </div>
              <Form.Item label="Agregar laboratorio">
                <Input value={laboratorio} onChange={(e) => setLaboratorio(e.target.value)} placeholder="Nombre del laboratorio" />
              </Form.Item>
              <Form.Item label="Investigador">
                <Input value={investigador} onChange={(e) => setInvestigador(e.target.value)} placeholder="Nombre del investigador" />
              </Form.Item>
              <Button type="default" onClick={createLab}>Agregar</Button>
              <List
                bordered
                dataSource={laboratorios}
                style={{ marginTop: '20px', maxHeight: '150px', overflowY: 'auto' }}
                renderItem={(item) => (
                  <List.Item key={item.nombre}>
                    <strong>{item.nombre}</strong> - {item.investigador}
                  </List.Item>
                )}
              />
            </Form>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Lab_add;
