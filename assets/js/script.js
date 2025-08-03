// 保存（新規・上書き）
// function saveToSession(key, dataObj) {
//   try {
//     const jsonStr = JSON.stringify(dataObj);
//     sessionStorage.setItem(key, jsonStr);
//   } catch (e) {
//     console.error("JSONの保存に失敗しました:", e);
//   }
// }

// 取得（パース込み）
function getJsonValue(pathStr) {
  const storedData = sessionStorage.getItem("demoAppData");
  if (!storedData) return undefined;

  try {
    const obj = JSON.parse(storedData);
    const keys = pathStr.split(".");

    // path に沿って値をたどる
    return keys.reduce((acc, key) => acc?.[key], obj);
  } catch (e) {
    console.error("データの取得に失敗:", e);
    return undefined;
  }
}

// 更新（プロパティをマージして保存）
// function updateSessionData(key, updaterFn) {
//   const currentData = loadFromSession(key);
//   if (!currentData) {
//     console.warn("更新対象データが見つかりません:", key);
//     return false;
//   }

  // updaterFnで中身を書き換え
//   const updatedData = updaterFn(currentData);
//   saveToSession(key, updatedData);
//   return true;
// }

// 削除
// function removeFromSession(key) {
//   sessionStorage.removeItem(key);
// }



function showModal(message) {
  document.getElementById("modal-message").textContent = message;
  document.getElementById("modal-overlay").style.display = "block";
}

function hideModal() {
  document.getElementById("modal-overlay").style.display = "none";
}

const elementCheck = () => {
  const element = document.querySelector(".app_wrapper_main");
  console.log(`element`, element);
  if (element) {
    const siblings = Array.from(element.parentElement.children).filter(el => el !== element);
    console.log(`siblings`, siblings);
      

  } else {
    console.warn("要素が見つかりませんでした: .app_wrapper_main");
  }
};

//     用語
// 英語
// 説明
// 親要素
// parent element
// ある要素を直接囲んでいる上位の要素（例：<ul>は<li>の親）
// 子要素
// child element
// ある要素の内部に直接書かれている要素
// 祖先要素
// ancestor element
// 親・親の親…など、上位にあるすべての要素
// 兄弟要素
// sibling element
// 同じ親要素を持つ別の要素
