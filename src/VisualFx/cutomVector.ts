import { Vector3 } from "three";
import { TimelineMax } from 'gsap';

class CustomVector extends Vector3 {
    constructor(x?: number, y?: number, z?: number) {
        super(x, y, z);
    }
    color: number | undefined;
    theta: number | undefined;
    phi: number | undefined;
    scaleX: number | undefined;
    tl: TimelineMax | undefined;
}

export default CustomVector;