const GITHUB_USER = "VernadithTanacio";
async function loadProjects() {
  const box = document.getElementById("project-list");
  try {
    const res = await fetch("data/projects.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const projects = await res.json();
    box.innerHTML = "";
    projects.forEach(p => {
      const card = document.createElement("article");
      card.className = "card";
      const img = document.createElement("img");
      img.src = "images/" + p.screenshot;
      img.alt = "Screenshot of " + p.title;
      img.onerror = () => img.remove(); 
      const title = document.createElement("h3");
      title.textContent = p.title;
      const desc = document.createElement("p");
      desc.textContent = p.description;
      const tech = document.createElement("p");
      tech.className = "tech";
      tech.textContent = "Technologies: " + p.technologies.join(", ");
      const role = document.createElement("p");
      role.className = "tech";
      role.textContent = "Role: " + p.role;
      const link = document.createElement("a");
      link.href = p.link;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "View on GitHub";
      card.append(img, title, desc, tech, role, link);
      box.appendChild(card);
    });
  } catch (err) {
    box.innerHTML = "<p>Sorry, the projects could not be loaded. Please try again later.</p>";
    console.warn("Projects error:", err);
  }
}
async function getRepoLanguage(repoName) {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repoName}/languages`);
    if (!res.ok) return "No language";
    const data = await res.json();
    const languages = Object.keys(data);
    return languages.length ? languages.join(", ") : "No language";
  } catch {
    return "No language";
  }
}

async function loadRepos() {
  const list = document.getElementById("repo-list");
  const url = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=5`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const repos = await res.json();
    list.innerHTML = "";
    if (repos.length === 0) {
      list.innerHTML = "<li>No public repositories yet.</li>";
      return;
    }

    const repoItems = await Promise.all(repos.map(async r => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = r.html_url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = r.name;

      const lang = document.createElement("span");
      lang.className = "lang";
      lang.textContent = r.language || await getRepoLanguage(r.name);

      li.append(a, lang);
      return li;
    }));

    repoItems.forEach(item => list.appendChild(item));
  } catch (err) {
    list.innerHTML = "<li>GitHub data is unavailable right now.</li>";
    console.warn("GitHub error:", err);
  }
}
const form = document.getElementById("contact-form");
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  document.getElementById("name-error").textContent = name ? "" : "Please enter your name.";
  document.getElementById("email-error").textContent =
    !email ? "Please enter your email." : emailOk ? "" : "Please enter a valid email address.";
  document.getElementById("message-error").textContent = message ? "" : "Please enter a message.";
  const status = document.getElementById("form-status");
  if (name && emailOk && message) {
    status.textContent = "Thank you, " + name + "! Your message was received.";
    form.reset();
  } else {
    status.textContent = "";
  }
});
const toTop = document.getElementById("to-top");
window.addEventListener("scroll", () => {
  toTop.classList.toggle("show", window.scrollY > 300);
});
toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
loadProjects();
loadRepos();