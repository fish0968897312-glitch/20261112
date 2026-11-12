// 宣告全域變數
let stopSprite, runSprite;

// 靜止狀態（stop）的精靈圖規格：寬 613, 高 155, 共 6 張
const STOP_SHEET_WIDTH = 613;
const STOP_SHEET_HEIGHT = 155;
const STOP_FRAMES = 6;
const STOP_FRAME_W = STOP_SHEET_WIDTH / STOP_FRAMES;

// 移動狀態（run）的精靈圖規格：寬 757, 高 150, 共 7 張
const RUN_SHEET_WIDTH = 757;
const RUN_SHEET_HEIGHT = 150;
const RUN_FRAMES = 7;
const RUN_FRAME_W = RUN_SHEET_WIDTH / RUN_FRAMES;

// 動畫與角色狀態變數
let currentFrame = 0;
let animationSpeed = 6; // 動畫播放速度
let characterState = 'stop'; // 目前狀態：'stop' 或 'run'
let direction = 1; // 角色朝向：1 代表面向右側，-1 代表面向左側

// 角色位置與移動變數
let posX, posY;
let targetHeight;
let moveSpeed = 5; // 移動速度

// preload 函式會在 setup 執行前預先載入兩組精靈圖檔案
function preload() {
  // 從根目錄的 1 資料夾載入圖片
  stopSprite = loadImage('/1/stop/stop.png');
  runSprite = loadImage('/1/run/run.png');
}

// setup 函式在程式啟動時執行一次，初始化畫布與位置
function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  // 初始化角色位置在畫面 2/3 處
  posX = width * (2 / 3);
}

// draw 函式每秒重複 60 次，負責更新畫面與動作
function draw() {
  // 設定背景顏色為天空藍色
  background(135, 206, 235);

  // 計算角色顯示的高度（畫布高度的 1/3）
  targetHeight = height / 3;

  // 根據目前狀態決定要使用哪一張精靈圖、總幀數與單張寬高
  let activeSprite, totalFrames, frameW, frameH;
  if (characterState === 'run') {
    activeSprite = runSprite;
    totalFrames = RUN_FRAMES;
    frameW = RUN_FRAME_W;
    frameH = RUN_SHEET_HEIGHT;
  } else {
    activeSprite = stopSprite;
    totalFrames = STOP_FRAMES;
    frameW = STOP_FRAME_W;
    frameH = STOP_SHEET_HEIGHT;
  }

  // 計算等比例縮放的寬度
  let scaleRatio = targetHeight / frameH;
  let targetWidth = frameW * scaleRatio;

  // 角色 Y 座標（底部貼齊畫布最底端）
  posY = height - (targetHeight / 2);

  // 鍵盤按下持續移動的邏輯
  if (keyIsDown(RIGHT_ARROW)) {
    characterState = 'run';
    direction = 1; // 面向右
    posX += moveSpeed; // 往右移動
    // 限制不超過畫布最右端（扣除半個角色寬度）
    if (posX > width - (targetWidth / 2)) {
      posX = width - (targetWidth / 2);
      characterState = 'stop'; // 抵達邊界停止移動，切回原地動畫
    }
  } else if (keyIsDown(LEFT_ARROW)) {
    characterState = 'run';
    direction = -1; // 面向左
    posX -= moveSpeed; // 往左移動
    // 限制不超過畫布最左端（加上半個角色寬度）
    if (posX < targetWidth / 2) {
      posX = targetWidth / 2;
      characterState = 'stop'; // 抵達邊界停止移動，切回原地動畫
    }
  }

  // 計算目前精靈圖裁切的 X 座標
  let sourceX = currentFrame * frameW;

  // 繪製角色（支援左右鏡頭翻轉）
  push();
  translate(posX, posY); // 將畫布原點移至角色中心
  scale(direction, 1); // 透過 scale 做水平翻轉（若 direction 為 -1 則左右相反）

  if (activeSprite && activeSprite.width > 0) {
    image(
      activeSprite,
      0,
      0,
      targetWidth,
      targetHeight,
      sourceX,
      0,
      frameW,
      frameH
    );
  }
  pop();

  // 控制動畫影格切換速度
  if (frameCount % animationSpeed === 0) {
    currentFrame = (currentFrame + 1) % totalFrames;
  }
}

// 當放開方向鍵時，自動切回停止（stop）狀態
function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    characterState = 'stop';
    currentFrame = 0; // 重置影格
  }
}

// 視窗大小改變時自動調整畫布
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}