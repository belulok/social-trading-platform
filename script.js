async function getDeepSeekResponse(prompt) {
    const response = await fetch("https://f1a0-43-252-217-181.ngrok-free.app/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "deepseek-r1:1.5b",
            prompt: prompt,
            stream: false
        })
    });

    const data = await response.json();
    console.log(data.response);
}

getDeepSeekResponse("Tell me about AI.");
