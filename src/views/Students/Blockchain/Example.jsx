import React, { useEffect, useState, useRef } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import { Modal, Button } from "antd";

const experiments = [
  {
    cid: "Qmc7waVn54LDZ3k6SonFZwdVzJwgPcJRRMZH9GVuHtVF71",
    title: "Ejemplo 2",
    description: "Este es un ejemplo numero 2",
    referencesCid: ["QmbCup1C6rweTLwCujWZyf3THHF6Dq9KVvGhU32k4SaUJ5"],
  },
  {
    cid: "QmbCup1C6rweTLwCujWZyf3THHF6Dq9KVvGhU32k4SaUJ5",
    title: "Experimento de prueba 1",
    description: "Este es un experimento de prueba",
    referencesCid: [],
  }
];

const Graph3D = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const fgRef = useRef();

  useEffect(() => {
    const nodes = experiments.map((exp) => ({
      id: exp.cid,
      name: exp.title,
      color: "#1f77b4",
    }));

    const links = experiments.flatMap((exp) =>
      exp.referencesCid.map((refCid) => ({
        source: exp.cid,
        target: refCid,
      }))
    );

    setGraphData({ nodes, links });
  }, []);

  const handleCenterView = () => {
    if (fgRef.current) {
      fgRef.current.cameraPosition({ x: 0, y: 0, z: 500 });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <Button
        style={{ position: "absolute", top: 10, left: 10, zIndex: 10 }}
        onClick={handleCenterView}
      >
        Centrar
      </Button>
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeAutoColorBy="id"
        linkDirectionalArrowLength={5}
        d3Force="charge"
        d3ForceStrength={-500}
        nodeThreeObject={(node) => {
          const group = new THREE.Group();

          // Nodo circular
          const geometry = new THREE.SphereGeometry(5, 16, 16);
          const material = new THREE.MeshBasicMaterial({ color: node.color });
          const sphere = new THREE.Mesh(geometry, material);
          group.add(sphere);

          // Texto debajo del nodo
          const sprite = new THREE.Sprite(
            new THREE.SpriteMaterial({
              map: new THREE.CanvasTexture(
                (() => {
                  const canvas = document.createElement("canvas");
                  const ctx = canvas.getContext("2d");
                  canvas.width = 100;
                  canvas.height = 50;
                  ctx.fillStyle = "white";
                  ctx.font = "14px Arial";
                  ctx.fillText(node.name, 10, 40);
                  return canvas;
                })()
              ),
            })
          );
          sprite.position.set(0, -8, 0);
          sprite.scale.set(10, 5, 1);
          group.add(sprite);

          return group;
        }}
        onNodeClick={(node) => setSelectedNode(node)}
      />
      <Modal
        title={selectedNode?.name}
        open={!!selectedNode}
        onCancel={() => setSelectedNode(null)}
        footer={null}
      >
        <p>{selectedNode?.id}</p>
      </Modal>
    </div>
  );
};

export default Graph3D;
