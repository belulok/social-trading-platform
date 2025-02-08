import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function MarketVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: THREE.Points;
    dataStreams: THREE.Line[];
    neuralNodes: THREE.Mesh[];
    priceCharts: THREE.Line[];
    candlesticks: THREE.InstancedMesh;
    frameId: number;
  }>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles for market data points
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 50;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;

      colors[i3] = 0.2 + Math.random() * 0.2;     // R
      colors[i3 + 1] = 0.4 + Math.random() * 0.2; // G
      colors[i3 + 2] = 0.8 + Math.random() * 0.2; // B
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Create neural network nodes
    const neuralNodes: THREE.Mesh[] = [];
    const neuralGeometry = new THREE.IcosahedronGeometry(0.5, 1);
    const neuralMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9,
      wireframe: true,
    });

    // Create layers of neural nodes
    const layers = [4, 6, 6, 4];
    const layerSpacing = 10;
    layers.forEach((nodesInLayer, layerIndex) => {
      const xPos = (layerIndex - (layers.length - 1) / 2) * layerSpacing;
      for (let i = 0; i < nodesInLayer; i++) {
        const node = new THREE.Mesh(neuralGeometry, neuralMaterial);
        const yPos = (i - (nodesInLayer - 1) / 2) * 4;
        node.position.set(xPos, yPos, 0);
        neuralNodes.push(node);
        scene.add(node);
      }
    });

    // Create data streams
    const dataStreams: THREE.Line[] = [];
    const streamGeometry = new THREE.BufferGeometry();
    const streamMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.2,
    });

    // Connect neural nodes with data streams
    for (let i = 0; i < neuralNodes.length - 1; i++) {
      for (let j = i + 1; j < neuralNodes.length; j++) {
        if (Math.random() > 0.85) {
          const points = [
            neuralNodes[i].position,
            neuralNodes[j].position,
          ];
          streamGeometry.setFromPoints(points);
          const stream = new THREE.Line(streamGeometry.clone(), streamMaterial);
          dataStreams.push(stream);
          scene.add(stream);
        }
      }
    }

    // Create price charts
    const priceCharts: THREE.Line[] = [];
    const chartPoints = 100;
    const chartMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.5,
    });

    for (let i = 0; i < 3; i++) {
      const points = [];
      for (let j = 0; j < chartPoints; j++) {
        points.push(new THREE.Vector3(
          (j - chartPoints / 2) * 0.2,
          Math.sin(j * 0.1) * 2 + Math.random() * 0.5,
          (i - 1) * 10
        ));
      }
      const chartGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const chart = new THREE.Line(chartGeometry, chartMaterial);
      priceCharts.push(chart);
      scene.add(chart);
    }

    // Create candlesticks
    const candlestickGeometry = new THREE.BoxGeometry(0.2, 1, 0.2);
    const candlestickMaterial = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.7,
    });
    const candlestickCount = 50;
    const candlesticks = new THREE.InstancedMesh(
      candlestickGeometry,
      candlestickMaterial,
      candlestickCount
    );

    const matrix = new THREE.Matrix4();
    for (let i = 0; i < candlestickCount; i++) {
      const x = (i - candlestickCount / 2) * 0.4;
      const y = Math.random() * 4 - 2;
      const z = Math.random() * 10 - 5;
      matrix.setPosition(x, y, z);
      candlesticks.setMatrixAt(i, matrix);
    }
    scene.add(candlesticks);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const animate = () => {
      if (!sceneRef.current) return;

      const currentTime = Date.now() * 0.001; // Define time variable for animations

      // Animate particles with mouse influence
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(currentTime + positions[i] * 0.1) * 0.02 + mouseRef.current.x * 0.01;
        positions[i + 1] += Math.cos(currentTime + positions[i + 1] * 0.1) * 0.02 + mouseRef.current.y * 0.01;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      // Animate neural nodes
      neuralNodes.forEach((node, i) => {
        node.rotation.x += 0.005;
        node.rotation.y += 0.005;
        const scale = 1 + Math.sin(currentTime + i) * 0.1;
        node.scale.setScalar(scale);
        
        // Add mouse influence
        node.position.x += (mouseRef.current.x * 0.05 - node.position.x * 0.01);
        node.position.y += (mouseRef.current.y * 0.05 - node.position.y * 0.01);
      });

      // Animate data streams
      dataStreams.forEach((stream, i) => {
        const positions = stream.geometry.attributes.position.array as Float32Array;
        const offset = i * 0.1;
        
        for (let j = 0; j < positions.length; j += 3) {
          positions[j + 2] = Math.sin(currentTime + offset + positions[j] * 0.1) * 2;
        }
        stream.geometry.attributes.position.needsUpdate = true;
        stream.material.opacity = 0.1 + Math.sin(currentTime + offset) * 0.1;
      });

      // Animate price charts
      priceCharts.forEach((chart, i) => {
        const positions = chart.geometry.attributes.position.array as Float32Array;
        
        for (let j = 0; j < positions.length; j += 3) {
          const index = j / 3;
          positions[j + 1] = Math.sin(currentTime * 0.5 + index * 0.1) * 2 + 
                            Math.sin(currentTime * 0.2 + mouseRef.current.x * index * 0.01) * 1;
        }
        chart.geometry.attributes.position.needsUpdate = true;
      });

      // Animate candlesticks
      const matrix = new THREE.Matrix4();
      for (let i = 0; i < candlestickCount; i++) {
        candlesticks.getMatrixAt(i, matrix);
        const position = new THREE.Vector3();
        position.setFromMatrixPosition(matrix);
        
        position.y += Math.sin(currentTime * 0.5 + i * 0.1) * 0.02 + mouseRef.current.y * 0.01;
        matrix.setPosition(position);
        candlesticks.setMatrixAt(i, matrix);
      }
      candlesticks.instanceMatrix.needsUpdate = true;

      // Camera movement
      camera.position.x = Math.sin(currentTime * 0.2) * 40;
      camera.position.z = Math.cos(currentTime * 0.2) * 40;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      sceneRef.current.frameId = requestAnimationFrame(animate);
    };

    sceneRef.current = {
      scene,
      camera,
      renderer,
      particles,
      dataStreams,
      neuralNodes,
      priceCharts,
      candlesticks,
      frameId: 0,
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;

      const { camera, renderer } = sceneRef.current;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.frameId);
        containerRef.current?.removeChild(sceneRef.current.renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 -z-10"
      style={{ 
        background: 'linear-gradient(to bottom, #000510, #001530)',
        overflow: 'hidden'
      }}
    />
  );
}