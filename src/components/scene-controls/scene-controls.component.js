import EventBus from '@event-bus';

export default {
  name: 'SceneControls',

  data: () => ({
    transform: {
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  }),

  methods: {
    emitInput () {
      EventBus.$emit('transformControlsUpdated', this.transform);
    }
  },

  computed: {
    positionX: {
      get () {
        return this.transform.position.x;
      },

      set (value) {
        this.transform.position.x = +value;
        this.emitInput();
      }
    },
    positionY: {
      get () {
        return this.transform.position.y;
      },

      set (value) {
        this.transform.position.y = +value;
        this.emitInput();
      }
    },
    positionZ: {
      get () {
        return this.transform.position.z;
      },

      set (value) {
        this.transform.position.z = +value;
        this.emitInput();
      }
    }
  }
};
