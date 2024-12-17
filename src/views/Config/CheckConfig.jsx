import React from 'react';
import { Spin, Typography, Row, Col } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import './CheckConfiguration.css';

const { Title, Text } = Typography;

// Configuración de un loader con un icono personalizado
const antIcon = <LoadingOutlined style={{ fontSize: 50, color: '#1890ff' }} spin />;

//Componente destinado a enviar un request al servidor para verificar la configuración incial si ya se ha realizado
const CheckConfiguration = () => {
  return (
    <div className="check-configuration-container">
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col>
          <div className="loader-content">
            <Spin indicator={antIcon} />
            <Title level={3} className="loader-title">Verificando configuración...</Title>
            <Text type="secondary" className="loader-subtitle">
              Por favor, espere mientras validamos su configuración.
            </Text>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CheckConfiguration;
