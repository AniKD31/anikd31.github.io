async function fixlink(link) {
    if (link.includes("/https/")) {
        const match = link.match(/\/https\/(.+)\.png/);
        if (match) {
            const extractedUrl = "https://" + match[1];
            return decodeURIComponent(extractedUrl);
        } else {
            console.error("Invalid URL format for external URL");
            return link;
        }
    } else {
        return link;
    }
}

async function fetchPresence() {
    try {
        const response = await fetch("https://grabe.infiinitee.me/infinite");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        return data
    } catch (error) {
        console.error("Error fetching presence:", error);
    }
}

async function create() {
    const data = await fetchPresence();
    const stleft = document.querySelector(".stleft");
    
    const img = document.createElement("img");
    img.src = data.avatar;
    if (data.status == "Online") {
        img.style.border = "2px solid #37a65c";
    } else if (data.status == "Offline") {
        img.style.border = "2px solid #545554";
    } else if (data.status == "Idle") {
        img.style.border = "2px solid #ecb03f";
    } else if (data.status == "Dnd") {
        img.style.border = "2px solid #f7595a";
    }
    stleft.appendChild(img);   

    if (data.status == "Offline") {
        const stdown = document.querySelector(".stdown");
        const p = document.createElement("p");
        p.textContent = "Offline";
        const stpresence = document.querySelector(".stpresence");
        stpresence.style.display = "none";
        stdown.appendChild(p);

    }
    else {
        if (data.return == "None") {
            const stdown = document.querySelector(".stdown");
            const p = document.createElement("p");
            p.textContent = "...";
            const stpresence = document.querySelector(".stpresence");
            stpresence.style.display = "none";
            stdown.appendChild(p);
        }
        if (data.return == "status") {
            const stdown = document.querySelector(".stdown");
            const p = document.createElement("p");
            p.textContent = data.name;
            const stpresence = document.querySelector(".stpresence");
            stpresence.style.display = "none";
            stdown.appendChild(p);
        }
        if (data.return == "presence") {
            if (data.image == null) {
                const stpresence = document.querySelector(".stpresence");
                stpresence.style.display = "none";
            }
            if (data.image != null) {
                const stpresence = document.querySelector(".stpresence");
                const i = document.createElement("img");
                i.src = await fixlink(data.image);
                stpresence.appendChild(i);
            }
            const stdown = document.querySelector(".stdown");
            const p = document.createElement("p");
            if (data.type == "Listening to") {
                const i = document.createElement("i");
                i.className = "fa-solid fa-music";
                stdown.appendChild(i);
                const content = data.type +" "+ data.name;
                const new_content = content.length > 30 ? content.slice(0, 30) + "..." : content;
                p.textContent = new_content;
            }
            if (data.type == "Playing") {
                const i = document.createElement("i");
                i.className = "fa-solid fa-gamepad";
                stdown.appendChild(i);
                const content = data.type +" "+ data.name;
                const new_content = content.length > 30 ? content.slice(0, 30) + "..." : content;
                p.textContent = new_content;
            }
            if (data.type == "Watching") {
                const i = document.createElement("i");
                i.className = "fa-solid fa-film";
                stdown.appendChild(i);
                const content = data.type +" "+ data.name;
                const new_content = content.length > 30 ? content.slice(0, 30) + "..." : content;
                p.textContent = new_content;
            }
            stdown.appendChild(p);
        }
    }
}

create()