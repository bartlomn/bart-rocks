/// <reference types="react-scripts" />
declare function requestIdleCallback(...params) {};
declare module '*.vert' {
    const content: string;
    export default content;
}
declare module '*.frag' {
    const content: string;
    export default content;
}
