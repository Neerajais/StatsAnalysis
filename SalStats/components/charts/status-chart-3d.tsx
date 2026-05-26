'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { DashboardData, calculateStatusCounts } from '@/lib/calculations';

interface Status3DChartProps {
  data: DashboardData[];
}

interface BoxBarProps {
  height: number;
  position: [number, number, number];
  color: string;
  label: string;
  value: number;
  percentage: number;
}

function BoxBar({ height, position, color, label, value, percentage }: BoxBarProps) {
  return (
    <group position={position}>
      {/* Main box with gradient effect */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, height, 1.2]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.4}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Top cap */}
      <mesh position={[0, height + 0.1, 0]}>
        <boxGeometry args={[1.4, 0.2, 1.4]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, height + 1.8, 0]}
        fontSize={0.65}
        color="#ffffff"
        anchorY="bottom"
        fontWeight="bold"
        maxWidth={3}
      >
        {label}
      </Text>

      {/* Value with percentage */}
      <Text
        position={[0, height + 0.8, 0]}
        fontSize={0.5}
        color="#e0e0e0"
        anchorY="top"
      >
        {value} ({percentage}%)
      </Text>
    </group>
  );
}

export default function StatusChart3D({ data }: Status3DChartProps) {
  const chartData = useMemo(() => {
    const counts = calculateStatusCounts(data);
    // counts already includes percentage from the function
    return counts.slice(0, 8);
  }, [data]);

  const colors = [
    '#3b82f6', '#f97316', '#22c55e', '#a855f7',
    '#f43f5e', '#14b8a6', '#eab308', '#06b6d4'
  ];
  
  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="w-full h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg shadow-lg overflow-hidden">
      <Canvas
        camera={{ position: [15, 9, 15], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[12, 12, 8]} intensity={1.3} castShadow />
        <spotLight position={[-12, 15, -12]} intensity={0.8} castShadow />

        {/* Grid */}
        <gridHelper args={[50, 50]} position={[0, -0.5, 0]} />

        {/* Bars */}
        {chartData.map((item, idx) => {
          const row = Math.floor(idx / 4);
          const col = idx % 4;
          return (
            <BoxBar
              key={item.name}
              height={(item.value / maxValue) * 9}
              position={[
                (col - 1.5) * 3.5,
                0,
                (row - 0.5) * 3.5,
              ]}
              color={colors[idx % colors.length]}
              label={item.name}
              value={item.value}
              percentage={item.percentage}
            />
          );
        })}

        {/* Title */}
        <Text position={[0, 14, 0]} fontSize={1.8} color="#ffffff" fontWeight="bold">
          Status Analysis
        </Text>

        {/* Controls */}
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={1.5}
          enableZoom={true}
          enablePan={true}
        />
      </Canvas>
    </div>
  );
}
