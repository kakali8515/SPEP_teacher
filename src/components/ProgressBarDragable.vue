<!-- <template>
    <div class="progress-bar-wrap">
        <div class="backbar">
            <div class="dragbar" :style="{ left: position.x + 'px' }" @mousedown="startDrag"></div>
        </div>
    </div>
</template>


<script>
export default {
  data() {
    return {
      dragging: false,
      position: { x: 0, y: 0 },
      initialMouseOffset: { x: 0, y: 0 },
      maxHeight: 200, // Set your desired max height
    };
  },
  methods: {
    startDrag(event) {
      this.dragging = true;
      this.initialMouseOffset = {
        x: event.clientX - this.position.x,
        y: event.clientY - this.position.y,
      };

      window.addEventListener('mousemove', this.handleMouseMove);
      window.addEventListener('mouseup', this.stopDrag);
    },
    handleMouseMove(event) {
      if (this.dragging) {
        const newX = event.clientX - this.initialMouseOffset.x;
        const newY = event.clientY - this.initialMouseOffset.y;

        // Limit vertical movement within maxHeight
        this.position = {
          x: newX,
          y: Math.min(Math.max(newY, 0), this.maxHeight),
        };
      }
    },
    stopDrag() {
      this.dragging = false;
      window.removeEventListener('mousemove', this.handleMouseMove);
      window.removeEventListener('mouseup', this.stopDrag);
    },
  },
};
</script>

<style scoped>
.progress-bar-wrap{
    position: relative;
    width: 100%;
    padding: 50px;
}
.backbar{
    position: relative;
    width: 100%;
    background-color: #E5EBFF;
    height: 6px;
    border-radius: 50px;
}
.dragbar{
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    background-color: #0C60C2;
    height: 6px;
    border-radius: 50px;
    cursor: pointer;
    user-select: none;
}
</style> -->


<template>
    <div class="progress-bar-wrap">
        <h3>Keep it up</h3>
        <div class="progressslider">
            <input type="range" min="0" max="100" value="20">
            <div class="range-num">
                <p class="text" style="left: 108px;">Jinhee</p>
                <span>0</span>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
            </div>
        </div>
        <h3>Excelent</h3>
    </div>
    <!-- <div class="value">100</div> -->

</template>
<script setup>
    const progressslider = document.querySelector('input');
    const value = document.querySelector('.value');
</script>

<style scoped>
.progress-bar-wrap{
    position: relative;
    width: 100%;
    padding: 20px 16px;
    display: flex;
    /* border: 1px solid red; */
    margin-top: 8px;
    border-radius: 8px;
    border: 1px solid  #F2F2F2;
}
.progress-bar-wrap h3{
  color: #222059;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 100%; 
  width: 100%;
  max-width: 60px;
  display: block;
  margin-top: 7px;
}
.progressslider{
    position: relative;
    width: 100%;
    margin-right: 10px;
    margin-left: 5px;
    /* border: 1px solid black; */
}
.progressslider input{
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
    outline: none;
    position: relative;
}
.progressslider input::after{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 8px;
  background: #F7F9FD;
  border-radius: 10px;
  /* background: red; */
}
.text{
  position: absolute;
  top: -26px;
  color: #181818;
  font-size: 9px;
  font-style: normal;
  font-weight: 500;
  line-height: 100%;
}
.progressslider input[type=range]::-webkit-slider-thumb {
   -webkit-appearance: none;
   border: none;
   height: 8px;
   width: 20px;
   border-radius: 10px;
   background: #0C60C2;
   margin-top: 0px;
  position: relative;
  z-index: 9;
}

.range-num{
    position: relative;
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.range-num span{
  color: var(--Gray-6, #BDBDBD);
  font-size: 10px;
  font-style: normal;
  font-weight: 600;
  line-height: 100%;
}

</style>