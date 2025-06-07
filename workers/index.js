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

        // ✅ Authentication Routes
        if (url.pathname === "/auth/login") {
            const response = await handleLogin(request, env);
            return addCorsHeaders(response);
        }
        if (url.pathname === "/auth/protected") {
            const response = await verifyToken(request, env);
            return addCorsHeaders(response);
        }

        // ✅ Admin Routes
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

        // ✅ Patient Routes
        if (url.pathname === "/patient/appointments") {
            return handlePatientAppointments(request, env);
        }
        if (url.pathname === "/patient/medical-records") {
            return handlePatientMedicalRecords(request, env);
        }
        if (url.pathname === "/patient/profile") {
            return handlePatientProfile(request, env);
        }

        // ✅ New Route: Fetch User Data
        if (url.pathname === "/me") {
            const response = await handleMe(request, env);
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

        // ✅ Include role in JWT
        const token = await generateJwt({ email: user.email, role: user.role }, env.JWT_SECRET);

        console.log("Generated Token Payload:", JSON.parse(atob(token.split(".")[1]))); // ✅ Log decoded JWT payload

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
            waitingList: waitingList?.count || 0,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}

async function handleRecentAppointments(request, env) {
    const appointments = await env.auth.prepare("SELECT * FROM appointments WHERE date = CURRENT_DATE ORDER BY time ASC LIMIT 10").all();
    return new Response(JSON.stringify(appointments), { status: 200, headers: { "Content-Type": "application/json" } });
}

async function handleRecentBlogPosts(request, env) {
    const blogPosts = await env.auth.prepare("SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 5").all();
    return new Response(JSON.stringify(blogPosts), { status: 200, headers: { "Content-Type": "application/json" } });
}

// ✅ Fetch patient appointments
async function handlePatientAppointments(request, env) {
    const appointments = await env.auth.prepare("SELECT * FROM appointments WHERE patient_id = ? ORDER BY date ASC")
        .bind(request.headers.get("Authorization"))
        .all();

    return new Response(JSON.stringify(appointments), { status: 200, headers: { "Content-Type": "application/json" } });
}

// ✅ Fetch patient medical records
async function handlePatientMedicalRecords(request, env) {
    const records = await env.auth.prepare("SELECT * FROM medical_records WHERE patient_id = ? ORDER BY record_date DESC")
        .bind(request.headers.get("Authorization"))
        .all();

    return new Response(JSON.stringify(records), { status: 200, headers: { "Content-Type": "application/json" } });
}

// ✅ Fetch patient profile
async function handlePatientProfile(request, env) {
    const profile = await env.auth.prepare("SELECT * FROM profiles WHERE id = ?")
        .bind(request.headers.get("Authorization"))
        .first();

    return new Response(JSON.stringify(profile), { status: 200, headers: { "Content-Type": "application/json" } });
}

async function handleMe(request, env) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("Missing or invalid token");
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");
        const decoded = JSON.parse(atob(token.split(".")[1])); // ✅ Decode JWT to get email
        console.log("Decoded Token:", decoded);

        const user = await env.auth.prepare("SELECT * FROM users WHERE email = ?")
            .bind(decoded.email)
            .first();

        console.log("Database User Lookup:", user);

        if (!user) {
            console.log("User Not Found");
            return new Response(JSON.stringify({ error: "User Not Found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ user }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Worker Error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}