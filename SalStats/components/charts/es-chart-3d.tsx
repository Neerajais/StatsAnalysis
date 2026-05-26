'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { DashboardData, calculateESCounts } from '@/lib/calculations';

interface ES3DChartProps {
  data: DashboardData[];
}

interface CylinderBarProps {
  height: number;
  position: [number, number, number];
  color: string;
  label: string;
  value: number;
  percentage: number;
}

function CylinderBar({ height, position, color, label, value, percentage }: CylinderBarProps) {
  return (
    <group position={position}>
      {/* Main cylinder */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.8, 0.8, height, 32]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.3}
          roughness={0.4}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Label on top */}
      <Text
        position={[0, height + 1.5, 0]}
        fontSize={0.8}
        color="#ffffff"
        anchorY="bottom"
        fontWeight="bold"
      >
        {label}
      </Text>

      {/* Value */}
      <Text
        position={[0, height + 0.5, 0]}
        fontSize={0.6}
        color="#e0e0e0"
        anchorY="top"
      >
        {value} ({percentage}%)
      </Text>
    </group>
  );
}

export default function ESChart3D({ data }: ES3DChartProps) {
  const chartData = useMemo(() => {
    const counts = calculateESCounts(data);
    // counts already includes percentage from the function
    return counts.slice(0, 6);
  }, [data]);

  const colors = ['#3b82f6', '#f97316', '#22c55e', '#a855f7', '#f43f5e', '#14b8a6'];
  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="w-full h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg shadow-lg overflow-hidden">
      <Canvas
        camera={{ position: [12, 8, 12], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.6} />

        {/* Grid background */}
        <gridHelper args={[40, 40]} position={[0, -0.5, 0]} />

        {/* Bars */}
        {chartData.map((item, idx) => (
          <CylinderBar
            key={item.name}
            height={(item.value / maxValue) * 8}
            position={[
              (idx - chartData.length / 2) * 3,
              0,
              0,
            ]}
            color={colors[idx % colors.length]}
            label={item.name}
            value={item.value}
            percentage={item.percentage}
          />
        ))}

        {/* Title */}
        <Text position={[0, 12, 0]} fontSize={1.5} color="#ffffff" fontWeight="bold">
          ES Distribution
        </Text>

        {/* Controls */}
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={2}
          enableZoom={true}
          enablePan={true}
        />
      </Canvas>
    </div>
  );
}
