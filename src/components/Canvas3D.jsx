import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Canvas3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Dimensions
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 5.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    currentMount.appendChild(renderer.domElement);

    // Group for the 3D Holographic Robotics Core
    const robotCoreGroup = new THREE.Group();
    scene.add(robotCoreGroup);

    // 1. Central Compute Core (Icosahedron in Pink Accent)
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      wireframe: true,
      emissive: 0xec4899,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.9
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    robotCoreGroup.add(coreMesh);

    // Solid inner glowing orb (Purple Accent)
    const orbGeo = new THREE.SphereGeometry(0.42, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: false
    });
    const orbMesh = new THREE.Mesh(orbGeo, orbMat);
    robotCoreGroup.add(orbMesh);

    // 2. Gimbal / Gyroscope Rings (Pink, Purple, Sky Blue)
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0xec4899, wireframe: true });
    const ringGeo1 = new THREE.TorusGeometry(1.5, 0.02, 8, 50);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    robotCoreGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true });
    const ringGeo2 = new THREE.TorusGeometry(1.9, 0.02, 8, 50);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = Math.PI / 3;
    robotCoreGroup.add(ring2);

    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const ringGeo3 = new THREE.TorusGeometry(2.3, 0.015, 8, 50);
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.y = Math.PI / 4;
    robotCoreGroup.add(ring3);

    // 3. Orbiting Sensor Satellites
    const satellites = [];
    const satCount = 6;
    const satGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8
    });

    for (let i = 0; i < satCount; i++) {
      const sat = new THREE.Mesh(satGeo, satMat);
      const angle = (i / satCount) * Math.PI * 2;
      const radius = 2.6;
      sat.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 1.2, Math.sin(angle) * radius);
      sat.userData = { angle, radius, speed: 0.012 + i * 0.003 };
      robotCoreGroup.add(sat);
      satellites.push(sat);
    }

    // 4. Floating Ambient Particle Field
    const particlesCount = 180;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 12;
      posArray[i + 1] = (Math.random() - 0.5) * 8;
      posArray[i + 2] = (Math.random() - 0.5) * 12;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0xec4899,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const particleField = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleField);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pinkPoint = new THREE.PointLight(0xec4899, 3, 20);
    pinkPoint.position.set(3, 4, 3);
    scene.add(pinkPoint);

    const bluePoint = new THREE.PointLight(0x38bdf8, 3, 20);
    bluePoint.position.set(-3, -2, 2);
    scene.add(bluePoint);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      if (!currentMount) return;
      const rect = currentMount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / (rect.width || 1) - 0.5;
      const y = (e.clientY - rect.top) / (rect.height || 1) - 0.5;
      targetX = x * 1.2;
      targetY = y * 1.2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Rotate Gimbal Rings
      ring1.rotation.x += 0.008;
      ring1.rotation.y += 0.012;

      ring2.rotation.y -= 0.01;
      ring2.rotation.z += 0.007;

      ring3.rotation.x += 0.005;
      ring3.rotation.z -= 0.009;

      // Rotate & Pulse Core
      coreMesh.rotation.y += 0.015;
      coreMesh.rotation.x += 0.008;
      const scale = 1 + Math.sin(elapsedTime * 2.5) * 0.06;
      coreMesh.scale.set(scale, scale, scale);

      // Rotate Satellites
      satellites.forEach((sat) => {
        sat.userData.angle += sat.userData.speed;
        sat.position.x = Math.cos(sat.userData.angle) * sat.userData.radius;
        sat.position.z = Math.sin(sat.userData.angle) * sat.userData.radius;
        sat.rotation.x += 0.02;
        sat.rotation.y += 0.03;
      });

      // Ambient particle drift
      particleField.rotation.y = elapsedTime * 0.02;

      // Group responds to cursor tilt
      robotCoreGroup.rotation.y = mouseX * 0.8 + elapsedTime * 0.1;
      robotCoreGroup.rotation.x = -mouseY * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }

      // Dispose geometries and materials
      coreGeo.dispose();
      coreMat.dispose();
      orbGeo.dispose();
      orbMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      ringGeo3.dispose();
      ringMat3.dispose();
      satGeo.dispose();
      satMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
}

