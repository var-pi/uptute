export function refresh() {
  return (this.input = JSON.parse(JSON.stringify(this.def)));
}
export function isValid() {
  let val = true;
  if (this.rules !== undefined) val = this.rules(this.input);
  this.$refs.base.errorAnim = false;
  setTimeout(() => {
    this.$refs.base ? (this.$refs.base.errorAnim = !val) : null;
  }, 50);
  this.$refs.base.error = !val;
  return val;
}
export function convert(item) {
  if (this.convertor === undefined) return item;
  return this.convertor(item);
}

export const watch = {
  input: function(val) {
    this.$emit("input", val);
    console.log("!!");
    console.log(this);
    if (this.rules != undefined && this.rules(this.input))
      this.$refs.base.error = false;
  },
  value: function(val) {
    this.input = val;
  },
};

