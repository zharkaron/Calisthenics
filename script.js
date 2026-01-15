async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

const validHashes = [
  "9f3b9a6a9c7b7b7c4a0d19ef0d4cb0e3d5e1b52eafc6c7ad7c71d1c1b20f9a0b",
  "8dcb3a4e9e9e6c1d4d6e80e92ce409dab907f0d2d8c58cb35c50a6481d948e76",
  "4e65c9bb8e6a62ad31f1b3f5cb9a8e93d7c9a0c4d2d3c9f21a9d9e2bcb7d39b7",
  "2cbafbe0c2a9f6f42bfa5d0b2a57f6c1b7b8a9c2d6c9e8d6f5a4d3c2b1a0f9e",
  "a1d0e5f9b4c7a6d8e9f2c3b5d6a7e8f9c0b1a2d3e4f5c6b7a8d9e0f1"
];

async function checkFlags() {
  const used = new Set();
  let score = 0;

  for (let i = 1; i <= 5; i++) {
    const input = document.getElementById(`flag${i}`).value.trim();
    const status = document.getElementById(`status${i}`);

    const hash = await sha256(input);

    if (validHashes.includes(hash) && !used.has(hash)) {
      status.textContent = "✅ Correct";
      used.add(hash);
      score++;
    } else {
      status.textContent = "❌ Incorrect";
    }
  }

  document.getElementById("score").textContent =
    `Score: ${score} / 5 flags found`;
}

