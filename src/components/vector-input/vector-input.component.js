export default {
  name: 'VectorInput',

  props: {
    value: {
      type: Object,
      required: true
    },
    step: {
      type: [Number, String],
      default: 1
    },
    max: {
      type: [Number, String],
      default: 10000
    }
  },

  methods: {
    emitInput (value) {
      this.$emit('input', Object.assign({}, this.value, value));
    }
  },

  computed: {
    xValue: {
      get () {
        return this.value.x;
      },

      set (value) {
        this.emitInput({ x: +value });
      }
    },
    yValue: {
      get () {
        return this.value.y;
      },

      set (value) {
        this.emitInput({ y: +value });
      }
    },
    zValue: {
      get () {
        return this.value.z;
      },

      set (value) {
        this.emitInput({ z: +value });
      }
    }
  }
};
