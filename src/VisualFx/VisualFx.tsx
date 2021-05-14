/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import styles from './VisualFx.module.scss';

const initialCameraPos: [x: number, y: number, z: number] = [-25, 100, 300];

type VisualFxProps = {
    loadComplete: boolean;
};

const VisualFx: FC<VisualFxProps> = ({ loadComplete }): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isInitialised, setInitialised] = useState<boolean>(false);
    const initCallback = useCallback(async () => {
        // load dependencies
        const [Three, CustomVector, Utils, fragmentShader, vertexShader] = await Promise.all([
            import('three'),
            import('./cutomVector').then((module) => module.default),
            import('./utils'),
            import('./shaders/shader.frag').then(module => module.default),
            import('./shaders/shader.vert').then(module => module.default),
        ]);
        debugger
        const {
            BufferAttribute,
            BufferGeometry,
            Color,
            Geometry,
            Group,
            LineBasicMaterial,
            LineSegments,
            PerspectiveCamera,
            Points,
            Raycaster,
            ShaderMaterial,
            Scene,
            TextureLoader,
            WebGLRenderer,
            Vector2,
        } = Three;
        const { initRender, moveDot } = Utils;

        // set up renderer
        const textureFile = 'images/dotTexture.png';
        const canvas = canvasRef.current;
        if (!canvas) return;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;

        const colors = [new Color(0x5e81ac), new Color(0x81a1c1), new Color(0x88c0d0), new Color(0x8fbcbb)];

        const renderer = new WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
        renderer.setSize(width, height);

        // set up geometry
        const scene = new Scene();

        const raycaster = new Raycaster();
        raycaster.params.Points!.threshold = 6;

        const camera = new PerspectiveCamera(30, width / height, 0.1, 2000);
        camera.position.set(...initialCameraPos);

        const galaxy = new Group();
        scene.add(galaxy);

        // Create dots
        const loader = new TextureLoader();
        loader.crossOrigin = '';
        const dotTexture = loader.load(textureFile);
        const dotsAmount = 3000;
        const dotsGeometry = new Geometry();
        const positions = new Float32Array(dotsAmount * 3);
        const attributePositions = new BufferAttribute(positions, 3);
        const sizes = new Float32Array(dotsAmount);
        const colorsAttribute = new Float32Array(dotsAmount * 3);
        let vector: InstanceType<typeof CustomVector>;
        for (let i = 0; i < dotsAmount; i++) {
            vector = new CustomVector();

            vector.color = Math.floor(Math.random() * colors.length);
            vector.theta = Math.random() * Math.PI * 2;
            vector.phi = (((1 - Math.sqrt(Math.random())) * Math.PI) / 2) * (Math.random() > 0.5 ? 1 : -1);

            vector.x = Math.cos(vector.theta) * Math.cos(vector.phi);
            vector.y = Math.sin(vector.phi);
            vector.z = Math.sin(vector.theta) * Math.cos(vector.phi);
            vector.multiplyScalar(120 + (Math.random() - 0.5) * 5);
            vector.scaleX = 5;

            if (Math.random() > 0.5) {
                moveDot(vector, i, attributePositions);
            }
            dotsGeometry.vertices.push(vector);
            vector.toArray(positions, i * 3);
            colors[vector.color].toArray(colorsAttribute, i * 3);
            sizes[i] = 5;
        }
        const bufferWrapGeom = new BufferGeometry();
        bufferWrapGeom.setAttribute('position', attributePositions);
        const attributeSizes = new BufferAttribute(sizes, 1);
        bufferWrapGeom.setAttribute('size', attributeSizes);
        const attributeColors = new BufferAttribute(colorsAttribute, 3);
        bufferWrapGeom.setAttribute('color', attributeColors);
        const shaderMaterial = new ShaderMaterial({
            uniforms: {
                texture: {
                    value: dotTexture,
                },
            },
            vertexShader,
            fragmentShader,
            transparent: true,
        });
        const wrap = new Points(bufferWrapGeom, shaderMaterial);
        scene.add(wrap);

        // Create line segments
        const segmentsGeom = new Geometry();
        const segmentsMat = new LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            vertexColors: true,
        });
        for (let i = dotsGeometry.vertices.length - 1; i >= 0; i--) {
            const vector: InstanceType<typeof CustomVector> = dotsGeometry.vertices[i] as InstanceType<
                typeof CustomVector
            >;
            for (let j = dotsGeometry.vertices.length - 1; j >= 0; j--) {
                if (i !== j && vector.distanceTo(dotsGeometry.vertices[j]) < 12) {
                    segmentsGeom.vertices.push(vector);
                    segmentsGeom.vertices.push(dotsGeometry.vertices[j]);
                    segmentsGeom.colors.push(colors[vector.color!]);
                    segmentsGeom.colors.push(colors[vector.color!]);
                }
            }
        }
        const segments = new LineSegments(segmentsGeom, segmentsMat);
        galaxy.add(segments);

        // interactive stuff
        const mouse = new Vector2(-100, -100);

        // kick off rendering
        initRender(
            dotsGeometry,
            segmentsGeom,
            raycaster,
            mouse,
            camera,
            wrap,
            attributeSizes,
            attributePositions,
            renderer,
            scene,
        );
    }, [canvasRef.current]);

    useEffect(() => {
        if (loadComplete && !isInitialised) {
            setTimeout(initCallback, 2500);
            setInitialised(true);
        }
    }, [loadComplete, isInitialised]);
    return (
        <>
            <canvas data-testid="visual-fx" className={styles.vfx} ref={canvasRef} />
        </>
    );
};

export default VisualFx;