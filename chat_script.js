const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = ""; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    const avatarSrc = localStorage.getItem("avatarSrc") || "ava_images/m_ng_s_s.png";
    let chatContent = className === "outgoing" ? `<p></p>` : `<img class="ava_image" src="ava_images/m_ng_s_s.png"><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = chatElement.querySelector("p");

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "system", content: "As a professional and solemn salary negotiation coach, your role is to use your knowledge of salary negotiation, including negotiation strategies, steps, and how to prepare for salary negotiations, to instruct users in 'Traditional Chinese' on all aspects of salary negotiation knowledge and skills. When addressing user questions, you may consult 'salary negotiation.txt,' which includes preparation tips and brief case studies for user reference. Please answer users as thoroughly as possible based on this document and your pre-existing knowledge. Your tone should always remain stern and formal, without any emotion or warmth, to ensure the user perceives you as highly professional and serious.###RULES### Always use 'Traditional Chinese' when responding to users.Do not use Simplified Chinese.Address users with respect, using honorifics such as 'You' and 'Please.'Maintain seriousness at all times, but do not mention 'you are very serious' in your responses.Do not display any friendliness or enthusiasm.Do not mention the document provided to you; do not let users know that you are referencing a document.If users ask about things unrelated to salary negotiation, such as what movies you like, do not respond, and insist that users only ask about salary negotiation-related matters.Respond as concisely as possible to reduce the length of responses.Respond in a list format as much as possible.###EXAMPLES### Regarding your question XXX, I have provided a few XX for your consideration:1. XXX2. XXX3. XXXThese are the answers I have provided for you."},
            {role: "user", content: "您好"},
            {role: "assistant", content: "您好，請問有關於薪資談判的問題嗎？"},
            {role: "user", content: "如何進行薪資談判？"},
            {role: "assistant", content: "關於薪資談判，以下是您可以考慮的幾個步驟：1.研究市場標準薪資，了解行業和地區的薪資水平。\n2.強調您的價值和貢獻，展示您的技能和經驗。\n3.設定明確的薪資範圍，確保您有彈性去討論。\n4.提出具體的要求，例如薪資、津貼、福利等。\n5.準備好應對可能的反駁和提出議價。\n6.與自信和尊重的態度進行談判，不要過於強硬或妥協。\n7.在確定最終薪資前，確保對合同條款有清晰的了解和確認。\n8.這些是您在薪資談判中可以考慮的步驟。祝您順利達成理想的薪資協議。"},
            {role: "user", content: userMessage}],
            temperature: 0.2,
            top_p: 0.8,
            frequency_penalty: 0.3,
            presence_penalty: 0.3,
        })
    }

    // Send POST request to API, get response and set the reponse as paragraph text
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content.trim();
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("......", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

document.addEventListener("DOMContentLoaded", () => { 
    // if the webpage opened, the chatroom show
    document.body.classList.add("show-chatbot");
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
//chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    const interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = "剩餘時間：" + minutes + "：" + seconds; // 在這裡添加“剩餘時間”

        if (--timer < 0) {
            clearInterval(interval);
            window.location.href = 'endpage.html'; // 替換為實際的跳轉URL
        }
    }, 1000);
}

window.onload = function () {
    const duration = 180, // 這裡設置倒數計時的總秒數
        display = document.querySelector('#timer');
    startTimer(duration, display);
    
    var avatarSrc = localStorage.getItem("avatarSrc");
    var userName = localStorage.getItem("userName");
  
    // 如果信息存在，則更新頁面上的頭像和姓名
    if (avatarSrc && userName) {
      document.querySelector(".ava_image").src = avatarSrc;
      // 假設你有一個顯示用戶名的元素
      document.getElementById("user-name-display").textContent = userName;
    }
};

document.querySelector('.material-symbols-outlined').addEventListener('click', function() {
    var popupBox = document.querySelector('.popup-box');
    if (popupBox.style.display === 'none') {
      popupBox.style.display = 'block';
    } else {
      popupBox.style.display = 'none';
    }
  });
  