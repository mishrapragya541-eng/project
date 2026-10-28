
const pages = document.querySelectorAll("section.page");
const navigationLinks = document.querySelectorAll('nav a[href^="#"]');

function showCurrentPage() {
    const requestedPageId = window.location.hash.slice(1) || "home";
    const activePage = Array.from(pages).find(function (page) {
        return page.id === requestedPageId;
    }) || document.getElementById("home");

    pages.forEach(function (page) {
        const isActive = page === activePage;
        page.hidden = !isActive;
        page.classList.toggle("is-active", isActive);
    });

    navigationLinks.forEach(function (link) {
        if (link.getAttribute("href") === `#${activePage.id}`) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    window.scrollTo(0, 0);
}

window.addEventListener("hashchange", showCurrentPage);
showCurrentPage();

const urlForm = document.getElementById("urlForm");
const urlInput = document.getElementById("urlInput");
const result = document.getElementById("result");
const sampleUrl = document.getElementById("sampleUrl");

sampleUrl.addEventListener("click", function () {
    urlInput.value = "http://secure-account-verify.example.test/login";
    urlForm.requestSubmit();
});

urlForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const input = urlInput.value.trim();
    const warnings = [];

    result.replaceChildren();
    result.className = "";

    let url;

    try {
        url = new URL(input);

        if (!["http:", "https:"].includes(url.protocol)) {
            throw new Error("Unsupported protocol");
        }
    } catch {
        result.className = "neutral";
        result.textContent =
            "Enter a valid http:// or https:// URL.";
        return;
    }

    const host = url.hostname.toLowerCase();

    if (url.protocol === "http:") {
        warnings.push("The connection does not use HTTPS.");
    }

    if (url.username || url.password) {
        warnings.push("The URL contains embedded login information.");
    }

    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
        warnings.push("The hostname is an IP address.");
    }

    if (host.includes("xn--")) {
        warnings.push("The hostname contains encoded characters.");
    }

    if (host.split(".").length > 4) {
        warnings.push("The URL has many hostname sections.");
    }

    if (url.href.length > 100) {
        warnings.push("The URL is unusually long.");
    }

    if (/(login|verify|password|account|confirm|urgent)/i.test(
        url.pathname + url.search
    )) {
        warnings.push(
            "The URL contains words sometimes used in phishing."
        );
    }

    const heading = document.createElement("h3");
    heading.textContent = warnings.length
        ? "⚠️ Warning signs found"
        : "No common warning signs found";

    result.appendChild(heading);

    if (warnings.length) {
        result.className = "warning";

        const list = document.createElement("ul");

        warnings.forEach(function (warning) {
            const item = document.createElement("li");
            item.textContent = warning;
            list.appendChild(item);
        });

        result.appendChild(list);
    } else {
        result.className = "safe";
    }

    const note = document.createElement("p");
    note.textContent = "Heuristic check only. No verdict is guaranteed.";

    result.appendChild(note);
});

// Phishing awareness quiz
const options = document.querySelectorAll(".option");
const quizResult = document.getElementById("quizResult");
const nextQuestion = document.getElementById("nextQuestion");
const question = document.getElementById("question");
const quizProgressText = document.getElementById("quizProgressText");
const quizProgress = document.getElementById("quizProgress");
const quizScore = document.getElementById("quizScore");

let questionIndex = 0;
let answered = false;
let score = 0;

const questions = [
    {
        question: "A message asks for your OTP urgently. What should you do?",
        options: ["Share the OTP", "Never share it", "Forward it to everyone"],
        correct: 1
    },
    {
        question: "What should you do with an unexpected suspicious link?",
        options: [
            "Click it immediately",
            "Check the source independently",
            "Enter your password"
        ],
        correct: 1
    },
    {
        question: "Does HTTPS guarantee that a website is genuine?",
        options: ["Yes, always", "No, it does not", "Only at night"],
        correct: 1
    }
];

function showQuestion() {
    const current = questions[questionIndex];

    question.textContent = current.question;
    quizProgressText.textContent =
        `Question ${questionIndex + 1} of ${questions.length}`;
    quizProgress.value = questionIndex + 1;
    quizScore.textContent = `Score: ${score}`;
    quizResult.textContent = "";
    nextQuestion.hidden = true;
    answered = false;

    options.forEach(function (button, index) {
        button.classList.remove("correct", "incorrect");
        button.textContent = current.options[index];
        button.disabled = false;
    });
}

options.forEach(function (button, index) {
    button.addEventListener("click", function () {
        if (answered) return;

        answered = true;
        const correctIndex = questions[questionIndex].correct;

        if (index === correctIndex) {
            score++;
            quizScore.textContent = `Score: ${score}`;
            quizResult.textContent = "Correct.";
        } else {
            quizResult.textContent = "Not quite. Review the safety tips.";
        }

        options.forEach(function (option, optionIndex) {
            option.disabled = true;
            if (optionIndex === correctIndex) {
                option.classList.add("correct");
            } else if (optionIndex === index) {
                option.classList.add("incorrect");
            }
        });

        nextQuestion.hidden = false;

        if (questionIndex === questions.length - 1) {
            nextQuestion.textContent = "Restart Quiz";
            quizResult.textContent =
                `Quiz complete. Score: ${score}/${questions.length}.`;
        } else {
            nextQuestion.textContent = "Next Question";
        }
    });
});

nextQuestion.addEventListener("click", function () {
    if (questionIndex === questions.length - 1) {
        questionIndex = 0;
        score = 0;
    } else {
        questionIndex++;
    }

    showQuestion();

});

showQuestion();

