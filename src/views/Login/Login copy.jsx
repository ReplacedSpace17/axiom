/*
import React, { useState } from 'react';
import { Layout, Form, Input, Button, Checkbox, message, Steps } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Step } = Steps;

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [currentStep] = useState(0); // Usado para mantener consistencia con el estilo
  const steps = [{ title: 'Inicio de sesión', content: 'Formulario de acceso' }];

  const onFinish = async (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('¡Ingreso exitoso!');
      console.log('Login successful:', values);
    }, 1000);
  };

  const onFinishFailed = (errorInfo) => {
    message.error('Por favor, complete los campos correctamente.');
  };

  return (
    <Layout style={{ width: '100vw', height: '100vh', margin: '-8px', padding: '0px' }}>
      <Header style={{ color: 'white', textAlign: 'center', fontSize: '20px' }}>
        Logo
      </Header>
      <Content style={{ padding: '20px', marginTop: '20px' }}>
        
        <div
          style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '8px',
              width: '50%',
              maxWidth: '450px',
              minWidth: '350px',
              border: '1px solid #d4d4d4',
            }}
          >
            <Form
              name="login"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
            >
              <Form.Item
                label="Usuario"
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese su usuario!',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                  placeholder="Usuario"
                  allowClear
                />
              </Form.Item>

              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingrese su contraseña!',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#1890ff' }} />}
                  placeholder="Contraseña"
                  allowClear
                />
              </Form.Item>

              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox style={{ color: '#7d7d7d' }}>Recordarme</Checkbox>
                </Form.Item>
                <a href="#" style={{ float: 'right', color: '#1890ff' }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={loading}
                  style={{
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    height: '45px',
                    fontSize: '16px',
                  }}
                >
                  Iniciar Sesión
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>ReplacedSpace17 - Axiom</Footer>
    </Layout>
  );
};

export default LoginForm;
*/