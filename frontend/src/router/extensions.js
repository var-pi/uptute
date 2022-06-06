/* EXAMPLE:
import SubRoute from "@src/...";
export default {
  name: "ChooseATutor",              // page's name; default - file's name
  path: "/choose_a_tutor",           // page's URL; default - modified name
  permisions: {                      // default - undefined
    roles: "USER",                   // redirects if roles not valid; can be array; default - "ALL"
    allowedOrigins: "FindATutor",    // redirects if last page not valid; can be array; default - undefined
    redirect: "FindATutor",          // default - "Home"
  },
  children: [                        // nested routes
    {
        compunent: SubRoute,
        path: "/sub_route",
        ...
    },
  ]
}

*/

export function createRoutes(prefix = "") {
  const context = require.context("@/views", true, /.vue$/);
  return context.keys().map((key) => {
    const component = context(key).default;
    const name = component.name ?? key.replace(/.\/|.vue/g, "");
    const path =
      prefix +
      (component.path ??
        name.replace(
          /^.|[A-Z]/g,
          (c, i) => (i === 0 ? "/" : "_") + c.toLowerCase()
        ));
    const meta = createMeta(component);
    const children = component.children;
    return { name, path, meta, component, children };
  });
}

function createMeta(component) {
  return {
    allowedOrigins: convertToPermisions(component.permisions?.allowedOrigins),
    allowedRoles: convertToPermisions(component.permisions?.roles),
    redirect: component.permisions?.redirect || "LogIn",
  };
}

function convertToPermisions(val) {
  return val == null ? ["ALL"] : Array.isArray(val) ? val : [val];
}

export function redirect(path, redirect) {
  return { path, redirect };
}

