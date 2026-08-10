```javascript
const SUPABASE_URL = "https://zwpcswfrpzpyccdksspi.supabase.co";

// Supabase Publishable/Anon Key
const SUPABASE_ANON_KEY = "sb_publishable_iHFpyTs2PY57NvX6OqUxTg_lr53vTm5";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// ======================================================
// PAGE LOAD
// ======================================================

window.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);

    const certParam = urlParams.get("certNo");
    const dobParam = urlParams.get("dob");

    if (certParam && dobParam) {
        document.getElementById("certificateNo").value = certParam;
        document.getElementById("dateOfBirth").value = dobParam;

        verifyCertificate(certParam, dobParam);
    }
});


// ======================================================
// FORM SUBMIT
// ======================================================

document
    .getElementById("verificationForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();

        const certNo = document
            .getElementById("certificateNo")
            .value
            .trim();

        const dob = document
            .getElementById("dateOfBirth")
            .value;

        if (!certNo || !dob) {

            const resultBox =
                document.getElementById("resultBox");

            resultBox.style.display = "block";

            resultBox.className =
                "result-box result-error";

            resultBox.innerHTML =
                "<strong>ERROR:</strong> Please enter CDC No. and Date of Birth.";

            return;
        }

        verifyCertificate(certNo, dob);
    });


// ======================================================
// VERIFY CERTIFICATE
// ======================================================

async function verifyCertificate(certNo, dob) {

    const resultBox =
        document.getElementById("resultBox");

    resultBox.style.display = "block";

    resultBox.className =
        "result-box";

    resultBox.innerHTML =
        "Checking certificate...";


    try {

        const { data, error } = await db
            .from("certificates")
            .select("*")
            .eq("certificate_no", certNo)
            .eq("date_of_birth", dob)
            .maybeSingle();


        // ==================================================
        // DATABASE ERROR
        // ==================================================

        if (error) {

            console.error("Supabase Error:", error);

            resultBox.className =
                "result-box result-error";

            resultBox.innerHTML =
                "<strong>ERROR:</strong> Unable to connect to verification database.";

            return;
        }


        // ==================================================
        // CERTIFICATE NOT FOUND
        // ==================================================

        if (!data) {

            resultBox.className =
                "result-box result-error";

            resultBox.innerHTML =
                "<strong>ERROR:</strong> CDC No. or Date of Birth is incorrect.";

            return;
        }


        // ==================================================
        // CERTIFICATE VERIFIED
        // ==================================================

        resultBox.className =
            "result-box result-success";


        resultBox.innerHTML = `
            <strong>✓ CDC VERIFIED</strong><br><br>

            <b>CDC No.:</b>
            ${escapeHTML(data.certificate_no || "")}<br>

            <b>Name:</b>
            ${escapeHTML(data.name || "")}<br>

            <b>Rank:</b>
            ${escapeHTML(data.rank || "")}<br>

            <b>Date of Birth:</b>
            ${escapeHTML(data.date_of_birth || "")}<br>

            <b>Date of Issue:</b>
            ${escapeHTML(data.issue_date || "")}<br>

            <b>Date of Expiry:</b>
            ${escapeHTML(data.expiry_date || "")}<br>

            <b>Status:</b>
            ${escapeHTML(data.status || "")}
        `;

    } catch (error) {

        console.error("Verification Error:", error);

        resultBox.className =
            "result-box result-error";

        resultBox.innerHTML =
            "<strong>ERROR:</strong> Something went wrong while verifying the certificate.";
    }
}


// ======================================================
// SECURITY: ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
```
