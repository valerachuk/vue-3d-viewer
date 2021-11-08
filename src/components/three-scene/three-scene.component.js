import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import EventBus from '@event-bus';
import { createTransformMatrix } from '@math-services';

export default {
  name: 'ThreeScene',

  data: () => ({
    scene: null,
    camera: null,
    renderer: null,
    textMesh: null
  }),

  mounted () {
    EventBus.$on('transformControlsUpdated', this.applyTransform);
    this.initScene();
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize);
    this.loadTextModel();
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
    EventBus.$off('transformControlsUpdated', this.applyTransform);
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

    applyTransform (newTransform) {
      const rowMajorArray = createTransformMatrix(newTransform);
      const threeMatrix = new THREE.Matrix4();
      threeMatrix.set(...rowMajorArray);

      threeMatrix.decompose(this.textMesh.position, this.textMesh.quaternion, this.textMesh.scale);
      this.render();
    },

    render () {
      this.renderer.render(this.scene, this.camera);
    },

    initScene () {
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
