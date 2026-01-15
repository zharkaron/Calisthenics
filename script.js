// Jaguar Bytes - Flag Checker

function checkFlags() {
  const validFlags = [
    "ZHK{HTML_SOURCE_REVEALS_TRUTH}",
    "ZHK{ROBOTS_ARE_TOO_HONEST}",
    "ZHK{BASE64_ENCODED}",
    "ZHK{CSS_FILES_ARE_NOT_INVISIBLE}",
    "ZHK{JAVASCRIPT_KNOWS_ALL}"
  ];

  const usedFlags = new Set();

  for (let i = 1; i <= 5; i++) {
    const input = document.getElementById(`flag${i}`).value.trim();
    const status = document.getElementById(`status${i}`);

    if (validFlags.includes(input) && !usedFlags.has(input)) {
      status.textContent = "✅ Correct";
      status.style.color = "#22c55e";
      usedFlags.add(input);
    } else {
      status.textContent = "❌ Incorrect";
      status.style.color = "#ef4444";
    }
  }

  document.getElementById("score").textContent =
    `Score: ${usedFlags.size} / 5 flags found`;
}
