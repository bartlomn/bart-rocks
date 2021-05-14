/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BufferAttribute, Geometry, PerspectiveCamera, Points, Raycaster, Scene, Vector2, WebGLRenderer } from 'three';
import { Elastic, Power0, TimelineMax, TweenMax } from 'gsap';

import CustomVector from './cutomVector';

let hovered: number[] = [];
let prevHovered: number[] = [];

export const moveDot = (vector: CustomVector, index: number, attributePositions: BufferAttribute): void => {
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
            // attributePositions.setXYZ(index * 3, vector.x, vector.y, vector.z);
            // @ts-expect-error test
            attributePositions.array[index * 3] = vector.x;
            // @ts-expect-error test
            attributePositions.array[index * 3 + 1] = vector.y;
            // @ts-expect-error test
            attributePositions.array[index * 3 + 2] = vector.z;
        },
    });
};

export const onDotHover = (index: number, dotsGeometry: Geometry, attributeSizes: BufferAttribute): void => {
    (dotsGeometry.vertices[index] as CustomVector).tl = new TimelineMax();
    (dotsGeometry.vertices[index] as CustomVector).tl!.to(dotsGeometry.vertices[index], 1, {
        scaleX: 10,
        // duration: 1,
        ease: Elastic.easeOut.config(2, 0.2),
        onUpdate: () => {
            // attributeSizes.set([(dotsGeometry.vertices[index] as CustomVector).scaleX!], index);
            // @ts-expect-error test
            attributeSizes.array[index] = (dotsGeometry.vertices[index] as CustomVector).scaleX;
        },
    }, 5);
};

export const mouseOut = (index: number, dotsGeometry: Geometry, attributeSizes: BufferAttribute): void => {
    (dotsGeometry.vertices[index] as CustomVector).tl!.to(dotsGeometry.vertices[index], .4, {
        scaleX: 5,
        // duration: 0.4,
        ease: Power2.easeOut,
        onUpdate: () => {
            // attributeSizes.set([(dotsGeometry.vertices[index] as CustomVector).scaleX!], index);
            // @ts-expect-error test
            attributeSizes.array[index] = (dotsGeometry.vertices[index] as CustomVector).scaleX;
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
): void => {
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
    };
    requestAnimationFrame(render);
};
