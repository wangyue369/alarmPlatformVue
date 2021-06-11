<template>
  <div>
    <channel :channelType="channelType"></channel>
  </div>
</template>

<script>
export default {
  data () {
    return {
      channelType: 'feishu'
    }
  },
  components: {
    channel: require('./Channel.vue').default
  }
}
</script>

<style lang="less" scoped>
</style>
