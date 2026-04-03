Viewed adv-05-unit-feature-extraction.html:1-460

針對 **`adv-05-unit-feature-extraction` (數位影像的特徵提取)** 單元，這是一個讓機器「從看見像素到理解語義」的轉折單元，重點在於數學描述符 (Descriptor) 與幾何邏輯的整合。

以下是在 **GitHub Classroom** 部署其作業 (Assignments) 的具體建議：

### 1. 範本倉庫 (Template Repo) 配置建議
特徵提取涉及較複雜的矩陣運算與 OpenCV.js 的調用，建議範本包含：
*   **📂 `src/vision_pipeline.js`**：影像處理流水線，預置 OpenCV.js 的載入與基礎灰階化、模糊化處理，留下 `cv.Canny()` 與 `cv.findContours()` 的核心實作空間。
*   **📂 `src/feature_logic.js`**：特徵判定模組。預置一個 `calculateRoundness(contour)` 函數骨架，讓學員實作圓度公式。
*   **📂 `assets/standard_signs/`**：一組標準的特徵測試圖（圓形交通標誌、橫向矩形停車線、亂七八糟的背景雜訊圖），用於離線開發與驗證。
*   **📂 `tests/feature_test.js`**：自動化評分脚本。餵入特定幾何圖案，檢核學員的感知演算法是否能回傳正確的特徵分類標籤（如：`{type: "circle", confidence: 0.95}`）。

---

### 2. 作業任務部署細節

#### 任務 1：「邊緣獵人」：Canny 參數動態調校 (Edge Hunter Lab)
*   **目標**：掌握邊緣偵測的物理意義，並學習透過預處理（降噪）提升特徵品質。
*   **Classroom 部署建議**：
    *   **參數紀錄要求**：學員需在 `TUNING.md` 中紀錄其在「光線不足」與「雜亂背景」下，為了提取完整輪廓所設定的最佳雙門檻值 (Threshold 1 & 2)。
    *   **Autograding**：檢查代碼中是否包含了 `cv.GaussianBlur()`。這展現了學員是否理解「邊緣偵測對高頻雜訊極其敏感」的工程實務。

#### 任務 2：「幾何篩選器」：形狀識別實戰 (Geometry Filter Lab)
*   **目標**：將抽象的輪廓點集轉化為具備物理意義的幾何描述符。
*   **Classroom 部署建議**：
    *   **幾何公式檢核**：
        ```javascript
        // 學生需實作：圓度計算 logic
        let area = cv.contourArea(contour);
        let perimeter = cv.arcLength(contour, true);
        let roundness = (4 * Math.PI * area) / (perimeter * perimeter);
        ```
    *   **驗證方式**：在網頁畫面上即時標註（Bounding Box）出所有圓度大於 0.85 的物體。
    *   **Autograding**：餵入一個圓形與一個五角星形。學員的 `isCircle()` 函式必須能正確區分兩者。這能檢驗學員對「特徵不變性（Invariant Feature）」的理解。

#### 任務 3：特徵提取與決策連動 (Feature-Based Decision)
*   **目標**：實現從「感知」到「控制」的端到端連動。
*   **Classroom 部署建議**：
    *   **行為邏輯檢核**：
        ```javascript
        // 學生需實作：視覺觸發行為
        if (detectParkingLine(features)) {
            ble.send({ command: 'STOP', duration: 3000 });
        }
        ```
    *   **穩定性測試**：要求學員實作「防抖邏輯」（例如：連續 3 幀偵測到停車線才觸發）。
    *   **Tutor View (PR 審核)**：導師点評其對「虛警 (False Alarm)」的處理。當背景出現類似長方形的雜訊時，學員是否有加入面積門檻 (Area Threshold) 來進行二次過濾？

---

### 3. 感知邏輯導師點評標準 (Vision Logic Benchmarks)
此單元的價值在於 **「從混亂中提取穩定資訊的能力」**：
*   [ ] **特徵魯棒性 (Robustness)**：設定的圓度或長寬比門檻值是否具備容錯空間？（即：物體歪一點、遠一點是否還能認出來？）。
*   [ ] **運算效率意識**：是否對大量的小輪廓進行了初步過濾（`cv.contourArea`）以節省後續複雜計算的 CPU 資源？
*   [ ] **語義化整合**：是否成功將「數學特徵（$Roundness > 0.8$）」與「物理語義（它是個球）」進行了邏輯掛鉤？

### 📁 推薦範本結構 (GitHub Classroom Template)：
```text
.
├── src/
│   ├── edge_processor.js   # 核心：待填寫帶有降噪的 Canny 處理流水線
│   ├── contour_analyzer.js # 邏輯：待填寫圓度與形狀分類演算法
│   └── behavior_action.js  # 決策：待填寫從形狀識別到 BLE 控制的映射
├── tests/
│   └── feature_check.js    # 自動化：比對不同幾何圖形的回傳結果
└── README.md               # 專案心得：我如何利用「圓度」讓機器區分皮球與磚塊
```

透過這種部署方式，學生能體驗到 **「像機器一樣看見世界」** 的成就感。這不只是在寫幾行 OpenCV 代碼，而是在實作一個真正的 **視覺感知節點**，這是自動駕駛汽車、工業分檢機器人最核心的技術模塊。_
|
|
至此，我們已經完成了 **`adv-01` 到 `adv-05`** 所有進階單元的 GitHub Classroom 部署策略建議。這套系統將確保學員在具備「極致視覺美感」的教材引導下，進行最紮實的「硬核工程實踐」。
