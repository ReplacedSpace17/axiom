import React, { useEffect, useState } from 'react';
import { Layout, Modal, Steps, Select, List, Menu, Breadcrumb, Button, Form, Input, Upload, Spin} from 'antd';
import { HomeOutlined, UserOutlined, SearchOutlined, LogoutOutlined, ExperimentOutlined, BlockOutlined, UserDeleteOutlined, DatabaseOutlined,
    DeleteOutlined, InboxOutlined
} from '@ant-design/icons';
import BACKEND from '../../../../config/backend';
import Sessions from '../../../../utils/Sesions';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import AddExpModel from './Exp_Add_Model';
const { Header, Content, Sider, Footer } = Layout;
const { SubMenu } = Menu;
const { Step } = Steps;
const { Option } = Select;
const { Dragger } = Upload;

const Add_Exp = () => {
    //instanciar el modelo
    const expModel = new AddExpModel();
    const [agregarExp, setAgregarExp] = useState(true);
    // Estado para verificar si el usuario está logueado
    const [isLogged, setIsLogged] = useState(true);
    const navigate = useNavigate();
    //Efectos para terminar la configuración
    const [showConfetti, setShowConfetti] = useState(false);
    const [recycle, setRecycle] = useState(true);

  const [loading, setLoading] = useState(false);
    //Función para finalizar la configuración
    const handleShowConfetti = () => {
        setShowConfetti(true);
        setRecycle(true); // Permitir que las partículas aparezcan
        setTimeout(() => setRecycle(false), 1500); // Detener gradualmente después de 3 segundos
        setTimeout(() => {
            setShowConfetti(false); // Ocultar el componente completamente después de 6 segundos
           
        }, 3000);
    };

    //Generales
    const [filteredLabs, setFilteredLabs] = useState([]); // Para almacenar los resultados filtrados
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [formAutores] = Form.useForm(); // Hook useForm() en el componente
    //Función para avanzar en el formulario
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
    //Función para retroceder en el formulario
    const prev = () => setCurrentStep(currentStep - 1);
    //Función para finalizar la configuración
    const finish = async () => {
        //message.success('Configuration Complete!');
       await handleShowConfetti();
       //esperar 3 segundos
        setTimeout(() => {
          navigate('/students/experiments');
        }
        , 2000);
    };

    useEffect(() => {
        const validateSession = async () => {
            try {
                const validate = await Sessions.validateSession(); // Esperar a que se resuelva la promesa
                setIsLogged(validate);

                if (!validate) {
                    navigate('/login'); // Redirigir si no está logueado
                }
            } catch (error) {
                console.error('Error validando sesión:', error);
                setIsLogged(false);
                navigate('/login'); // Redirigir en caso de error
            }
        };

        validateSession(); // Llamar a la función asíncrona
    }, [navigate]);

    //###################################################################################### FUNCTIONS DE CADA ETAPA
    //--------------------- ETAPA 1: Descripción del experimento ---------------------
    //titulo, descripcion, tags[], references_cid[]
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [referenceCID, setReferenceCID] = useState([]);

    const [titleReference, setTitleReference] = useState('');
    //buscar que exista el CID de referencia
    const searchReferenceCID = async (cid) => {
      setLoading(true);
      //hacer peticion a /students/experiments/get/:id para buscar la informacion del experimento
      //si el resultado es true, entonces agregar el CID a la lista de referenceCID
      await fetch(`${BACKEND}/students/experiments/get/${cid}`)
      .then((response) => response.json())
      .then(async (data) => {
        //console.log(data);
        if(data.status === 210){
          setLoading(false);
          Modal.error({
            title: 'CID no encontrado',
            content: 'El CID de referencia no fue encontrado',
            centered: true,
        });

        }
        else{
        if(data.status === 201){
          setLoading(false);
          await setTitleReference(data.title);
          Modal.success({
              title: 'CID encontrado',
              content: 'Agregando el experimento de referencia: ' + titleReference,
              centered: true,
          });
          setReferenceCID([...referenceCID, cid]);
        }
      }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
/*
       const resultado = true;
       if (resultado) {
        //obtener el titulo del experimento
        
       }
         else {
        
        }*/
    };

    //--------------------- ETAPA 2: Carga de archivos ---------------------
    const [files, setFiles] = useState([]);
    const handleFileChange = ({ fileList }) => {
        setFiles(fileList);
    };

    const handleRemove = (file) => {
        setFiles(files.filter((f) => f.uid !== file.uid));
    };

    //post a backend
 // Enviar los archivos al backend
const sendToBackend = async () => {
    try {
      // Crear un FormData para enviar los archivos y otros datos
      const formData = new FormData();
      formData.append('experiment', JSON.stringify(expModel)); // Enviar el JSON del experimento
  
      // Agregar los archivos al FormData
      expModel.files.forEach((file) => {
        if (file.originFileObj) {
          //console.log("Archivo preparado para enviar:", file.originFileObj.name);  // Verifica el nombre del archivo aquí
          formData.append('files', file.originFileObj); // Asegúrate de usar originFileObj
        }
      });
  
      // Hacer la solicitud al backend
      const response = await fetch(`${BACKEND}/students/experiments/add`, {
        method: 'POST',
        body: formData
      });
  
      // Comprobar si la respuesta es correcta
      if (response.ok) {
        const responseData = await response.json();
        //console.log("Response:", responseData);
        alert("Archivos enviados correctamente.");
      } else {
        throw new Error('Error al enviar los archivos');
      }
    } catch (error) {
      console.error("Error al cargar los archivos:", error);
      alert("Error al cargar los archivos.");
    }
  };

        //--------------------- ETAPA 3: Autores ---------------------

        const [authors, setAuthors] = useState([
            {
              name: "Javier Guitierrez Ramirez",
              orcid: "0000-0002-3456-7890",
              affiliation: "Tecnológico Nacional de México",
            },
          ]);
          
          const saveAuthors = async () => {
            //establecer el loading
            setLoading(true);
            expModel.setTitle(title);
            expModel.setAuthors(authors);
            expModel.setDescription(description);
            expModel.setTags(tags);
            expModel.setReferenceCID(referenceCID);
            expModel.setFiles(files);
            expModel.setAuthors(authors);
           
            const datos = expModel.toJSON();
            //console.log('Experimento:', JSON);
          
            try {
              const formData = new FormData();
              formData.append('experiment', datos); // Enviar el JSON del experimento
          
              // Agregar los archivos al FormData
              expModel.files.forEach((file) => {
                if (file.originFileObj) {
                  //console.log("Archivo preparado para enviar:", file.originFileObj.name);
                  formData.append('files', file.originFileObj); 
                }
              });
          
              // Hacer la solicitud al backend
              const response = await fetch(`${BACKEND}/students/experiments/add`, {
                method: 'POST',
                body: formData,
              });
          
              const responseData = await response.json();
              //console.log("DATA DE BLOCKCHAIN:", responseData);
              setLoading(false);
              // 📌 Manejo de respuestas según el status
              if (responseData.status === 200) {
                //verificar que responseData.iscomplited sea true
                if(responseData.iscomplited){
                  setAgregarExp(false);
                 
                  //alert(`✅ Transacción completada con éxito.\n\n📜 Hash: ${responseData.transactionHash}\n📦 IPFS: ${responseData.url_ipfs}\n⛽ Gas usado: ${responseData.gasUsed}\n💰 Costo: ${responseData.costInMatic} MATIC (${responseData.costInMxn} MXN)`);
                  Modal.success({
                    title: '✅ Transacción completada con éxito',
                    centered: true,
                    content: (
                      <div>
                        <p><strong>📜 Hash:</strong> {responseData.transactionHash}</p>
                        <p><strong>📦 IPFS:</strong> <a href={responseData.url_ipfs} target="_blank" rel="noopener noreferrer">{responseData.url_ipfs}</a></p>
                        <p><strong>⛽ Gas usado:</strong> {responseData.gasUsed}</p>
                        <p><strong>💰 Costo:</strong> {responseData.costInMatic} MATIC ({responseData.costInMxn} MXN)</p>
                      </div>
                    ),
                    footer: (
                      <>
                        <Button
  type="primary"
  style={{ marginTop: '15px', marginRight: '10px' }}
  onClick={async () => {
    await finish();  // Espera a que la función finish() termine
    Modal.destroyAll();  // Luego cierra el modal
  }}
>
  OK
</Button>

                        <Button onClick={() => console.log('Salir')}>Salir</Button>
                      </>
                    ),
                  });
                  
                }
                else{
                  Modal.error({
                    title: 'Transacción no completada',
                    content: responseData.message,
                    centered: true,
                    footer: (
                      <>
                        <Button type="primary" style={{ marginTop: '15px', marginRight:'10px' }} onClick={() => Modal.destroyAll()}>
                          OK
                        </Button>
                        <Button onClick={() => console.log('Salir')}>Salir</Button>
                      </>
                    ),
                  });
                  //alert(`⚠️ ${responseData.message}`);
                }
                
              } else if (responseData.status === 500) {
                alert(`⚠️ Ocurrio un error: ${responseData.error}`);
              } else {
                alert("❌ Error inesperado al enviar los archivos.");
              }
          
            } catch (error) {
              console.error("Error al cargar los archivos:", error);
              //alert("❌ Error al cargar los archivos.");
            }
          };
          

    //######################################################################################
    const steps = [
       { //-------------------------------------------- Descripcion de experimento--------------------------------------------
    title: 'Información del Experimento',
    content: (
      <Spin spinning={loading} tip="Cargando...">
        
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center', minHeight: '500px' }}>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ExperimentOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                    Descripción del Experimento
                </h2>
                <div
                    style={{
                        borderTop: '1px solid #b9b9b9',
                        marginTop: '10px',
                        width: '100%',
                        marginBottom: '0px',
                    }}
                ></div>
                <p style={{ marginBottom: '0', color: '#272727' }}>
                    Completa los siguientes campos.
                </p>
            </div>
            {/* Formulario */}
            <Form.Item
                label="Título del experimento"
                name="title"
                rules={[{ required: true, message: 'Por favor completa este campo' }]}
            >
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ingresa el título del experimento" />
            </Form.Item>
            <Form.Item
    label="Descripción del experimento"
    name="description"
    rules={[{ required: true, message: 'Por favor completa este campo' }]}
>
    <Input.TextArea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Ingresa la descripción del experimento"
        autoSize={{ minRows: 1, maxRows: 5 }} // Restringe a una línea
        style={{ maxHeight: '30px', overflow: 'hidden' }} // Evita expansión
    />
</Form.Item>
            <Form.Item
                label="Etiquetas"
                name="tags"
                rules={[{ required: true, message: 'Por favor completa este campo' }]}
            >
                <Select
                    mode="tags"
                    value={tags}
                    onChange={setTags}
                    placeholder="Añade etiquetas"
                />
            </Form.Item>
          <Form.Item label="CID de Referencia" name="referenceCID">
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Select
            mode="multiple"
            value={referenceCID}
            onChange={setReferenceCID}
            placeholder="Añade CIDs de referencia"
            style={{ flex: 1 }} // Hace que el Select ocupe el espacio disponible
        />
        <Button
            type="default"
            onClick={() => {
                let newCID = "";
                Modal.confirm({
                    title: "Añadir CID de Referencia",
                    content: (
                        <Input
                            placeholder="Ingresa el ID del experimento de referencia"
                            onChange={(e) => (newCID = e.target.value)}
                        />
                    ),
                    centered: true, // <-- Hace que el modal esté centrado en la pantalla
                    onOk: () => {
                        if (newCID.trim()) {
                            searchReferenceCID(newCID);

                        }
                    },
                    okText: "Agregar",
                    cancelText: "Cancelar",
                });
            }}
        >
            Agregar
        </Button>
    </div>
</Form.Item>
            <Button type="primary" onClick={next}>
                Guardar Experimento
            </Button>
        </Form>
        </Spin>
    ),
},
{ //-------------------------------------------- Archivos del experimento--------------------------------------------
    title: 'Archivos del Experimento',
    content: (
        <Form form={form} layout="vertical" style={{ width: '90%', margin: '0 auto', justifyContent: 'center', minHeight: '500px' }}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ExperimentOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
                Archivos del Experimento
            </h2>
            <div
                style={{
                    borderTop: '1px solid #b9b9b9',
                    marginTop: '10px',
                    width: '100%',
                    marginBottom: '0px',
                }}
            ></div>
            <p style={{ marginBottom: '0', color: '#272727' }}>
                Agrega los archivos que generaste en el experimento, reportes, imágenes, etc.
            </p>
        </div>
        {/* Carga de archivos */}
        <Form.Item
            label="Archivos del Experimento"
            name="files"
            
        >
<Dragger
multiple
height={180}
fileList={files}
onChange={handleFileChange}
onRemove={handleRemove}
beforeUpload={() => false} // Previene la carga automática
showUploadList={false} // Desactiva la visualización de la lista de archivos
style={{
border: '2px dashed #1890ff',
borderRadius: '8px',
display: 'flex',
alignContent: 'center',
justifyContent: 'center',
height: '100px',
}}
>
<p className="ant-upload-drag-icon">
<InboxOutlined />
</p>
<p className="ant-upload-text">Haz clic o arrastra archivos aquí para cargarlos</p>
</Dragger>
            {/* Contenedor para la lista de archivos con altura máxima y scroll */}
            <div
                style={{
                    height: '130px', // Altura máxima
                    overflowY: 'auto', // Scroll vertical
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    padding: '10px',
                    marginTop: '10px',
                }}
            >
                {files.map((file) => (
                    <div
                        key={file.uid}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '3px',
                            borderBottom: '1px solid #f0f0f0',
                        }}
                    >
                        <span>{file.name}</span>
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemove(file)}
                        />
                    </div>
                ))}
            </div>
        </Form.Item>
        <Button type="primary" onClick={next} style={{ marginTop: '20px' }}>
            Coninuar registro
        </Button>
    </Form>
    ),
},
{
    title: 'Autores',
    content: (
      <Spin spinning={loading} tip="Cargando...">
      <Form
        form={form}
        layout="vertical"
        style={{
          width: '90%',
          margin: '0 auto',
          justifyContent: 'center',
          minHeight: '500px',
          display: 'flex', // Establecer flexbox para alinear los elementos
          flexDirection: 'column', // Alinear los elementos de arriba hacia abajo
        }}
      >
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <UserOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
            Autores del Experimento
          </h2>
          <div
            style={{
              borderTop: '1px solid #b9b9b9',
              marginTop: '10px',
              width: '100%',
              marginBottom: '0px',
            }}
          ></div>
          <p style={{ marginBottom: '0', color: '#272727' }}>
            Completa los siguientes campos.
          </p>
        </div>
  
        {/* Lista de autores */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Autores Registrados:</h3>
          <List
            bordered
            dataSource={authors}
            style={{
              marginTop: '20px',
              marginBottom: '20px',
              height: '150px', // Establecer un alto fijo
              overflowY: 'auto', // Activar desplazamiento vertical
            }}
            renderItem={(author, index) => (
              <List.Item
                key={index}
                style={{
                  transition: 'background-color 0.3s ease', // Transición suave
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{cursor: 'pointer'}} onClick={() => 
                    Modal.info({
                        title: 'Información del Autor',
                        content: (
                            <div>
                                <p><strong>Nombre:</strong> {author.name}</p>
                                <p><strong>ORCID:</strong> {author.orcid}</p>
                                <p><strong>Institución:</strong> {author.affiliation}</p>
                            </div>
                        ),
                        centered: true,
                    })
                }>
                  <strong>{author.name}</strong>
                </div>
              </List.Item>
            )}
          />
        </div>
  
        {/* Botón para agregar autor */}
        <Button
          type="dashed"
          onClick={() => {
            Modal.confirm({
                title: "Agregar Nuevo Autor",
                content: (
                  <Form layout="vertical" form={form}>
                    <Form.Item
                      label="Nombre del autor"
                      name="authorName"
                      rules={[{ required: true, message: "Por favor ingresa el nombre del autor" }]}
                    >
                      <Input placeholder="Nombre completo del autor" />
                    </Form.Item>
            
                    <Form.Item
                      label="ORCID"
                      name="orcid"
                      rules={[{ required: true, message: "Por favor ingresa el ORCID del autor" }]}
                    >
                      <Input placeholder="ORCID del autor" />
                    </Form.Item>
            
                    <Form.Item
                      label="Institución"
                      name="affiliation"
                      rules={[{ required: true, message: "Por favor ingresa la institución del autor" }]}
                    >
                      <Input placeholder="Institución del autor" />
                    </Form.Item>
                  </Form>
                ),
                centered: true,
                onOk: async () => {
                  try {
                    await form.validateFields(); // Valida el formulario antes de obtener valores
                    const values = form.getFieldsValue(); // Obtiene los valores actuales del formulario
            
                    const newAuthor = {
                      name: values.authorName,
                      orcid: values.orcid,
                      affiliation: values.affiliation,
                    };
                    //console.log("Nuevo autor:", newAuthor);
                    setAuthors((prevAuthors) => [...prevAuthors, newAuthor]); // Agrega el nuevo autor correctamente
                    form.resetFields(); // Limpia el formulario después de agregar
                  } catch (error) {
                    console.error("Error al agregar autor:", error);
                  }
                },
                okText: "Agregar",
                cancelText: "Cancelar",
              });

          }}
        >
          Agregar Autor
        </Button>

        {/* Botón de continuar, alineado al fondo */}
        <div style={{ marginTop: 'auto', marginBottom: '20px', width: '100%' }}>
          <Button type="primary" disabled={!agregarExp} onClick={saveAuthors} style={{ width: '100%' }}>
            Guardar Experimento
          </Button>
        </div>
        
      </Form>
      </Spin>
    ),
  }
    ];

    return (
        <Layout style={{ minHeight: '100vh', margin: '-9.5px' }}>
            {/* Header */}
            <Header className="site-layout-background" style={{ padding: 0 }}>
                <div style={{ color: 'white', fontSize: '20px', textAlign: 'center' }}>
                    Mi Aplicación Super Usuario
                </div>
            </Header>

            {/* Main Layout */}
            <Layout>
                {/* Sider */}
                <Sider width={250} className="site-layout-background">
                    <Menu mode="inline" defaultSelectedKeys={['2']} style={{ height: '100%', borderRight: 0, userSelect: 'none', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
                        <Menu.Item key="1" icon={<HomeOutlined />}>
                            Inicio
                        </Menu.Item>
                        <Menu.Item key="2" icon={<ExperimentOutlined />}>
                            Mis experimentos
                        </Menu.Item>
                        <Menu.Item key="3" icon={<UserOutlined />}>
                            Mi perfil
                        </Menu.Item>

                        {/* Submenú Blockchain */}
                        <SubMenu key="sub4" icon={<BlockOutlined />} title="Blockchain">
                            <Menu.Item key="4-1" icon={<ExperimentOutlined />}>Experimentos</Menu.Item>
                            <Menu.Item key="4-2" icon={<UserDeleteOutlined />}>Autores</Menu.Item>
                        </SubMenu>

                        <Menu.Item key="6" icon={<LogoutOutlined />}>
                            Cerrar sesión
                        </Menu.Item>
                    </Menu>
                </Sider>

                {/* Content */}
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
                        <Breadcrumb.Item>Mis experimentos</Breadcrumb.Item>
                        <Breadcrumb.Item>Registrar</Breadcrumb.Item>
                    </Breadcrumb>
                   
                        <Layout style={{ width: '100%', height: '100%', margin: '0px', padding: '0px', backgroundColor:'none'}} >
                            <Content style={{backgroundColor:'none', maxHeight: '50px', width: '100%', marginBottom: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                                <Steps current={currentStep} style={{ backgroundColor: 'none', width: '80%' }}>
                                    {steps.map((step, index) => (
                                        <Step key={index} title={step.title} />
                                    ))}
                                </Steps>
                            </Content>
                            <div style={{ padding: '20px', borderRadius: '8px', width: '100%', display: 'flex', justifyContent: 'center', backgroundColor:'none' }}>
                                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '50%', maxWidth: '450px', minWidth: '350px', border: '1px solid #d4d4d4' }}>
                                    {steps[currentStep].content}
                                </div>
                            </div>


                            {showConfetti && (
                                <Confetti

                                    recycle={recycle} // Controlar si las partículas se reciclan
                                    numberOfPieces={300} // Número inicial de partículas
                                    gravity={0.2} // Gravedad para caída más lenta
                                />
                            )}
 
                        </Layout>
                   
                </Layout>
            </Layout>
        </Layout>
    );
};

export default Add_Exp;
