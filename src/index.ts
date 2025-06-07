import { Hono } from 'hono';
import { Context } from 'hono';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import type { D1Database, KVNamespace } from '@cloudflare/workers-types';

type Env = {
    DB: D1Database;
    SESSIONS: KVNamespace;
};

const app = new Hono<{ Bindings: Env }>();

app.post('/register', async (c: Context) => {
    const { email, password, fullName } = await c.req.json();
    const hash = await bcrypt.hash(password, 10);

    try {
        await c.env.DB.prepare(
            `INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)`
        ).bind(email, hash, fullName).run();

        return c.json({ success: true });
    } catch (err: any) {
        return c.json({ error: 'Email already registered' }, 400);
    }
});

app.post('/login', async (c: Context) => {
    const { email, password } = await c.req.json();
    const result = await c.env.DB.prepare(`SELECT * FROM users WHERE email = ?`).bind(email).first();

    if (!result || !(await bcrypt.compare(password, result.password_hash))) {
        return c.json({ error: 'Invalid credentials' }, 401);
    }

    const sessionId = uuidv4();
    await c.env.SESSIONS.put(sessionId, JSON.stringify(result), { expirationTtl: 86400 }); // 1 day

    setCookie(c, 'session', sessionId, { path: '/', httpOnly: true });
    return c.json({ success: true });
});

app.get('/me', async (c: Context) => {
    const sessionId = getCookie(c, 'session');
    if (!sessionId) return c.json({ error: 'Not logged in' }, 401);

    const user = await c.env.SESSIONS.get(sessionId);
    return user ? c.json(JSON.parse(user)) : c.json({ error: 'Session expired' }, 401);
});

app.post('/logout', async (c: Context) => {
    const sessionId = getCookie(c, 'session');
    if (sessionId) {
        await c.env.SESSIONS.delete(sessionId);
        deleteCookie(c, 'session');
    }
    return c.json({ success: true });
});

export default app;
