import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BuildingShelter, CityRegion } from '../types/shelter';
import { 
  Rotate3d, 
  Layers, 
  Droplet, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle,
  Maximize2
} from 'lucide-react';

interface Map3DProps {
  shelters: BuildingShelter[];
  onSelectShelter: (shelter: BuildingShelter) => void;
}

export const Map3D: React.FC<Map3DProps> = ({ shelters, onSelectShelter }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState<CityRegion>('JOINVILLE_SC');
  const [waterLevel, setWaterLevel] = useState<number>(5.5); // meters
  const [selectedShelter3D, setSelectedShelter3D] = useState<BuildingShelter | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  // Filter shelters for the selected city/region
  const cityShelters = shelters.filter(s => s.cityRegion === selectedCity);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.FogExp2(0x090d16, 0.012);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(40, 35, 50);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff0dd, 1.2);
    dirLight.position.set(50, 60, 30);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueRimLight = new THREE.PointLight(0x38bdf8, 2, 80);
    blueRimLight.position.set(-30, 20, -30);
    scene.add(blueRimLight);

    // 3. 3D Terrain Geometry
    const terrainSize = 70;
    const segments = 45;
    const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, segments, segments);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      // Create hills and a natural river/valley depression
      const valley = Math.sin(vx * 0.08) * 4;
      const hills = Math.cos(vz * 0.07) * 3 + Math.sin((vx + vz) * 0.05) * 5;
      const elevation = Math.max(1, valley + hills + 6);
      posAttr.setY(i, elevation);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // Grid on terrain
    const gridHelper = new THREE.GridHelper(terrainSize, 25, 0x334155, 0x1e293b);
    gridHelper.position.y = 0.2;
    scene.add(gridHelper);

    // 4. Dynamic Water Plane (Flood simulation)
    const waterGeo = new THREE.PlaneGeometry(terrainSize, terrainSize);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.65,
      roughness: 0.1,
      metalness: 0.6,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = waterLevel;
    scene.add(waterMesh);

    // 5. 3D Markers for Shelters
    const markerGroup = new THREE.Group();
    scene.add(markerGroup);

    const markersList: { mesh: THREE.Mesh; shelter: BuildingShelter }[] = [];

    cityShelters.forEach((shelter, idx) => {
      // Position buildings across the terrain
      const angle = (idx / cityShelters.length) * Math.PI * 2;
      const radius = 16 + (idx % 3) * 6;
      const bx = Math.cos(angle) * radius;
      const bz = Math.sin(angle) * radius;
      // Relative height mapped from elevationMeters
      const by = Math.max(2, Math.min(22, shelter.elevationMeters * 0.45));

      // Color coding: Green = Apto, Amber = Ressalvas, Red = Inapto
      let markerColor = 0x10b981;
      if (shelter.status === 'APTO_COM_RESSALVAS') markerColor = 0xf59e0b;
      if (shelter.status === 'INAPTO') markerColor = 0xf43f5e;

      // Base building block
      const bGeo = new THREE.BoxGeometry(3, 4, 3);
      const bMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
      const buildingMesh = new THREE.Mesh(bGeo, bMat);
      buildingMesh.position.set(bx, by / 2, bz);
      buildingMesh.castShadow = true;
      markerGroup.add(buildingMesh);

      // Status Pin Beacon on top
      const pinGeo = new THREE.CylinderGeometry(0.8, 0.2, 4, 12);
      const pinMat = new THREE.MeshStandardMaterial({
        color: markerColor,
        emissive: markerColor,
        emissiveIntensity: 0.6,
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(bx, by + 3, bz);
      markerGroup.add(pinMesh);

      // Glowing sphere top
      const sphereGeo = new THREE.SphereGeometry(1.1, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: markerColor });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      sphereMesh.position.set(bx, by + 5.5, bz);
      markerGroup.add(sphereMesh);

      // Store for raycasting/clicking
      buildingMesh.userData = { shelter };
      sphereMesh.userData = { shelter };
      markersList.push({ mesh: sphereMesh, shelter });
    });

    // 6. Camera Orbit & Drag Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      scene.rotation.y += deltaX * 0.006;
      camera.position.y = Math.max(15, Math.min(65, camera.position.y - deltaY * 0.15));

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Raycast click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerGroup.children);

      if (intersects.length > 0) {
        const clickedObj = intersects[0].object;
        if (clickedObj.userData && clickedObj.userData.shelter) {
          setSelectedShelter3D(clickedObj.userData.shelter);
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('click', onClick);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation if active
      if (isRotating && !isDragging) {
        scene.rotation.y += 0.002;
      }

      // Water subtle wave pulsation
      waterMesh.position.y = waterLevel + Math.sin(elapsedTime * 2) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('click', onClick);
      renderer.dispose();
    };
  }, [selectedCity, waterLevel, isRotating, cityShelters]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg text-white">
      {/* 3D Toolbar */}
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <Rotate3d className="w-5 h-5 text-rose-500 animate-spin-slow" />
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Simulador 3D Altimétrico de Terreno & Inundação</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                WebGL 3D
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualização de relevo com cota de inundação dinâmica e elevação dos prédios
            </p>
          </div>
        </div>

        {/* Region / City Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setSelectedCity('JOINVILLE_SC')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedCity === 'JOINVILLE_SC'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Joinville (SC)
            </button>
            <button
              onClick={() => setSelectedCity('RIO_GRANDE_DO_SUL')}
              className={`px-3 py-1 rounded-md transition-colors ${
                selectedCity === 'RIO_GRANDE_DO_SUL'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Rio Grande do Sul
            </button>
          </div>

          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
              isRotating
                ? 'bg-slate-800 border-slate-700 text-slate-200'
                : 'bg-rose-950/60 border-rose-700 text-rose-300'
            }`}
            title="Pausar / Retomar rotação do relevo"
          >
            {isRotating ? 'Pausar Giro' : 'Girar 3D'}
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="relative w-full h-[480px] bg-slate-950 cursor-grab active:cursor-grabbing">
        <div ref={mountRef} className="w-full h-full" />

        {/* Floating Water Level Slider Overlay */}
        <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-3.5 shadow-xl max-w-xs space-y-2 z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-sky-400" />
              <span>Simular Lâmina D'Água:</span>
            </span>
            <span className="font-mono font-bold text-sky-400 tabular-nums">
              {waterLevel.toFixed(1)} m
            </span>
          </div>

          <input
            type="range"
            min="1.0"
            max="12.0"
            step="0.5"
            value={waterLevel}
            onChange={(e) => setWaterLevel(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />

          <div className="text-[10px] text-slate-400 leading-snug">
            {selectedCity === 'JOINVILLE_SC'
              ? 'Joinville: Maré astronômica (2,1m) + Cheia do Rio Cachoeira (Cota 4m a 6m alaga Centro e Morro do Meio).'
              : 'RS: Guaíba atingiu 5,35m em maio/2024. Prédios em cotas baixas ficam submersos.'}
          </div>
        </div>

        {/* 3D Legend (Bottom Left) */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md rounded-lg p-2.5 text-[11px] text-slate-300 border border-slate-800 space-y-1 z-10 hidden sm:block">
          <div className="font-semibold text-white uppercase text-[9px] tracking-wider mb-1">
            Status dos Prédios 3D
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
            <span>Apto Imediato (Cota Alta &amp; Segura)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
            <span>Apto com Ressalvas Operacionais</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" />
            <span>Inapto / Risco de Inundação</span>
          </div>
        </div>

        {/* Selected Shelter Floating Card in 3D */}
        {selectedShelter3D && (
          <div className="absolute bottom-4 right-4 max-w-sm bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-2xl text-white z-20 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono text-slate-400">{selectedShelter3D.code} · {selectedShelter3D.city}</div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{selectedShelter3D.name}</h4>
                <div className="text-xs text-slate-300">{selectedShelter3D.neighborhood}</div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  selectedShelter3D.status === 'APTO_IMEDIATO' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                  selectedShelter3D.status === 'APTO_COM_RESSALVAS' ? 'bg-amber-950 text-amber-300 border border-amber-700' :
                  'bg-rose-950 text-rose-300 border border-rose-700'
                }`}>
                  IAA {selectedShelter3D.overallScore}%
                </span>
                <div className="text-xs font-mono font-bold text-sky-400 mt-0.5">
                  Cota {selectedShelter3D.elevationMeters}m
                </div>
              </div>
            </div>

            {selectedShelter3D.hasCriticalVeto ? (
              <div className="p-2 bg-rose-950/60 border border-rose-800 rounded text-xs text-rose-300">
                {selectedShelter3D.vetoReason}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/80 p-2 rounded">
                <div>
                  <span className="text-slate-400">Capacidade:</span>{' '}
                  <strong className="text-white font-mono">{selectedShelter3D.capacityPersons} vagas</strong>
                </div>
                <div>
                  <span className="text-slate-400">Autonomia:</span>{' '}
                  <strong className="text-white font-mono">{(selectedShelter3D.facilities.waterTanksLiters / 1000).toFixed(0)}k Litros</strong>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                {selectedShelter3D.elevationMeters > waterLevel ? '✓ Acima da lâmina d’água' : '⚠️ Área alagada nesta cota'}
              </span>
              <button
                onClick={() => onSelectShelter(selectedShelter3D)}
                className="px-3 py-1 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-600 rounded-md transition-colors"
              >
                Ver Ficha Técnica
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
