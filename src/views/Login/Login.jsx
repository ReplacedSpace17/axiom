import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message, Row, Col } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    // Simulando un retraso en la validación para la demostración
    setTimeout(() => {
      setLoading(false);
      // Suponiendo que la validación del servidor fue exitosa
      message.success('¡Ingreso exitoso!');
      console.log('Login successful:', values);
    }, 1000);
  };

  const onFinishFailed = (errorInfo) => {
    message.error('Por favor, complete los campos correctamente.');
  };

  return (
    <Row justify="center" style={{ minHeight: '100vh', alignItems: 'center' }}>
      <Col xs={24} sm={16} md={12} lg={8}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2>Iniciar Sesión</h2>
        </div>
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
              prefix={<UserOutlined />}
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
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              allowClear
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Recordarme</Checkbox>
            </Form.Item>
            <a href="#" style={{ float: 'right' }}>
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
              }}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default LoginForm;
