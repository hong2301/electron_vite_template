<script setup lang="ts">
import { onMounted, onUnmounted, PropType, ref, watch } from 'vue'

const emit = defineEmits(['update:text', 'confirm'])
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  type: {
    type: String as PropType<'number' | 'numbenALetter' | 'handwriting' | 'numberX'>,
    default: 'numbenALetter'
  },
  limit: {
    type: Number,
    default: 100
  },
  paddingBlock: {
    type: Number,
    default: 2
  },
  fontSize: {
    type: Number,
    default: 2.5
  }
})

const isUppercase = ref<boolean>(true)
let keyInputText = props.text
const handwritingCanvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let isDrawing = false

// 字符输入
const keyCin = (str: string) => {
  if (keyInputText.length < props.limit) {
    keyInputText += str
  }
  emit('update:text', keyInputText)
}

// 切换大小写
const updateKeyCase = () => {
  isUppercase.value = !isUppercase.value
  const characterKeys = document.querySelectorAll('.key.character')
  characterKeys.forEach((key) => {
    if (isUppercase.value) {
      key.textContent = key.textContent.toUpperCase()
    } else {
      key.textContent = key.textContent.toLowerCase()
    }
  })
}

// 删除
const del = () => {
  keyInputText = keyInputText.slice(0, -1)
  emit('update:text', keyInputText)
}

// 确定
const next = () => {
  emit('confirm')
}

// 在 initCanvas 函数中改进触摸事件处理
const initCanvas = () => {
  const canvas = handwritingCanvas.value
  if (!canvas) return

  // 获取容器尺寸
  const container = canvas.parentElement
  if (!container) return

  const rect = container.getBoundingClientRect()
  canvas.width = rect.width
  canvas.height = rect.height

  ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置画笔样式
  ctx.strokeStyle = '#000000'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // 移除所有旧的事件监听器
  canvas.removeEventListener('mousedown', handleStart)
  canvas.removeEventListener('mousemove', handleMove)
  canvas.removeEventListener('mouseup', handleEnd)
  canvas.removeEventListener('mouseleave', handleEnd)
  canvas.removeEventListener('touchstart', handleStart)
  canvas.removeEventListener('touchmove', handleMove)
  canvas.removeEventListener('touchend', handleEnd)

  // 添加新的事件监听器 - 使用 passive: false 来确保可以阻止默认行为
  canvas.addEventListener('mousedown', handleStart)
  canvas.addEventListener('mousemove', handleMove)
  canvas.addEventListener('mouseup', handleEnd)
  canvas.addEventListener('mouseleave', handleEnd)
  canvas.addEventListener('touchstart', handleStart, { passive: false })
  canvas.addEventListener('touchmove', handleMove, { passive: false })
  canvas.addEventListener('touchend', handleEnd)
}

// 清空画布
const clearCanvas = () => {
  if (!ctx || !handwritingCanvas.value) return

  ctx.clearRect(0, 0, handwritingCanvas.value.width, handwritingCanvas.value.height)
  // drawCrosshair() // 重新绘制十字虚线
}

// 统一的事件处理函数
const handleStart = (e: MouseEvent | TouchEvent) => {
  e.preventDefault() // 重要：阻止默认行为
  isDrawing = true

  const coords = getCoordinates(e)
  if (!ctx) return

  ctx.beginPath()
  ctx.moveTo(coords.x, coords.y)
}

const handleMove = (e: MouseEvent | TouchEvent) => {
  e.preventDefault() // 重要：阻止默认行为
  if (!isDrawing || !ctx) return

  const coords = getCoordinates(e)
  ctx.lineTo(coords.x, coords.y)
  ctx.stroke()
}

const handleEnd = (e: MouseEvent | TouchEvent) => {
  e.preventDefault() // 重要：阻止默认行为
  if (!isDrawing) return
  isDrawing = false
  ctx?.closePath()
}

// 改进的坐标获取函数
const getCoordinates = (e: MouseEvent | TouchEvent) => {
  const canvas = handwritingCanvas.value
  if (!canvas) return { x: 0, y: 0 }

  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  if ('touches' in e && e.touches.length > 0) {
    return {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top) * scaleY
    }
  } else if ('clientX' in e) {
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  return { x: 0, y: 0 }
}

// 绘制十字虚线
const drawCrosshair = () => {
  if (!ctx) return

  const canvas = ctx.canvas
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2

  ctx.save() // 保存当前画笔状态
  ctx.strokeStyle = '#cccccc' // 浅灰色虚线
  ctx.lineWidth = 1
  ctx.setLineDash([5, 5]) // 设置虚线样式

  // 画垂直线
  ctx.beginPath()
  ctx.moveTo(centerX, 0)
  ctx.lineTo(centerX, canvas.height)
  ctx.stroke()

  // 画水平线
  ctx.beginPath()
  ctx.moveTo(0, centerY)
  ctx.lineTo(canvas.width, centerY)
  ctx.stroke()

  ctx.restore() // 恢复画笔状态，这样后续书写的线条就不会是虚线了
}

// 保存手写痕迹为PNG图片（base64格式）
const saveHandwriting = () => {
  if (!ctx || !handwritingCanvas.value) return null

  // 创建临时画布来保存干净的图像（不包含十字虚线）
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  if (!tempCtx) return null

  // 设置临时画布尺寸与原画布相同
  tempCanvas.width = handwritingCanvas.value.width
  tempCanvas.height = handwritingCanvas.value.height

  // 填充白色背景
  tempCtx.fillStyle = '#ffffff'
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

  // 保存当前画布状态
  ctx.save()

  // 将手写内容绘制到临时画布
  tempCtx.drawImage(handwritingCanvas.value, 0, 0)

  // 恢复十字虚线
  drawCrosshair()
  ctx.restore()

  // 转换为base64格式的PNG图片
  const base64Image = tempCanvas.toDataURL('image/png')

  return base64Image
}

// 保存并触发事件
const saveAndEmit = () => {
  const base64Image = saveHandwriting()
  if (base64Image) {
    return base64Image
  }
  return null
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', initCanvas)
})

onUnmounted(() => {
  window.removeEventListener('resize', initCanvas)
})

watch(
  () => props.text,
  (newValue) => {
    keyInputText = newValue
  }
)

defineExpose({
  clearCanvas,
  saveAndEmit
})
</script>

<template>
  <div class="keyboard-main">
    <div v-if="type === 'numbenALetter'" id="virtualKeyboard" class="virtual-keyboard">
      <div class="keyboard-row">
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="1"
          @click="keyCin('1')"
        >
          1
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="2"
          @click="keyCin('2')"
        >
          2
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="3"
          @click="keyCin('3')"
        >
          3
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="4"
          @click="keyCin('4')"
        >
          4
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="5"
          @click="keyCin('5')"
        >
          5
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="6"
          @click="keyCin('6')"
        >
          6
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="7"
          @click="keyCin('7')"
        >
          7
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="8"
          @click="keyCin('8')"
        >
          8
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="9"
          @click="keyCin('9')"
        >
          9
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="0"
          @click="keyCin('0')"
        >
          0
        </div>
        <div class="key backspace action" data-key="backspace" @click="del">⌫</div>
      </div>
      <div class="keyboard-row">
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="Q"
          @click="keyCin(isUppercase ? 'Q' : 'q')"
        >
          Q
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="W"
          @click="keyCin(isUppercase ? 'W' : 'w')"
        >
          W
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="E"
          @click="keyCin(isUppercase ? 'E' : 'e')"
        >
          E
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="R"
          @click="keyCin(isUppercase ? 'R' : 'r')"
        >
          R
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="T"
          @click="keyCin(isUppercase ? 'T' : 't')"
        >
          T
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="Y"
          @click="keyCin(isUppercase ? 'Y' : 'y')"
        >
          Y
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="U"
          @click="keyCin(isUppercase ? 'U' : 'u')"
        >
          U
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="I"
          @click="keyCin(isUppercase ? 'I' : 'i')"
        >
          I
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="O"
          @click="keyCin(isUppercase ? 'O' : 'o')"
        >
          O
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="P"
          @click="keyCin(isUppercase ? 'P' : 'p')"
        >
          P
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="@"
          @click="keyCin(isUppercase ? '@' : '@')"
        >
          @
        </div>
      </div>
      <div class="keyboard-row">
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="A"
          @click="keyCin(isUppercase ? 'A' : 'a')"
        >
          A
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="S"
          @click="keyCin(isUppercase ? 'S' : 's')"
        >
          S
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="D"
          @click="keyCin(isUppercase ? 'D' : 'd')"
        >
          D
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="F"
          @click="keyCin(isUppercase ? 'F' : 'f')"
        >
          F
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="G"
          @click="keyCin(isUppercase ? 'G' : 'g')"
        >
          G
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="H"
          @click="keyCin(isUppercase ? 'H' : 'h')"
        >
          H
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="J"
          @click="keyCin(isUppercase ? 'J' : 'j')"
        >
          J
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="K"
          @click="keyCin(isUppercase ? 'K' : 'k')"
        >
          K
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="L"
          @click="keyCin(isUppercase ? 'L' : 'l')"
        >
          L
        </div>
        <div class="key enter action" data-key="enter" @click="next">确定</div>
      </div>
      <div class="keyboard-row">
        <div class="key shift action" data-key="shift" style="flex: 1.6" @click="updateKeyCase">
          ⇧
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="Z"
          @click="keyCin(isUppercase ? 'Z' : 'z')"
        >
          Z
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="X"
          @click="keyCin(isUppercase ? 'X' : 'x')"
        >
          X
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="C"
          @click="keyCin(isUppercase ? 'C' : 'c')"
        >
          C
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="V"
          @click="keyCin(isUppercase ? 'V' : 'v')"
        >
          V
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="B"
          @click="keyCin(isUppercase ? 'B' : 'b')"
        >
          B
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="N"
          @click="keyCin(isUppercase ? 'N' : 'n')"
        >
          N
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="M"
          @click="keyCin(isUppercase ? 'M' : 'm')"
        >
          M
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="."
          @click="keyCin(isUppercase ? '.' : '.')"
        >
          .
        </div>
      </div>
      <!-- <div class="keyboard-row">
        <div class="key space action" data-key=" ">空格</div>
      </div> -->
    </div>
    <div v-if="type === 'number'" id="virtualKeyboard" class="virtual-keyboard">
      <div class="keyboard-row">
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="1"
          @click="keyCin('1')"
        >
          1
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="2"
          @click="keyCin('2')"
        >
          2
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="3"
          @click="keyCin('3')"
        >
          3
        </div>
      </div>
      <div class="keyboard-row">
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="4"
          @click="keyCin('4')"
        >
          4
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="5"
          @click="keyCin('5')"
        >
          5
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="6"
          @click="keyCin('6')"
        >
          6
        </div>
      </div>
      <div class="keyboard-row">
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="7"
          @click="keyCin('7')"
        >
          7
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="8"
          @click="keyCin('8')"
        >
          8
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="9"
          @click="keyCin('9')"
        >
          9
        </div>
      </div>
      <div class="keyboard-row">
        <div class="key backspace action" data-key="backspace" @click="del">⌫</div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="0"
          @click="keyCin('0')"
        >
          0
        </div>
        <div class="key enter action" data-key="enter" @click="next">确定</div>
      </div>
      <!-- <div class="keyboard-row">
        <div class="key space action" data-key=" ">空格</div>
      </div> -->
    </div>
    <div v-if="type === 'numberX'" id="virtualKeyboard" class="virtual-keyboard">
      <div class="keyboard-row">
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="1"
          @click="keyCin('1')"
        >
          1
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="2"
          @click="keyCin('2')"
        >
          2
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="3"
          @click="keyCin('3')"
        >
          3
        </div>
      </div>
      <div class="keyboard-row">
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="4"
          @click="keyCin('4')"
        >
          4
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="5"
          @click="keyCin('5')"
        >
          5
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="6"
          @click="keyCin('6')"
        >
          6
        </div>
      </div>
      <div class="keyboard-row">
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="7"
          @click="keyCin('7')"
        >
          7
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="8"
          @click="keyCin('8')"
        >
          8
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="9"
          @click="keyCin('9')"
        >
          9
        </div>
      </div>
      <div class="keyboard-row">
        <div class="key backspace action" data-key="backspace" @click="del">⌫</div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="0"
          @click="keyCin('0')"
        >
          0
        </div>
        <div
          class="key character"
          :style="{ fontSize: `${fontSize}rem` }"
          data-key="0"
          @click="keyCin('X')"
        >
          X
        </div>
      </div>
      <!-- <div class="keyboard-row">
        <div class="key space action" data-key=" ">空格</div>
      </div> -->
    </div>
    <div v-if="type === 'handwriting'" id="virtualKeyboard" class="virtual-keyboard">
      <div class="handwriting-content">
        <canvas ref="handwritingCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.keyboard-main {
  width: 100%;
}
/* 虚拟键盘样式 */
.virtual-keyboard {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.handwriting-content {
  content: '';
  position: relative;
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 1rem;
  box-sizing: border-box;
}
/* 使用伪元素绘制垂直十字虚线 */
.handwriting-content::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background-image: repeating-linear-gradient(
    to bottom,
    #cccccc 0,
    #cccccc 5px,
    transparent 5px,
    transparent 10px
  );
  transform: translateX(-50%); /* 居中对齐 */
  pointer-events: none; /* 确保不影响鼠标事件 */
}

/* 使用伪元素绘制水平十字虚线 */
.handwriting-content::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-image: repeating-linear-gradient(
    to right,
    #cccccc 0,
    #cccccc 5px,
    transparent 5px,
    transparent 10px
  );
  transform: translateY(-50%); /* 居中对齐 */
  pointer-events: none; /* 确保不影响鼠标事件 */
}

.virtual-keyboard.active {
  display: block;
  animation: slideUp 0.3s ease;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  margin-bottom: 0.4rem;
  flex: 1;
}

.key {
  flex: 1;
  margin: 0.3rem;
  background: white;
  border: none;
  border-radius: 0.4rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.key:active {
  background: #e0e0e0;
  transform: translateY(2px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.key.backspace {
  font-size: 1.5rem;
}

.key.shift,
.key.enter {
  font-size: 1.5rem;
}

.key.special {
  background: #a0a0a0;
  color: white;
}

.key.character {
  background: #ffffff;
  color: black;
}

.key.action {
  background: #4c84ff;
  color: white;
}
</style>
