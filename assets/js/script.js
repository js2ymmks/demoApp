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
