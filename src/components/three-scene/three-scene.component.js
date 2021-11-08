import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import EventBus from '@event-bus';
import { createTransformMatrix, animationFunction } from '@math-services';

export default {
  name: 'ThreeScene',

  data: () => ({
    threeClock: null,
    scene: null,
    camera: null,
    renderer: null,
    textMesh: null,
    animationEnabled: false,
    animationInfo: {
      initialAnimationX: 0,
      animationX: null,
      animationSpeed: 2,
      animationXMin: 1,
      animationXMax: 25
    },
    lastTransform: {}
  }),

  mounted () {
    EventBus.$on('transformControlsUpdated', this.onTransformControlsUpdated);
    EventBus.$on('animationStateChanged', this.animationStateChanged);
    this.initScene();
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize);
    this.loadTextModel();
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
    EventBus.$off('transformControlsUpdated', this.onTransformControlsUpdated);
    EventBus.$off('animationStateChanged', this.animationStateChanged);
  },

  methods: {
    onWindowResize () {
      const { width, height } = this.$refs.canvasHandler.getBoundingClientRect();
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);

      this.renderer.render(this.scene, this.camera);
    },

    loadTextModel () {
      const material = new THREE.MeshStandardMaterial({
        color: 'hsl(0, 100%, 50%)'
        // wireframe: true
      });

      const loader = new STLLoader();
      loader.load(
        './hello-world.stl',
        geometry => {
          this.textMesh = new THREE.Mesh(geometry, material);
          this.textMesh.add(new THREE.AxesHelper(15));
          this.scene.add(this.textMesh);
          this.render();
        }
      );
    },

    onTransformControlsUpdated (newTransform) {
      this.lastTransform = newTransform;
      this.applyTransform(newTransform);
    },

    applyTransform (newTransform) {
      const rowMajorArray = createTransformMatrix(newTransform);
      const threeMatrix = new THREE.Matrix4();
      threeMatrix.set(...rowMajorArray);

      threeMatrix.decompose(this.textMesh.position, this.textMesh.quaternion, this.textMesh.scale);
      this.render();
    },

    animationStateChanged (animationEnabled) {
      this.animationEnabled = animationEnabled;

      if (animationEnabled) {
        this.animationInfo.animationX = this.animationInfo.initialAnimationX;
        this.threeClock.start();
        this.animate();
        return;
      }

      this.applyTransform(this.lastTransform);
    },

    animate () {
      if (!this.animationEnabled) {
        return;
      }

      requestAnimationFrame(this.animate);

      this.animationInfo.animationX += this.animationInfo.animationSpeed * this.threeClock.getDelta();

      if (this.animationInfo.animationX >= this.animationInfo.animationXMax) {
        this.animationInfo.animationSpeed = -Math.abs(this.animationInfo.animationSpeed);
      }

      if (this.animationInfo.animationX <= this.animationInfo.animationXMin) {
        this.animationInfo.animationSpeed = Math.abs(this.animationInfo.animationSpeed);
      }

      const animationY = animationFunction(this.animationInfo.animationX);
      this.applyTransform({
        position: {
          x: this.animationInfo.animationX,
          y: animationY,
          z: 0
        }
      });
    },

    render () {
      this.renderer.render(this.scene, this.camera);
    },

    initScene () {
      this.threeClock = new THREE.Clock();

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color('hsl(0, 100%, 100%)');

      this.camera = new THREE.PerspectiveCamera(
        75,
        1,
        0.1,
        1000
      );
      this.camera.position.set(50, 50, 50);
      this.camera.lookAt(0, 0, 0);
      this.scene.add(this.camera);

      const light = new THREE.DirectionalLight('hsl(0, 0%, 100%)');
      light.position.set(0, 0, 10);
      this.scene.add(light);

      const ambientLight = new THREE.AmbientLight('hsl(0, 0%, 50%)');
      this.scene.add(ambientLight);

      const axes = new THREE.AxesHelper(35);
      this.scene.add(axes);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });

      this.$refs.canvasHandler.appendChild(this.renderer.domElement);
    }
  }

};
