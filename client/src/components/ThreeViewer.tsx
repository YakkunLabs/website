import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, useAnimations, useGLTF } from '@react-three/drei';
import { Loader2 } from 'lucide-react';
import { Box3, Group, MathUtils, PerspectiveCamera, Vector3, type Object3D } from 'three';

import { Button } from './ui/button';

type ThreeViewerProps = {
  url?: string;
  animationName?: string | null;
  onAnimationsLoaded?: (names: string[]) => void;
};

type CameraState = {
  position: [number, number, number];
  target: [number, number, number];
};

function useFitCamera(
  controlsRef: React.RefObject<any>,
  setCameraState: (state: CameraState) => void,
) {
  const { camera } = useThree() as { camera: PerspectiveCamera };

  return useCallback(
    (object: Object3D) => {
      const box = new Box3().setFromObject(object);
      const size = box.getSize(new Vector3());
      const center = box.getCenter(new Vector3());

      object.position.sub(center);
      const updatedBox = new Box3().setFromObject(object);
      const boundedSize = updatedBox.getSize(new Vector3());
      const maxAxis = Math.max(boundedSize.x, boundedSize.y, boundedSize.z);

      const fitHeightDistance =
        maxAxis / (2 * Math.tan(MathUtils.degToRad(camera.fov) / 2));
      const fitWidthDistance = fitHeightDistance / camera.aspect;
      const distance = Math.max(fitHeightDistance, fitWidthDistance) * 1.4;

      const direction = new Vector3(0, 0, 1);
      const newPosition = direction.multiplyScalar(distance);

      camera.position.set(newPosition.x, newPosition.y, newPosition.z);
      camera.near = distance / 100;
      camera.far = distance * 100;
      camera.updateProjectionMatrix();

      controlsRef.current?.target.set(0, 0, 0);
      controlsRef.current?.update();

      setCameraState({
        position: [newPosition.x, newPosition.y, newPosition.z],
        target: [0, 0, 0],
      });
    },
    [camera, controlsRef, setCameraState],
  );
}

function SceneContent({
  url,
  controlsRef,
  animationName,
  onAnimationsLoaded,
  setCameraState,
}: {
  url: string;
  controlsRef: React.RefObject<any>;
  animationName?: string | null;
  onAnimationsLoaded?: (names: string[]) => void;
  setCameraState: (state: CameraState) => void;
}) {
  const groupRef = useRef<Group>(null);
  const { scene, animations } = useGLTF(url);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const fitCameraToScene = useFitCamera(controlsRef, setCameraState);
  const { actions, names } = useAnimations(animations, groupRef);

  useEffect(() => {
    onAnimationsLoaded?.(names);
  }, [names, onAnimationsLoaded]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    group.clear();
    group.add(clonedScene);
    fitCameraToScene(group);
  }, [clonedScene, fitCameraToScene]);

  useEffect(() => {
    if (!actions) return;
    Object.values(actions).forEach((action) => action?.stop());
    if (animationName && actions[animationName]) {
      actions[animationName]!.reset().fadeIn(0.2).play();
    } else if (!animationName && names.length) {
      const first = names[0];
      actions[first]?.reset().fadeIn(0.2).play();
    }
  }, [actions, animationName, names]);

  return <group ref={groupRef} />;
}

export function ThreeViewer({
  url,
  animationName,
  onAnimationsLoaded,
}: ThreeViewerProps) {
  const controlsRef = useRef<any>(null);
  const [cameraState, setCameraState] = useState<CameraState | null>(null);

  const handleResetCamera = useCallback(() => {
    if (!cameraState || !controlsRef.current) return;
    const controls = controlsRef.current as unknown as { object: PerspectiveCamera; target: Vector3 };
    controls.object.position.set(...cameraState.position);
    controls.target.set(...cameraState.target);
    controls.update();
  }, [cameraState]);

  if (!url) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-border bg-background/60 text-sm text-muted-foreground">
        Upload a file to preview it in 3D.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative h-72 overflow-hidden rounded-xl border border-border bg-[#05070F]">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading model…
            </div>
          }
        >
          <Canvas camera={{ position: [0, 1.5, 3], fov: 45 }}>
            <color attach="background" args={['#05070F']} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 10, 5]} intensity={1.2} />
            <Environment preset="city" />
            <SceneContent
              url={url}
              controlsRef={controlsRef as React.RefObject<any>}
              animationName={animationName ?? undefined}
              onAnimationsLoaded={onAnimationsLoaded}
              setCameraState={setCameraState}
            />
            <OrbitControls ref={controlsRef} enableDamping />
          </Canvas>
        </Suspense>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleResetCamera}
        disabled={!cameraState}
      >
        Reset Camera
      </Button>
    </div>
  );
}

