/*
  app.js：核心逻辑文件
  负责：
  1) 加载 recipes.json 数据
  2) 根据用户选择进行筛选
  3) 把结果渲染到页面
  4) 处理 WHY 的展开/收起
*/

// 用于保存从 JSON 读取的所有菜谱
let recipes = [];

// 1) 加载数据（浏览器会发起请求读取 recipes.json 文件）
fetch('recipes.json')
  .then(res => res.json()) // 把返回的数据解析为 JSON
  .then(data => {
    recipes = data; // 存到全局变量，后面筛选用
    // 可选：页面加载完成后先显示全部
    render(recipes);
  });

// 2) 根据选择条件筛选
function search() {
  // 从下拉框读取当前选择的值
  const tech = document.getElementById('technique').value;
  const main = document.getElementById('main').value;

  // filter：对数组进行筛选，返回符合条件的新数组
  const filtered = recipes.filter(r => {
    return (!tech || r.technique === tech) &&  // 如果 tech 为空（不限）就放行
           (!main || r.main === main);
  });

  // 把筛选结果渲染到页面
  render(filtered);
}

// 3) 渲染结果列表
function render(list) {
  const container = document.getElementById('results');

  // 先清空旧内容
  container.innerHTML = '';

  // 遍历每个菜谱
  list.forEach(r => {
    const div = document.createElement('div');
    div.className = 'card';

    // innerHTML：直接用字符串生成 HTML
    div.innerHTML = `
      <h3>${r.name}</h3>
      <div class="steps">
        ${r.steps.map(step => renderStep(step)).join('')}
      </div>
    `;

    container.appendChild(div);
  });
}

// 4) 渲染单个步骤
function renderStep(step) {
  // 判断是否有 WHY（核心逻辑：有内容才显示箭头）
  const hasWhy = step.why && step.why.trim();

  // 有 WHY → 可点击展开
  if (hasWhy) {
    return `
      <div class="step clickable" onclick="toggleWhy(this)">
        ▶ ${step.text}
        <div class="why hidden">${step.why}</div>
      </div>
    `;
  } else {
    // 没 WHY → 普通文本（不可点击）
    return `<div class="step">${step.text}</div>`;
  }
}

// 5) 展开 / 收起 WHY
function toggleWhy(el) {
  const why = el.querySelector('.why');
  // 切换 hidden 类（控制显示/隐藏）
  why.classList.toggle('hidden');
}
