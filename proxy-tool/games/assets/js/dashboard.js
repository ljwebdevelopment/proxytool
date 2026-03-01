(function () {
  const searchInput = document.getElementById("searchInput");
  const statusText = document.getElementById("statusText");
  const gameGrid = document.getElementById("gameGrid");
  const gameCardTemplate = document.getElementById("gameCardTemplate");

  let allGames = [];

  function normalize(value) {
    return String(value || "").toLowerCase();
  }

  function matchesQuery(game, query) {
    if (!query) {
      return true;
    }

    const title = normalize(game.title);
    const tags = Array.isArray(game.tags) ? game.tags.map(normalize).join(" ") : "";
    return title.includes(query) || tags.includes(query);
  }

  function normalizeGamesData(data) {
    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === "object") {
      const normalized = [];

      if (data.featured && typeof data.featured === "object") {
        normalized.push(data.featured);
      }

      if (Array.isArray(data.games)) {
        normalized.push(...data.games);
      }

      return normalized;
    }

    return [];
  }

  function renderGames(list) {
    gameGrid.innerHTML = "";

    for (const game of list) {
      const fragment = gameCardTemplate.content.cloneNode(true);
      const card = fragment.querySelector(".game-card");
      const image = fragment.querySelector("img");
      const title = fragment.querySelector(".game-title");

      card.href = game.href || "#";
      image.src = game.cover || "";
      image.alt = game.title || "Game";
      title.textContent = game.title || "Untitled";

      gameGrid.appendChild(fragment);
    }

    statusText.textContent = list.length === 0 ? "No games found." : "";
  }

  function applyFilter() {
    const query = normalize(searchInput.value).trim();
    const filtered = allGames.filter(function (game) {
      return matchesQuery(game, query);
    });

    renderGames(filtered);
  }

  async function init() {
    try {
      statusText.textContent = "Loading games...";

      const response = await fetch("assets/data/games.json", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to load games.json: " + response.status);
      }

      const data = await response.json();
      allGames = normalizeGamesData(data);

      renderGames(allGames);
      searchInput.addEventListener("input", applyFilter);
    } catch (error) {
      statusText.textContent = "Could not load games.";
      console.error(error);
    }
  }

  init();
})();
