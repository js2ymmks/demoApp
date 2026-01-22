/******************************************
 * テンプレートファイル読み込み
 ******************************************/
Promise.all([
  fetch("../../partials/header.txt").then((r) => r.text()),
  fetch("../../partials/date.html").then((r) => r.text()),
  fetch("../../partials/footer.txt").then((r) => r.text()),
  fetch("../../partials/modal.html").then((r) => r.text()),
  fetch("../../partials/drower-menu.txt").then((r) => r.text()),
])
  .then(([headerHtml, dateHtml, footerHtml, modalHtml, drawerHtml]) => {
    document.querySelector(".content-header").innerHTML = headerHtml;
    document.querySelector(".content-date").innerHTML = dateHtml;
    document.querySelector(".content-footer").innerHTML = footerHtml;
    document.querySelector(".content-modal").innerHTML = modalHtml;
    document.querySelector(".content-drawer").innerHTML = drawerHtml;
  })
  .catch((err) => {
    console.error("Failed to load partials:", err);
  });

/******************************************
 * JSON取得（ブラケット版）
 ******************************************/
const getJsonValue = (propertyPath) => {
  const storedJson = sessionStorage.getItem("appData");
  let data;

  try {
    data = storedJson ? JSON.parse(storedJson) : null;
  } catch (e) {
    data = null;
  }

  if (!data) return undefined;

  // ブラケット → ドット記法
  const normalizedPath = propertyPath.replace(/\[(\d+)\]/g, ".$1");

  const props = normalizedPath.split(".");
  let current = data;

  for (let prop of props) {
    if (current[prop] === undefined) return undefined;
    current = current[prop];
  }

  return current;
};

/******************************************
 * JSON更新（ブラケット版）
 ******************************************/
const setJsonValue = (propertyPath, value) => {
  const storedJson = sessionStorage.getItem("appData");
  let data;

  try {
    data = storedJson ? JSON.parse(storedJson) : {};
  } catch (e) {
    data = {};
  }

  // ブラケット記法をドット記法に変換
  // "buttons[0].label" → "buttons.0.label"
  const normalizedPath = propertyPath.replace(/\[(\d+)\]/g, ".$1");

  const props = normalizedPath.split(".");
  let current = data;

  for (let i = 0; i < props.length - 1; i++) {
    const prop = props[i];

    // 数字 → 配列アクセス
    const index = Number(prop);
    const isIndex = !isNaN(index);

    if (isIndex) {
      if (!Array.isArray(current)) {
        current = [];
      }
      if (current[index] === undefined) {
        current[index] = {};
      }
      current = current[index];
    } else {
      if (!current[prop] || typeof current[prop] !== "object") {
        current[prop] = {};
      }
      current = current[prop];
    }
  }

  // 最終プロパティ
  const lastProp = props[props.length - 1];
  const lastIndex = Number(lastProp);

  if (!isNaN(lastIndex)) {
    if (!Array.isArray(current)) current = [];
    current[lastIndex] = value;
  } else {
    current[lastProp] = value;
  }

  sessionStorage.setItem("appData", JSON.stringify(data));
};

/******************************************
 * 無効ボタンをクリックしたときの処理
 ******************************************/
document.addEventListener("click", (e) => {
  // クリックされた要素、またはその親要素が指定のクラスを持っているか判定
  const target = e.target.closest(".demo-disabled-button");
  if (target) {
    e.preventDefault(); // リンクの遷移を止める
    alert("デモアプリではこのボタンは操作できません。");
  }
});

/******************************************
 * モーダル表示
 ******************************************/
const showModal = (modalId) => {
  const modalEl = document.getElementById(modalId);
  if (!modalEl) return;

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

/******************************************
 * ヘッダーのアイテムを設定する
 ******************************************/
window.addEventListener("load", () => {
  setTimeout(initHeader, 100);
});

function initHeader() {
// ==============================
// DOM取得
// ==============================
  const headerDom = {
    leftBtn: document.getElementById("headerLeftBtn"),
    title: document.getElementById("headerTitle"),
    rightBtn: document.getElementById("headerRightBtn"),
  };

  if (!headerDom.leftBtn || !headerDom.title || !headerDom.rightBtn) {
    console.warn("header DOM がまだ準備できていません");
    return;
  }

// ==============================
// headerSetBodyKeyキー取得
// ==============================
  const currentHeaderSetKey = document.body.dataset.appHeaderSet;
  if (!currentHeaderSetKey) {
    console.warn("data-app-header-set が指定されていません");
    return;
  }

// ==============================
// headerSetJson 取得
// ==============================
  const headerSetJson = getJsonValue(`headerSet.${currentHeaderSetKey}`);
  if (!headerSetJson) {
    console.warn(`headerSet.${currentHeaderSetKey} が見つかりません`);
    return;
  }

// ==============================
// タイトル
// ==============================
  headerDom.title.innerHTML = headerSetJson.title;

// ==============================
// 左ボタン
// ==============================
  renderLeftButton(headerSetJson.left?.type, headerDom.leftBtn);
  headerDom.leftBtn.onclick = () =>
    handleHeaderLeftAction(headerSetJson.left?.type);

// ==============================
// 右ボタン
// ==============================
  renderRightButton(headerSetJson.right, headerDom.rightBtn);
  headerDom.rightBtn.onclick = () =>
    handleHeaderRightAction(headerSetJson.right?.action); 
}

// ==============================
// 左ボタン描画
// ==============================
// リセット
function renderLeftButton(type, btn) {
  btn.innerHTML = "";
  btn.classList.remove("d-none");
  // アイコン設定
  switch (type) {
    case "back":
      btn.innerHTML = '<i class="bi bi-chevron-left"></i>';
      break;
    case "drawer":
      btn.innerHTML = '<i class="bi bi-list"></i>';
      break;
    default:
      btn.classList.add("d-none");
  }
}

// ==============================
// 左アクション処理
// ==============================
function handleHeaderLeftAction(type) {
  switch (type) {
    case "back":
      // document.addEventListener("DOMContentLoaded", syncToggleFromStorage);
      // window.addEventListener("pageshow", syncToggleFromStorage);
      window.history.back();
      window.addEventListener("pageshow", syncToggleFromStorage);
      break;

    case "drawer":
      const bsOffcanvas = new bootstrap.Offcanvas('#appOffcanvas');
      bsOffcanvas.show();
      break;
  }
}

// ==============================
// 右ボタン描画
// ==============================
function renderRightButton(headerSetJsonRight, headerDomRight) {
  // 右ボタンのプロパティチェック
  if (!headerSetJsonRight || !headerSetJsonRight.visible) {
    headerDomRight.classList.add("d-none");
    headerDomRight.onclick = null;
    return;
    headerDomRight.innerText = headerSetJsonRight.text || "";
  }
 // 右側のテキストボタン表示

  headerDomRight.innerText = headerSetJsonRight.text || "";
}

// ==============================
// 右アクション処理（完了/done | 設定/set | リンク/link | 編集/edit | 決定/ok）
// ==============================
function handleHeaderRightAction(action) {
  switch (action) {
    // JSON更新後、前の画面へ戻る
    case "done":
      window.history.back();
      break;

    // 電気代チェック画面へ遷移
    case "set":
      window.history.back();
      break;

    // 指定リンクへ遷移
    case "link":
      const rightBtn = document.getElementById('headerRightBtn');
      const target = getJsonValue('headerSet.electricityBillCheck.right.target');
      if (rightBtn) {
        rightBtn.href = target;
      }
      break;

    // 現在の画面が編集可能になるtouch-airflow-back
    case "edit":
      window.history.back();
      break;

    // タッチ気流、窓位置設定のポインターがロックされる
    case "ok":
      window.history.back();
      break;

    // アラート表示
    case "alert":
      alert('デモアプリではこのボタンは操作できません。＜ ボタンで戻ってください');
      break;

    // アラート表示
    case "touch-airflow-back":
      alert('風向を設定しました。やり直す場合は画像をダブルタップしてください。');
      break;
  }
}

/******************************************
 * 運転モード選択ボタン, 操作パネル表示処理
 ******************************************/
const driveModeSwitchBtnAndSettingPanelOperation = () => {
  let currentMode = getJsonValue("currentMode");
  document.getElementById("driveModeSwitchBtn").classList.add(getJsonValue(`driveModeSelectBtn.${currentMode}.style`));
  document.getElementById("currentModeLabel").innerText = getJsonValue(`driveModeSelectBtn.${currentMode}.label`);
  document.getElementById("currentModeIcon").src = getJsonValue(`driveModeSelectBtn.${currentMode}.icon`);
  document.getElementById("tempDisplay").className = getJsonValue(`driveModeSelectBtn.${currentMode}.settingDisplay`);
};

window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const footerButtons = document.querySelectorAll(".footer-button");
    footerButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        setJsonValue("currentPage", btn.dataset.appPage);
      });
    });
  }, 100);
});

/******************************************
 * フッターアイコン初期表示
 * アイコンをクリックするとページが切り替わるため、初期表示のみで対応
 ******************************************/
window.addEventListener("load", () => {
  setTimeout(() => {
    // 0. フッターが存在しない画面の処理
    const footerElement = document.getElementsByClassName("content-footer")[0];
    if (footerElement.className.includes("d-none")) {
      return;
    }

    // 1. リセット
    const currentPage = getJsonValue("currentPage");
    const footerButtons = document.querySelectorAll(".footer-button");
    footerButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    // 2. 初期表示
    footerButtons.forEach((btn) => {
      const page = btn.dataset.appPage;
      if (page === currentPage) {
        btn.classList.add("active");
      }
    });

    // 3. JSON更新
    footerButtons.forEach((btn) => {
      footerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          setJsonValue("currentPage", btn.dataset.appPage);
        });
      });
    });
  }, 100);
});

/******************************************
 * BS5 モーダルフォーカス解除
 ******************************************/
window.addEventListener("hide.bs.modal", () => {
  document.activeElement.blur();
});

/******************************************
 * トグルスイッチ関連
 ******************************************/

// JSONの値を取得⇒ ラベル表示更新
const renderToggleSwitchLabel = () => {
  getJsonValue("isThermalImageManagement")
    ? syncThermalImageManagement(true)
    : syncThermalImageManagement(false);
};

// DOM処理
const syncThermalImageManagement = (value) => {
  document.querySelectorAll(".js-toggle-switch").forEach(toggle => {
    // トグルスイッチの状態を更新
    toggle.checked = value;
    // ラベル表示を更新
    if (toggle.nextElementSibling) {
      toggle.nextElementSibling.innerText = value ? "ON" : "OFF";
    }
    // カードのリンクを更新
    const element = document.querySelector(".stretched-link-none");
    if(element) element.style.pointerEvents = value ? "auto" : "none";
  });
};

// 熱画像の表示⇔非表示の切り替え関数
const renderThermalImage = (value) => {
  const thermalImageElement = document.querySelector(".js-img");
  thermalImageElement.style.visibility = value ? "visible" : "hidden";
}

// その他機能画面を表示した時、タッチ気流トグルスイッチの状態を更新（AI自動以外はOFF）
// const renderTouchAirflowToggle = () => {
//   const isAiAuto = getJsonValue("currentMode").includes("ai-auto");
//   const btn = document.getElementById("toggleTouchAirflow");
//   if (isAiAuto) {
//     btn.checked = true;
//     btn.nextElementSibling.innerText = "ON";
//   } else {
//     btn.checked = false;
//     btn.nextElementSibling.innerText = "OFF";
//   }
// };

document.addEventListener("change", (event) => {
  // 変更された要素のIDを確認
  if (event.target && event.target.id === "toggleTouchAirflow") {
    const isAiAuto = getJsonValue("currentMode").includes("ai-auto");
    if (!isAiAuto) {
      event.target.checked = false; // 元に戻す
      event.target.nextElementSibling.innerText = "OFF";
      showModal("touchAirflowToggleModal");
    }
  }
});

/******************************************
 * レンダリング：その他機能画面
 ******************************************/
// タッチ気流トグルスイッチ
const renderTouchAirflowToggle = () => {
  const value = getJsonValue("isTouchAirflow")
  const btn = document.getElementById("toggleTouchAirflow");
  if (value) {
    btn.checked = true;
    btn.nextElementSibling.innerText = "ON";
  } else {
    btn.checked = false;
    btn.nextElementSibling.innerText = "OFF";
  }
};

/******************************************
 * レンダリング：熱画像管理画面
 * 熱画像トグルスイッチ
 ******************************************/
const renderThermalImageManagementToggle = () => {
  const value = getJsonValue("isThermalImageManagement")
  const btn = document.getElementById("thermalImageManagement");
  if (value) {
    btn.checked = true;
  } else {
    btn.checked = false;
  }
};


/******************************************
 * 操作：その他機能画面
 * タッチ気流トグルスイッチ
 * OFF → ON 熱画像管理がONでないとONにできない
 * ON → OFF そのままOFFにできる
 ******************************************/
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("toggleTouchAirflow");
  if (!btn) return;
  btn.addEventListener("change", (e) => {
    if (e.target.checked) {
      // OFF → ON
      const value = getJsonValue("isThermalImageManagement");
      if (!value) {
        showModal("touchAirflowToggleModal");
        e.target.checked = false; // トグルをOFFに戻す
        return;
      }
      setJsonValue("isTouchAirflow", true);
      renderTouchAirflowToggle();
    } else {
      // ON → OFF
      setJsonValue("isTouchAirflow", false);
      renderTouchAirflowToggle();
    }
  });
});

/******************************************
 * 操作：熱画像管理画面
 * 熱画像トグルスイッチ
 * OFF → ON そのままONにできる
 * ON → OFF タッチ気流トグルスイッチ（その他機能）のJSONをfalseにして、そのままOFFにする
 ******************************************/
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("thermalImageManagement");
  if (!btn) return;
  btn.addEventListener("change", (e) => {
    if (e.target.checked) {
      // OFF → ON
      setJsonValue("isThermalImageManagement", true);
      setJsonValue("isTouchAirflow", false); // タッチ気流を強制OFF
    } else {
      // ON → OFF
      setJsonValue("isThermalImageManagement", false);
    }
  });
});


/******************************************
 * 「停止中」表示
 ******************************************/
// 「停止中」を非表示
const elementsDisplayDefault = () => {
  const setValueDisplay = document.getElementById("setValueDisplay");
  const airControl = document.getElementById("airControl");
  const statusStopped = document.getElementById("statusStopped");
  // 各要素の表示・非表示を制御
  setValueDisplay.classList.remove("d-none");
  airControl.classList.remove("d-none");
  statusStopped.classList.add("d-none");
};

// 「停止中」を表示
const elementsDisplayNone = () => {
  const setValueDisplay = document.getElementById("setValueDisplay");
  const airControl = document.getElementById("airControl");
  const statusStopped = document.getElementById("statusStopped");
  // 各要素の表示・非表示を制御
  setValueDisplay.classList.add("d-none");
  airControl.classList.add("d-none");
  statusStopped.classList.remove("d-none");
};

const renderStatusStoppedEl = () => {
  const isRunning = getJsonValue("modalDrive.isRunning");
  if (isRunning) {
    elementsDisplayDefault();
  } else {
    elementsDisplayNone();
  }
};

/******************************************
 * スケジュール表示処理
 ******************************************/
// 曜日表示用マップ
const DAY_LABEL_MAP = {
  sun: "日",
  mon: "月",
  tue: "火",
  wed: "水",
  thu: "木",
  fri: "金",
  sat: "土",
};

// スケジュール表示テキスト取得関数（スケジュール 画面用）
function getScheduleText() {
  const dayOfTheWeek = getJsonValue("schedule[0].dayOfTheWeek");
  const activeDays = Object.entries(dayOfTheWeek)
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  // 何も選択されていない
  if (activeDays.length === 0) {
    return "一度だけ実行します";
  }

  // 全て選択
  if (activeDays.length === 7) {
    return "毎日実行します";
  }

  // 一部選択
  const labelText = activeDays
    .map(day => DAY_LABEL_MAP[day])
    .join("、");

  return `毎週${labelText}曜日に実行します`;
}

// スケジュール表示テキスト取得関数（スケジュール編集 画面用）
function getScheduleTextShort() {
  const dayOfTheWeek = getJsonValue("schedule[0].dayOfTheWeek");
  const activeDays = Object.entries(dayOfTheWeek)
    .filter(([, value]) => value === true)
    .map(([key]) => key);

  // 何も選択されていない
  if (activeDays.length === 0) {
    return null;
  }

  // 全て選択
  if (activeDays.length === 7) {
    return "毎日";
  }

  // 一部選択
  const labelText = activeDays
    .map(day => DAY_LABEL_MAP[day])
    .join("");

  return `${labelText}`;
}


// 表示アップデート 関数
function renderDayOfWeekToggle() {
  const dayOfTheWeek = getJsonValue("schedule[0].dayOfTheWeek");

  document.querySelectorAll(".day-of-the-week").forEach(button => {
    const dayKey = button.dataset.appScheduleDay; // sun, mon...

    if (dayOfTheWeek[dayKey]) {
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    }
  });

  updateScheduleText();
}

// トグルスイッチのクリックイベントをバインド 関数（JSON → トグル + 文言）
function bindDayOfWeekEvents() {
  document.querySelectorAll(".day-of-the-week").forEach(button => {
    button.addEventListener("click", () => {
      const dayKey = button.dataset.appScheduleDay;
      const isActive = button.classList.contains("active");

      const path = `schedule[0].dayOfTheWeek.${dayKey}`;
      setJsonValue(path, isActive);

      updateScheduleText();
    });
  });
}

// 文言更新のみ 関数
function updateScheduleText() {
  const textEl = document.getElementById("scheduleText");
  // スケジュール 画面用
  if (textEl) {
    textEl.innerText = getScheduleText();
  }
  // スケジュール編集 画面用
  setJsonValue("schedule[0].dayOfTheWeekLabel", getScheduleTextShort());
}

document.addEventListener('DOMContentLoaded', () => {
  const link = document.getElementById('transition-link');
  const myOffcanvasElement = document.getElementById('appOffcanvas');
  const bsOffcanvas = new bootstrap.Offcanvas(myOffcanvasElement);

  link.addEventListener('click', function (event) {
    // 1. 通常の遷移をキャンセル
    event.preventDefault();
    
    // 2. 遷移先のURLを取得
    const targetUrl = this.getAttribute('href');

    // 3. オフキャンバスが「完全に閉じた」後の処理を一度だけ登録
    myOffcanvasElement.addEventListener('hidden.bs.offcanvas', () => {
      window.location.href = targetUrl;
    }, { once: true }); // once: true で1回だけ実行

    // 4. オフキャンバスを閉じる
    bsOffcanvas.hide();
  });
});
