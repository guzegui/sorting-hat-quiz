<template>
  <h1 style="color: white">{{ msg }}</h1>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
};
</script>
