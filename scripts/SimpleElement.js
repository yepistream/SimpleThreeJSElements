import * as THREE from 'three';

import '../styles/OverlayElementStyle.css';


class HTMLOverlay {
    static animID;
    static SimpleIFramesActive = [];


    /**
     * Starts the animation loop for all active SimpleIFrames.
     * @param {THREE.Camera} camera - The camera used for view-projection matrix.
     */
    static startAll(camera) {
        const frustum = new THREE.Frustum();
        const cameraViewProjectionMatrix = new THREE.Matrix4();

        camera.updateMatrixWorld();
        cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
        frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);

        HTMLOverlay.SimpleIFramesActive.forEach(element => {
            element.recenterElement(camera, frustum);
        });

        HTMLOverlay.animID = requestAnimationFrame(() => HTMLOverlay.startAll(camera));
    }

    /**
     * Stops the animation loop.
     */
    static stopAll() {
        cancelAnimationFrame(HTMLOverlay.animID);
    }

    /**
     * @param {string} innerHTML - HTML content to display inside the IFrame.
     * @param {THREE.Object3D} target - 3D object target.
     * @param {THREE.Vector2} [offset=new THREE.Vector2(0, 0)] - Optional offset for the position.
     */
    constructor(innerHTML, target, offset = new THREE.Vector2(0, 0)) {

        this.innerHTML = innerHTML;
        this.target = target;
        this.offset = offset;
        HTMLOverlay.SimpleIFramesActive.push(this);

        this.div = document.createElement('div');
        this.div.classList.add("overlay-div");
        this.div.innerHTML = innerHTML;
        document.body.appendChild(this.div);
    }

    /**
     * Repositions the HTML element to match the target's position in 2D screen space.
     * @param {THREE.Camera} camera - The camera used for projection.
     * @param {THREE.Frustum} frustum - Precomputed camera frustum.
     */
    recenterElement(camera, frustum) {
        const boundingBox = new THREE.Box3().setFromObject(this.target);

        if (frustum.intersectsBox(boundingBox)) {
            const worldPosition = new THREE.Vector3();
            this.target.getWorldPosition(worldPosition);

            const vector = worldPosition.clone();
            vector.project(camera);

            const x = ((vector.x * 0.5 + 0.5) * window.innerWidth) + this.offset.x;
            const y = ((vector.y * -0.5 + 0.5) * window.innerHeight) - this.offset.y;

            const divWidth = this.div.offsetWidth;
            const divHeight = this.div.offsetHeight;

            this.div.style.left = `${x - divWidth / 2}px`;
            this.div.style.top = `${y - divHeight / 2}px`;
            this.div.style.display = "block";
        } else {
            this.div.style.display = "none";
        }
    }
}

class HTMLOverlay3D extends HTMLOverlay {
    /**
     * @param {string} innerHTML - HTML content for the panel.
     * @param {THREE.Object3D} target - 3D object to track.
     * @param {THREE.Vector2} [offset=new THREE.Vector2(0, 0)] - Position offset.
     * @param {number} [scaleDistance=3000] - Distance for scaling the panel.
     * @param {boolean} [resizeOnlyText=true] - Whether to resize only text elements.
     */
    constructor(innerHTML, target, offset = new THREE.Vector3(0, 0, 0), scaleDistance = 3000, resizeOnlyText = true) {
        super(innerHTML, target, offset);
        this.scaleDistance = scaleDistance;
        this.resizeOnlyText = resizeOnlyText;

        this.div.style.width = this.div.offsetWidth + "px";
        this.div.style.height = this.div.offsetHeight + "px";
        this.resizeFontsBasedOnParent();
        this.observeParentResize();
    }

    /**
     * Observe size changes in the parent element to adjust fonts.
     */
    observeParentResize() {
        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(() => {
                this.resizeFontsBasedOnParent();
            });
            resizeObserver.observe(this.div);
        } else {
            window.addEventListener('resize', () => this.resizeFontsBasedOnParent());
        }
    }

    /**
     * Resizes font based on the parent element's size.
     */
    resizeFontsBasedOnParent() {
        Array.from(this.div.children).forEach(child => {
            if (this.resizeOnlyText && child.nodeType !== Node.ELEMENT_NODE) {
                return;
            }

            const parentWidth = this.div.offsetWidth;
            const fontSize = parentWidth * 0.05;
            child.style.fontSize = `${fontSize}px`;
        });
    }

    /**
     * Repositions and scales the floating panel based on the target's position and distance.
     * @param {THREE.Camera} camera - The camera used for projection.
     * @param {THREE.Frustum} frustum - Precomputed camera frustum.
     */
    recenterElement(camera, frustum) {
        const boundingBox = new THREE.Box3().setFromObject(this.target);
        if (frustum.intersectsBox(boundingBox)) {
            const worldPosition = new THREE.Vector3();
            this.target.getWorldPosition(worldPosition);
            
            const vector = worldPosition.clone();
            vector.add(this.offset);
            vector.project(camera);

            const x = ((vector.x * 0.5 + 0.5) * window.innerWidth);
            const y = ((vector.y * -0.5 + 0.5) * window.innerHeight);

            const distance = worldPosition.distanceTo(camera.position);
            const scale = THREE.MathUtils.clamp((this.scaleDistance - distance) / (this.scaleDistance - 1), 0, 20);

            const divWidth = this.div.offsetWidth * scale;
            const divHeight = this.div.offsetHeight * scale;
            const zIndex = Math.floor((1 / distance) * 1000);
            this.div.style.left = `${x - divWidth / 2}px`;
            this.div.style.top = `${y - divHeight / 2}px`;
            this.div.style.width = `${divWidth}px`;
            this.div.style.height = `${divHeight}px`;
            this.div.style.zIndex = zIndex;
            this.div.style.display = "block";
            this.resizeFontsBasedOnParent();
        } else {
            this.div.style.display = "none";
        }
    }
}

export { HTMLOverlay, HTMLOverlay3D};
