 const USER = "VernadithTanacio";

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

// ---------- Projects from projects.json ----------
const grid = document.getElementById("project-grid");

fetch("projects.json")
  .then(r => {
    if (!r.ok) throw new Error("projects.json error: " + r.status);
    return r.json();
  })
  .then(list => {
    grid.replaceChildren();

    list.forEach(p => {
      const card = el("article", "card");

      if (p.image) {
        const img = el("img", "shot");
        img.src = p.image;
        img.alt = p.title;
        card.append(img);
      }

      card.append(el("h3", "", p.title), el("p", "", p.description));

      if (p.role) {
        const role = el("p", "role");
        role.append(el("strong", "", "Role: "), document.createTextNode(p.role));
        card.append(role);
      }

      const tags = el("div", "tags");
      (p.technologies || p.tags || []).forEach(t => tags.append(el("span", "tag", t)));
      card.append(tags);

      if (p.link) {
        const a = el("a", "", "View project");
        a.href = p.link;
        a.target = "_blank";
        a.rel = "noopener";
        card.append(a);
      }

      grid.append(card);
    });
  })
  .catch(err => {
    grid.textContent = "Hindi ma-load ang projects.";
    console.error(err);
  });

// ---------- Latest GitHub repositories ----------
const repoList = document.getElementById("repo-list");

fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=6`)
  .then(r => {
    if (!r.ok) throw new Error("GitHub API error: " + r.status);
    return r.json();
  })
  .then(repos => {
    repoList.replaceChildren();

    repos
      .filter(repo => !repo.fork)
      .forEach(repo => {
        const card = el("article", "card");
        const title = el("h3");
        const link = el("a", "", repo.name);
        link.href = repo.html_url;
        link.target = "_blank";
        link.rel = "noopener";
        title.append(link);

        card.append(title, el("p", "", repo.description || "No description"));
        repoList.append(card);
      });
  })
  .catch(err => {
    repoList.textContent = "Hindi ma-load ang repositories.";
    console.error(err);
  });