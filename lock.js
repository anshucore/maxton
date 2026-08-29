// --- Password gate ---
// The password is never stored as plain text here — only its SHA-256 hash.
// Even if someone opens dev tools / view-source, they'll only see the hash below,
// not the actual password.

const CORRECT_HASH = "1a09807a0e6928a66d91025ed5fccd713c9edb101e72a1bbcb8a01cd9a53cb51";
const SESSION_KEY = "site_unlocked";

const input = document.getElementById("lockInput");
const submitBtn = document.getElementById("lockSubmit");
const errorMsg = document.getElementById("lockError");
const lockCard = document.querySelector(".lock-card");

async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

function unlock() {
    document.body.classList.add("unlocked");
    sessionStorage.setItem(SESSION_KEY, "true");
}

async function attemptUnlock() {
    const value = input.value.trim();
    if (!value) return;

    const hash = await sha256(value);

    if (hash === CORRECT_HASH) {
        unlock();
    } else {
        errorMsg.classList.add("show");
        lockCard.classList.remove("shake");
        void lockCard.offsetWidth; // restart animation
        lockCard.classList.add("shake");
        input.value = "";
        input.focus();
    }
}

// Already unlocked earlier this session? Skip the gate.
if (sessionStorage.getItem(SESSION_KEY) === "true") {
    unlock();
}

submitBtn.addEventListener("click", attemptUnlock);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") attemptUnlock();
    errorMsg.classList.remove("show");
});

// Focus input on load for convenience
window.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem(SESSION_KEY) !== "true") {
        input.focus();
    }
});
