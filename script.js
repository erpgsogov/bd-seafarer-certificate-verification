```javascript
// ======================================================
// SUPABASE CONFIGURATION
// ======================================================

const SUPABASE_URL =
    "https://zwpcswfrpzpyccdksspi.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_iHFpyTs2PY57NvX6OqUxTg_lr53vTm5";


// ======================================================
// START APPLICATION
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    // Check Supabase library
    if (typeof supabase === "undefined") {

        showResult(
            "error",
            "ERROR: Supabase library could not be loaded."
        );

        console.error(
            "Supabase JavaScript library is not loaded."
        );

        return;
    }


    // Create Supabase client
    const db = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


    // Get HTML elements
    const form =
        document.getElementById("verificationForm");

    const certificateInput =
        document.getElementById("certificateNo");

    const dobInput =
        document.getElementById("dateOfBirth");


    // Check HTML elements
    if (!form || !certificateInput || !dobInput) {

        showResult(
            "error",
            "ERROR: Verification form could not be loaded."
        );

        console.error(
            "Required HTML elements are missing."
        );

        return;
    }


    // ==================================================
    // FORM SUBMIT
    // ==================================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Get user input
            const certNo =
                certificateInput.value.trim();

            const dob =
                dobInput.value;


            // ==================================================
            // INPUT VALIDATION
            // ==================================================

            if (!certNo) {

                showResult(
                    "error",
                    "ERROR: Please enter CDC No."
                );

                certificateInput.focus();

                return;
            }


            if (!dob) {

                showResult(
                    "error",
                    "ERROR: Please select Date of Birth."
                );

                dobInput.focus();

                return;
            }


            // ==================================================
            // SHOW LOADING
            // ==================================================

            showResult(
                "loading",
                "Checking certificate...<br><br>Please wait."
            );


            console.log(
                "Verification started."
            );

            console.log(
                "CDC No.:",
                certNo
            );

            console.log(
                "Date of Birth:",
                dob
            );


            try {


                // ==================================================
                // SEARCH CERTIFICATE
                // ==================================================

                const response = await db

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


                const data =
                    response.data;

                const error =
                    response.error;


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

                        <b>Message:</b>
                        ${escapeHTML(
                            error.message || "Unknown error"
                        )}

                        <br><br>

                        <b>Code:</b>
                        ${escapeHTML(
                            error.code || "N/A"
                        )}
                        `
                    );

                    return;
                }


                // ==================================================
                // CERTIFICATE NOT FOUND
                // ==================================================

                if (!data) {

                    console.log(
                        "Certificate not found."
                    );


                    showResult(
                        "error",
                        `
                        <strong>✗ CERTIFICATE NOT FOUND</strong>

                        <br><br>

                        CDC No. or Date of Birth is incorrect.

                        <br><br>

                        Please check your:
                        <br>
                        • CDC No.
                        <br>
                        • Date of Birth
                        `
                    );

                    return;
                }


                // ==================================================
                // CERTIFICATE VERIFIED
                // ==================================================

                console.log(
                    "Certificate verified:",
                    data
                );


                showResult(
                    "success",
                    `
                    <strong>✓ CDC VERIFIED</strong>

                    <br><br>

                    <b>CDC No.:</b>
                    ${escapeHTML(
                        data.certificate_no || ""
                    )}

                    <br>

                    <b>Name:</b>
                    ${escapeHTML(
                        data.name || ""
                    )}

                    <br>

                    <b>Rank:</b>
                    ${escapeHTML(
                        data.rank || ""
                    )}

                    <br>

                    <b>Date of Birth:</b>
                    ${escapeHTML(
                        data.date_of_birth || ""
                    )}

                    <br>

                    <b>Date of Issue:</b>
                    ${escapeHTML(
                        data.issue_date || ""
                    )}

                    <br>

                    <b>Date of Expiry:</b>
                    ${escapeHTML(
                        data.expiry_date || ""
                    )}

                    <br>

                    <b>Status:</b>
                    ${escapeHTML(
                        data.status || ""
                    )}
                    `
                );


            } catch (error) {


                // ==================================================
                // GENERAL ERROR
                // ==================================================

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
    );


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


        // Automatically verify
        form.dispatchEvent(
            new Event("submit")
        );
    }

});


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
// SECURITY: ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
```
