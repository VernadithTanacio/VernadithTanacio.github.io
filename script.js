 const USER = "VernadithTanacio";
function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
}
// Projects from data/projects.json
const grid = document.getElementById("project-grid");
fetch("data/projects.json")
    .then(r => r.json())
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
            (p.technologies || p.tags || []).forEach(t => tags.append(el("span", "", t)));
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
    });
const repoList = document.getElementById("repo-list");
fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=6`)
  .then(r => {
    if (!r.ok) throw new Error("GitHub API error " + r.status);
    return r.json();
  })
  .then(repos => {
    repoList.replaceChildren();
    repos.forEach(repo => {
      const item = el("article", "card");
      item.append(el("h3", "", repo.name));
      item.append(el("p", "", repo.description || "No description"));
      const a = el("a", "", "View repository");
      a.href = repo.html_url;
      a.target = "_blank";
      a.rel = "noopener";
      item.append(a);
      repoList.append(item);
    });
  })
  .catch(err => {
    repoList.textContent = "Unable to load repositories right now.";
    console.error(err);
  });
