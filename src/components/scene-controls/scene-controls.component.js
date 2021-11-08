import EventBus from '@event-bus';
import VectorInput from '../vector-input/vector-input.component.vue';
import MirrorVectorInput from '../mirror-vector-input/mirror-vector-input.component.vue';

export default {
  name: 'SceneControls',

  components: {
    VectorInput,
    MirrorVectorInput
  },

  data: () => ({
    transform: {
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      scale: {
        x: 1,
        y: 1,
        z: 1
      },
      rotationAroundWorldCenter: {
        x: 0,
        y: 0,
        z: 0
      },
      mirror: {
        x: false,
        y: false,
        z: false
      }
    }
  }),

  methods: {
    emitInput () {
      EventBus.$emit('transformControlsUpdated', this.transform);
    }
  },

  computed: {
    position: {
      get () {
        return this.transform.position;
      },

      set (value) {
        this.transform.position = value;
        this.emitInput();
      }
    },
    rotation: {
      get () {
        return this.transform.rotation;
      },

      set (value) {
        this.transform.rotation = value;
        this.emitInput();
      }
    },
    scale: {
      get () {
        return this.transform.scale;
      },

      set (value) {
        this.transform.scale = value;
        this.emitInput();
      }
    },
    rotationAroundWorldCenter: {
      get () {
        return this.transform.rotationAroundWorldCenter;
      },

      set (value) {
        this.transform.rotationAroundWorldCenter = value;
        this.emitInput();
      }
    },
    mirror: {
      get () {
        return this.transform.mirror;
      },

      set (value) {
        this.transform.mirror = value;
        this.emitInput();
      }
    }
  }
};
