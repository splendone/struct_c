// 全局变量定义
let animationState = {
  step: 0,
  isPlaying: false,
  speed: 500,
  intervalId: null,
  nodes: [],
  memoryBlocks: []
};

// 初始链表数据
const initialList = [
  { id: 'node1', data: 1, address: '0x1000', next: '0x1008' },
  { id: 'node2', data: 3, address: '0x1008', next: '0x1010' },
  { id: 'node3', data: 5, address: '0x1010', next: 'NULL' }
];

// 代码内容
const codeLines = [
  '1: struct Node* insertNode(struct Node* head, int pos, int value) {',
  '2:     // 创建新节点',
  '3:     struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));',
  '4:     newNode->data = value;',
  '5:     newNode->next = NULL;',
  '6:     ',
  '7:     // 处理头部插入',
  '8:     if (pos == 1) {',
  '9:         newNode->next = head;',
  '10:        return newNode;',
  '11:     }',
  '12:    ',
  '13:     // 查找插入位置',
  '14:     struct Node* current = head;',
  '15:     int count = 1;',
  '16:     while (count < pos - 1 && current != NULL) {',
  '17:         current = current->next;',
  '18:         count++;',
  '19:     }',
  '20:    ',
  '21:     // 执行插入',
  '22:     if (current != NULL) {',
  '23:         newNode->next = current->next;',
  '24:         current->next = newNode;',
  '25:     }',
  '26:    ',
  '27:     return head;',
  '28: }'
];

// 动画步骤定义
const animationSteps = [
  {
    step: 0,
    description: "初始化：显示初始链表（1 → 3 → 5 → NULL）",
    action: initializeAnimation,
    highlight: { line: -1, variables: [] }
  },
  {
    step: 1,
    description: "创建新节点 (newNode)",
    action: createNewNode,
    highlight: { line: 3, variables: ['newNode'] }
  },
  {
    step: 2,
    description: "设置新节点的数据 (newNode->data = value)",
    action: setNewNodeData,
    highlight: { line: 4, variables: ['newNode->data', 'value'] }
  },
  {
    step: 3,
    description: "初始化新节点的next指针 (newNode->next = NULL)",
    action: setNewNodeNext,
    highlight: { line: 5, variables: ['newNode->next'] }
  },
  {
    step: 4,
    description: "检查是否为头部插入 (pos == 1)",
    action: checkHeadInsertion,
    highlight: { line: 8, variables: ['pos'] }
  },
  {
    step: 5,
    description: "查找插入位置 (current = head)",
    action: setCurrentToHead,
    highlight: { line: 14, variables: ['current', 'head'] }
  },
  {
    step: 6,
    description: "执行插入操作 - 设置newNode->next = current->next",
    action: setNewNodeNextToCurrentNext,
    highlight: { line: 23, variables: ['newNode->next', 'current->next'] }
  },
  {
    step: 7,
    description: "执行插入操作 - 设置current->next = newNode",
    action: setCurrentNextToNewNode,
    highlight: { line: 24, variables: ['current->next', 'newNode'] }
  },
  {
    step: 8,
    description: "完成插入，显示最终链表 (1 → 2 → 3 → 5 → NULL)",
    action: showFinalList,
    highlight: { line: -1, variables: [] }
  }
];

// 初始化动画
function initializeAnimation() {
  // 清空容器
  document.getElementById('listContainer').innerHTML = '';
  document.getElementById('memoryContainer').innerHTML = '';
  
  // 显示初始链表
  const listContainer = document.getElementById('listContainer');
  initialList.forEach((node, index) => {
    const nodeElement = document.createElement('div');
    nodeElement.className = 'node';
    nodeElement.id = node.id;
    
    nodeElement.innerHTML = `
      <div class="node-data">${node.data}</div>
      <div class="node-next">${node.next === 'NULL' ? '∅' : node.next}</div>
    `;
    
    listContainer.appendChild(nodeElement);
    
    // 添加箭头（除了最后一个节点）
    if (index < initialList.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'pointer-arrow';
      nodeElement.appendChild(arrow);
    }
  });
  
  // 显示初始内存视图
  const memoryContainer = document.getElementById('memoryContainer');
  initialList.forEach(node => {
    const block = document.createElement('div');
    block.className = 'memory-block';
    block.innerHTML = `
      <div class="memory-address">${node.address}</div>
      <div class="memory-content">
        <div class="memory-field">
          <div class="memory-field-name">data:</div>
          <div class="memory-field-value">${node.data}</div>
        </div>
        <div class="memory-field">
          <div class="memory-field-name">next:</div>
          <div class="memory-field-value">${node.next === 'NULL' ? '∅' : node.next}</div>
        </div>
      </div>
    `;
    memoryContainer.appendChild(block);
  });
  
  // 添加head指针
  const headBlock = document.createElement('div');
  headBlock.className = 'memory-block';
  headBlock.innerHTML = `
    <div class="memory-address">head</div>
    <div class="memory-content">
      <div class="memory-field">
        <div class="memory-field-name">value:</div>
        <div class="memory-field-value">${initialList[0].address}</div>
      </div>
    </div>
  `;
  memoryContainer.appendChild(headBlock);
}

// 创建新节点
function createNewNode() {
  const memoryContainer = document.getElementById('memoryContainer');
  const newNodeBlock = document.createElement('div');
  newNodeBlock.className = 'memory-block fade-in';
  newNodeBlock.id = 'newNodeBlock';
  newNodeBlock.innerHTML = `
    <div class="memory-address">0x1020 (newNode)</div>
    <div class="memory-content">
      <div class="memory-field">
        <div class="memory-field-name">data:</div>
        <div class="memory-field-value">?</div>
      </div>
      <div class="memory-field">
        <div class="memory-field-name">next:</div>
        <div class="memory-field-value">∅</div>
      </div>
    </div>
  `;
  memoryContainer.appendChild(newNodeBlock);
  
  // 添加newNode变量
  const newNodeVarBlock = document.createElement('div');
  newNodeVarBlock.className = 'memory-block';
  newNodeVarBlock.innerHTML = `
    <div class="memory-address">newNode</div>
    <div class="memory-content">
      <div class="memory-field">
        <div class="memory-field-name">value:</div>
        <div class="memory-field-value">0x1020</div>
      </div>
    </div>
  `;
  memoryContainer.appendChild(newNodeVarBlock);
}

// 设置新节点数据
function setNewNodeData() {
  const dataField = document.querySelector('#newNodeBlock .memory-field-value:first-child');
  dataField.textContent = '2'; // 插入的值是2
  dataField.classList.add('highlight-pulse');
  
  setTimeout(() => {
    dataField.classList.remove('highlight-pulse');
  }, 1000);
}

// 设置新节点next指针
function setNewNodeNext() {
  const nextField = document.querySelector('#newNodeBlock .memory-field-value:last-child');
  nextField.textContent = '∅';
  nextField.classList.add('highlight-pulse');
  
  setTimeout(() => {
    nextField.classList.remove('highlight-pulse');
  }, 1000);
}

// 检查头部插入
function checkHeadInsertion() {
  const infoPanel = document.getElementById('operationInfo');
  infoPanel.innerHTML = 'pos = 2, 不等于 1，所以不执行头部插入';
  
  // 高亮显示pos变量
  setTimeout(() => {
    const posIndicator = document.createElement('span');
    posIndicator.style.backgroundColor = 'lightblue';
    posIndicator.textContent = 'pos(2)';
    infoPanel.appendChild(posIndicator);
  }, 300);
}

// 设置current指针
function setCurrentToHead() {
  const memoryContainer = document.getElementById('memoryContainer');
  const currentBlock = document.createElement('div');
  currentBlock.className = 'memory-block';
  currentBlock.innerHTML = `
    <div class="memory-address">current</div>
    <div class="memory-content">
      <div class="memory-field">
        <div class="memory-field-name">value:</div>
        <div class="memory-field-value">0x1000</div>
      </div>
    </div>
  `;
  memoryContainer.appendChild(currentBlock);
  
  // 高亮显示current指向
  const firstNode = document.getElementById('node1');
  firstNode.classList.add('highlight-pulse');
  
  setTimeout(() => {
    firstNode.classList.remove('highlight-pulse');
  }, 1000);
}

// 设置newNode->next = current->next
function setNewNodeNextToCurrentNext() {
  const currentNextValue = '0x1008'; // current->next 的值
  const newNodeNextField = document.querySelector('#newNodeBlock .memory-field-value:last-child');
  
  // 显示计算过程
  const infoPanel = document.getElementById('operationInfo');
  infoPanel.innerHTML = `计算右侧值: current->next = ${currentNextValue}`;
  
  // 更新newNode的next字段
  setTimeout(() => {
    newNodeNextField.textContent = currentNextValue;
    newNodeNextField.classList.add('highlight-pulse');
    infoPanel.innerHTML += `<br>赋值给左侧: newNode->next = ${currentNextField}`;
  }, 500);
  
  setTimeout(() => {
    newNodeNextField.classList.remove('highlight-pulse');
  }, 1500);
}

// 设置current->next = newNode
function setCurrentNextToNewNode() {
  const listContainer = document.getElementById('listContainer');
  const newNodeElement = document.createElement('div');
  newNodeElement.className = 'node fade-in';
  newNodeElement.id = 'newNodeElement';
  
  newNodeElement.innerHTML = `
    <div class="node-data">2</div>
    <div class="node-next">0x1008</div>
  `;
  
  // 在正确位置插入新节点
  const node1 = document.getElementById('node1');
  listContainer.insertBefore(newNodeElement, node1.nextSibling);
  
  // 添加指向新节点的箭头
  const arrow = document.createElement('div');
  arrow.className = 'pointer-arrow';
  newNodeElement.appendChild(arrow);
  
  // 更新node1的next值
  const node1Next = node1.querySelector('.node-next');
  node1Next.textContent = '0x1020'; // newNode的地址
  
  // 更新内存视图中的current->next
  const currentBlock = Array.from(document.querySelectorAll('.memory-block'))
    .find(block => block.innerHTML.includes('current'));
  
  if (currentBlock) {
    const valueElement = currentBlock.querySelector('.memory-field-value');
    valueElement.textContent = '0x1020';
  }
  
  // 更新newNode内存块的地址显示
  const newNodeAddr = document.querySelector('#newNodeBlock .memory-address');
  newNodeAddr.textContent = '0x1020 (newNode)';
}

// 显示最终列表
function showFinalList() {
  const infoPanel = document.getElementById('operationInfo');
  infoPanel.innerHTML = '插入完成！最终链表为: 1 → 2 → 3 → 5 → NULL';
  
  // 高亮整个链表
  const nodes = document.querySelectorAll('.node');
  nodes.forEach(node => {
    node.classList.add('highlight-pulse');
  });
  
  setTimeout(() => {
    nodes.forEach(node => {
      node.classList.remove('highlight-pulse');
    });
  }, 2000);
}

// 高亮代码行和变量
function highlightCode(highlightInfo) {
  const codeDisplay = document.getElementById('codeDisplay');
  
  // 清除之前的高亮
  codeDisplay.innerHTML = codeLines.map(line => {
    // 移除所有高亮类
    line = line.replace(/<span class="[^"]*">([^<]*)<\/span>/g, '$1');
    return line;
  }).join('\n');
  
  if (highlightInfo.line !== -1) {
    // 高亮整行
    const lines = codeDisplay.innerHTML.split('\n');
    if (highlightInfo.line >= 1 && highlightInfo.line <= lines.length) {
      const lineIndex = highlightInfo.line - 1;
      lines[lineIndex] = `<span class="highlighted-line">${lines[lineIndex]}</span>`;
    }
    codeDisplay.innerHTML = lines.join('\n');
  }
  
  // 只对指定行中的特定变量进行高亮（而不是在整个代码中查找）
  if (highlightInfo.line !== -1 && highlightInfo.variables.length > 0) {
    const lines = codeDisplay.innerHTML.split('\n');
    if (highlightInfo.line >= 1 && highlightInfo.line <= lines.length) {
      const lineIndex = highlightInfo.line - 1;
      let lineContent = lines[lineIndex];
      
      // 只对当前行中的变量进行高亮
      highlightInfo.variables.forEach(variable => {
        const regex = new RegExp(`(${variable})`, 'g');
        lineContent = lineContent.replace(regex, '<span class="highlighted-variable">$1</span>');
      });
      
      lines[lineIndex] = lineContent;
      codeDisplay.innerHTML = lines.join('\n');
    }
  }
}

// 更新信息面板
function updateInfo(description) {
  document.getElementById('operationInfo').textContent = description;
}

// 执行下一步动画
function nextStep() {
  if (animationState.step < animationSteps.length - 1) {
    const step = animationSteps[animationState.step];
    step.action();
    highlightCode(step.highlight);
    updateInfo(step.description);
    animationState.step++;
    
    // 显示下一步的信息
    if (animationState.step < animationSteps.length) {
      const nextStep = animationSteps[animationState.step];
      highlightCode(nextStep.highlight);
      updateInfo(nextStep.description);
    }
  } else if (animationState.step === animationSteps.length - 1) {
    // 执行最后一步
    const step = animationSteps[animationState.step];
    step.action();
    highlightCode(step.highlight);
    updateInfo(step.description);
    animationState.step++;
  }
  
  updateButtonStates();
}

// 执行上一步动画
function prevStep() {
  if (animationState.step > 0) {
    animationState.step--;
    resetAnimationToStep(animationState.step);
  }
  
  updateButtonStates();
}

// 重置动画到指定步骤
function resetAnimationToStep(stepNum) {
  // 重置到初始状态
  initializeAnimation();
  
  // 重新执行到指定步骤
  for (let i = 0; i < stepNum; i++) {
    const step = animationSteps[i];
    step.action();
  }
  
  // 高亮当前步骤
  if (stepNum < animationSteps.length) {
    highlightCode(animationSteps[stepNum].highlight);
    updateInfo(animationSteps[stepNum].description);
  }
}

// 更新按钮状态
function updateButtonStates() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const playBtn = document.getElementById('playBtn');
  
  // 上一步按钮状态
  prevBtn.disabled = (animationState.step <= 0);
  
  // 下一步按钮状态
  nextBtn.disabled = (animationState.step >= animationSteps.length);
  
  // 播放按钮状态
  playBtn.disabled = animationState.isPlaying || (animationState.step >= animationSteps.length);
}

// 事件监听器
document.addEventListener('DOMContentLoaded', () => {
  // 初始化代码显示
  document.getElementById('codeDisplay').textContent = codeLines.join('\n');
  
  // 初始化动画
  initializeAnimation();

  // 绑定按钮事件
  document.getElementById('playBtn').addEventListener('click', startAnimation);
  document.getElementById('pauseBtn').addEventListener('click', pauseAnimation);
  document.getElementById('resetBtn').addEventListener('click', resetAnimation);
  document.getElementById('prevBtn').addEventListener('click', prevStep);
  document.getElementById('nextBtn').addEventListener('click', nextStep);

  // 速度选择事件
  document.getElementById('speedSelect').addEventListener('change', (e) => {
    animationState.speed = parseInt(e.target.value);
  });
  
  // 初始化按钮状态
  updateButtonStates();
});

// 开始动画
function startAnimation() {
  if (animationState.isPlaying) return;
  
  animationState.isPlaying = true;
  
  animationState.intervalId = setInterval(() => {
    nextStep();
    if (animationState.step >= animationSteps.length) {
      stopAnimation();
    }
  }, animationState.speed);
  
  updateButtonStates();
}

// 暂停动画
function pauseAnimation() {
  if (!animationState.isPlaying) return;
  
  clearInterval(animationState.intervalId);
  animationState.isPlaying = false;
  document.getElementById('playBtn').disabled = false;
}

// 停止动画
function stopAnimation() {
  clearInterval(animationState.intervalId);
  animationState.isPlaying = false;
  animationState.step = 0;
  document.getElementById('playBtn').disabled = false;
}

// 重置动画
function resetAnimation() {
  pauseAnimation();
  animationState.step = 0;
  
  // 重新初始化
  initializeAnimation();
  
  // 清除代码高亮
  const codeDisplay = document.getElementById('codeDisplay');
  codeDisplay.innerHTML = codeLines.join('\n');
  
  // 清除信息面板
  document.getElementById('operationInfo').textContent = '点击“播放动画”开始演示';
}

// 事件监听器
document.addEventListener('DOMContentLoaded', () => {
  // 初始化代码显示
  document.getElementById('codeDisplay').textContent = codeLines.join('\n');
  
  // 初始化动画
  initializeAnimation();
  
  // 绑定按钮事件
  document.getElementById('playBtn').addEventListener('click', startAnimation);
  document.getElementById('pauseBtn').addEventListener('click', pauseAnimation);
  document.getElementById('resetBtn').addEventListener('click', resetAnimation);
  
  // 速度选择事件
  document.getElementById('speedSelect').addEventListener('change', (e) => {
    animationState.speed = parseInt(e.target.value);
  });
});