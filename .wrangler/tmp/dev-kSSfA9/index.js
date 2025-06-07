var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-s1pH2l/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// workers/index.js
async function generateJwt(payload, secret) {
  const encoder = new TextEncoder();
  const secretKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = await crypto.subtle.sign(
    "HMAC",
    secretKey,
    encoder.encode(`${encodedHeader}.${encodedPayload}`)
  );
  return `${encodedHeader}.${encodedPayload}.${btoa(String.fromCharCode(...new Uint8Array(signature)))}`;
}
__name(generateJwt, "generateJwt");
var corsHeaders = {
  "Access-Control-Allow-Origin": "https://heal-scribe-connect-portal.pages.dev",
  // ✅ Allow frontend
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true"
};
var workers_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (url.pathname === "/auth/login") {
      const response = await handleLogin(request, env);
      return addCorsHeaders(response);
    }
    if (url.pathname === "/auth/protected") {
      const response = await verifyToken(request, env);
      return addCorsHeaders(response);
    }
    if (url.pathname === "/admin/stats") {
      const response = await handleAdminStats(request, env);
      return addCorsHeaders(response);
    }
    if (url.pathname === "/admin/appointments") {
      const response = await handleRecentAppointments(request, env);
      return addCorsHeaders(response);
    }
    if (url.pathname === "/admin/blog-posts") {
      const response = await handleRecentBlogPosts(request, env);
      return addCorsHeaders(response);
    }
    if (url.pathname === "/patient/appointments") {
      return handlePatientAppointments(request, env);
    }
    if (url.pathname === "/patient/medical-records") {
      return handlePatientMedicalRecords(request, env);
    }
    if (url.pathname === "/patient/profile") {
      return handlePatientProfile(request, env);
    }
    return addCorsHeaders(new Response("Not Found", { status: 404 }));
  }
};
function addCorsHeaders(response) {
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => newHeaders.set(key, value));
  return new Response(response.body, { status: response.status, headers: newHeaders });
}
__name(addCorsHeaders, "addCorsHeaders");
async function handleLogin(request, env) {
  try {
    const requestData = await request.json();
    console.log("Request Data:", requestData);
    if (!requestData || !requestData.email || !requestData.password) {
      return new Response(JSON.stringify({ success: false, message: "Missing credentials" }), { status: 400 });
    }
    console.log(`Fetching user: ${requestData.email}`);
    const user = await env.auth.prepare("SELECT * FROM users WHERE email = ?").bind(requestData.email).first();
    console.log("User Found:", user);
    if (!user || user.password !== requestData.password) {
      return new Response(JSON.stringify({ success: false, message: "Invalid credentials" }), { status: 401 });
    }
    const token = await generateJwt({ email: user.email, role: user.role }, env.JWT_SECRET);
    console.log("Generated Token Payload:", JSON.parse(atob(token.split(".")[1])));
    return new Response(JSON.stringify({ success: true, token }), { status: 200 });
  } catch (error) {
    console.error("Login Error:", error);
    return new Response(JSON.stringify({ success: false, message: "Server error", error: error.toString() }), { status: 500 });
  }
}
__name(handleLogin, "handleLogin");
async function verifyToken(request, env) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ success: false, message: "Missing token" }), { status: 401 });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decoded = await verifyJwt(token, env.JWT_SECRET);
    if (!decoded) {
      return new Response(JSON.stringify({ success: false, message: "Invalid token" }), { status: 403 });
    }
    return new Response(JSON.stringify({ success: true, user: decoded.email }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Token verification failed" }), { status: 403 });
  }
}
__name(verifyToken, "verifyToken");
async function verifyJwt(token, secret) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = new Uint8Array([...atob(encodedSignature)].map((c) => c.charCodeAt(0)));
  const isValid = await crypto.subtle.verify("HMAC", key, signature, encoder.encode(data));
  return isValid ? JSON.parse(atob(encodedPayload)) : null;
}
__name(verifyJwt, "verifyJwt");
async function handleAdminStats(request, env) {
  const totalPatients = await env.auth.prepare("SELECT COUNT(*) FROM users WHERE role = 'patient'").first();
  const todayAppointments = await env.auth.prepare("SELECT COUNT(*) FROM appointments WHERE date = CURRENT_DATE").first();
  const blogPosts = await env.auth.prepare("SELECT COUNT(*) FROM blog_posts").first();
  const publications = await env.auth.prepare("SELECT COUNT(*) FROM publications").first();
  const waitingList = await env.auth.prepare("SELECT COUNT(*) FROM waiting_list WHERE status = 'pending'").first();
  return new Response(
    JSON.stringify({
      totalPatients: totalPatients?.count || 0,
      todayAppointments: todayAppointments?.count || 0,
      blogPosts: blogPosts?.count || 0,
      publications: publications?.count || 0,
      waitingList: waitingList?.count || 0
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
__name(handleAdminStats, "handleAdminStats");
async function handleRecentAppointments(request, env) {
  const appointments = await env.auth.prepare("SELECT * FROM appointments WHERE date = CURRENT_DATE ORDER BY time ASC LIMIT 10").all();
  return new Response(JSON.stringify(appointments), { status: 200, headers: { "Content-Type": "application/json" } });
}
__name(handleRecentAppointments, "handleRecentAppointments");
async function handleRecentBlogPosts(request, env) {
  const blogPosts = await env.auth.prepare("SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 5").all();
  return new Response(JSON.stringify(blogPosts), { status: 200, headers: { "Content-Type": "application/json" } });
}
__name(handleRecentBlogPosts, "handleRecentBlogPosts");
async function handlePatientAppointments(request, env) {
  const appointments = await env.auth.prepare("SELECT * FROM appointments WHERE patient_id = ? ORDER BY date ASC").bind(request.headers.get("Authorization")).all();
  return new Response(JSON.stringify(appointments), { status: 200, headers: { "Content-Type": "application/json" } });
}
__name(handlePatientAppointments, "handlePatientAppointments");
async function handlePatientMedicalRecords(request, env) {
  const records = await env.auth.prepare("SELECT * FROM medical_records WHERE patient_id = ? ORDER BY record_date DESC").bind(request.headers.get("Authorization")).all();
  return new Response(JSON.stringify(records), { status: 200, headers: { "Content-Type": "application/json" } });
}
__name(handlePatientMedicalRecords, "handlePatientMedicalRecords");
async function handlePatientProfile(request, env) {
  const profile = await env.auth.prepare("SELECT * FROM profiles WHERE id = ?").bind(request.headers.get("Authorization")).first();
  return new Response(JSON.stringify(profile), { status: 200, headers: { "Content-Type": "application/json" } });
}
__name(handlePatientProfile, "handlePatientProfile");

// ../../../Users/Segun/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../Users/Segun/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-s1pH2l/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = workers_default;

// ../../../Users/Segun/AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-s1pH2l/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
