document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("pre").forEach(pre => {
        const code = pre.querySelector("code");
        if (!code) return;

        const button = document.createElement("button");
        button.className = "copy-btn";
        button.textContent = "复制";

        button.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(code.innerText);
                button.textContent = "已复制";
                setTimeout(() => {
                    button.textContent = "复制";
                }, 1500);
            } catch (e) {
                button.textContent = "失败";
            }
        });

        pre.style.position = "relative";
        pre.appendChild(button);
    });
});