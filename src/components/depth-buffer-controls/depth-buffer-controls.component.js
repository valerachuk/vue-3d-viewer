export default {
  name: 'DepthBufferControls',

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    depthComparatorValues: [
      'NEVER', 'LESS', 'EQUAL', 'LEQUAL', 'GREATER', 'NOTEQUAL', 'GEQUAL', 'ALWAYS'
    ]
  }),

  methods: {
    emitInput (value) {
      this.$emit('input', Object.assign({}, this.value, value));
    }
  },

  computed: {
    enabledValue: {
      get () {
        return this.value.enabled;
      },

      set (value) {
        this.emitInput({
          enabled: value
        });
      }
    },
    comparatorValue: {
      get () {
        return this.value.comparator;
      },

      set (value) {
        this.emitInput({
          comparator: value
        });
      }
    },
    initialBufferValue: {
      get () {
        return this.value.initialBufferValue;
      },

      set (value) {
        this.emitInput({ initialBufferValue: +value });
      }
    }
  }
};
