const SUPABASE_URL = "https://zwpcswfrpzpyccdksspi.supabase.co";
const SUPABASE_ANON_KEY = sb_publishable_iHFpyTs2PY57NvX6OqUxTg_lr53vTm5

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// Page load
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


// Form submit
document.getElementById("verificationForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const certNo = document.getElementById("certificateNo").value.trim();
    const dob = document.getElementById("dateOfBirth").value;

    verifyCertificate(certNo, dob);
});


// Verify certificate
async function verifyCertificate(certNo, dob) {

    const resultBox = document.getElementById("resultBox");

    resultBox.style.display = "block";
    resultBox.className = "result-box";
    resultBox.innerHTML = "Checking certificate...";

    const { data, error } = await db
        .from("certificates")
        .select("*")
        .eq("certificate_no", certNo)
        .eq("date_of_birth", dob)
        .maybeSingle();

    if (error) {
        console.error(error);

        resultBox.className = "result-box result-error";
        resultBox.innerHTML =
            "<strong>ERROR:</strong> Unable to connect to verification database.";

        return;
    }

    if (!data) {
        resultBox.className = "result-box result-error";
        resultBox.innerHTML =
            "<strong>ERROR:</strong> CDC No. or Date of Birth is incorrect.";
        return;
    }

    resultBox.className = "result-box result-success";

    resultBox.innerHTML = `
        <strong>✓ CDC VERIFIED</strong><br><br>

        <b>CDC No.:</b> ${data.certificate_no}<br>
        <b>Name:</b> ${data.name}<br>
        <b>Rank:</b> ${data.rank || ""}<br>
        <b>Date of Birth:</b> ${data.date_of_birth}<br>
        <b>Date of Issue:</b> ${data.issue_date || ""}<br>
        <b>Date of Expiry:</b> ${data.expiry_date || ""}<br>
        <b>Status:</b> ${data.status || ""}
    `;
}
