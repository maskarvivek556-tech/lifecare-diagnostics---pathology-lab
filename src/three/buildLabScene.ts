import * as THREE from 'three';

export interface LabSceneHandles {
  root: THREE.Group;
  microscope: {
    group: THREE.Group;
    headAssembly: THREE.Group;
    nosepiece: THREE.Group;
    stage: THREE.Group;
  };
  centrifuge: {
    group: THREE.Group;
    lid: THREE.Group;
    rotor: THREE.Group;
  };
  dnaDisplay: {
    group: THREE.Group;
    helix: THREE.Group;
    ring: THREE.Mesh;
  };
  lights: {
    key: THREE.DirectionalLight;
    hemi: THREE.HemisphereLight;
    rim: THREE.DirectionalLight;
    condenser: THREE.PointLight;
  };
  disposables: {
    geometries: THREE.BufferGeometry[];
    materials: THREE.Material[];
    textures: THREE.Texture[];
  };
}

export function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createBenchTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#e7eff6';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle brushed ceramic micro-speckle
  for (let i = 0; i < 2400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const v = 224 + Math.floor(Math.random() * 20);
    ctx.fillStyle = `rgba(${v - 8}, ${v}, ${v + 8}, 0.25)`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Fine clinical calibration grid lines
  ctx.strokeStyle = 'rgba(12, 59, 102, 0.08)';
  ctx.lineWidth = 1.5;
  for (let p = 0; p <= 512; p += 64) {
    ctx.beginPath();
    ctx.moveTo(p, 0);
    ctx.lineTo(p, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, p);
    ctx.lineTo(512, p);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
  grad.addColorStop(0, 'rgba(10, 26, 46, 0.52)');
  grad.addColorStop(0.55, 'rgba(10, 26, 46, 0.20)');
  grad.addColorStop(1, 'rgba(10, 26, 46, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function createCentrifugeScreenTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#071b2e';
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#0d9488';
  ctx.lineWidth = 5;
  ctx.strokeRect(10, 10, 492, 236);

  ctx.fillStyle = '#5eead4';
  ctx.font = 'bold 26px monospace';
  ctx.fillText('LIFECARE CENTRIFUGE CX-6', 32, 54);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 74px monospace';
  ctx.fillText('3,500 RPM', 32, 146);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 24px monospace';
  ctx.fillText('TEMP: 4.0 C   TIME: 06:00', 32, 208);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function buildLabScene(
  scene: THREE.Scene,
  isSoftwareGl: boolean,
  maxAnisotropy: number
): LabSceneHandles {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    textures.push(t);
    return t;
  };

  const root = new THREE.Group();
  scene.add(root);

  // --- Shared Calibrated PBR Materials (varied roughness >= 0.25 across adjacent parts) ---
  const clinicalWhiteMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf4f7fb,
      roughness: 0.42,
      metalness: 0.06,
    })
  );
  const clinicalSlateMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.72,
      metalness: 0.14,
    })
  );
  const navyAccentMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0c3b66,
      roughness: 0.34,
      metalness: 0.22,
    })
  );
  const tealAccentMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      roughness: 0.32,
      metalness: 0.28,
    })
  );
  const chromeMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xdce5ef,
      roughness: 0.14,
      metalness: 0.94,
      clearcoat: 0.5,
    })
  );
  const darkAnodizedMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.48,
      metalness: 0.65,
    })
  );
  const rubberMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x17202e,
      roughness: 0.88,
      metalness: 0.04,
    })
  );
  const glassMat = trackMat(
    new THREE.MeshPhysicalMaterial({
      color: 0xe6f4ff,
      roughness: 0.06,
      metalness: 0.0,
      transmission: isSoftwareGl ? 0 : 0.88,
      transparent: true,
      opacity: isSoftwareGl ? 0.36 : 1.0,
      ior: 1.52,
      thickness: 0.35,
      depthWrite: false,
      clearcoat: 1.0,
    })
  );
  const glowCyanMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 1.6,
      roughness: 0.25,
      metalness: 0.1,
    })
  );

  // --- Studio Lighting Rig (Warm Key + Cool Hemisphere Fill + Teal Rim) ---
  const hemi = new THREE.HemisphereLight(0xdbeafe, 0x334155, 1.05);
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xfff5e8, 2.2);
  key.position.set(5.5, 9.0, 6.0);
  if (!isSoftwareGl) {
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 24;
    key.shadow.camera.left = -6.5;
    key.shadow.camera.right = 6.5;
    key.shadow.camera.top = 6.5;
    key.shadow.camera.bottom = -6.5;
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.02;
  }
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x5eead4, 1.15);
  rim.position.set(-6.0, 5.5, -5.5);
  scene.add(rim);

  // --- Grounded Laboratory Workbench Surface ---
  const benchTex = trackTex(createBenchTexture(maxAnisotropy));
  const benchMat = trackMat(
    new THREE.MeshStandardMaterial({
      map: benchTex,
      roughness: 0.55,
      metalness: 0.05,
    })
  );
  const benchMesh = new THREE.Mesh(trackGeo(new THREE.CircleGeometry(18, 64)), benchMat);
  benchMesh.rotation.x = -Math.PI / 2;
  benchMesh.position.y = 0;
  benchMesh.receiveShadow = !isSoftwareGl;
  root.add(benchMesh);

  const shadowTex = trackTex(createContactShadowTexture());
  const shadowPlaneMat = trackMat(
    new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
    })
  );
  const addContactShadow = (x: number, z: number, radius: number) => {
    const plane = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(radius * 2, radius * 2)),
      shadowPlaneMat
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.set(x, 0.015, z);
    root.add(plane);
  };

  // =========================================================================
  // MODEL 1: Composite 9-Part Precision Binocular Clinical Microscope
  // =========================================================================
  const microscopeGroup = new THREE.Group();
  microscopeGroup.position.set(-2.35, 0, 0.35);
  microscopeGroup.rotation.y = 0.42;
  root.add(microscopeGroup);
  addContactShadow(-2.35, 0.35, 1.35);

  // Part 1: Beveled Extruded Base Plinth
  const baseShape = new THREE.Shape();
  baseShape.moveTo(-0.62, -0.82);
  baseShape.lineTo(0.62, -0.82);
  baseShape.quadraticCurveTo(0.75, -0.82, 0.75, -0.68);
  baseShape.lineTo(0.68, 0.72);
  baseShape.quadraticCurveTo(0.65, 0.85, 0.5, 0.85);
  baseShape.lineTo(-0.5, 0.85);
  baseShape.quadraticCurveTo(-0.65, 0.85, -0.68, 0.72);
  baseShape.lineTo(-0.75, -0.68);
  baseShape.quadraticCurveTo(-0.75, -0.82, -0.62, -0.82);

  const baseGeo = trackGeo(
    new THREE.ExtrudeGeometry(baseShape, {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
    })
  );
  baseGeo.rotateX(-Math.PI / 2);
  const baseMesh = new THREE.Mesh(baseGeo, clinicalWhiteMat);
  baseMesh.position.y = 0.04;
  baseMesh.castShadow = !isSoftwareGl;
  baseMesh.receiveShadow = !isSoftwareGl;
  microscopeGroup.add(baseMesh);

  // Part 2: Illuminated LED Condenser Lamp Housing
  const condenserRing = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.24, 0.29, 0.14, 28)),
    darkAnodizedMat
  );
  condenserRing.position.set(0, 0.33, 0.24);
  microscopeGroup.add(condenserRing);

  const condenserLens = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24)),
    glowCyanMat
  );
  condenserLens.position.set(0, 0.41, 0.24);
  microscopeGroup.add(condenserLens);

  const condenser = new THREE.PointLight(0x38bdf8, 1.4, 3.2);
  condenser.position.set(0, 0.52, 0.24);
  microscopeGroup.add(condenser);

  // Part 3: Curved Ergonomic C-Arm Spine (TubeGeometry)
  const armCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.26, -0.52),
    new THREE.Vector3(0, 0.92, -0.78),
    new THREE.Vector3(0, 1.72, -0.64),
    new THREE.Vector3(0, 2.25, -0.18),
    new THREE.Vector3(0, 2.34, 0.24),
  ]);
  const armMesh = new THREE.Mesh(
    trackGeo(new THREE.TubeGeometry(armCurve, 32, 0.14, 16, false)),
    clinicalWhiteMat
  );
  armMesh.castShadow = !isSoftwareGl;
  microscopeGroup.add(armMesh);

  // Part 4: Coaxial Knurled Focus Knobs (Left & Right)
  const focusAxle = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.05, 0.05, 0.72, 16)),
    chromeMat
  );
  focusAxle.rotation.z = Math.PI / 2;
  focusAxle.position.set(0, 0.68, -0.64);
  microscopeGroup.add(focusAxle);

  [-0.36, 0.36].forEach((xOffset) => {
    const coarseKnob = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 24)),
      rubberMat
    );
    coarseKnob.rotation.z = Math.PI / 2;
    coarseKnob.position.set(xOffset, 0.68, -0.64);
    microscopeGroup.add(coarseKnob);

    const fineKnob = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 20)),
      tealAccentMat
    );
    fineKnob.rotation.z = Math.PI / 2;
    fineKnob.position.set(xOffset + Math.sign(xOffset) * 0.08, 0.68, -0.64);
    microscopeGroup.add(fineKnob);
  });

  // Part 5: Mechanical XY Stage + Glass Specimen Slide
  const stageGroup = new THREE.Group();
  stageGroup.position.set(0, 1.05, 0.16);
  microscopeGroup.add(stageGroup);

  const stagePlate = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.95, 0.07, 0.85)),
    darkAnodizedMat
  );
  stagePlate.castShadow = !isSoftwareGl;
  stageGroup.add(stagePlate);

  const slideGlass = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.56, 0.02, 0.22)),
    glassMat
  );
  slideGlass.position.set(0, 0.05, 0.06);
  slideGlass.renderOrder = 2;
  stageGroup.add(slideGlass);

  const specimenSmear = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.065, 0.065, 0.012, 20)),
    trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd946ef,
        roughness: 0.3,
        metalness: 0.1,
      })
    )
  );
  specimenSmear.position.set(0, 0.055, 0.06);
  stageGroup.add(specimenSmear);

  // Part 6: Revolving Objective Turret & 3 Color-Coded Objective Lenses
  const nosepieceGroup = new THREE.Group();
  nosepieceGroup.position.set(0, 1.98, 0.24);
  microscopeGroup.add(nosepieceGroup);

  const turretProfile = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.32, 0),
    new THREE.Vector2(0.36, 0.12),
    new THREE.Vector2(0.26, 0.22),
    new THREE.Vector2(0.01, 0.22),
  ];
  const turretMesh = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(turretProfile, 28)),
    clinicalSlateMat
  );
  nosepieceGroup.add(turretMesh);

  const objectiveSpecs = [
    { angle: 0, length: 0.56, ringColor: 0x0d9488 }, // 40x Teal
    { angle: (Math.PI * 2) / 3, length: 0.44, ringColor: 0x0b5ed7 }, // 10x Cobalt
    { angle: (Math.PI * 4) / 3, length: 0.36, ringColor: 0xe11d48 }, // 4x Rose
  ];
  objectiveSpecs.forEach((spec) => {
    const objHolder = new THREE.Group();
    objHolder.rotation.y = spec.angle;
    const barrel = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.065, 0.048, spec.length, 20)),
      chromeMat
    );
    barrel.position.set(0, -spec.length / 2, 0.16);
    barrel.rotation.x = -0.18;
    objHolder.add(barrel);

    const band = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.068, 0.066, 0.055, 20)),
      trackMat(
        new THREE.MeshStandardMaterial({
          color: spec.ringColor,
          roughness: 0.3,
          metalness: 0.35,
        })
      )
    );
    band.position.set(0, -spec.length * 0.38, 0.175);
    band.rotation.x = -0.18;
    objHolder.add(band);
    nosepieceGroup.add(objHolder);
  });

  // Part 7–9: Binocular Prism Head + Twin Tilted Optical Eyepieces
  const headAssembly = new THREE.Group();
  headAssembly.position.set(0, 2.38, 0.22);
  microscopeGroup.add(headAssembly);

  const prismBody = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.24, 0.27, 0.34, 24)),
    navyAccentMat
  );
  prismBody.castShadow = !isSoftwareGl;
  headAssembly.add(prismBody);

  const eyepieceProfile = [
    new THREE.Vector2(0.045, 0),
    new THREE.Vector2(0.085, 0.05),
    new THREE.Vector2(0.085, 0.56),
    new THREE.Vector2(0.115, 0.62),
    new THREE.Vector2(0.115, 0.72),
    new THREE.Vector2(0.065, 0.72),
  ];
  const eyepieceGeo = trackGeo(new THREE.LatheGeometry(eyepieceProfile, 22));

  [-0.14, 0.14].forEach((xOff) => {
    const eyeTube = new THREE.Mesh(eyepieceGeo, darkAnodizedMat);
    eyeTube.position.set(xOff, 0.12, 0.12);
    eyeTube.rotation.x = 0.62;
    eyeTube.castShadow = !isSoftwareGl;
    headAssembly.add(eyeTube);

    const eyeRim = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(0.095, 0.018, 12, 24)),
      rubberMat
    );
    eyeRim.position.set(xOff, 0.66, 0.51);
    eyeRim.rotation.x = 0.62 + Math.PI / 2;
    headAssembly.add(eyeRim);
  });

  // =========================================================================
  // MODEL 2: Composite 8-Part Automated Centrifuge & Barcoded Vacutainers
  // =========================================================================
  const centrifugeGroup = new THREE.Group();
  centrifugeGroup.position.set(2.25, 0, 0.38);
  centrifugeGroup.rotation.y = -0.38;
  root.add(centrifugeGroup);
  addContactShadow(2.25, 0.38, 1.45);

  // Part 1: Rubber Stabilizer Feet
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const foot = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(0.11, 0.13, 0.08, 16)),
      rubberMat
    );
    foot.position.set(Math.cos(a) * 0.85, 0.04, Math.sin(a) * 0.85);
    centrifugeGroup.add(foot);
  }

  // Part 2: Contoured Clinical Drum Chassis (LatheGeometry)
  const drumProfile = [
    new THREE.Vector2(0.01, 0.08),
    new THREE.Vector2(1.02, 0.08),
    new THREE.Vector2(1.12, 0.24),
    new THREE.Vector2(1.08, 0.96),
    new THREE.Vector2(0.95, 1.06),
    new THREE.Vector2(0.86, 1.06),
    new THREE.Vector2(0.84, 0.44),
    new THREE.Vector2(0.01, 0.44),
  ];
  const drumMesh = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(drumProfile, 40)),
    clinicalWhiteMat
  );
  drumMesh.castShadow = !isSoftwareGl;
  drumMesh.receiveShadow = !isSoftwareGl;
  centrifugeGroup.add(drumMesh);

  // Part 3: Navy Trim Collar
  const collarRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(1.04, 0.04, 14, 48)),
    navyAccentMat
  );
  collarRing.rotation.x = Math.PI / 2;
  collarRing.position.y = 0.94;
  centrifugeGroup.add(collarRing);

  // Part 4: Angled Digital Control Panel with Procedural Screen CanvasTexture
  const screenTex = trackTex(createCentrifugeScreenTexture(maxAnisotropy));
  const controlHousing = new THREE.Mesh(
    trackGeo(new THREE.BoxGeometry(0.92, 0.46, 0.34)),
    clinicalSlateMat
  );
  controlHousing.position.set(0, 0.48, 0.96);
  controlHousing.rotation.x = -0.38;
  controlHousing.castShadow = !isSoftwareGl;
  centrifugeGroup.add(controlHousing);

  const screenPlane = new THREE.Mesh(
    trackGeo(new THREE.PlaneGeometry(0.78, 0.36)),
    trackMat(
      new THREE.MeshStandardMaterial({
        map: screenTex,
        emissiveMap: screenTex,
        emissive: 0xffffff,
        emissiveIntensity: 0.72,
        roughness: 0.2,
        metalness: 0.05,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      })
    )
  );
  screenPlane.position.set(0, 0.54, 1.125);
  screenPlane.rotation.x = -0.38;
  centrifugeGroup.add(screenPlane);

  // Part 5 & 6: Spinning Brushed Titanium 6-Slot Rotor + 6 Color-Coded Vacutainers
  const rotorGroup = new THREE.Group();
  rotorGroup.position.set(0, 0.58, 0);
  centrifugeGroup.add(rotorGroup);

  const rotorHub = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.24, 0.68, 0.42, 32)),
    chromeMat
  );
  rotorHub.position.y = 0.21;
  rotorHub.castShadow = !isSoftwareGl;
  rotorGroup.add(rotorHub);

  const rotorCapNut = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.14, 0.18, 0.14, 16)),
    tealAccentMat
  );
  rotorCapNut.position.y = 0.48;
  rotorGroup.add(rotorCapNut);

  const tubeSpecs = [
    { cap: 0x7c3aed, fluid: 0x991b1b }, // Lavender EDTA Whole Blood
    { cap: 0xd97706, fluid: 0xf59e0b }, // Gold SST Serum
    { cap: 0x0284c7, fluid: 0xb91c1c }, // Blue Citrate Plasma
    { cap: 0x0d9488, fluid: 0xd97706 }, // Teal Heparin
    { cap: 0x7c3aed, fluid: 0x991b1b }, // Lavender EDTA
    { cap: 0x64748b, fluid: 0xdc2626 }, // Grey Fluoride Glucose
  ];

  const tubeGlassGeo = trackGeo(new THREE.CylinderGeometry(0.068, 0.068, 0.56, 18));
  const tubeFluidGeo = trackGeo(new THREE.CylinderGeometry(0.054, 0.054, 0.34, 16));
  const tubeCapGeo = trackGeo(new THREE.CylinderGeometry(0.078, 0.072, 0.12, 18));

  tubeSpecs.forEach((spec, idx) => {
    const angle = (idx / tubeSpecs.length) * Math.PI * 2;
    const holder = new THREE.Group();
    holder.rotation.y = angle;

    const vial = new THREE.Group();
    vial.position.set(0.46, 0.36, 0);
    vial.rotation.z = -0.36;

    const fluidMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: spec.fluid,
        roughness: 0.25,
        metalness: 0.05,
      })
    );
    const fluidMesh = new THREE.Mesh(tubeFluidGeo, fluidMat);
    fluidMesh.position.y = -0.08;
    vial.add(fluidMesh);

    const glassTube = new THREE.Mesh(tubeGlassGeo, glassMat);
    glassTube.renderOrder = 2;
    vial.add(glassTube);

    const capMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: spec.cap,
        roughness: 0.42,
        metalness: 0.1,
      })
    );
    const capMesh = new THREE.Mesh(tubeCapGeo, capMat);
    capMesh.position.y = 0.32;
    vial.add(capMesh);

    holder.add(vial);
    rotorGroup.add(holder);
  });

  // Part 7 & 8: Protective Translucent Acrylic Dome Lid + Latch Rim
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 1.06, 0);
  centrifugeGroup.add(lidGroup);

  const lidRim = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.92, 0.045, 14, 48)),
    chromeMat
  );
  lidRim.rotation.x = Math.PI / 2;
  lidGroup.add(lidRim);

  const domeGeo = trackGeo(
    new THREE.SphereGeometry(0.9, 36, 20, 0, Math.PI * 2, 0, Math.PI * 0.46)
  );
  const domeMesh = new THREE.Mesh(domeGeo, glassMat);
  domeMesh.scale.y = 0.62;
  domeMesh.renderOrder = 3;
  lidGroup.add(domeMesh);

  // =========================================================================
  // MODEL 3: Floating Biomarker DNA Double Helix (InstancedMesh Rungs + Tubes)
  // =========================================================================
  const dnaDisplayGroup = new THREE.Group();
  dnaDisplayGroup.position.set(0, 0, -1.25);
  root.add(dnaDisplayGroup);
  addContactShadow(0, -1.25, 1.15);

  // Pedestal Base (LatheGeometry)
  const pedProfile = [
    new THREE.Vector2(0.01, 0),
    new THREE.Vector2(0.92, 0),
    new THREE.Vector2(0.84, 0.12),
    new THREE.Vector2(0.76, 0.24),
    new THREE.Vector2(0.01, 0.24),
  ];
  const pedestal = new THREE.Mesh(
    trackGeo(new THREE.LatheGeometry(pedProfile, 36)),
    clinicalSlateMat
  );
  pedestal.castShadow = !isSoftwareGl;
  pedestal.receiveShadow = !isSoftwareGl;
  dnaDisplayGroup.add(pedestal);

  const calibrationRing = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.68, 0.025, 12, 48)),
    glowCyanMat
  );
  calibrationRing.rotation.x = Math.PI / 2;
  calibrationRing.position.y = 0.26;
  dnaDisplayGroup.add(calibrationRing);

  const helixGroup = new THREE.Group();
  helixGroup.position.y = 0.48;
  dnaDisplayGroup.add(helixGroup);

  const turns = 2.2;
  const height = 2.75;
  const radius = 0.44;
  const strandPointsA: THREE.Vector3[] = [];
  const strandPointsB: THREE.Vector3[] = [];
  const sampleCount = 72;

  for (let i = 0; i <= sampleCount; i++) {
    const t = i / sampleCount;
    const angle = t * Math.PI * 2 * turns;
    const y = t * height;
    strandPointsA.push(
      new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
    );
    strandPointsB.push(
      new THREE.Vector3(
        Math.cos(angle + Math.PI) * radius,
        y,
        Math.sin(angle + Math.PI) * radius
      )
    );
  }

  const strandAMesh = new THREE.Mesh(
    trackGeo(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(strandPointsA),
        72,
        0.042,
        12,
        false
      )
    ),
    trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x0b5ed7,
        roughness: 0.2,
        metalness: 0.3,
        clearcoat: 0.9,
      })
    )
  );
  strandAMesh.castShadow = !isSoftwareGl;
  helixGroup.add(strandAMesh);

  const strandBMesh = new THREE.Mesh(
    trackGeo(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3(strandPointsB),
        72,
        0.042,
        12,
        false
      )
    ),
    trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x0d9488,
        roughness: 0.2,
        metalness: 0.3,
        clearcoat: 0.9,
      })
    )
  );
  strandBMesh.castShadow = !isSoftwareGl;
  helixGroup.add(strandBMesh);

  // InstancedMesh for 24 Base-Pair Rungs & 48 Nucleotide Spheres (high efficiency!)
  const rungCount = 24;
  const rungGeo = trackGeo(new THREE.CylinderGeometry(0.022, 0.022, radius * 1.92, 10));
  rungGeo.rotateZ(Math.PI / 2);
  const rungMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.25,
    })
  );
  const rungInstanced = new THREE.InstancedMesh(rungGeo, rungMat, rungCount);
  const nodeGeo = trackGeo(new THREE.SphereGeometry(0.062, 14, 14));
  const nodeInstanced = new THREE.InstancedMesh(nodeGeo, rungMat, rungCount * 2);

  const dummy = new THREE.Object3D();
  const palette = [
    new THREE.Color(0x38bdf8),
    new THREE.Color(0x2dd4bf),
    new THREE.Color(0x818cf8),
    new THREE.Color(0xf472b6),
  ];

  for (let i = 0; i < rungCount; i++) {
    const t = (i + 0.5) / rungCount;
    const angle = t * Math.PI * 2 * turns;
    const y = t * height;

    dummy.position.set(0, y, 0);
    dummy.rotation.set(0, -angle, 0);
    dummy.scale.set(1, 1, 1);
    dummy.updateMatrix();
    rungInstanced.setMatrixAt(i, dummy.matrix);
    rungInstanced.setColorAt(i, palette[i % palette.length]);

    // Pair nodes on both strands
    dummy.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    dummy.rotation.set(0, 0, 0);
    dummy.updateMatrix();
    nodeInstanced.setMatrixAt(i * 2, dummy.matrix);
    nodeInstanced.setColorAt(i * 2, palette[i % palette.length]);

    dummy.position.set(
      Math.cos(angle + Math.PI) * radius,
      y,
      Math.sin(angle + Math.PI) * radius
    );
    dummy.updateMatrix();
    nodeInstanced.setMatrixAt(i * 2 + 1, dummy.matrix);
    nodeInstanced.setColorAt(i * 2 + 1, palette[(i + 1) % palette.length]);
  }

  rungInstanced.instanceMatrix.needsUpdate = true;
  if (rungInstanced.instanceColor) rungInstanced.instanceColor.needsUpdate = true;
  rungInstanced.computeBoundingSphere();

  nodeInstanced.instanceMatrix.needsUpdate = true;
  if (nodeInstanced.instanceColor) nodeInstanced.instanceColor.needsUpdate = true;
  nodeInstanced.computeBoundingSphere();

  helixGroup.add(rungInstanced);
  helixGroup.add(nodeInstanced);

  return {
    root,
    microscope: {
      group: microscopeGroup,
      headAssembly,
      nosepiece: nosepieceGroup,
      stage: stageGroup,
    },
    centrifuge: {
      group: centrifugeGroup,
      lid: lidGroup,
      rotor: rotorGroup,
    },
    dnaDisplay: {
      group: dnaDisplayGroup,
      helix: helixGroup,
      ring: calibrationRing,
    },
    lights: {
      key,
      hemi,
      rim,
      condenser,
    },
    disposables: {
      geometries,
      materials,
      textures,
    },
  };
}
