/** 可搜索站点选择 — 读 BUS_DATA.stops，支持日/中/英/编号检索 */
const StopPicker = {
  groupOrder: ["miyanoura", "airport", "anbo", "east", "west", "nagata", "shiratani", "arakawa"],

  sortedIds() {
    return Object.keys(BUS_DATA.stops).sort((a, b) => {
      const sa = BUS_DATA.stops[a], sb = BUS_DATA.stops[b];
      const ga = this.groupOrder.indexOf(sa.group);
      const gb = this.groupOrder.indexOf(sb.group);
      if (ga !== gb) return ga - gb;
      return Number(sa.no) - Number(sb.no);
    });
  },

  ids(filterIds) {
    const all = this.sortedIds();
    if (!filterIds?.length) return all;
    const set = new Set(filterIds);
    return all.filter((id) => set.has(id));
  },

  label(id, lang) {
    const s = BUS_DATA.stops[id];
    if (!s) return "";
    return lang === "ja" ? s.ja : (lang === "zh" ? s.zh : s.en);
  },

  /** 输入框上方副行：主语言已在输入框；此处为其余语言（日/英/中），与主名去重 */
  altLine(id, lang) {
    const s = BUS_DATA.stops[id];
    if (!s) return "";
    const primary = this.label(id, lang);
    const order = lang === "ja" ? ["en"] : lang === "en" ? ["ja"] : ["ja", "en"];
    const seen = new Set([primary]);
    const parts = [];
    for (const key of order) {
      const v = s[key];
      if (v && !seen.has(v)) {
        parts.push(v);
        seen.add(v);
      }
    }
    return parts.join(" · ");
  },

  /** @deprecated 使用 altLine */
  subLabel(id, lang) {
    return this.altLine(id, lang);
  },

  /** 下拉列表：与输入框 altLine 一致 */
  listHint(id, lang) {
    return this.altLine(id, lang);
  },

  matches(id, q) {
    if (!q) return true;
    const s = BUS_DATA.stops[id];
    const ql = q.toLowerCase();
    const hay = [s.ja, s.zh, s.en, s.no, `#${s.no}`].join(" ").toLowerCase();
    if (hay.includes(ql)) return true;
    if (typeof AppCore === "undefined") return false;
    const cluster = AppCore.stopSearchCluster(id);
    return cluster.some((cid) => {
      if (cid === id) return false;
      const c = BUS_DATA.stops[cid];
      if (!c) return false;
      const ch = [c.ja, c.zh, c.en, c.no].join(" ").toLowerCase();
      return ch.includes(ql);
    });
  },

  groupLabel(groupId, lang) {
    const g = BUS_DATA.stopGroups?.[groupId];
    if (!g) return groupId;
    return lang === "ja" ? g.ja : (lang === "zh" ? g.zh : g.en);
  },

  mount({ root, hidden, subEl, lang, onChange, placeholder, filterIds }) {
    const input = root.querySelector(".picker-input");
    const list = root.querySelector(".picker-list");
    const listId = `picker-list-${Math.random().toString(36).slice(2, 9)}`;
    list.id = listId;
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-controls", listId);
    input.setAttribute("aria-expanded", "false");
    list.setAttribute("role", "listbox");

    let currentLang = lang;
    let selectedId = hidden.value || "";
    const touchPick = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const listIds = (q) => this.ids(filterIds).filter((id) => this.matches(id, q));

    if (touchPick) {
      input.readOnly = true;
      input.setAttribute("inputmode", "none");
      input.classList.add("picker-input-touch");
    }

    const syncDisplay = () => {
      input.value = selectedId ? this.label(selectedId, currentLang) : "";
      if (subEl) {
        const sub = selectedId ? this.subLabel(selectedId, currentLang) : "";
        subEl.textContent = sub;
        subEl.hidden = !sub;
      }
      if (selectedId && typeof AppCore !== "undefined") {
        input.setAttribute("aria-label", AppCore.stopAriaLabel(selectedId, currentLang));
      } else {
        input.removeAttribute("aria-label");
      }
    };

    const setExpanded = (open) => {
      input.setAttribute("aria-expanded", open ? "true" : "false");
    };

    const setValue = (id, fire = true) => {
      if (!id || !BUS_DATA.stops[id]) return;
      selectedId = id;
      hidden.value = id;
      input.placeholder = placeholder || "";
      syncDisplay();
      closeList();
      if (fire && onChange) onChange(id);
    };

    const closeList = () => {
      list.hidden = true;
      root.classList.remove("is-open");
      setExpanded(false);
      resetListFloat();
      window.removeEventListener("scroll", onListReflow, true);
      window.removeEventListener("resize", onListReflow);
      window.visualViewport?.removeEventListener("resize", onListReflow);
      window.visualViewport?.removeEventListener("scroll", onListReflow);
    };

    const resetListFloat = () => {
      list.classList.remove("is-floating");
      list.style.position = list.style.left = list.style.right = "";
      list.style.top = list.style.bottom = list.style.width = "";
      list.style.maxHeight = list.style.zIndex = "";
    };

    const floatList = () => {
      const vv = window.visualViewport;
      const r = input.getBoundingClientRect();
      const gap = 4;
      const margin = 8;
      const viewTop = vv?.offsetTop ?? 0;
      const viewLeft = vv?.offsetLeft ?? 0;
      const viewHeight = vv?.height ?? window.innerHeight;
      const viewWidth = vv?.width ?? window.innerWidth;
      const spaceBelow = viewTop + viewHeight - r.bottom - gap - margin;
      const spaceAbove = r.top - viewTop - gap - margin;
      const preferBelow = spaceBelow >= 120 || spaceBelow >= spaceAbove;
      const maxH = Math.min(viewHeight * 0.48, 300, preferBelow ? spaceBelow : spaceAbove);

      list.classList.add("is-floating");
      list.style.position = "fixed";
      list.style.left = `${Math.max(viewLeft + margin, Math.min(r.left, viewLeft + viewWidth - r.width - margin))}px`;
      list.style.width = `${Math.min(r.width, viewWidth - margin * 2)}px`;
      list.style.maxHeight = `${Math.max(120, maxH)}px`;
      list.style.zIndex = "120";
      if (preferBelow) {
        list.style.top = `${r.bottom + gap}px`;
        list.style.bottom = "auto";
      } else {
        list.style.top = "auto";
        list.style.bottom = `${viewTop + viewHeight - r.top + gap}px`;
      }
    };

    const bindListReflow = () => {
      window.addEventListener("scroll", onListReflow, true);
      window.addEventListener("resize", onListReflow);
      window.visualViewport?.addEventListener("resize", onListReflow);
      window.visualViewport?.addEventListener("scroll", onListReflow);
    };

    const onListReflow = () => {
      if (!list.hidden) floatList();
    };

    const openList = (q = "") => {
      renderList(q);
      root.classList.add("is-open");
      floatList();
      bindListReflow();
    };

    const beginBrowse = () => {
      if (touchPick) {
        openList("");
        return;
      }
      const current = selectedId ? this.label(selectedId, currentLang) : "";
      input.value = "";
      input.placeholder = current || placeholder || "";
      openList("");
    };

    const renderList = (q) => {
      const query = (q || "").trim();
      const ids = listIds(query);
      if (!ids.length) {
        list.innerHTML = `<li class="picker-empty" role="presentation">${currentLang === "zh" ? "无匹配站点" : currentLang === "en" ? "No stops found" : "該当なし"}</li>`;
        list.hidden = false;
        root.classList.add("is-open");
        floatList();
        return;
      }
      let lastGroup = null;
      const rows = [];
      ids.forEach((id) => {
        const s = BUS_DATA.stops[id];
        if (s.group !== lastGroup) {
          lastGroup = s.group;
          rows.push(`<li class="picker-group" role="presentation">${this.groupLabel(s.group, currentLang)}</li>`);
        }
        const name = this.label(id, currentLang);
        const hint = this.listHint(id, currentLang);
        const active = id === selectedId ? " active" : "";
        const hintHtml = hint
          ? `<span class="picker-hint">${hint}</span>` : "";
        const aria = typeof AppCore !== "undefined" ? AppCore.stopAriaLabel(id, currentLang) : name;
        rows.push(`<li role="option" data-id="${id}" class="picker-option${active}" aria-selected="${id === selectedId}" aria-label="${aria.replace(/"/g, "&quot;")}">
          <span class="picker-no">${s.no}</span>
          <span class="picker-body">
            ${hintHtml}
            <span class="picker-name">${name}</span>
          </span>
        </li>`);
      });
      list.innerHTML = rows.join("");
      list.hidden = false;
      root.classList.add("is-open");
      setExpanded(true);
      if (list.classList.contains("is-floating") || root.classList.contains("is-open")) floatList();
    };

    const pickFromInput = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) {
        syncDisplay();
        return;
      }
      const exact = listIds("").filter((id) => {
        const s = BUS_DATA.stops[id];
        return [s.ja, s.zh, s.en, s.no].some((x) => String(x).toLowerCase() === q);
      });
      if (exact.length === 1) {
        setValue(exact[0]);
        return;
      }
      const partial = listIds(q);
      if (partial.length === 1) setValue(partial[0]);
      else syncDisplay();
    };

    input.placeholder = placeholder || "";
    if (selectedId) syncDisplay();

    input.addEventListener("pointerdown", (e) => {
      if (list.hidden) {
        e.preventDefault();
        beginBrowse();
        if (!touchPick) input.focus({ preventScroll: true });
      }
    });
    input.addEventListener("focus", () => {
      if (touchPick) {
        input.blur();
        return;
      }
      if (list.hidden) beginBrowse();
    });
    input.addEventListener("input", () => {
      if (touchPick) return;
      renderList(input.value);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeList();
        input.placeholder = placeholder || "";
        syncDisplay();
        input.blur();
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const first = list.querySelector("li.picker-option");
        if (first) setValue(first.dataset.id);
        else pickFromInput();
      }
    });
    input.addEventListener("blur", () => {
      if (touchPick) return;
      setTimeout(() => {
        input.placeholder = placeholder || "";
        pickFromInput();
        closeList();
      }, 150);
    });

    list.addEventListener("mousedown", (e) => {
      const li = e.target.closest("li.picker-option");
      if (!li) return;
      e.preventDefault();
      setValue(li.dataset.id);
    });
    list.addEventListener("click", (e) => {
      if (!touchPick) return;
      const li = e.target.closest("li.picker-option");
      if (!li) return;
      e.preventDefault();
      setValue(li.dataset.id);
    });

    document.addEventListener("click", (e) => {
      if (!root.contains(e.target)) closeList();
    });

    return {
      getValue: () => selectedId,
      setValue: (id, fire = true) => setValue(id, fire),
      setLang(newLang, ph) {
        currentLang = newLang;
        if (ph != null) input.placeholder = ph;
        syncDisplay();
      },
    };
  },
};
