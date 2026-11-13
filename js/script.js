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
            if (p.images) {
                const img = el("img", "shot");
                img.src = p.images;
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
