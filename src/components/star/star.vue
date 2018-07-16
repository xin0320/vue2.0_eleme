<template>
<div class="star">  <!-- star表示一行星星，star-item循环这几个星星,starType返回star-48 -->
    <div class="star-item" :class="starType"> <!-- itemClasses记为result数组的值，itemclass的值为on off half -->
        <span v-for="itemClass in itemClasses" :key = itemClass.id :class = "itemClass" class = "star-item"></span>
    </div>
</div>
</template>

<script type = "text/ecmascript-6">
   const LENGTH = 5;
  const CLS_ON = 'on';
  const CLS_HALF = 'half';
  const CLS_OFF = 'off';
  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType() {
        return 'star-' + this.size;
      },
      itemClasses() {
        let result = [];
        let score = Math.floor(this.score * 2) / 2;
        let hasDecimal = score % 1 !== 0;
        let integer = Math.floor(score);
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus">
  @import "star.styl";
</style>
