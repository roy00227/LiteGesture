const rowsContainer = document.getElementById("gesture-rows");
const statusEl = document.getElementById("status");
const wheelInvertedCheckbox = document.getElementById("wheel-inverted");
const gestureButtonRow = document.getElementById("gesture-button-row");
const langSwitch = document.getElementById("lang-switch");

let currentLang = DEFAULT_UI_LANGUAGE;
let currentGestureMap = DEFAULT_GESTURE_MAP;

function t() {
  return TRANSLATIONS[currentLang];
}

// 言語切り替えボタンの見た目・状態を更新
function updateLangSwitchUI() {
  langSwitch.querySelectorAll("button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

langSwitch.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.lang === currentLang) return;

    // 保存前の未保存の選択を失わないよう、切り替え前に画面の状態を読み取っておく
    const snapshot = captureCurrentGestureMap();
    const selectedButton = getSelectedGestureButton();

    currentLang = btn.dataset.lang;
    chrome.storage.sync.set({ uiLanguage: currentLang });

    applyStaticTexts();
    buildRows(snapshot);
    buildGestureButtonRow(selectedButton);
  });
});

// 保存前の画面の選択状態を読み取ってジェスチャーコード→アクションのマップにする
// （言語切り替え時に再描画する際、未保存の入力内容を保つために使う）
function captureCurrentGestureMap() {
  const map = {};
  for (const row of rowsContainer.querySelectorAll("tr")) {
    const dir1Select = row.querySelector('select[data-role="dir1"]');
    const dir2Select = row.querySelector('select[data-role="dir2"]');
    if (!dir1Select) continue;
    const code = dir1Select.value + dir2Select.value;
    if (code) map[code] = dir1Select.dataset.actionId;
  }
  return map;
}

// 固定テキスト（タイトル・説明文・見出し・ボタン等）を現在の言語で反映
function applyStaticTexts() {
  const tr = t();
  document.title = tr.pageTitle;
  document.getElementById("page-title").textContent = tr.pageTitle;
  document.getElementById("page-note").innerHTML = tr.note.join("<br>");
  document.getElementById("th-action").textContent = tr.tableHeaders.action;
  document.getElementById("th-dir1").textContent = tr.tableHeaders.dir1;
  document.getElementById("th-dir2").textContent = tr.tableHeaders.dir2;
  document.getElementById("wheel-inverted-label").textContent = tr.wheelInvertLabel;
  document.getElementById("save").textContent = tr.saveButton;
  document.getElementById("reset").textContent = tr.resetButton;
  updateLangSwitchUI();
}

// ジェスチャーボタン（右クリック／左クリック）選択のラジオボタンを組み立てる
function buildGestureButtonRow(currentValue) {
  const tr = t();
  gestureButtonRow.innerHTML = "";

  for (const value of GESTURE_BUTTON_IDS) {
    const wrapperLabel = document.createElement("label");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "gesture-button";
    radio.value = value;
    radio.checked = value === currentValue;

    wrapperLabel.appendChild(radio);
    wrapperLabel.append(tr.gestureButtons[value]);
    gestureButtonRow.appendChild(wrapperLabel);
  }
}

function getSelectedGestureButton() {
  return gestureButtonRow.querySelector('input[name="gesture-button"]:checked')?.value || DEFAULT_GESTURE_BUTTON;
}

// gestureMap（ジェスチャーコード→アクション）から アクション→ジェスチャーコード を作る
function toActionToGesture(gestureMap) {
  const actionToGesture = {};
  for (const [code, actionId] of Object.entries(gestureMap)) {
    if (actionId) actionToGesture[actionId] = code;
  }
  return actionToGesture;
}

// 方向選択用の<select>を作る
function buildDirectionSelect(placeholder) {
  const select = document.createElement("select");

  const noneOption = document.createElement("option");
  noneOption.value = "";
  noneOption.textContent = placeholder;
  select.appendChild(noneOption);

  for (const [dirId, dirLabel] of Object.entries(DIRECTIONS)) {
    const option = document.createElement("option");
    option.value = dirId;
    option.textContent = dirLabel;
    select.appendChild(option);
  }

  return select;
}

// 1本目の選択に応じて2本目の候補を絞り込む（同じ方向の連続は成立しないため除外し、
// 1本目が未設定なら2本目も選べないようにする）
function refreshDir2Options(dir1Select, dir2Select) {
  const dir1Value = dir1Select.value;
  const prevDir2Value = dir2Select.value;

  dir2Select.disabled = !dir1Value;

  for (const option of dir2Select.options) {
    option.hidden = option.value !== "" && option.value === dir1Value;
  }

  if (!dir1Value || dir2Select.selectedOptions[0]?.hidden) {
    dir2Select.value = "";
  } else {
    dir2Select.value = prevDir2Value;
  }
}

// 行を組み立てる（アクションごとに1行、1本目・2本目の方向を選ぶ）
function buildRows(gestureMap) {
  const tr = t();
  rowsContainer.innerHTML = "";
  const actionToGesture = toActionToGesture(gestureMap);

  for (const actionId of ACTION_IDS) {
    const row = document.createElement("tr");

    const labelTd = document.createElement("td");
    labelTd.textContent = tr.actions[actionId];
    row.appendChild(labelTd);

    const code = actionToGesture[actionId] || "";
    const dir1Value = code[0] || "";
    const dir2Value = code[1] || "";

    const dir1Select = buildDirectionSelect(tr.dirPlaceholder);
    dir1Select.dataset.actionId = actionId;
    dir1Select.dataset.role = "dir1";
    dir1Select.title = tr.dir1Title;
    dir1Select.value = dir1Value;

    const dir2Select = buildDirectionSelect(tr.dirPlaceholder);
    dir2Select.dataset.actionId = actionId;
    dir2Select.dataset.role = "dir2";
    dir2Select.title = tr.dir2Title;

    refreshDir2Options(dir1Select, dir2Select);
    dir2Select.value = dir2Value;

    dir1Select.addEventListener("change", () => {
      refreshDir2Options(dir1Select, dir2Select);
      clearConflictHighlight();
    });
    dir2Select.addEventListener("change", clearConflictHighlight);

    const dir1Td = document.createElement("td");
    dir1Td.appendChild(dir1Select);
    row.appendChild(dir1Td);

    const dir2Td = document.createElement("td");
    dir2Td.appendChild(dir2Select);
    row.appendChild(dir2Td);

    rowsContainer.appendChild(row);
  }
}

function clearConflictHighlight() {
  rowsContainer.querySelectorAll("select.conflict").forEach((s) => s.classList.remove("conflict"));
}

function showStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b3261e" : "#2a7a2a";
  clearTimeout(showStatus._timer);
  showStatus._timer = setTimeout(() => { statusEl.textContent = ""; }, isError ? 4000 : 2000);
}

function loadSettings() {
  chrome.storage.sync.get(
    {
      gestureMap: DEFAULT_GESTURE_MAP,
      wheelInverted: DEFAULT_WHEEL_INVERTED,
      gestureButton: DEFAULT_GESTURE_BUTTON,
      uiLanguage: DEFAULT_UI_LANGUAGE,
    },
    (result) => {
      currentLang = result.uiLanguage;
      currentGestureMap = result.gestureMap;
      applyStaticTexts();
      buildRows(currentGestureMap);
      buildGestureButtonRow(result.gestureButton);
      wheelInvertedCheckbox.checked = result.wheelInverted;
    }
  );
}

document.getElementById("save").addEventListener("click", () => {
  clearConflictHighlight();

  const codeToEntries = new Map(); // code -> [{ actionId, selects }]

  for (const row of rowsContainer.querySelectorAll("tr")) {
    const dir1Select = row.querySelector('select[data-role="dir1"]');
    const dir2Select = row.querySelector('select[data-role="dir2"]');
    const code = dir1Select.value + dir2Select.value;
    if (!code) continue; // 未設定は保存対象外

    const actionId = dir1Select.dataset.actionId;
    if (!codeToEntries.has(code)) codeToEntries.set(code, []);
    codeToEntries.get(code).push({ actionId, selects: [dir1Select, dir2Select] });
  }

  let hasConflict = false;
  for (const entries of codeToEntries.values()) {
    if (entries.length > 1) {
      hasConflict = true;
      entries.forEach(({ selects }) => selects.forEach((s) => s.classList.add("conflict")));
    }
  }

  if (hasConflict) {
    showStatus(t().statusConflict, true);
    return;
  }

  const newGestureMap = {};
  for (const [code, entries] of codeToEntries) {
    newGestureMap[code] = entries[0].actionId;
  }
  currentGestureMap = newGestureMap;

  chrome.storage.sync.set(
    {
      gestureMap: newGestureMap,
      wheelInverted: wheelInvertedCheckbox.checked,
      gestureButton: getSelectedGestureButton(),
      uiLanguage: currentLang,
    },
    () => {
      showStatus(t().statusSaved);
    }
  );
});

document.getElementById("reset").addEventListener("click", () => {
  chrome.storage.sync.set(
    {
      gestureMap: DEFAULT_GESTURE_MAP,
      wheelInverted: DEFAULT_WHEEL_INVERTED,
      gestureButton: DEFAULT_GESTURE_BUTTON,
    },
    () => {
      currentGestureMap = DEFAULT_GESTURE_MAP;
      buildRows(currentGestureMap);
      wheelInvertedCheckbox.checked = DEFAULT_WHEEL_INVERTED;
      buildGestureButtonRow(DEFAULT_GESTURE_BUTTON);
      showStatus(t().statusReset);
    }
  );
});

loadSettings();
