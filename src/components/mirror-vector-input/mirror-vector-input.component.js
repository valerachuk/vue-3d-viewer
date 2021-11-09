export default {
  name: 'MirrorVectorInput',

  props: {
    value: {
      type: Object,
      required: true
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
        this.emitInput({ x: value });
      }
    },
    yValue: {
      get () {
        return this.value.y;
      },

      set (value) {
        this.emitInput({ y: value });
      }
    },
    zValue: {
      get () {
        return this.value.z;
      },

      set (value) {
        this.emitInput({ z: value });
      }
    }
  }
};
