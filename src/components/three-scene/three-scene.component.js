import * as THREE from 'three';
// import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
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
      animationXMin: 0,
      animationXMax: 25
    },
    rotationEnabled: false,
    rotationInfo: {
      currentRotation: null,
      initialRotation: 0,
      rotationSpeed: 30 // deg / sec
    },
    lastTransform: {}
  }),

  mounted () {
    EventBus.$on('transformControlsUpdated', this.onTransformControlsUpdated);
    EventBus.$on('animationStateChanged', this.onAnimationStateChanged);
    EventBus.$on('rotateStateChanged', this.onRotateStateChanged);
    EventBus.$on('depthBufferSettingsChanged', this.applyDepthBufferSettings);
    this.initScene();
    this.onWindowResize();
    window.addEventListener('resize', this.onWindowResize);
    this.loadTextModel();
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.onWindowResize);
    EventBus.$off('transformControlsUpdated', this.onTransformControlsUpdated);
    EventBus.$off('animationStateChanged', this.onAnimationStateChanged);
    EventBus.$on('rotateStateChanged', this.onRotateStateChanged);
    EventBus.$off('depthBufferSettingsChanged', this.applyDepthBufferSettings);
  },

  methods: {
    applyDepthBufferSettings (depthBufferSettings) {
      const gl = this.renderer.getContext();

      if (!depthBufferSettings.enabled) {
        gl.disable(gl.DEPTH_TEST);
        this.render();
        return;
      }

      gl.enable(gl.DEPTH_TEST);
      gl.clearDepth(depthBufferSettings.initialBufferValue);

      const comparators = {
        NEVER: gl.NEVER,
        LESS: gl.LESS,
        EQUAL: gl.EQUAL,
        LEQUAL: gl.LEQUAL,
        GREATER: gl.GREATER,
        NOTEQUAL: gl.NOTEQUAL,
        GEQUAL: gl.GEQUAL,
        ALWAYS: gl.ALWAYS
      };

      gl.depthFunc(comparators[depthBufferSettings.comparator]);
      this.render();
    },

    onWindowResize () {
      const { width, height } = this.$refs.canvasHandler.getBoundingClientRect();
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);

      this.renderer.render(this.scene, this.camera);
    },

    loadTextModel () {
      const red = new THREE.MeshStandardMaterial({
        color: 'hsl(0, 100%, 50%)',
        side: THREE.DoubleSide
        // wireframe: true
      });

      const green = new THREE.MeshStandardMaterial({
        color: 'hsl(50, 100%, 50%)',
        side: THREE.DoubleSide
        // wireframe: true
      });

      // const loader = new STLLoader();
      // loader.load(
      //   './hello-world.stl',
      //   geometry => {
      //     this.textMesh = new THREE.Mesh(geometry, material);
      //     this.textMesh.add(new THREE.AxesHelper(15));
      //     this.scene.add(this.textMesh);
      //     this.render();
      //   }
      // );

      const geometry1 = new THREE.PlaneGeometry(20, 20);
      const planeMesh1 = new THREE.Mesh(geometry1, red);
      this.textMesh = planeMesh1;

      const geometry2 = new THREE.PlaneGeometry(20, 20);
      const planeMesh2 = new THREE.Mesh(geometry2, green);
      planeMesh2.rotateX(0.4);
      planeMesh2.rotateY(0.4);
      planeMesh2.rotateZ(0.4);
      planeMesh1.add(planeMesh2);

      this.scene.add(planeMesh1);
      this.render();
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

    onRotateStateChanged (rotationEnabled) {
      this.rotationEnabled = rotationEnabled;

      if (rotationEnabled) {
        this.rotationInfo.currentRotation = this.rotationInfo.initialRotation;
        this.threeClock.start();
        this.rotate();
        return;
      }

      this.applyTransform(this.lastTransform);
    },

    rotate () {
      if (!this.rotationEnabled) {
        return;
      }

      requestAnimationFrame(this.rotate);

      this.rotationInfo.currentRotation += this.rotationInfo.rotationSpeed * this.threeClock.getDelta();
      this.rotationInfo.currentRotation %= 360;

      const currentRotation = this.rotationInfo.currentRotation;

      this.applyTransform({
        rotation: {
          x: currentRotation,
          y: currentRotation,
          z: currentRotation
        }
      });
    },

    onAnimationStateChanged (animationEnabled) {
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
