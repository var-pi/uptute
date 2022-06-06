mounted();

async function mounted() {
  addListeners();
  const localeIdArr = await getIdArr();
  const localeArr = await getLocaleArr(localeIdArr);
  fillWrapper(localeArr);
  collapsDropdowns();

  function addListeners() {
    document
      .querySelector("#header button#download")
      .addEventListener("click", onDownloadClick);

    function onDownloadClick(e) {
      compileJSONs().forEach((json, id) => createAFile({ json, id }));

      function createAFile({ json, id }) {
        const element = document.createElement("a");
        element.setAttribute(
          "href",
          "data:application/json;charset=utf-8," + encodeURIComponent(json)
        );
        element.setAttribute("download", localeIdArr[id]);

        element.style.display = "none";
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      }
    }
  }
  async function getIdArr() {
    return ["en", "est"];
  }
  async function getLocaleArr(localeIdArr) {
    return await Promise.all(
      localeIdArr.map(async (id) => await getLocale(id))
    );
    async function getLocale(id) {
      return await fetch(`../${id}.json`).then((r) => r.json());
    }
  }
  function fillWrapper(data) {
    if (!ifObjKeysSame(data))
      return new Error("Some keys of locale objects were not identical");

    renderLayer({
      layer: data[0],
      path: "",
      parent: document.getElementById("wrapper"),
      arr: data,
    });

    function ifObjKeysSame(data) {
      return true; // TODO !!
    }
    function renderLayer({ layer, path, parent, arr }) {
      var table = null;
      if (Object.values(layer).some((el) => typeof el == "string"))
        table = createTag({ parent, name: "table" });
      for (const key in layer) {
        if (typeof layer[key] == "string")
          createInputRow({ path: `${path}.${key}`, parent: table, arr });
        else {
          const dropdown = createDropdown({ parent, key });
          renderLayer({
            layer: layer[key],
            path: `${path}.${key}`,
            parent: dropdown,
            arr,
          });
        }
      }
      function createInputRow({ path, parent, arr }) {
        var tr = createTag({ parent, name: "tr" });
        createTds({ path, parent: tr, arr });

        function createTds({ path, parent, arr }) {
          createCell({ innerHTML: getKey(path), tag: "p" });
          arr.forEach((locale) => {
            const value = getValue({ locale, path });
            createCell({ value, tag: "input" });
          });

          function createCell({ value = null, innerHTML = null, tag }) {
            var td = createTag({ parent, name: "td" });
            createTag({
              parent: td,
              name: tag,
              type: "text",
              value,
              innerHTML,
              classes: ["cell"],
            });
          }
          function getValue({ locale, path }) {
            return getByPath(locale, path.substring(1));
          }
          function getKey(path) {
            return path.split(".").at(-1);
          }
        }
      }
      function createDropdown({ parent, key }) {
        const wrapper = createTag({ parent, classes: ["dropdown"] });
        const button = createTag({
          parent: wrapper,
          name: "button",
          type: "button",
          textContent: key,
          classes: ["button"],
        });
        const content = createTag({
          parent: wrapper,
          classes: ["content", "open"],
        });
        button.dropdownContent = content;
        button.addEventListener("click", onClick);
        return content;

        function onClick(e) {
          const content = e.target.dropdownContent;
          content.classList.toggle("open");
          if (content.classList.contains("open")) expand(content);
          else collapse(content);

          function expand(content) {
            content.style.maxHeight = `${content.getAttribute(
              "maxHeightVar"
            )}px`;
            content.style.transform = "scaleY(1)";
          }
          function collapse(content) {
            content.style.maxHeight = "0px";
            content.style.transform = "scaleY(0)";
          }
        }
      }
    }
  }
  function collapsDropdowns() {
    setMaxHeightVars();
    triggerClicks();
    toggleTransitionOn();

    function setMaxHeightVars() {
      document
        .querySelectorAll(".dropdown .content")
        .forEach((el) => setMaxHeightVar(el));

      function setMaxHeightVar(el) {
        el.setAttribute("maxHeightVar", el.getBoundingClientRect().height);
      }
    }
    function triggerClicks() {
      document
        .querySelectorAll(".dropdown .button")
        .forEach((el) => el.dispatchEvent(new Event("click")));
    }
    function toggleTransitionOn() {
      document
        .querySelectorAll(".dropdown .content")
        .forEach((el) => el.classList.add("ifWithTransition"));
    }
  }
  function compileJSONs() {
    const wrapper = document.querySelector("#wrapper");
    const localesArr = readLayer({ parent: wrapper });
    return convertToJSON(localesArr);

    function readLayer({ parent }) {
      return [...parent.childNodes].reduce(
        (arr, child) => concat({ child, arr }),
        getBaseArr()
      );

      function concat({ child, arr }) {
        const childArr = readChild({ child });
        for (let i = 0; i < childArr.length; i++)
          for (const [key, value] of childArr[i].entries())
            arr[i].set(key, value);

        return arr;

        function readChild({ child }) {
          if (child.tagName == "TABLE") return readTable(child);
          else return readDropdown(child);

          function readTable(child) {
            const arr = [...child.childNodes].map((tr) => readTr(tr));
            return format(arr);

            function readTr(tr) {
              return [...tr.childNodes].map((td) => readTd(td));

              function readTd(td) {
                const cell = td.childNodes[0];
                var map = new Map();
                if (cell.tagName == "INPUT") {
                  map.set("val", cell.value);
                  map.set("isKey", false);
                  return map;
                } else {
                  map.set("val", cell.innerHTML);
                  map.set("isKey", true);
                  return map;
                }
              }
            }
            function format(arr) {
              const newArr = getBaseArr();
              arr.forEach((row) => {
                const key = row
                  .find((el) => el.get("isKey") == true)
                  .get("val");

                const valArr = row
                  .filter((el) => el.get("isKey") == false)
                  .map((el) => el.get("val"));

                for (let j = 0; j < newArr.length; j++)
                  newArr[j].set(key, valArr[j]);
              });
              return newArr;
            }
          }
          function readDropdown(child) {
            const arr = getBaseArr();
            var keyName = null;
            var childArr = [];
            child.childNodes.forEach((child) => {
              if (child.tagName == "BUTTON") keyName = child.textContent;
              else childArr = readLayer({ parent: child });
            });

            for (let i = 0; i < arr.length; i++)
              arr[i].set(keyName, childArr[i]);

            return arr;
          }
        }
      }
    }
    function convertToJSON(localesArr) {
      const nestedArrs = localesArr.map((map) => toNestedArrs(map));
      return nestedArrs.map((nestedArr) => toJSONs(nestedArr));

      function toNestedArrs(map) {
        const arr = [];
        for (const [key, value] of map) {
          if (typeof value == "string") arr.push([key, value]);
          else arr.push([key, toNestedArrs(value)]);
        }
        return arr;
      }
      function toJSONs(nestedArr) {
        return `{${formatLayer(nestedArr)}}`;

        function formatLayer(layer) {
          const res = [...layer].reduce((pr, cur) => {
            if (typeof cur[1] == "string") return pr + JSONformat(cur);
            else return `${pr}"${cur[0]}":{${formatLayer(cur[1])}},`;
          }, "");
          return res.slice(0, -1);
        }

        function JSONformat(arr) {
          arr = arr.map((word) => word.replaceAll('"', '\\"'));
          arr = arr.map((word) => `\"${word}\"`);
          var str = arr.join(":");
          str = `${str},`;
          return str;
        }
      }
    }
  }
  function getBaseArr() {
    var arr = new Array(localeIdArr.length);
    for (let i = 0; i < arr.length; i++) arr[i] = new Map();
    return arr;
  }
}

function createTag({
  parent,
  name = "div",
  type = null,
  value = null,
  textContent = null,
  innerHTML = null,
  classes = [],
}) {
  const el = document.createElement(name);
  if (type) el.type = type;
  if (value) el.value = value;
  if (textContent) el.textContent = textContent;
  if (innerHTML) el.innerHTML = innerHTML;
  classes.forEach((name) => el.classList.add(name));
  parent.appendChild(el);
  return el;
}
function getByPath(obj, path) {
  return path.split(".").reduce((pr, cur) => pr[cur], obj);
}
