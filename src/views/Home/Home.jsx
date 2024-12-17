import React, { useState } from 'react';
import { Layout, Steps, Form, Input, Select, Button, message, Space } from 'antd';
import { DatabaseOutlined, UserOutlined, ExperimentOutlined } from '@ant-design/icons';


const { Header, Content, Footer } = Layout;
const { Step } = Steps;
const { Option } = Select;

function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  const next = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(currentStep + 1);
      })
      .catch((errorInfo) => {
        console.error('Validation failed:', errorInfo);
      });
  };

  const prev = () => setCurrentStep(currentStep - 1);

  const finish = () => {
    message.success('Configuration Complete!');
  };

  const steps = [
    {
      title: 'Base de datos',
      content: (
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center' }}>
      
        {/* Título con icono de base de datos */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <DatabaseOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
            Configuración del Servidor
          </h2>
          <div
            style={{
              borderTop: '1px solid #b9b9b9',
              marginTop: '10px',
              width: '100%',
              marginBottom: '0px',
            }}
          ></div>
          <p style={{ marginBottom: '0', color:'#272727'}}>
            Completa los siguientes campos para conectar tu aplicación al servidor y la base de datos.
          </p>
        </div>
  
        {/* Formulario */}
        <Form.Item
          label="Dirección del servidor"
          name="server"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input placeholder="Ingresa el nombre del servidor" />
        </Form.Item>
        <Form.Item
          label="Base de datos"
          name="name"
          rules={[{ required: true, message: 'Por favor ingresa un nombre' }]}
        >
          <Input placeholder="Ingresa el nombre de la base de datos" />
        </Form.Item>
        <Form.Item
          label="Usuario"
          name="user"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input placeholder="Ingresa el usuario" />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input.Password placeholder="Ingresa la contraseña" />
        </Form.Item>
  
        <Button type="default" style={{ marginRight: '10px' }} onClick={finish}>
          Probar conexión
        </Button>
        <Button type="primary" onClick={next}>
          Continuar
        </Button>
      </Form>
      
      ),
    },
    {
      title: 'Administrador',
      content: (
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center' }}>
      
        {/* Título con icono de base de datos */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <UserOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
            Administrador
          </h2>
          <div
            style={{
              borderTop: '1px solid #b9b9b9',
              marginTop: '10px',
              width: '100%',
              marginBottom: '0px',
            }}
          ></div>
          <p style={{ marginBottom: '0', color:'#272727'}}>
            Crea las credenciales de acceso para el administrador de la aplicación.
          </p>
        </div>
  
        {/* Formulario */}
 
        <Form.Item
          label="Usuario"
          name="user"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input placeholder="Ingresa el usuario" />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input.Password placeholder="Crear una contraseña" />
        </Form.Item>
        <Form.Item
          label="Confirmar contraseña"
          name="password2"
          rules={[{ required: true, message: 'Por favor completa este campo' }]}
        >
          <Input.Password placeholder="Confirmar la contraseña" />
        </Form.Item>
  
        <Button type="default" style={{ marginRight: '10px' }} onClick={prev}>
          Regresar
        </Button>
        <Button type="primary" onClick={next}>
          Continuar
        </Button>
      </Form>
      
      ),
    },
    {
      title: 'Laboratorios',
      content: (
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center' }}>
      
        {/* Título con icono de base de datos */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ExperimentOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
            Laboratorios
          </h2>
          <div
            style={{
              borderTop: '1px solid #b9b9b9',
              marginTop: '10px',
              width: '100%',
              marginBottom: '0px',
            }}
          ></div>
          <p style={{ marginBottom: '0', color:'#272727'}}>
            Crea los laboratorios que se utilizarán en la aplicación.
          </p>
        </div>
  
        {/* Formulario */}
  {/* AGREGAR UN BUSCADOR DE LABORATORIO*/}
        <Form.Item
          label="Agregar laboratorio"
          name="labname"
          rules={[{ required: false, message: 'Por favor completa este campo' }]}
        >
          <Input placeholder="Ingresa el nombre del laboratorio" />
        </Form.Item>
        <Form.Item
          label="Investigador"
          name="invname"
          rules={[{ required: false, message: 'Por favor completa este campo' }]}
        >
          <Input placeholder="Ingresa el nombre del investigador" />
        </Form.Item>

  
        <Button type="default" style={{ marginRight: '10px' }} onClick={prev}>
          Regresar
        </Button>
        <Button type="primary" onClick={next}>
          Continuar
        </Button>
      </Form>
      
      ),
    },
    {
      title: 'Usuarios',
      content: (
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center' }}>
      
        {/* Título con icono de base de datos */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ExperimentOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
            Agregar usuarios
          </h2>
          <div
            style={{
              borderTop: '1px solid #b9b9b9',
              marginTop: '10px',
              width: '100%',
              marginBottom: '0px',
            }}
          ></div>
          <p style={{ marginBottom: '0', color:'#272727'}}>
            Agrega los usuarios que tendrán acceso a la aplicación.
          </p>
        </div>
  
        {/* Formulario */}
  {/* AGREGAR UN BUSCADOR DE LABORATORIO*/}
        <Form.Item
          label="Agregar laboratorio"
          name="labname"
          rules={[{ required: false, message: 'Por favor completa este campo' }]}
        >
          <Input placeholder="Ingresa el nombre del laboratorio" />
        </Form.Item>
        <Form.Item
          label="Investigador"
          name="invname"
          rules={[{ required: false, message: 'Por favor completa este campo' }]}
        >
          <Input placeholder="Ingresa el nombre del investigador" />
        </Form.Item>

  
        <Button type="default" style={{ marginRight: '10px' }} onClick={prev}>
          Regresar
        </Button>
        <Button type="primary" onClick={next}>
          Continuar
        </Button>
      </Form>
      
      ),
    },
  ];

  return (
    <Layout >
      <Header style={{ color: 'white', textAlign: 'center', fontSize: '20px' }}>
        Configuration Wizard
      </Header>
      <Content style={{ padding: '20px', marginTop: '20px' }}>
        <Steps current={currentStep} style={{ marginBottom: '30px' }}>
          {steps.map((step, index) => (
            <Step key={index} title={step.title} />
          ))}
        </Steps>
        <div style={{ padding: '20px', borderRadius: '8px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '50%', maxWidth: '450px', minWidth: '350px', border: '1px solid #d4d4d4' }}>
            {steps[currentStep].content}
          </div>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          {currentStep > 0 && (
            <Button style={{ marginRight: '10px' }} onClick={prev}>
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button type="primary" onClick={finish}>
              Finish
            </Button>
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>ReplacedSpace17 - Axiom</Footer>
    </Layout>
  );
}

export default Home;
