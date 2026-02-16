// 子要素のプロパティ名を取得する
  const getChildKey = () => {
  // const entryId = getJsonValue("entryId");
  const entryId = "auto-3";
  const parentKey =getJsonValue(`${entryId}.triggers`)
  const childKey = Object.keys(parentKey)[0];
  return childKey;
  }
  getChildKey();

  const renderTriggerButton = () => {
    // const entryId = getJsonValue("entryId");
    const entryId = "auto-2";
    const parentKey = getJsonValue(`${entryId}.triggers`);
    const childKey = Object.keys(parentKey)[0];
    const targetButton = document.querySelector(
      `.js-trigger-event[data-app-key="${childKey}"]`
    );
    targetButton.classList.add("active");
    targetButton.setAttribute("aria-pressed", "true");
  };
renderTriggerButton();

// プロパティを排他的に処理する
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".js-trigger-event");
    if (!btn) return;
    const trigger = btn.dataset.appKey;


    const entryId = getJsonValue("entryId");
    const parentKey = getJsonValue(`${entryId}.triggers`);
    const childKey = Object.keys(parentKey)[0];
    console.log(entryId);

    setJsonValue(`${entryId}.triggers`, `{${trigger}: {}}`);
  });