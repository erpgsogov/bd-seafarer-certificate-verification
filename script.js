// ======================================================
// SUPABASE TEST
// ======================================================

const SUPABASE_URL =
    "https://zwpcswfrpzpyccdksspi.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_iHFpyTs2PY57NvX6OqUxTg_lr53vTm5";

const resultBox =
    document.getElementById("resultBox");

async function testSupabase() {

    resultBox.style.display = "block";
    resultBox.className = "result-box";
    resultBox.innerHTML = "Testing database...";

    try {

        if (typeof supabase === "undefined") {

            throw new Error(
                "Supabase library is not loaded."
            );
        }

        const db =
            supabase.createClient(
                SUPABASE_URL,
                SUPABASE_ANON_KEY
            );

        const { data, error } =
            await db
                .from("certificates")
                .select("*")
                .limit(5);

        console.log("DATA:", data);
        console.log("ERROR:", error);

        if (error) {

            resultBox.className =
                "result-box result-error";

            resultBox.innerHTML =
                "<strong>DATABASE ERROR</strong><br><br>" +
                escapeHTML(error.message);

            return;
        }

        if (!data || data.length === 0) {

            resultBox.className =
                "result-box result-error";

            resultBox.innerHTML =
                "<strong>NO DATA FOUND</strong><br><br>" +
                "Supabase connected, but no records were returned.";

            return;
        }

        resultBox.className =
            "result-box result-success";

        resultBox.innerHTML = `
            <strong>✓ DATABASE CONNECTED</strong>
            <br><br>

            <b>Records found:</b> ${data.length}
            <br><br>

            <b>First CDC:</b>
            ${escapeHTML(data[0].certificate_no || "")}
            <br>

            <b>Name:</b>
            ${escapeHTML(data[0].name || "")}
            <br>

            <b>Rank:</b>
            ${escapeHTML(data[0].rank || "")}
            <br>

            <b>Date of Birth:</b>
            ${escapeHTML(data[0].date_of_birth || "")}
            <br>

            <b>Status:</b>
            ${escapeHTML(data[0].status || "")}
        `;

    } catch (error) {

        console.error("TEST ERROR:", error);

        resultBox.className =
            "result-box result-error";

        resultBox.innerHTML =
            "<strong>ERROR</strong><br><br>" +
            escapeHTML(
                error.message || String(error)
            );
    }
}

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

document.addEventListener(
    "DOMContentLoaded",
    testSupabase
);
