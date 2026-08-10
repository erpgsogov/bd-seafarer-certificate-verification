```javascript
// ======================================================
// SUPABASE CONFIGURATION
// ======================================================

const SUPABASE_URL =
    "https://zwpcswfrpzpyccdksspi.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_iHFpyTs2PY57NvX6OqUxTg_lr53vTm5";


// ======================================================
// CHECK SUPABASE LIBRARY
// ======================================================

if (typeof supabase === "undefined") {

    console.error("Supabase library was NOT loaded.");

    document.addEventListener("DOMContentLoaded", function () {

        const resultBox =
            document.getElementById("resultBox");

        if (resultBox) {

            resultBox.style.display = "block";

            resultBox.className =
                "result-box result-error";

            resultBox.innerHTML = `
                <strong>ERROR:</strong><br><br>
                Supabase library could not be loaded.<br>
                Please check your internet connection.
            `;
        }

    });

    throw new Error("Supabase library not loaded.");
}


// ======================================================
// CREATE SUPABASE CLIENT
// ======================================================

const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Page loaded successfully.");

    const form =
        document.getElementById("verificationForm");

    const certificateInput =
        document.getElementById("certificateNo");

    const dobInput =
        document.getElementById("dateOfBirth");

    const resultBox =
        document.getElementById("resultBox");


    // --------------------------------------------------
    // CHECK REQUIRED HTML ELEMENTS
    // --------------------------------------------------

    if (!form) {

        console.error(
            "verificationForm element not found."
        );

        return;
    }

    if (!certificateInput) {

        console.error(
            "certificateNo element not found."
        );

        return;
    }

    if (!dobInput) {

        console.error(
            "dateOfBirth element not found."
        );

        return;
    }

    if (!resultBox) {

        console.error(
            "resultBox element not found."
        );

        return;
    }


    console.log("Verification form found.");
    console.log("Supabase client initialized.");


    // ==================================================
    // URL AUTO VERIFICATION
    // ==================================================

    const urlParams =
        new URLSearchParams(window.location.search);

    const certParam =
        urlParams.get("certNo");

    const dobParam =
        urlParams.get("dob");


    if (certParam && dobParam) {

        certificateInput.value =
            certParam;

        dobInput.value =
            dobParam;

        verifyCertificate(
            certParam,
            dobParam
        );
    }


    // ==================================================
    // FORM SUBMIT
    // ==================================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log("VERIFY button clicked.");

            const certNo =
                certificateInput.value
                    .trim();

            const dob =
                dobInput.value;


            // ----------------------------------------------
            // EMPTY FIELD CHECK
            // ----------------------------------------------

            if (!certNo) {

                showError(
                    "Please enter CDC No."
                );

                certificateInput.focus();

                return;
            }


            if (!dob) {

                showError(
                    "Please select Date of Birth."
                );

                dobInput.focus();

                return;
            }


            console.log(
                "CDC No.:",
                certNo
            );

            console.log(
                "Date of Birth:",
                dob
            );


            await verifyCertificate(
                certNo,
                dob
            );

        }
    );

});


// ======================================================
// VERIFY CERTIFICATE
// ======================================================

async function verifyCertificate(
    certNo,
    dob
) {

    const resultBox =
        document.getElementById("resultBox");


    // --------------------------------------------------
    // SHOW CHECKING MESSAGE
    // --------------------------------------------------

    resultBox.style.display =
        "block";

    resultBox.className =
        "result-box";

    resultBox.innerHTML = `
        <strong>Checking certificate...</strong>
        <br><br>
        Please wait.
    `;


    console.log(
        "Starting certificate verification..."
    );


    try {


        // ==================================================
        // TEST SUPABASE CONNECTION
        // ==================================================

        console.log(
            "Connecting to Supabase..."
        );


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
                "SUPABASE DATABASE ERROR:",
                error
            );


            resultBox.className =
                "result-box result-error";


            resultBox.innerHTML = `
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

                <br><br>

                <b>Details:</b>
                ${escapeHTML(
                    error.details || "N/A"
                )}

                <br><br>

                <b>Hint:</b>
                ${escapeHTML(
                    error.hint || "N/A"
                )}
            `;

            return;
        }


        // ==================================================
        // NO CERTIFICATE FOUND
        // ==================================================

        if (!data) {

            console.log(
                "Certificate not found."
            );


            resultBox.className =
                "result-box result-error";


            resultBox.innerHTML = `
                <strong>✗ CERTIFICATE NOT FOUND</strong>
                <br><br>

                CDC No. or Date of Birth is incorrect.

                <br><br>

                Please check:
                <br>
                • CDC No.
                <br>
                • Date of Birth
            `;

            return;
        }


        // ==================================================
        // CERTIFICATE FOUND
        // ==================================================

        console.log(
            "Certificate found:",
            data
        );


        resultBox.className =
            "result-box result-success";


        resultBox.innerHTML = `

            <strong>
                ✓ CDC VERIFIED
            </strong>

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

        `;

    }


    // ==================================================
    // JAVASCRIPT ERROR
    // ==================================================

    catch (error) {

        console.error(
            "VERIFICATION ERROR:",
            error
        );


        resultBox.className =
            "result-box result-error";


        resultBox.innerHTML = `

            <strong>
                JAVASCRIPT ERROR
            </strong>

            <br><br>

            <b>Message:</b>

            ${escapeHTML(
                error.message ||
                String(error)
            )}

            <br><br>

            Please send me a screenshot
            of this error.

        `;

    }

}


// ======================================================
// SHOW ERROR
// ======================================================

function showError(message) {

    const resultBox =
        document.getElementById("resultBox");


    resultBox.style.display =
        "block";


    resultBox.className =
        "result-box result-error";


    resultBox.innerHTML = `
        <strong>ERROR:</strong>
        ${escapeHTML(message)}
    `;

}


// ======================================================
// HTML SECURITY
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
