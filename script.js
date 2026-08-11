// ==========================================
// BANGLADESH SEAFARER CERTIFICATE VERIFICATION
// FINAL FIX
// ==========================================

const SUPABASE_URL = "https://zwpcswfrpzpyccdksspi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_iHFpyTs2PY57NvX6OqUxTg_lr53vTm5";

document.addEventListener("DOMContentLoaded", function () {

    console.log("==========================================");
    console.log("BANGLADESH SEAFARER VERIFICATION STARTED");
    console.log("==========================================");

    const form = document.getElementById("verificationForm");
    const certificateInput = document.getElementById("certificateNo");
    const dobInput = document.getElementById("dateOfBirth");
    const resultBox = document.getElementById("resultBox");
    const verifyButton = document.getElementById("verifyButton");

    if (!form || !certificateInput || !dobInput || !resultBox) {
        console.error("Required HTML elements are missing.");
        return;
    }

    if (typeof window.supabase === "undefined" || !window.supabase.createClient) {
        showResult(
            "error",
            `<strong>SUPABASE LIBRARY ERROR</strong><br><br>Supabase JavaScript CDN library could not be initialized.`
        );
        return;
    }

    // Direct initialization
    const db = window.supabase.createClient(
        "https://zwpcswfrpzpyccdksspi.supabase.co",
        "sb_publishable_iHFpyTs2PY57NvX6OqUxTg_lr53vTm5"
    );

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const certNo = certificateInput.value.trim().toUpperCase();
        const dob = dobInput.value.trim();

        if (!certNo) {
            showResult("error", "<strong>ERROR</strong><br><br>Please enter CDC / Certificate No.");
            return;
        }

        if (!dob) {
            showResult("error", "<strong>ERROR</strong><br><br>Please select Date of Birth.");
            return;
        }

        if (verifyButton) {
            verifyButton.disabled = true;
            verifyButton.innerText = "CHECKING...";
        }

        await verifyCertificate(db, certNo, dob);

        if (verifyButton) {
            verifyButton.disabled = false;
            verifyButton.innerText = "VERIFY CERTIFICATE";
        }
    });
});

async function verifyCertificate(db, certNo, dob) {

    showResult("loading", "<strong>Checking certificate...</strong><br><br>Please wait.");

    try {

        const { data, error } = await db
            .from("certificates")
            .select(`
                certificate_no,
                name,
                rank,
                date_of_birth,
                issue_date,
                expiry_date,
                status
            `)
            .ilike("certificate_no", certNo)
            .limit(10);

        if (error) {

            showResult(
                "error",
                `<strong>DATABASE ERROR</strong><br><br>${escapeHTML(error.message || "Unable to access database.")}<br><br><b>Error Code:</b> ${escapeHTML(error.code || "N/A")}`
            );

            return;
        }

        if (!data || data.length === 0) {

            showResult(
                "error",
                `<strong>✗ CDC NOT FOUND</strong><br><br>Certificate No. <b>${escapeHTML(certNo)}</b> was not found in the database.`
            );

            return;
        }

        let matchedRecord = null;

        for (const record of data) {

            const databaseDOB = normalizeDate(record.date_of_birth);
            const inputDOB = normalizeDate(dob);

            if (databaseDOB === inputDOB) {
                matchedRecord = record;
                break;
            }
        }

        if (!matchedRecord) {

            showResult(
                "error",
                `<strong>✗ NOT VERIFIED</strong><br><br>Certificate No.: <b>${escapeHTML(data[0].certificate_no || certNo)}</b><br><br>Date of Birth does not match our records.`
            );

            return;
        }

        showResult(
            "success",
            `<strong>✓ CDC VERIFIED</strong><br><br>
            <b>Certificate No.:</b> ${escapeHTML(matchedRecord.certificate_no || "")}<br>
            <b>Name:</b> ${escapeHTML(matchedRecord.name || "")}<br>
            <b>Rank:</b> ${escapeHTML(matchedRecord.rank || "")}<br>
            <b>Date of Birth:</b> ${formatDate(matchedRecord.date_of_birth)}<br>
            <b>Date of Issue:</b> ${formatDate(matchedRecord.issue_date)}<br>
            <b>Date of Expiry:</b> ${formatDate(matchedRecord.expiry_date)}<br>
            <b>Status:</b> ${escapeHTML(matchedRecord.status || "")}`
        );

    } catch (error) {

        showResult(
            "error",
            `<strong>CONNECTION ERROR</strong><br><br>${escapeHTML(error.message || String(error))}`
        );
    }
}

function showResult(type, message) {

    const resultBox = document.getElementById("resultBox");

    if (!resultBox) return;

    resultBox.style.display = "block";

    if (type === "success") {
        resultBox.className = "result-box result-success";
    }
    else if (type === "error") {
        resultBox.className = "result-box result-error";
    }
    else {
        resultBox.className = "result-box";
    }

    resultBox.innerHTML = message;
}

function normalizeDate(value) {

    if (!value) return "";

    return String(value)
        .trim()
        .substring(0, 10);
}

function formatDate(value) {

    const date = normalizeDate(value);

    if (!date) return "";

    const parts = date.split("-");

    if (parts.length === 3) {

        return escapeHTML(
            parts[2] +
            "-" +
            parts[1] +
            "-" +
            parts[0]
        );
    }

    return escapeHTML(date);
}

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
