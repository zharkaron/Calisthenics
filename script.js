async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

const validHashes = [
  "ddafcbe2d6c909828488caea020e0e2de0746d5bb25fa550ae19d3e7a48bf975",
  "2db1685977d214bb30e568ad249a31553a7c6c19bb3462047781ba8cb73922f1",
  "5f67c99515addb44c2b6db5b620e3cc52d9fc823a46616dbbaf6c57279339f5e",
  "df0f5c5251a4da7152bac2b7ea74a8e13733af790dd243d166f1fc0d580c315d",
  "61035e6f126c58bafa996aa15366da991dd3090203a568d809f92c15db912762"
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

function revealFlag() {
  console.log("ZHK{XSS_EXECUTES_JAVASCRIPT}");
}

function debug() {
  const input = document.getElementById("debugInput").value;
  document.getElementById("debugOutput").innerHTML = input;
}

