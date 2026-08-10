const SUPABASE_URL = "https://zwpcswfrpzpyccdksspi.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_iHFpyTs2PY57NvX6OqUxTg_lr53vTm5";

document.addEventListener("DOMContentLoaded", async function () {

    const resultBox = document.getElementById("resultBox");

    if (!resultBox) {
        console.error("resultBox not found.");
        return;
    }

    resultBox.style.display = "block";
    resultBox.className = "result-box";
    resultBox.innerHTML = "Testing database...";

    try {

        if (typeof supabase === "undefined") {
            throw new Error("Supabase library is not loaded.");
        }

        const db = supabase.createClient(
            SUPABASE_URL,
            SUPABASE_ANON_KEY
        );

        const { data, error } = await db
            .from("certificates")
            .select("*")
            .limit(5);

        console.log("SUPABASE DATA:", data);
        console.log("SUPABASE ERROR:", error);

        if (error) {

            resultBox.className = "result-box result-error";

            resultBox.innerHTML = `
                <strong>DATABASE ERROR</strong>
                <br><br>
                ${escapeHTML(error.message || "Unknown error")}
            `;

            return;
        }

        if (!data || data.length === 0) {

            resultBox.className = "result-box result-error";

            resultBox.innerHTML = `
                <strong>NO DATA FOUND</strong>
                <br><br>
                Supabase connected successfully,
                but no certificate records were returned.
            `;

            return;
        }

        const certificate = data[0];

        resultBox.className = "result-box result-success";

        resultBox.innerHTML = `
            <strong>✓ DATABASE CONNECTED</strong>
            <br><br>

            <b>Records Found:</b>
            ${data.length}

            <br><br>

            <b>CDC No.:</b>
            ${escapeHTML(certificate.certificate_no || "")}

            <br>

            <b>Name:</b>
            ${escapeHTML(certificate.name || "")}

            <br>

            <b>Rank:</b>
            ${escapeHTML(certificate.rank || "")}

            <br>

            <b>Date of Birth:</b>
            ${escapeHTML(certificate.date_of_birth || "")}

            <br>

            <b>Date of Issue:</b>
            ${escapeHTML(certificate.issue_date || "")}

            <br>

            <b>Date of Expiry:</b>
            ${escapeHTML(certificate.expiry_date || "")}

            <br>

            <b>Status:</b>
            ${escapeHTML(certificate.status || "")}
        `;

    } catch (error) {

        console.error("SUPABASE TEST ERROR:", error);

        resultBox.className = "result-box result-error";

        resultBox.innerHTML = `
            <strong>ERROR</strong>
            <br><br>
            ${escapeHTML(
                error.message || String(error)
            )}
        `;
    }

});


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
