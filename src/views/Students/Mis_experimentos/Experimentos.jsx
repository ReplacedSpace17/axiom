import React, { useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb, Button, Card, Row, Col, Tag, message } from 'antd';
import { CopyOutlined, HomeOutlined, UserOutlined, SearchOutlined, LogoutOutlined, ExperimentOutlined, BlockOutlined, UserDeleteOutlined, BranchesOutlined, EyeFilled } from '@ant-design/icons';
import BACKEND from '../../../config/backend';
import axios from 'axios';
import Sessions from '../../../utils/Sesions';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const HomeExperimentos = () => {
  const [isLogged, setIsLogged] = useState(true);
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);

  useEffect(() => {
    const getExperiments = async () => {
      try {
        const response = await axios.get(`${BACKEND}/students/experiments/get`);
        setExperiments(response.data);
      } catch (error) {
        console.error('Error obteniendo experimentos:', error);
      }
    };

    const validateSession = async () => {
      try {
        const isValid = await Sessions.validateSession();
        setIsLogged(isValid);
        if (!isValid) navigate('/login');
      } catch (error) {
        console.error('Error validando sesión:', error);
        setIsLogged(false);
        navigate('/login');
      }
    };

    Promise.all([getExperiments(), validateSession()]);
  }, [navigate]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Copiado al portapapeles');
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-9.5px' }}>
      <Header className="site-layout-background" style={{ padding: 0, textAlign: 'center', color: 'white', fontSize: '20px' }}>
        Axiom
      </Header>

      <Layout>
        <Sider width={250} className="site-layout-background">
          <Menu mode="inline" defaultSelectedKeys={['2']} style={{ height: '100%', borderRight: 0, padding: '10px' }}>
            <Menu.Item key="1" icon={<HomeOutlined />}>Inicio</Menu.Item>
            <Menu.Item key="2" icon={<ExperimentOutlined />}>Mis experimentos</Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>Mi perfil</Menu.Item>
            <SubMenu key="sub4" icon={<BlockOutlined />} title="Blockchain">
              <Menu.Item key="4-1" icon={<ExperimentOutlined />}>Experimentos</Menu.Item>
              <Menu.Item key="4-2" icon={<UserDeleteOutlined />}>Autores</Menu.Item>
              <Menu.Item key="4-3" icon={<BranchesOutlined />} onClick={
                () => navigate('/students/blockchain/trazabilidad')
              }>Trazabilidad</Menu.Item>
            </SubMenu>
            <Menu.Item key="6" icon={<LogoutOutlined />}>Cerrar sesión</Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Inicio</Breadcrumb.Item>
            <Breadcrumb.Item>Mis experimentos</Breadcrumb.Item>
          </Breadcrumb>

          <Content style={{ padding: 24, margin: 0, minHeight: 280, backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1>Mis experimentos</h1>
              <Button type="primary" onClick={() => navigate('/students/experiments/add')}>+ Agregar</Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
              {experiments.map((experiment) => {
                const autores = JSON.parse(experiment.autores);
                const etiquetas = JSON.parse(experiment.etiquetas);

                return (
                  <Col xs={24} sm={12} md={8} lg={6} key={experiment.id}>
                    <Card
                      title={experiment.titulo}
                      bordered={true}
                      extra={<a href={experiment.acceso_ipfs} target="_blank" rel="noopener noreferrer">Ver en IPFS</a>}
                      style={{ borderRadius: '10px', boxShadow: '0px 2px 10px rgba(0,0,0,0.1)', wordBreak: 'break-word' }}
                    >
                      <p><strong>Descripción:</strong> {experiment.descripcion}</p>
                      <p><strong>Fecha:</strong> {new Date(experiment.fecha_creacion).toLocaleDateString()}</p>
                      <p><strong>Autores:</strong> {autores.map(a => a.name).join(', ')}</p>

                      <p>
                        <strong>Etiquetas:</strong>
                        {etiquetas.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}
                      </p>

                      {/* CID */}
                      <p>
                        <strong>CID:</strong> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px', display: 'inline-block' }}>
                          {experiment.cid_ipfs}
                        </span>
                        <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(experiment.cid_ipfs)} />
                      </p>

                      {/* Bloque */}
                      <p>
                        <strong>Bloque:</strong> {experiment.block}
                        <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(experiment.block)} />
                      </p>

                      {/* Transacción */}
                      <p>
                        <strong>Transacción:</strong> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px', display: 'inline-block' }}>
                          {experiment.transaccion}
                        </span>
                        <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopy(experiment.transaccion)} />
                        <Button type="link" icon={<EyeFilled />} onClick={() => {
                          window.open(`https://explorer-mainnet.maticvigil.com/tx/${experiment.transaccion}`, '_blank');
                        }} />
                      </p>

                      {/* Gas y Costo */}
                      <p><strong>Gas:</strong> {experiment.gasUsed}</p>
                      <p><strong>Costo de transacción:</strong> ${experiment.mxnPrice} MXN</p>
                      <p>
                        <strong>Ver contrato:</strong> <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px', display: 'inline-block' }}>
                         
                        </span>
                       
                        <Button type="link" icon={<EyeFilled />} onClick={() => {
                          window.open(`https://polygonscan.com/address/0x64544B43884Bdf7d37C39a81D4b71bb78FC74F0A`, '_blank');
                        }} />
                      </p>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default HomeExperimentos;
