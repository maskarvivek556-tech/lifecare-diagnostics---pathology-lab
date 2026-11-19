import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ChevronDown,
  ChevronUp,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Sun,
} from 'lucide-react';
import {
  buildLabScene,
  detectSoftwareWebGL,
  LabSceneHandles,
} from '../three/buildLabScene';

type CameraPresetId = 'overview' | 'microscope' | 'centrifuge' | 'dna';
type LightingMood = 'daylight' | 'darkroom';

interface CameraPreset {
  id: CameraPresetId;
  label: string;
  position: [number, number, number];
  target: [number, number, number];
  caption: string;
}

const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'overview',
    label: 'Lab Overview',
    position: [0.2, 3.6, 7.6],
    target: [0, 1.35, -0.2],
    caption: 'Interactive 3D Core Pathology Bench — Drag to orbit, scroll to zoom',
  },
  {
    id: 'microscope',
    label: 'Microscope',
    position: [-0.4, 2.35, 3.25],
    target: [-2.35, 1.45, 0.35],
    caption: 'Binocular Optical Microscope · 4x / 10x / 40x Objectives & LED Condenser',
  },
  {
    id: 'centrifuge',
    label: 'Centrifuge',
    position: [4.1, 2.25, 3.15],
    target: [2.25, 0.92, 0.38],
    caption: 'Automated CX-6 Centrifuge · 6 Color-Coded Barcoded Vacutainer Rotor',
  },
  {
    id: 'dna',
    label: 'Biomarker Helix',
    position: [0.35, 2.35, 2.55],
    target: [0, 1.78, -1.25],
    caption: 'Molecular Diagnostics Display · Instanced Biomarker Double Helix',
  },
];

// Pre-allocated scratch vectors (zero GC allocations inside animation loop)
const _targetCamPos = new THREE.Vector3();
const _targetLookAt = new THREE.Vector3();
const _bgColor = new THREE.Color();
const _dayBg = new THREE.Color(0xeef4fa);
const _darkBg = new THREE.Color(0x0b1626);

interface Lab3DViewportProps {
  heightClass?: string;
}

export function Lab3DViewport({
  heightClass = 'h-[calc(100vh-64px)] min-h-[540px]',
}: Lab3DViewportProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  const [preset, setPreset] = useState<CameraPresetId>('overview');
  const [exploded, setExploded] = useState(0);
  const [spinning, setSpinning] = useState(true);
  const [mood, setMood] = useState<LightingMood>('daylight');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [contextLost, setContextLost] = useState(false);

  // Mutable ref bridge so React UI state never restarts or tears down WebGL
  const stateRef = useRef({
    exploded: 0,
    spinning: true,
    mood: 'daylight' as LightingMood,
    transitionActive: false,
    desiredPos: new THREE.Vector3(0.2, 3.6, 7.6),
    desiredTarget: new THREE.Vector3(0, 1.35, -0.2),
  });

  useEffect(() => {
    stateRef.current.exploded = exploded;
  }, [exploded]);

  useEffect(() => {
    stateRef.current.spinning = spinning;
  }, [spinning]);

  useEffect(() => {
    stateRef.current.mood = mood;
  }, [mood]);

  const applyPreset = (id: CameraPresetId) => {
    const found = CAMERA_PRESETS.find((p) => p.id === id) || CAMERA_PRESETS[0];
    setPreset(id);
    stateRef.current.desiredPos.set(...found.position);
    stateRef.current.desiredTarget.set(...found.target);
    stateRef.current.transitionActive = true;
  };

  // Keyboard shortcut 'H' for Collapse/Expand HUD (Cinema Mode)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'h' || e.key === 'H') {
        setDockCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareWebGL();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.background = _dayBg.clone();
    scene.fog = new THREE.FogExp2(0xeef4fa, 0.036);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 80);
    camera.position.set(0.2, 3.6, 7.6);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio RoomEnvironment reflection map on every device
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.35, -0.2);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.0;
    controls.maxDistance = 14.0;
    controls.maxPolarAngle = Math.PI * 0.485;
    controls.update();

    // Cancel camera preset glide as soon as user interacts manually
    const onControlStart = () => {
      stateRef.current.transitionActive = false;
    };
    controls.addEventListener('start', onControlStart);

    const handles: LabSceneHandles = buildLabScene(
      scene,
      isSoftwareGl,
      renderer.capabilities.getMaxAnisotropy()
    );

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    let frameId = 0;
    let disposed = false;
    let currentExploded = 0;
    let currentMoodBlend = 0; // 0 = daylight, 1 = darkroom
    let rotorVelocity = 4.2;
    let lastTime = performance.now();

    const afterDraw = (cb: () => void) => {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync?.(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const status = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    };

    const tick = () => {
      if (disposed) return;
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      const s = stateRef.current;
      const dampAlpha = 1 - Math.exp(-5.5 * dt);

      // Smooth Exploded-View Separation
      currentExploded = THREE.MathUtils.damp(currentExploded, s.exploded, 6.0, dt);
      handles.microscope.headAssembly.position.y = 2.38 + currentExploded * 0.65;
      handles.microscope.nosepiece.position.y = 1.98 + currentExploded * 0.25;
      handles.microscope.stage.position.y = 1.05 - currentExploded * 0.14;
      handles.centrifuge.lid.position.y = 1.06 + currentExploded * 0.78;
      handles.centrifuge.rotor.position.y = 0.58 + currentExploded * 0.34;
      handles.dnaDisplay.helix.position.y =
        0.48 + currentExploded * 0.35 + Math.sin(now * 0.0016) * 0.06;

      // Smooth Rotor Kinematics & Biomarker Helix Rotation
      const targetVel = s.spinning ? 5.2 : 0.0;
      rotorVelocity = THREE.MathUtils.damp(rotorVelocity, targetVel, 3.2, dt);
      handles.centrifuge.rotor.rotation.y += rotorVelocity * dt;
      handles.dnaDisplay.helix.rotation.y += (s.spinning ? 0.55 : 0.08) * dt;
      handles.microscope.nosepiece.rotation.y =
        Math.sin(now * 0.0005) * (s.spinning ? 0.15 : 0);

      // Smooth Daylight <-> Optical Darkroom Crossfade
      const targetMood = s.mood === 'darkroom' ? 1 : 0;
      currentMoodBlend = THREE.MathUtils.damp(currentMoodBlend, targetMood, 4.5, dt);
      _bgColor.copy(_dayBg).lerp(_darkBg, currentMoodBlend);
      (scene.background as THREE.Color).copy(_bgColor);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(_bgColor);
      }
      handles.lights.key.intensity = THREE.MathUtils.lerp(2.2, 1.05, currentMoodBlend);
      handles.lights.hemi.intensity = THREE.MathUtils.lerp(1.05, 0.45, currentMoodBlend);
      handles.lights.rim.intensity = THREE.MathUtils.lerp(1.15, 2.2, currentMoodBlend);
      handles.lights.condenser.intensity = THREE.MathUtils.lerp(1.4, 3.2, currentMoodBlend);

      // Smooth Camera Preset Glide
      if (s.transitionActive) {
        _targetCamPos.copy(s.desiredPos);
        _targetLookAt.copy(s.desiredTarget);
        camera.position.lerp(_targetCamPos, dampAlpha);
        controls.target.lerp(_targetLookAt, dampAlpha);
        if (
          camera.position.distanceTo(_targetCamPos) < 0.02 &&
          controls.target.distanceTo(_targetLookAt) < 0.02
        ) {
          camera.position.copy(_targetCamPos);
          controls.target.copy(_targetLookAt);
          s.transitionActive = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    };

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      handles.disposables.geometries.forEach((g) => g.dispose());
      handles.disposables.materials.forEach((m) => m.dispose());
      handles.disposables.textures.forEach((t) => t.dispose());
      envTarget.dispose();
      renderer.dispose();
    };
  }, []);

  const activePresetInfo =
    CAMERA_PRESETS.find((p) => p.id === preset) || CAMERA_PRESETS[0];

  return (
    <div className={`relative w-full overflow-hidden bg-[#eef4fa] ${heightClass}`}>
      {/* Stable Isolated WebGL Mount Container */}
      <div
        ref={mountRef}
        aria-label="Interactive 3D LifeCare Pathology Laboratory"
        className="h-full w-full cursor-grab active:cursor-grabbing"
      />

      {/* Minimal Top-Left Specification Header (Solid/RGBA, No Backdrop-Filter) */}
      <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-md rounded-xl border border-slate-700/30 bg-slate-900/90 px-4 py-3 text-white shadow-lg">
        <p className="text-[11px] font-semibold tracking-wide text-teal-300">
          LifeCare 3D Interactive Pathology Lab
        </p>
        <p className="mt-0.5 text-xs text-slate-200">{activePresetInfo.caption}</p>
      </div>

      {/* WebGL Context Lost Fallback */}
      {contextLost && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/95 p-6 text-center text-white">
          <div>
            <p className="text-base font-bold">3D Graphics Context Paused</p>
            <p className="mt-1 text-xs text-slate-300">
              Restoring WebGL rendering pipeline automatically...
            </p>
          </div>
        </div>
      )}

      {/* Single Unified Collapsible Bottom Floating Control Dock (No Side-Panel Occlusion, No backdrop-filter) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex flex-col items-center px-3">
        <button
          type="button"
          onClick={() => setDockCollapsed((prev) => !prev)}
          className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 rounded-t-lg border border-slate-700 bg-slate-900/95 px-3.5 py-1.5 text-[11px] font-semibold text-slate-200 transition-colors hover:text-white"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="h-3.5 w-3.5 text-teal-400" />
              Show Controls (H)
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5 text-teal-400" />
              Hide Controls (H)
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="pointer-events-auto flex w-full max-w-[920px] flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/94 px-4 py-3 text-white shadow-xl">
            {/* Camera View Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CAMERA_PRESETS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => applyPreset(item.id)}
                  className={`min-h-[34px] whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    preset === item.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Exploded View Inspection Slider */}
            <div className="flex items-center gap-2.5">
              <label
                htmlFor="lab-exploded-slider"
                className="whitespace-nowrap text-xs font-medium text-slate-300"
              >
                Explode
              </label>
              <input
                id="lab-exploded-slider"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={exploded}
                onChange={(e) => setExploded(parseFloat(e.target.value))}
                className="h-1.5 w-24 cursor-pointer accent-teal-500 sm:w-28"
              />
              <span className="w-8 font-mono text-xs text-teal-300 tabular-nums">
                {Math.round(exploded * 100)}%
              </span>
            </div>

            {/* Motion, Lighting & Reset Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSpinning((prev) => !prev)}
                className="inline-flex min-h-[34px] items-center gap-1.5 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                {spinning ? (
                  <>
                    <Pause className="h-3.5 w-3.5 text-teal-400" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 text-teal-400" />
                    Run
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  setMood((m) => (m === 'daylight' ? 'darkroom' : 'daylight'))
                }
                aria-label="Toggle studio lighting mood"
                className="inline-flex min-h-[34px] items-center gap-1.5 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                {mood === 'daylight' ? (
                  <>
                    <Moon className="h-3.5 w-3.5 text-sky-300" />
                    Darkroom
                  </>
                ) : (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-300" />
                    Daylight
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setExploded(0);
                  setSpinning(true);
                  applyPreset('overview');
                }}
                aria-label="Reset 3D view"
                className="inline-flex min-h-[34px] items-center justify-center rounded-lg bg-slate-800 px-2.5 py-1.5 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
