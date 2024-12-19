import React, { useState, useEffect } from 'react';
import { Spin, Typography, Row, Col, List, message } from 'antd';
import { LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './CheckConfiguration.css';
import logo from '../../assets/logo/logo.svg';

const { Title, Text } = Typography;

// Loader con un ícono personalizado
const antIcon = <LoadingOutlined style={{ fontSize: 50, color: '#1890ff' }} spin />;

// JSON de verificaciones
const verificationSteps = [
  { id: 1, description: 'Verificando conexión al servidor', completed: false },
  { id: 2, description: 'Cargando configuraciones del sistema', completed: false },
  { id: 3, description: 'Sincronizando datos iniciales', completed: false },
  { id: 4, description: 'Validando permisos de usuario', completed: false },
];

const CheckConfiguration = () => {
  const [currentStep, setCurrentStep] = useState(0); // Índice del paso actual
  const [steps, setSteps] = useState(verificationSteps); // Estado de las verificaciones
  const [loadingComplete, setLoadingComplete] = useState(false); // Estado del spinner principal
  const navigate = useNavigate(); // Hook para navegar

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentStep < steps.length) {
        // Actualizar el estado del paso actual
        const updatedSteps = steps.map((step, index) => ({
          ...step,
          completed: index <= currentStep, // Marcar como completado si el índice es menor o igual al actual
        }));
        setSteps(updatedSteps);
        setCurrentStep(currentStep + 1);
      } else {
        clearInterval(timer); // Detener el temporizador
        setLoadingComplete(true); // Cambiar el estado del spinner
        message.success('Configuration Complete!');
        setTimeout(() => navigate('/setup'), 2000); // Redirigir después de 2 segundos
      }
    }, 5000 / steps.length); // Dividir el tiempo total entre el número de pasos

    return () => clearInterval(timer); // Limpiar el temporizador al desmontar
  }, [currentStep, steps, navigate]);

  return (
    <div className="check-configuration-container">
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col>
          <div className="loader-content">
            <div className="image-content">
              <img src={logo} alt="logo" className="logo-loader" />
            </div>
            {/* Spinner principal o paloma */}
            {loadingComplete ? (
              <CheckCircleOutlined style={{ fontSize: 50, color: '#52c41a' }} />
            ) : (
              <Spin indicator={antIcon} />
            )}
            <Title level={4} className="loader-title">Verificando configuración...</Title>
            <Text type="secondary" className="loader-subtitle">
              Por favor, espere mientras validamos su configuración.
            </Text>
            {/* Lista de verificaciones */}
            <List
              style={{ marginTop: '20px' }}
              dataSource={steps}
              renderItem={(item) => (
                <List.Item>
                  <Text
                    type={item.completed ? 'success' : 'secondary'}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                  >
                    {item.completed ? (
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    ) : (
                      <LoadingOutlined spin style={{ color: '#1890ff' }} />
                    )}
                    {item.description}
                  </Text>
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CheckConfiguration;
