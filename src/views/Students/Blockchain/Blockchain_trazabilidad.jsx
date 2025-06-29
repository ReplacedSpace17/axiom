import React, { useEffect, useState, useRef } from 'react';
import { Layout, Menu, Breadcrumb, Button, Input, Spin, Modal } from 'antd';
import { HomeOutlined, ExperimentOutlined, UserOutlined, BlockOutlined, UserDeleteOutlined, BranchesOutlined, LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import BACKEND from '../../../config/backend';
import Sessions from '../../../utils/Sesions';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

const Blockchain_Trazabilidad = () => {
  const [isLogged, setIsLogged] = useState(true);
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState([]);
  const [filteredExperiments, setFilteredExperiments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const fgRef = useRef();

  useEffect(() => {
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

    Promise.all([validateSession()]);
  }, [navigate]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    message.success('Copiado al portapapeles');
  };

  const handleSearch = async (value) => {
    setLoading(true);
    console.log('Buscando:', value);

    try {
      const response = await fetch(`${BACKEND}/students/experiments/getAll/${value}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al buscar: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Resultados de búsqueda:', data);

      if (Array.isArray(data) && data.length > 0 && data[0].status === 210) {
        setLoading(false);
        Modal.error({
          title: 'Error',
          content: 'No se encontró el experimento',
          centered: true,
        });
        return;
      }

      setExperiments(data);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCenterView = () => {
    if (fgRef.current) {
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 500 });
    }
  };

  const graphData = {
    nodes: experiments.map((exp) => ({
      id: exp.cid,
      name: exp.title,
      color: "#1f77b4",
      description: exp.description,
      authors: exp.authors,
      tags: exp.tags,
      date: exp.date,
      host: exp.host,
    })),
    links: experiments.flatMap((exp) =>
      exp.referencesCid.map((refCid) => ({ source: exp.cid, target: refCid }))
    ),
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-9.5px' }}>
      <Header className="site-layout-background" style={{ padding: 0, textAlign: 'center', color: 'white', fontSize: '20px' }}>
        Axiom - Trazabilidad
      </Header>

      <Layout>
        <Sider width={250} className="site-layout-background">
          <Menu mode="inline" defaultSelectedKeys={['4-3']} style={{ height: '100%', borderRight: 0, padding: '10px' }}>
            <Menu.Item key="1" icon={<HomeOutlined />}>Inicio</Menu.Item>
            <Menu.Item key="2" icon={<ExperimentOutlined />} onClick={() => navigate('/students/experiments')}>Mis experimentos</Menu.Item>
            <Menu.Item key="3" icon={<UserOutlined />}>Mi perfil</Menu.Item>
            <SubMenu key="sub4" icon={<BlockOutlined />} title="Blockchain">
              <Menu.Item key="4-1" icon={<ExperimentOutlined />}>Experimentos</Menu.Item>
              <Menu.Item key="4-2" icon={<UserDeleteOutlined />}>Autores</Menu.Item>
              <Menu.Item key="4-3" icon={<BranchesOutlined />}>Trazabilidad</Menu.Item>
            </SubMenu>
            <Menu.Item key="6" icon={<LogoutOutlined />}>Cerrar sesión</Menu.Item>
          </Menu>
        </Sider>

        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Inicio</Breadcrumb.Item>
            <Breadcrumb.Item>Blockchain</Breadcrumb.Item>
            <Breadcrumb.Item>Trazabilidad</Breadcrumb.Item>
          </Breadcrumb>

          <Spin spinning={loading} tip="Cargando...">
            <Content style={{ padding: 24, margin: 0, minHeight: 280, backgroundColor: 'white' }}>
             

              <Search
                placeholder="Ingresa el CID del experimento aqui"
                enterButton={<SearchOutlined />}
                allowClear
                onSearch={handleSearch}
                style={{ marginBottom: 20, width: '100%' }}
                onClear={() => setLoading(false)}
              />

              <div style={{ position: "relative",  height: "auto"}}>
                <Button
                  style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}
                  onClick={handleCenterView}
                >
                  Centrar
                </Button>
                <ForceGraph3D
  width={1300}
  height={650}
  backgroundColor="#f5f5f5" // Fondo claro
  ref={fgRef}
  graphData={graphData}
  linkAutoColorBy={'#000000'}
  linkWidth={1}
  nodeAutoColorBy="id"
  linkDirectionalArrowLength={7}

  d3Force="charge"
  d3ForceStrength={-10000} // Aumenta la separación entre nodos
  nodeThreeObject={(node) => {
    const group = new THREE.Group();

    // Nodo en color gris
    const geometry = new THREE.SphereGeometry(5, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: "#808080" });
    const sphere = new THREE.Mesh(geometry, material);
    group.add(sphere);

    // Texto del nodo en negro y negrita
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(
          (() => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = 150;
            canvas.height = 50;
            ctx.fillStyle = "black"; // Texto en negro
            ctx.font = "bold 14px Arial"; // Negrita
            ctx.fillText(node.name, 10, 30);
            return canvas;
          })()
        ),
      })
    );
    sprite.position.set(0, -8, 0);
    sprite.scale.set(15, 7, 1);
    group.add(sprite);

    return group;
  }}
  onNodeClick={(node) => {
    console.log("Nodo seleccionado:", node);
    setSelectedNode(node);
  }}
/>


                <Modal
                  title={selectedNode?.name}
                  open={!!selectedNode}
                  onCancel={() => setSelectedNode(null)}
                  footer={null}
                  centered={true}
                >
                  {selectedNode && (
                    <div>
                      <p><strong>CID:</strong> {selectedNode.id}</p>
                      <p><strong>Descripción:</strong> {selectedNode.description}</p>
                      <p><strong>Fecha:</strong> {selectedNode.date}</p>
                      <p><strong>Autores:</strong></p>
                      <ul>
                        {selectedNode.authors.map((author, index) => (
                          <li key={index}>{author.name} - {author.affiliation}</li>
                        ))}
                      </ul>
                      <p><strong>Tags:</strong> {selectedNode.tags.join(', ')}</p>
                      <Button onClick={() => handleCopy(selectedNode.id)}>Copiar CID</Button>
                      <Button onClick={
                        ()=>{
                          //abrir ventana con los archivos del experimento de host
                          window.open(selectedNode.host, "_blank");
                        }
                      }>Ver archivos</Button>
                    </div>
                  )}
                </Modal>
              </div>
            </Content>
          </Spin>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Blockchain_Trazabilidad;