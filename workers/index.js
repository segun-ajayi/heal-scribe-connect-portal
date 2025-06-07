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

const corsHeaders = {
    "Access-Control-Allow-Origin": "https://heal-scribe-connect-portal.pages.dev", // ✅ Allow frontend
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
};

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // ✅ Handle CORS preflight requests
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: corsHeaders });
        }

        // ✅ Ensure all responses include CORS headers
        if (url.pathname === "/auth/login") {
            const response = await handleLogin(request, env);
            return addCorsHeaders(response);
        }

        if (url.pathname === "/auth/protected") {
            const response = await verifyToken(request, env);
            return addCorsHeaders(response);
        }

        return addCorsHeaders(new Response("Not Found", { status: 404 }));
    }
};

// ✅ Helper function to add CORS headers to responses
function addCorsHeaders(response) {
    const newHeaders = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => newHeaders.set(key, value));
    return new Response(response.body, { status: response.status, headers: newHeaders });
}


async function handleLogin(request, env) {
    try {
        const requestData = await request.json();
        console.log("Request Data:", requestData); // ✅ Debugging log

        if (!requestData || !requestData.email || !requestData.password) {
            return new Response(JSON.stringify({ success: false, message: "Missing credentials" }), { status: 400 });
        }

        // ✅ Debug D1 Database Query
        console.log(`Fetching user: ${requestData.email}`);
        const user = await env.auth.prepare("SELECT * FROM users WHERE email = ?").bind(requestData.email).first();

        console.log("User Found:", user); // ✅ Debugging log

        if (!user || user.password !== requestData.password) {
            return new Response(JSON.stringify({ success: false, message: "Invalid credentials" }), { status: 401 });
        }

        const token = await generateJwt({ email: requestData.email }, env.JWT_SECRET);
        return new Response(JSON.stringify({ success: true, token }), { status: 200 });
    } catch (error) {
        console.error("Login Error:", error);
        return new Response(JSON.stringify({ success: false, message: "Server error", error: error.toString() }), { status: 500 });
    }
}


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
    const signature = new Uint8Array([...atob(encodedSignature)].map(c => c.charCodeAt(0)));

    const isValid = await crypto.subtle.verify("HMAC", key, signature, encoder.encode(data));
    return isValid ? JSON.parse(atob(encodedPayload)) : null;
}

