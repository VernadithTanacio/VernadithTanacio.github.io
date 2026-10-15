 const USER = "VernadithTanacio";

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

// Projects from data/projects.json (title, description, technologies, role, screenshot, link)
const grid = document.getElementById("project-grid");
fetch("data/projects.json")
  .then(r => r.json())
  .then(list => {
    grid.replaceChildren();
    list.forEach(p => {
      const card = el("article", "card");
      if (p.screenshot) {
        const img = el("img", "shot");
        img.alt = p.title + " screenshot";
        img.loading = "lazy";
        let retried = false;
        img.onerror = () => {
          if (!retried) { retried = true; img.src = "images/" + p.screenshot; }
          else img.remove();
        };
        img.src = p.screenshot;
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
        a.href = p.link; a.target = "_blank"; a.rel = "noopener";
        card.append(a);
      }
      grid.append(card);
    });
  })
  .catch(() => grid.replaceChildren(el("p", "muted", "Projects could not be loaded. Check data/projects.json.")));

// Latest repositories from the GitHub API
const repoList = document.getElementById("repo-list");
fetch(`https://api.github.com/users/${USER}/repos?sort=updated&per_page=5`)
  .then(r => r.json())
  .then(repos => {
    repoList.replaceChildren();
    if (!Array.isArray(repos) || !repos.length) {
      repoList.append(el("p", "muted", "No public repositories yet."));
      return;
    }
    repos.forEach(r => {
      const item = el("div", "repo");
      const a = el("a", "", r.name);
      a.href = r.html_url; a.target = "_blank"; a.rel = "noopener";
      const strong = el("strong"); strong.append(a);
      item.append(strong, el("p", "muted", r.description || "No description."));
      repoList.append(item);
    });
  })
  .catch(() => repoList.replaceChildren(el("p", "muted", "Repositories could not be loaded right now.")));

// Contact form opens the visitor's email app
document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const msg = document.getElementById("message").value;
  const body = `${msg}\n\nFrom: ${name} (${email})`;
  location.href = "mailto:vernadithtanacio093@gmail.com?subject=" +
    encodeURIComponent("Portfolio message from " + name) + "&body=" + encodeURIComponent(body);
});

// Show initials if the profile photo is missing
const avatar = document.querySelector(".avatar");
const fallbackSvg = "data:image/svg+xml;utf8," + encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><rect width='220' height='220' fill='#bfe0f7'/>" +
  "<text x='50%' y='58%' font-size='72' font-family='Arial' font-weight='700' fill='white' text-anchor='middle'>VT</text></svg>");
function useFallback() { if (!avatar.dataset.fb) { avatar.dataset.fb = "1"; avatar.src = fallbackSvg; } }
avatar.addEventListener("error", useFallback);
if (avatar.complete && avatar.naturalWidth === 0) useFallback();
