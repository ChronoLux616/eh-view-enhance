import { SiteProfile, conf, saveConf } from "../config";
import { getMatchers } from "../platform/adapt";
import q from "../utils/query-element";
import relocateElement from "../utils/relocate-element";

function createInputElement(root: HTMLElement, anchor: HTMLElement, callback: (value: string) => void) {
  const element = document.createElement("div");
  element.style.position = "fixed";
  element.id = "input-element";
  element.innerHTML = `<input type="text" style="width:20em;height:2em;"><button class="ehvp-custom-btn-cover" style="border:none;height:2em;background-color:#7fef7b;margin-left:0.3em;color:white;font-weight:800;">√</button>`;
  root.appendChild(element);
  const input = element.querySelector("input");
  const button = element.querySelector("button");
  button!.addEventListener("click", () => {
    callback(input!.value);
    element.remove();
  });
  relocateElement(element, anchor, root.offsetWidth, root.offsetHeight);
}

function createWorkURLs(workURLs: string[], container: HTMLElement, onRemove: (vaule: string) => void) {
  const urls = workURLs.map(regex => `<div><span style="user-select: text;">${regex}</span><span class="ehvp-custom-btn-cover" data-value="${regex}" style="background-color:#fd5454;">&nbspx&nbsp</span></div>`);
  container.innerHTML = urls.join("");
  Array.from(container.querySelectorAll("div > span + span")).forEach(element => {
    element.addEventListener("click", () => {
      onRemove(element.getAttribute("data-value")!);
      element.parentElement!.remove();
    });
  });
}

export default function createExcludeURLPanel(root: HTMLElement) {
  const matchers = getMatchers();
  const listItems = matchers.map((matcher) => {
    const name = matcher.name();
    const id = "id-" + window.btoa(unescape(encodeURIComponent(name))).replaceAll("=", "-");
    const profile: SiteProfile | undefined = conf.siteProfiles[name];
    return `<li data-index="${id}" class="ehvp-custom-panel-list-item">
             <div style="display:flex;justify-content: space-between;">
               <div style="font-size: 1.2em;font-weight: 800;">${name}</div>
               <div>
                 <label><span>Enable: </span><input id="${id}-enable-checkbox" ${!profile?.disable ? "checked" : ""} type="checkbox"></label>
                 <label><span>Auto Open: </span><input id="${id}-enable-auto-open-checkbox" ${!profile?.disableAutoOpen ? "checked" : ""} type="checkbox"></label>
                 <label><span>Add Regexp: </span><span id="${id}-add-workurl" class="ehvp-custom-btn-cover" style="background-color:#7fef7b;">&nbsp+&nbsp</span></label>
               </div>
             </div>
             <div id="${id}-workurls"></div>
           </li>`;
  });
  const HTML_STR = `
<div class="ehvp-custom-panel">
  <div class="ehvp-custom-panel-title">
    <span>Site Profiles</span>
    <span id="ehvp-custom-panel-close" class="ehvp-custom-panel-close">✖</span>
  </div>
  <div class="ehvp-custom-panel-container">
    <div class="ehvp-custom-panel-content">
      <ul class="ehvp-custom-panel-list">
      ${listItems.join("")}
      </ul>
    </div>
  </div>
</div>
`;
  const fullPanel = document.createElement("div");
  fullPanel.classList.add("ehvp-full-panel");
  fullPanel.innerHTML = HTML_STR;
  fullPanel.addEventListener("click", (event) => {
    if ((event.target as HTMLElement).classList.contains("ehvp-full-panel")) {
      fullPanel.remove();
    }
  });
  root.appendChild(fullPanel);
  fullPanel.querySelector(".ehvp-custom-panel-close")!.addEventListener("click", () => fullPanel.remove());

  const siteProfiles = conf.siteProfiles;
  matchers.forEach(matcher => {
    const name = matcher.name();
    const id = "id-" + window.btoa(unescape(encodeURIComponent(name))).replaceAll("=", "-");
    const defaultWorkURLs = matcher.workURLs().map(u => u.source);

    const getProfile = () => {
      let profile = siteProfiles[name];
      if (!profile) {
        profile = { disable: false, disableAutoOpen: false, workURLs: [...defaultWorkURLs] };
        siteProfiles[name] = profile;
      }
      return profile;
    };
    // enable script on this site;
    const enableCheckbox = q<HTMLInputElement>(`#${id}-enable-checkbox`, fullPanel);
    enableCheckbox.addEventListener("click", () => {
      getProfile().disable = !enableCheckbox.checked;
      saveConf(conf);
    });
    // enable auto open on this site;
    const enableAutoOpenCheckbox = q<HTMLInputElement>(`#${id}-enable-auto-open-checkbox`, fullPanel);
    enableAutoOpenCheckbox.addEventListener("click", () => {
      getProfile().disableAutoOpen = !enableAutoOpenCheckbox.checked;
      saveConf(conf);
    });
    // add custom work url
    const addWorkURL = q(`#${id}-add-workurl`, fullPanel);
    const workURLContainer = q(`#${id}-workurls`, fullPanel);
    const removeWorkURL = (value: string, profile: SiteProfile) => {
      const index = profile.workURLs.indexOf(value);
      let changed = false;
      if (index > -1) {
        profile.workURLs.splice(index, 1);
        changed = true;
      }
      if (profile.workURLs.length === 0) {
        profile.workURLs = [...defaultWorkURLs];
        changed = true;
        createWorkURLs(defaultWorkURLs, workURLContainer, (value) => {
          removeWorkURL(value, getProfile());
        });
      }
      if (changed) saveConf(conf);
    };
    addWorkURL.addEventListener("click", () => {
      const background = document.createElement("div");
      background.addEventListener("click", (event) => event.target === background && background.remove());
      background.setAttribute("style", "position:absolute;width:100%;height:100%;");
      fullPanel.appendChild(background);
      createInputElement(background, addWorkURL, (value) => {
        if (!value) return;
        try {
          new RegExp(value);
        } catch (_) {
          return;
        }
        getProfile().workURLs.push(value);
        createWorkURLs(getProfile().workURLs, workURLContainer, (value) => {
          removeWorkURL(value, getProfile());
        });
      });
    });
    // init work urls to html
    let workURLs = defaultWorkURLs;
    if (siteProfiles[name] && siteProfiles[name].workURLs.length > 0) {
      workURLs = siteProfiles[name].workURLs;
    }
    createWorkURLs(workURLs, workURLContainer, (value) => {
      removeWorkURL(value, getProfile());
    });
  });
}
