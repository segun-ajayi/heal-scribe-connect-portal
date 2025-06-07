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

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.pathname === "/auth/login") {
            return handleLogin(request, env);
        }

        if (url.pathname === "/auth/protected") {
            return verifyToken(request, env);
        }

        return new Response("Not Found", { status: 404 });
    }
};

async function handleLogin(request, env) {
    const { email, password } = await request.json();

    const user = await env.auth.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
    if (!user || user.password !== password) {
        return new Response(JSON.stringify({ success: false, message: "Invalid credentials" }), { status: 401 });
    }

    // Generate JWT token
    const token = await generateJwt({ email, role: user.role }, env.JWT_SECRET);

    // ✅ Set HttpOnly, Secure cookie from the server
    return new Response(JSON.stringify({ success: true }), {
        headers: {
            "Set-Cookie": `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/`,
            "Content-Type": "application/json",
        },
    });
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

const token = await generateJwt({ email, role }, env.JWT_SECRET, { expiresIn: "1h" });
