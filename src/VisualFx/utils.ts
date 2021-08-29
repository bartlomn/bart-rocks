/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
    BufferAttribute,
    Geometry,
    LineBasicMaterial,
    PerspectiveCamera,
    Points,
    Raycaster,
    Scene,
    Vector2,
    Vector3,
    WebGLRenderer,
} from 'three';
import { Elastic, Expo, Power0, Power2, TimelineMax, TweenMax } from 'gsap';
import { throttle } from 'throttle-debounce';

let hovered: number[] = [];
let prevHovered: number[] = [];

export const moveDot = (vector: Vector3, index: number, attributePositions: BufferAttribute): void => {
    const tempVector = vector.clone();
    tempVector.multiplyScalar((Math.random() - 0.5) * 0.2 + 1);
    TweenMax.to(vector, Math.random() * 3 + 3, {
        x: tempVector.x,
        y: tempVector.y,
        z: tempVector.z,
        yoyo: true,
        repeat: -1,
        delay: -Math.random() * 3,
        ease: Power0.easeInOut,
        onUpdate: () => {
            attributePositions.setXYZ(index * 3, vector.x, vector.y, vector.z);
        },
    });
};

export const onDotHover = (index: number, dotsGeometry: Geometry, attributeSizes: BufferAttribute): void => {
    (dotsGeometry.vertices[index] as any).tl = new TimelineMax();
    (dotsGeometry.vertices[index] as any).tl!.to(
        dotsGeometry.vertices[index],
        1,
        {
            scaleX: 10,
            ease: Elastic.easeOut.config(2, 0.2),
            onUpdate: () => {
                attributeSizes.set([(dotsGeometry.vertices[index] as any).scaleX!], index);
            },
        },
        5,
    );
};

export const mouseOut = (index: number, dotsGeometry: Geometry, attributeSizes: BufferAttribute): void => {
    (dotsGeometry.vertices[index] as any).tl!.to(dotsGeometry.vertices[index], 0.4, {
        scaleX: 5,
        ease: Power2.easeOut,
        onUpdate: () => {
            attributeSizes.set([(dotsGeometry.vertices[index] as any).scaleX!], index);
        },
    });
};

export const initRender = (
    dotsGeometry: Geometry,
    segmentsGeom: Geometry,
    raycaster: Raycaster,
    mouse: Vector2,
    camera: PerspectiveCamera,
    wrap: Points,
    attributeSizes: BufferAttribute,
    attributePositions: BufferAttribute,
    renderer: WebGLRenderer,
    scene: Scene,
    canvas: HTMLCanvasElement,
    segmentsMaterial: LineBasicMaterial,
    isHome: boolean,
): { resizeHandler: () => void } => {
    const onResize = () => {
        canvas.style.width = '';
        canvas.style.height = '';
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };
    const resizeHandler = throttle(60, onResize);

    const render = () => {
        let i;
        dotsGeometry.verticesNeedUpdate = true;
        segmentsGeom.verticesNeedUpdate = true;

        raycaster.setFromCamera(mouse, camera);
        const intersections = raycaster.intersectObjects([wrap]);
        hovered = [];
        if (intersections.length) {
            for (i = 0; i < intersections.length; i++) {
                const index = intersections[i].index!;
                hovered.push(index);
                if (prevHovered.indexOf(index) === -1) {
                    onDotHover(index, dotsGeometry, attributeSizes);
                }
            }
        }
        for (i = 0; i < prevHovered.length; i++) {
            if (hovered.indexOf(prevHovered[i]) === -1) {
                mouseOut(prevHovered[i], dotsGeometry, attributeSizes);
            }
        }
        prevHovered = hovered.slice(0);
        attributeSizes.needsUpdate = true;
        attributePositions.needsUpdate = true;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    // initial animations

    performance.mark('scene:render:init');
    performance.measure('scene:processing', 'scene:deps:start', 'scene:render:init');

    const animationDelay = isHome ? 1.75 : 0;
    const animationDuration = isHome ? 7.5 : .1;

    // fade in dots
    const dotsSizeSrc = { value: 0 };
    new TimelineMax().to(dotsSizeSrc, animationDuration, {
        delay: animationDelay,
        value: 5,
        ease: Expo.easeOut,
        onUpdate: () => {
            const newAttrs = new Array(attributeSizes.count).fill(dotsSizeSrc.value);
            attributeSizes.set(newAttrs);
            attributeSizes.needsUpdate = true;
        },
    });
    // fade in edges
    new TimelineMax().to(segmentsMaterial, animationDuration, {
        opacity: 1,
        ease: Expo.easeOut,
        delay: animationDelay,
    });
    // move camera
    const cameraMeta = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
        fov: camera.fov,
    };
    new TimelineMax().to(cameraMeta, animationDuration, {
        delay: animationDelay,
        x: -50,
        y: 130,
        z: 300,
        fov: 30,
        ease: Expo.easeOut,
        onUpdate: () => {
            const { x, y, z, fov } = cameraMeta;
            camera.position.set(x, y, z);
            camera.fov = fov;
            camera.updateProjectionMatrix();
        },
    });

    return { resizeHandler };
};
