/**
 * check-cz-2char.js
 *
 * Sekvenční kontrola 2-znakových .cz domén (a–z + 0–9) přes RDAP:
 * - 404 = neregistrováno (AVAILABLE)
 * - 200 = existuje (TAKEN)
 *
 * Výstupy:
 * - available.txt  (volné)
 * - taken.txt      (obsazené)
 * - errors.txt     (chyby po vyčerpání retry)
 * - run.log        (detailní log)
 * - state.json     (checkpoint pro pokračování)
 *
 * Požadavky: Node 18+ (kvůli fetch), internet.
 */

import fs from "fs";
import fsp from "fs/promises";

const CONFIG = {
  charset: "abcdefghijklmnopqrstuvwxyz0123456789",
  tld: "cz",

  // Jde to "celou noc", takže radši šetrně:
  baseDelayMs: 900,      // pauza mezi doménami
  jitterMs: 250,         // náhodný jitter k pauze (ať nejsi "roboticky pravidelný")

  timeoutMs: 15000,      // timeout jednoho HTTP pokusu
  maxAttempts: 7,        // počet pokusů pro jednu doménu

  // Backoff pro 429/503/5xx (když server řekne "zpomali"):
  backoffBaseMs: 1200,   // 1.2s
  backoffCapMs: 5 * 60 * 1000, // max 5 minut čekání na jeden pokus

  // Logování:
  logEvery: 1,           // 1 = loguj každou doménu; klidně dej 5 pro méně spamu
  progressEvery: 25,     // souhrn každých N domén
};

const FILES = {
  state: "state.json",
  available: "available.txt",
  taken: "taken.txt",
  errors: "errors.txt",
  log: "run.log",
};

function ts() {
  // lokální timestamp, ať je vidět, že to žije
  return new Date().toISOString();
}

async function appendLine(path, line) {
  await fsp.appendFile(path, line + "\n", "utf8");
}

async function log(line) {
  const out = `[${ts()}] ${line}`;
  console.log(out);
  await appendLine(FILES.log, out);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function formatDuration(sec) {
  sec = Math.max(0, Math.floor(sec));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function buildLabels(charset) {
  const labels = [];
  for (const a of charset) for (const b of charset) labels.push(a + b);
  return labels;
}

function endpointFor(fqdn) {
  return `https://rdap.nic.cz/domain/${fqdn}`;
}

async function fetchWithTimeout(url, timeoutMs, headers = {}) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    return await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/rdap+json",
        "user-agent": "cz-2char-check/1.0 (node)",
        ...headers,
      },
      cache: "no-store",
      signal: ac.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function computeWaitMsFromRetryAfter(retryAfterValue) {
  if (!retryAfterValue) return null;
  // Retry-After může být buď počet sekund, nebo HTTP datum
  const asNumber = Number(retryAfterValue);
  if (Number.isFinite(asNumber) && asNumber >= 0) return Math.floor(asNumber * 1000);

  const asDate = Date.parse(retryAfterValue);
  if (Number.isFinite(asDate)) {
    const diff = asDate - Date.now();
    return diff > 0 ? diff : 0;
  }
  return null;
}

async function checkDomain(fqdn) {
  const url = endpointFor(fqdn);

  for (let attempt = 1; attempt <= CONFIG.maxAttempts; attempt++) {
    const attemptTag = `pokus ${attempt}/${CONFIG.maxAttempts}`;
    const started = Date.now();

    try {
      const res = await fetchWithTimeout(url, CONFIG.timeoutMs);
      const ms = Date.now() - started;

      // 404 = objekt neexistuje => neregistrováno
      if (res.status === 404) {
        return { status: "AVAILABLE", http: 404, ms };
      }

      // 200 (a obecně 2xx) => existuje
      if (res.ok) {
        return { status: "TAKEN", http: res.status, ms };
      }

      // Rate limit / dočasná nedostupnost
      if (res.status === 429 || res.status === 503 || (res.status >= 500 && res.status <= 599)) {
        const ra = res.headers.get("retry-after");
        const raMs = computeWaitMsFromRetryAfter(ra);

        const exp = CONFIG.backoffBaseMs * Math.pow(2, attempt - 1);
        const waitMs = Math.min(CONFIG.backoffCapMs, raMs ?? exp);

        await log(`${fqdn} -> HTTP ${res.status} (${attemptTag}), čekám ${Math.ceil(waitMs / 1000)}s a zkouším znovu… (odezva ${ms}ms)`);
        await sleep(waitMs);
        continue;
      }

      // Jiné statusy (403/400/…) – většinou nepomůže retry, ale uděláme pár pokusů
      const exp = Math.min(CONFIG.backoffCapMs, CONFIG.backoffBaseMs * Math.pow(2, attempt - 1));
      await log(`${fqdn} -> HTTP ${res.status} (${attemptTag}), čekám ${Math.ceil(exp / 1000)}s a zkouším znovu… (odezva ${ms}ms)`);
      await sleep(exp);
    } catch (e) {
      const ms = Date.now() - started;
      const msg = (e && (e.name || e.message)) ? `${e.name || "Error"}: ${e.message || ""}` : String(e);
      const exp = Math.min(CONFIG.backoffCapMs, CONFIG.backoffBaseMs * Math.pow(2, attempt - 1));
      await log(`${fqdn} -> CHYBA (${attemptTag}) ${msg} (po ${ms}ms), čekám ${Math.ceil(exp / 1000)}s a zkouším znovu…`);
      await sleep(exp);
    }
  }

  return { status: "ERROR", http: null, ms: null };
}

async function loadState() {
  try {
    const raw = await fsp.readFile(FILES.state, "utf8");
    const st = JSON.parse(raw);
    return st && typeof st === "object" ? st : null;
  } catch {
    return null;
  }
}

async function saveState(state) {
  await fsp.writeFile(FILES.state, JSON.stringify(state, null, 2), "utf8");
}

(async () => {
  // kontrola Node verze
  const major = Number(process.versions.node.split(".")[0] || "0");
  if (!Number.isFinite(major) || major < 18) {
    console.error(`Potřebuješ Node 18+. Máš: ${process.versions.node}`);
    process.exit(1);
  }

  const labels = buildLabels(CONFIG.charset);
  const total = labels.length;

  let state = await loadState();
  if (!state) {
    state = {
      startedAt: new Date().toISOString(),
      nextIndex: 0,
      counts: { available: 0, taken: 0, errors: 0 },
      lastDomain: null,
    };
    await saveState(state);
    await log(`Start nového běhu. Celkem domén: ${total}.`);
  } else {
    await log(`Pokračuju ze state.json. nextIndex=${state.nextIndex}/${total}, poslední=${state.lastDomain || "—"}`);
  }

  // heartbeat, ať je jasné, že proces žije i kdyby se čekalo na backoff
  const hb = setInterval(() => {
    const idx = state.nextIndex;
    const last = state.lastDomain || "—";
    console.log(`[${ts()}] (heartbeat) nextIndex=${idx}/${total}, last=${last}`);
  }, 60_000);

  const startedTs = Date.now();

  for (let i = state.nextIndex; i < total; i++) {
    const label = labels[i];
    const fqdn = `${label}.${CONFIG.tld}`;

    const before = Date.now();
    const result = await checkDomain(fqdn);
    const after = Date.now();

    state.nextIndex = i + 1;
    state.lastDomain = fqdn;

    if (result.status === "AVAILABLE") {
      state.counts.available++;
      await appendLine(FILES.available, fqdn);
    } else if (result.status === "TAKEN") {
      state.counts.taken++;
      await appendLine(FILES.taken, fqdn);
    } else {
      state.counts.errors++;
      await appendLine(FILES.errors, fqdn);
    }

    await saveState(state);

    const done = state.nextIndex;
    const elapsedSec = (Date.now() - startedTs) / 1000;
    const rate = done / Math.max(elapsedSec, 0.001);
    const remaining = total - done;
    const etaSec = remaining / Math.max(rate, 0.001);

    if (CONFIG.logEvery === 1 || done % CONFIG.logEvery === 0) {
      const durMs = result.ms ?? (after - before);
      await log(
        `[${done}/${total}] ${fqdn} => ${result.status}` +
        (result.http ? ` (HTTP ${result.http})` : "") +
        ` | čas ${durMs}ms | součet: volné=${state.counts.available}, obsazené=${state.counts.taken}, chyby=${state.counts.errors}` +
        ` | rychlost ~${rate.toFixed(2)}/s | ETA ~${formatDuration(etaSec)}`
      );
    }

    if (done % CONFIG.progressEvery === 0 || done === total) {
      await log(
        `PROGRESS: ${done}/${total} hotovo | volné=${state.counts.available} obsazené=${state.counts.taken} chyby=${state.counts.errors} | ` +
        `rychlost ~${rate.toFixed(2)}/s | ETA ~${formatDuration(etaSec)}`
      );
    }

    // základní pauza + jitter
    const jitter = Math.floor(Math.random() * (CONFIG.jitterMs + 1));
    await sleep(CONFIG.baseDelayMs + jitter);
  }

  clearInterval(hb);
  await log("✅ Hotovo. Výsledky: available.txt / taken.txt / errors.txt + detail v run.log");
  process.exit(0);
})().catch(async (e) => {
  try {
    await log(`FATÁLNÍ CHYBA: ${e && e.stack ? e.stack : String(e)}`);
  } catch {
    console.error(e);
  }
  process.exit(1);
});
