```javascript
// ======================================================
// BANGLADESH SEAFARER CERTIFICATE VERIFICATION
// ======================================================

const SUPABASE_URL =
    "https://zwpcswfrpzpyccdksspi.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_iHFpyTs2PY57NvX6OqUxTg_lr53vTm5";


// ======================================================
// START APPLICATION
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    // --------------------------------------------------
    // CHECK SUPABASE LIBRARY
    // --------------------------------------------------

    if (typeof supabase === "undefined") {

        console.error(
            "Supabase library is not loaded."
        );

        showResult(
            "error",
            "<strong>ERROR:</strong><br><br>" +
            "Supabase library could not be loaded."
        );

        return;
    }


    // --------------------------------------------------
    // CREATE SUPABASE CLIENT
    // --------------------------------------------------

    const db = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


    // --------------------------------------------------
    // GET HTML ELEMENTS
    // --------------------------------------------------

    const form =
        document.getElementById("verificationForm");

    const certificateInput =
        document.getElementById("certificateNo");

    const dobInput =
        document.getElementById("dateOfBirth");

    const resultBox =
        document.getElementById("resultBox");


    // --------------------------------------------------
    // CHECK HTML ELEMENTS
    // --------------------------------------------------

    if (!form || !certificateInput || !dobInput || !resultBox) {

        console.error(
            "Required HTML elements are missing."
        );

        return;
    }


    console.log(
        "Certificate Verification System Loaded."
    );


    // ==================================================
    // FORM SUBMIT
    // ==================================================

    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        const certNo =
            certificateInput.value.trim();

        const dob =
            dobInput.value;


        // ------------------------------------------------
        // CHECK CDC NO.
        // ------------------------------------------------

        if (!certNo) {

            showResult(
                "error",
                "<strong>ERROR:</strong><br><br>" +
                "Please enter CDC No."
            );

            certificateInput.focus();

            return;
        }


        // ------------------------------------------------
        // CHECK DATE OF BIRTH
        // ------------------------------------------------

        if (!dob) {

            showResult(
                "error",
                "<strong>ERROR:</strong><br><br>" +
                "Please select Date of Birth."
            );

            dobInput.focus();

            return;
        }


        // ------------------------------------------------
        // VERIFY
        // ------------------------------------------------

        await verifyCertificate(
            db,
            certNo,
            dob
        );

    });


    // ==================================================
    // URL AUTO VERIFICATION
    // ==================================================

    const params =
        new URLSearchParams(
            window.location.search
        );

    const urlCertNo =
        params.get("certNo");

    const urlDob =
        params.get("dob");


    if (urlCertNo && urlDob) {

        certificateInput.value =
            urlCertNo;

        dobInput.value =
            urlDob;

        verifyCertificate(
            db,
            urlCertNo.trim(),
            urlDob
        );
    }

});


// ======================================================
// VERIFY CERTIFICATE
// ======================================================

async function verifyCertificate(
    db,
    certNo,
    dob
) {

    showResult(
        "loading",
        "<strong>Checking certificate...</strong>" +
        "<br><br>Please wait."
    );


    try {

        console.log(
            "Searching CDC:",
            certNo
        );

        console.log(
            "Searching DOB:",
            dob
        );


        // ==================================================
        // DATABASE QUERY
        // ==================================================

        const {
            data,
            error
        } = await db
            .from("certificates")
            .select(
                "certificate_no,name,rank,date_of_birth,issue_date,expiry_date,status"
            )
            .eq(
                "certificate_no",
                certNo
            )
            .eq(
                "date_of_birth",
                dob
            )
            .maybeSingle();


        // ==================================================
        // DATABASE ERROR
        // ==================================================

        if (error) {

            console.error(
                "Supabase Error:",
                error
            );

            showResult(
                "error",
                `
                <strong>DATABASE ERROR</strong>
                <br><br>
                ${escapeHTML(
                    error.message ||
                    "Unable to connect to database."
                )}
                `
            );

            return;
        }


        // ==================================================
        // NOT FOUND
        // ==================================================

        if (!data) {

            showResult(
                "error",
                `
                <strong>✗ CERTIFICATE NOT FOUND</strong>

                <br><br>

                CDC No. or Date of Birth is incorrect.

                <br><br>

                Please check:

                <br>
                • CDC No.

                <br>
                • Date of Birth
                `
            );

            return;
        }


        // ==================================================
        // VERIFIED
        // ==================================================

        showResult(
            "success",
            `
            <strong>✓ CDC VERIFIED</strong>

            <br><br>

            <b>CDC No.:</b>
            ${escapeHTML(data.certificate_no || "")}

            <br>

            <b>Name:</b>
            ${escapeHTML(data.name || "")}

            <br>

            <b>Rank:</b>
            ${escapeHTML(data.rank || "")}

            <br>

            <b>Date of Birth:</b>
            ${escapeHTML(
                formatDate(data.date_of_birth)
            )}

            <br>

            <b>Date of Issue:</b>
            ${escapeHTML(
                formatDate(data.issue_date)
            )}

            <br>

            <b>Date of Expiry:</b>
            ${escapeHTML(
                formatDate(data.expiry_date)
            )}

            <br>

            <b>Status:</b>
            ${escapeHTML(data.status || "")}
            `
        );

    } catch (error) {

        console.error(
            "Verification Error:",
            error
        );

        showResult(
            "error",
            `
            <strong>ERROR</strong>
            <br><br>
            ${escapeHTML(
                error.message ||
                String(error)
            )}
            `
        );
    }
}


// ======================================================
// SHOW RESULT
// ======================================================

function showResult(
    type,
    message
) {

    const resultBox =
        document.getElementById("resultBox");


    if (!resultBox) {

        console.error(
            "resultBox not found."
        );

        return;
    }


    resultBox.style.display =
        "block";


    if (type === "success") {

        resultBox.className =
            "result-box result-success";

    } else if (type === "error") {

        resultBox.className =
            "result-box result-error";

    } else {

        resultBox.className =
            "result-box";
    }


    resultBox.innerHTML =
        message;
}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(value) {

    if (!value) {
        return "";
    }


    const parts =
        String(value).split("-");


    if (parts.length === 3) {

        return (
            parts[2] +
            "-" +
            parts[1] +
            "-" +
            parts[0]
        );
    }


    return String(value);
}


// ======================================================
// SECURITY
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
