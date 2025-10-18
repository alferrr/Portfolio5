// Login page
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("username").value.trim();
      const roleInput = document.querySelector('input[name="role"]:checked');

      if (!name) {
        alert("Please enter your name!");
        return;
      }

      if (!roleInput) {
        alert("Please select a role!");
        return;
      }

      const role = roleInput.value;

      localStorage.setItem("userName", name);
      localStorage.setItem("userRole", role);

      //ibutang sa google sheets
      const scriptURL =
        "https://script.google.com/macros/s/AKfycbxLRatK_rLwnPh1Nz7pXuLwjLB3GW1jk_MuiJOER7s2oNEXQV_EfUEuIkEud6oeiy1c/exec";

      const data = { name, role };

      fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then(() => {
          console.log("Submitted to Google Sheets!");
          window.location.href = "portfolio.html";
        })
        .catch((err) => {
          alert("Error sending data: " + err.message);
        });
    });
  }
});

// Index page (portfolio.html)
const subtitle = document.querySelector("#coverpage .text h2");
const storedName = localStorage.getItem("userName");
const storedRole = localStorage.getItem("userRole");

if (subtitle && storedName && storedRole) {
  const originalText = subtitle.textContent;

  function typeText(text, callback) {
    subtitle.textContent = "";
    let i = 0;
    const typing = setInterval(() => {
      subtitle.textContent += text.charAt(i);
      i++;
      if (i === text.length) {
        clearInterval(typing);
        if (callback) callback();
      }
    }, 80);
  }

  function eraseText(callback) {
    let text = subtitle.textContent;
    const erasing = setInterval(() => {
      text = text.slice(0, -1);
      subtitle.textContent = text;
      if (text.length === 0) {
        clearInterval(erasing);
        if (callback) callback();
      }
    }, 40);
  }

  if (storedRole === "teacher") {
    typeText(`Hello, Professor ${storedName}!`, () => {
      setTimeout(() => {
        eraseText(() => {
          typeText(originalText);
        });
      }, 2500);
    });
  } else {
    typeText(`Hello, ${storedName}!`, () => {
      setTimeout(() => {
        eraseText(() => {
          typeText(originalText);
        });
      }, 2500);
    });
  }
}
