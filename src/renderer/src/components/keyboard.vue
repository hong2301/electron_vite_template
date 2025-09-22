<script setup lang="ts">
import { PropType, ref, watch } from 'vue'

const emit = defineEmits(['update:text', 'confirm'])
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  type: {
    type: String as PropType<'number' | 'numbenALetter' | 'handwriting'>,
    default: 'numbenALetter'
  },
  limit: {
    type: Number,
    default: 11
  }
})

const isUppercase = ref<boolean>(true)
let keyInputText = props.text

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

watch(
  () => props.text,
  (newValue) => {
    keyInputText = newValue
  }
)
</script>

<template>
  <div class="overture">
    <div v-if="type === 'numbenALetter'" id="virtualKeyboard" class="virtual-keyboard">
      <div class="keyboard-row">
        <div class="key character" data-key="1" @click="keyCin('1')">1</div>
        <div class="key character" data-key="2" @click="keyCin('2')">2</div>
        <div class="key character" data-key="3" @click="keyCin('3')">3</div>
        <div class="key character" data-key="4" @click="keyCin('4')">4</div>
        <div class="key character" data-key="5" @click="keyCin('5')">5</div>
        <div class="key character" data-key="6" @click="keyCin('6')">6</div>
        <div class="key character" data-key="7" @click="keyCin('7')">7</div>
        <div class="key character" data-key="8" @click="keyCin('8')">8</div>
        <div class="key character" data-key="9" @click="keyCin('9')">9</div>
        <div class="key character" data-key="0" @click="keyCin('0')">0</div>
        <div class="key backspace action" data-key="backspace" @click="del">⌫</div>
      </div>
      <div class="keyboard-row">
        <div class="key character" data-key="Q" @click="keyCin(isUppercase ? 'Q' : 'q')">Q</div>
        <div class="key character" data-key="W" @click="keyCin(isUppercase ? 'W' : 'w')">W</div>
        <div class="key character" data-key="E" @click="keyCin(isUppercase ? 'E' : 'e')">E</div>
        <div class="key character" data-key="R" @click="keyCin(isUppercase ? 'R' : 'r')">R</div>
        <div class="key character" data-key="T" @click="keyCin(isUppercase ? 'T' : 't')">T</div>
        <div class="key character" data-key="Y" @click="keyCin(isUppercase ? 'Y' : 'y')">Y</div>
        <div class="key character" data-key="U" @click="keyCin(isUppercase ? 'U' : 'u')">U</div>
        <div class="key character" data-key="I" @click="keyCin(isUppercase ? 'I' : 'i')">I</div>
        <div class="key character" data-key="O" @click="keyCin(isUppercase ? 'O' : 'o')">O</div>
        <div class="key character" data-key="P" @click="keyCin(isUppercase ? 'P' : 'p')">P</div>
      </div>
      <div class="keyboard-row">
        <div class="key character" data-key="A" @click="keyCin(isUppercase ? 'A' : 'a')">A</div>
        <div class="key character" data-key="S" @click="keyCin(isUppercase ? 'S' : 's')">S</div>
        <div class="key character" data-key="D" @click="keyCin(isUppercase ? 'D' : 'd')">D</div>
        <div class="key character" data-key="F" @click="keyCin(isUppercase ? 'F' : 'f')">F</div>
        <div class="key character" data-key="G" @click="keyCin(isUppercase ? 'G' : 'g')">G</div>
        <div class="key character" data-key="H" @click="keyCin(isUppercase ? 'H' : 'h')">H</div>
        <div class="key character" data-key="J" @click="keyCin(isUppercase ? 'J' : 'j')">J</div>
        <div class="key character" data-key="K" @click="keyCin(isUppercase ? 'K' : 'k')">K</div>
        <div class="key character" data-key="L" @click="keyCin(isUppercase ? 'L' : 'l')">L</div>
        <div class="key enter action" data-key="enter" @click="next">确定</div>
      </div>
      <div class="keyboard-row">
        <div class="key shift action" data-key="shift" style="flex: 1.6" @click="updateKeyCase">
          ⇧
        </div>
        <div class="key character" data-key="Z" @click="keyCin(isUppercase ? 'Z' : 'z')">Z</div>
        <div class="key character" data-key="X" @click="keyCin(isUppercase ? 'X' : 'x')">X</div>
        <div class="key character" data-key="C" @click="keyCin(isUppercase ? 'C' : 'c')">C</div>
        <div class="key character" data-key="V" @click="keyCin(isUppercase ? 'V' : 'v')">V</div>
        <div class="key character" data-key="B" @click="keyCin(isUppercase ? 'B' : 'b')">B</div>
        <div class="key character" data-key="N" @click="keyCin(isUppercase ? 'N' : 'n')">N</div>
        <div class="key character" data-key="M" @click="keyCin(isUppercase ? 'M' : 'm')">M</div>
      </div>
      <!-- <div class="keyboard-row">
        <div class="key space action" data-key=" ">空格</div>
      </div> -->
    </div>
    <div v-if="type === 'number'" id="virtualKeyboard" class="virtual-keyboard">
      <div class="keyboard-row">
        <div class="key character" data-key="1" @click="keyCin('1')">1</div>
        <div class="key character" data-key="2" @click="keyCin('2')">2</div>
        <div class="key character" data-key="3" @click="keyCin('3')">3</div>
      </div>
      <div class="keyboard-row">
        <div class="key character" data-key="4" @click="keyCin('4')">4</div>
        <div class="key character" data-key="5" @click="keyCin('5')">5</div>
        <div class="key character" data-key="6" @click="keyCin('6')">6</div>
      </div>
      <div class="keyboard-row">
        <div class="key character" data-key="7" @click="keyCin('7')">7</div>
        <div class="key character" data-key="8" @click="keyCin('8')">8</div>
        <div class="key character" data-key="9" @click="keyCin('9')">9</div>
      </div>
      <div class="keyboard-row">
        <div class="key backspace action" data-key="backspace" @click="del">⌫</div>
        <div class="key character" data-key="0" @click="keyCin('0')">0</div>
        <div class="key enter action" data-key="enter" @click="next">确定</div>
      </div>
      <!-- <div class="keyboard-row">
        <div class="key space action" data-key=" ">空格</div>
      </div> -->
    </div>
    <div v-if="type === 'handwriting'" id="virtualKeyboard" class="virtual-keyboard"></div>
  </div>
</template>

<style scoped>
.overture {
  width: 100%;
}
/* 虚拟键盘样式 */
.virtual-keyboard {
  width: 100%;
  background: #f0f0f0;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.virtual-keyboard.active {
  display: block;
  animation: slideUp 0.3s ease;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  margin-bottom: 0.4rem;
}

.key {
  flex: 1;
  height: 4rem;
  margin: 0.3rem;
  background: white;
  border: none;
  border-radius: 0.4rem;
  font-size: 1.5rem;
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
