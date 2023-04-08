import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import classNames from "classnames/bind";
import "../util/reset.css";
import styles from "./ThreeJsPage.module.scss";

import * as THREE from "three";
import { GUI } from "dat.gui";
import DatGui from "../datGuiComponent/DatGui";
import DatNumber from "../datGuiComponent/DatNumber";
import DatString from "../datGuiComponent/DatString";
import ThreeJs3dmLoader from "../ThreeJsComponent/ThreeJs3dmLoader";

import { Canvas, useFrame, useGraph, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  softShadows,
  Sphere,
  Stats,
  useTexture,
} from "@react-three/drei";
import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader";
import { MathUtils } from "three";

const cx = classNames.bind(styles);

// const OrbitControls = oc(THREE);
const RhinoModel = forwardRef(({ url }, ref) => {
  const model = useLoader(Rhino3dmLoader, url, (loader) => {
    loader.setLibraryPath("https://cdn.jsdelivr.net/npm/rhino3dm@0.15.0-beta/");
  });

  // console.log(model);

  // const modelgr = useGraph(model);

  // console.log(modelgr);

  useImperativeHandle(ref, () => model, [url]);

  return <primitive object={model}></primitive>;
});

const SampleHouse = () => {
  const pavings = useRef();
  const trees = useRef();
  const [show_paving, setShowPaving] = useState(false);
  const [show_trees, setShowTrees] = useState(true);
  useFrame(() => {
    pavings.current.position.z = show_paving
      ? MathUtils.lerp(pavings.current.position.z, 0, 0.1)
      : MathUtils.lerp(pavings.current.position.z, -0.125, 0.1);
    trees.current.position.z = show_trees
      ? MathUtils.lerp(trees.current.position.z, 0, 0.1)
      : MathUtils.lerp(trees.current.position.z, -2, 0.1);
  });
  return (
    <>
      <group
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <RhinoModel url="test2.3dm" />
      </group>
      <group
        onClick={(event) => {
          event.stopPropagation();
          setShowPaving(!show_paving);
        }}
      >
        <RhinoModel url="test3.3dm" ref={pavings} />
      </group>
      <group
        onClick={(event) => {
          console.log(1);
          event.stopPropagation();
          setShowTrees(!show_trees);
        }}
      >
        <RhinoModel url="testtrees.3dm" ref={trees} />
      </group>
    </>
  );
};

const SampleTorus = ({ rot_speed, orb_speed }) => {
  const torus1 = useRef();
  const torus2 = useRef();
  const group = useRef();
  const model = useRef();

  const point = useTexture(
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/snowflake2.png"
  );

  useFrame(() => {
    group.current.rotateX(-0.001 * rot_speed);
    torus1.current.rotateZ(0.002 * orb_speed);
    // torus2.current.rotateX(-0.001);
    torus2.current.rotateZ(-0.001 * orb_speed);
  });

  return (
    <group ref={group}>
      {/* <RhinoModel url="test.3dm" ref={model} /> */}
      <points ref={torus1}>
        <torusGeometry args={[300, 130, 60, 30]}></torusGeometry>
        {/* <meshStandardMaterial color={0x87a7ca} /> */}
        <pointsMaterial
          size={2.5}
          map={point}
          color="#87a7ca"
          blending={THREE.AdditiveBlending}
          opacity={0.3}
        ></pointsMaterial>{" "}
      </points>
      <points ref={torus2}>
        <torusGeometry args={[300, 150, 30, 200]}></torusGeometry>
        {/* <meshStandardMaterial color={0x87a7ca} /> */}
        <pointsMaterial
          size={2.5}
          map={point}
          color="#87a7ca"
          blending={THREE.AdditiveBlending}
          opacity={0.3}
        ></pointsMaterial>
      </points>
    </group>
  );
};

const ThreeJsPage = () => {
  const size = { width: window.innerWidth, height: window.innerHeight };

  // const sample_model = useLoader();

  const box_geometry = new THREE.BoxGeometry();
  const box_material = new THREE.MeshBasicMaterial({ color: 0x00ff80 });
  const cube = new THREE.Mesh(box_geometry, box_material);

  //   const stars = new THREE.

  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.minDistance = 1;
  // controls.maxDistance = 2000;
  // controls.target = new THREE.Vector3(300, 100, 0);
  // controls.enableDamping = true;
  // controls.dampingFactor = 0.1;
  //   controls.screenSpacePanning = false;

  //   scene.add(cube);
  // scene.add(torus);
  // scene.add(torus2);

  // const animate = () => {
  //   requestAnimationFrame(animate);
  //   torus.rotation.z += 0.002;
  //   torus2.rotation.z -= 0.001;
  //   torus.rotation.y -= 0.001;
  //   torus2.rotation.y -= 0.001;
  //   // cube.rotation.y += 0.01;
  //   controls.update();
  //   // camera.lookAt(new THREE.Vector3(3, 0.1, 0));
  //   renderer.render(scene, camera);
  // };

  //   renderer.render(scene, camera);

  // animate();

  // useEffect(() => {
  //   window.addEventListener("resize", () => {
  //     size.width = window.innerWidth;
  //     size.height = window.innerHeight;
  //     // Update camera
  //     camera.aspect = size.width / size.height;
  //     camera.updateProjectionMatrix();

  //     // Update renderer
  //     renderer.setSize(size.width, size.height);
  //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  //   });
  //   document
  //     .getElementsByClassName("three-js-container")[0]
  //     .append(renderer.domElement);
  // }, []);

  const [test_data, setTestData] = useState({ test: 0 });

  const [rot_speed, setRotSpeed] = useState(1);
  const [orb_speed, setOrbSpeed] = useState(1);
  const [lt_pos, setLtPos] = useState(-30);
  const [lt_pow, setLtPow] = useState(2);

  const updateData = (e) => {
    switch (e.path) {
      case "도넛 회전속도":
        setOrbSpeed(e.state);
        break;
      case "도넛 자전속도":
        setRotSpeed(e.state);
        break;
      case "조명 움직이기":
        setLtPos(e.state);
        break;
      case "조명 세기":
        setLtPow(e.state);
        break;
    }
  };

  softShadows({
    frustum: 3.75,
    size: 0.01,
    near: 9.5,
    samples: 10,
    rings: 11,
  });

  return (
    <div className={cx("wrapper") + " three-js-container"}>
      <Stats />
      {/* <div className={cx("frame")}>
        <h1>Testing ThreeJS...</h1>
      </div> */}
      <Canvas shadows>
        <fog attach="fog" args={["#21282a", 0, 1000]} />
        <color attach="background" args={["#21282a"]}></color>
        <SampleTorus rot_speed={rot_speed} orb_speed={orb_speed} />
        <ambientLight args={[0xffffff, 0.1]}></ambientLight>
        <pointLight
          args={["#ffbb55", lt_pow, 200]}
          position={[lt_pos, 10, 10]}
          castShadow
          shadow-mapSize={1024}
          shadow-radius={5}
          shadow-bias={-0.005}
        >
          <mesh>
            <Sphere />
            <meshBasicMaterial />
          </mesh>
        </pointLight>
        <group scale={10} rotation-x={-Math.PI / 2} castShadow receiveShadow>
          <SampleHouse />
        </group>
        <OrbitControls
          minDistance={1}
          maxDistance={20000}
          target={[0, 15, 0]}
          enableDamping={true}
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2}
          screenSpacePanning={false}
        >
          <PerspectiveCamera
            makeDefault
            fov={30}
            aspect={size.width / size.height}
            near={0.1}
            far={10000}
            position={[250, 250, 350]}
          ></PerspectiveCamera>
        </OrbitControls>
      </Canvas>
      {/* <ThreeJs3dmLoader url="test.3dm" scene={scene} /> */}
      <DatGui data={test_data} onChange={updateData}>
        <DatNumber
          path="도넛 자전속도"
          placeholder={1}
          min={-100}
          max={100}
          step={1}
        ></DatNumber>
        <DatNumber
          path="도넛 회전속도"
          placeholder={3}
          min={-10}
          max={10}
        ></DatNumber>
        <DatNumber
          path="조명 움직이기"
          placeholder={-30}
          min={-100}
          max={100}
          step={5}
        ></DatNumber>
        <DatNumber
          path="조명 세기"
          placeholder={2}
          min={0}
          max={10}
          step={1}
        ></DatNumber>
        <DatString path="name" placeholder="torus"></DatString>
      </DatGui>
    </div>
  );
};

export default ThreeJsPage;
