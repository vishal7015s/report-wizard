import fs from 'fs';
const url = "https://bmuohsnbrbxbegwxcnzo.supabase.co/functions/v1/generate-report-content";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdW9oc25icmJ4YmVnd3hjbnpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTE4ODgsImV4cCI6MjA4MjE2Nzg4OH0.PnPgDrRVeKjP1Q66O7u_d-FbL8pk21wQKsS2f9m5a-w";

async function test() {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${key}`
            },
            body: JSON.stringify({
                prompt: "Create a project report about AI-powered library management system. Detail out the objectives clearly.",
                projectTitle: "AI Library Sys",
                mode: "preview"
            })
        });

        if (!res.ok) {
            fs.writeFileSync('ai_test_output.txt', "Error status: " + res.status + " " + await res.text());
            return;
        }

        const data = await res.json();
        let out = "Abstract:\n" + data.abstract + "\n\nChapter 1 Section 1 Content:\n" + data.chapters[0].sections[0].content;
        out += "\n\nChapter 1 Section 3 Content:\n" + data.chapters[0].sections[2].content;
        fs.writeFileSync('ai_test_output.txt', out);
        console.log("Wrote to ai_test_output.txt");
    } catch (e) {
        console.log("Fetch failed", e);
    }
}
test();
