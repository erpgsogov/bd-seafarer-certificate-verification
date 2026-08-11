const SUPABASE_URL =
    "https://zwpcswfrpzpyccdksspi.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_iHFpyTs2PY57NvX6OqUxTg_lr53vTm5";


document.addEventListener("DOMContentLoaded", async function () {

    const form = document.getElementById("verificationForm");
    const certificateInput = document.getElementById("certificateNo");
    const dobInput = document.getElementById("dateOfBirth");
    const resultBox = document.getElementById("resultBox");

    if (!form || !certificateInput || !dobInput || !resultBox) {
        alert("HTML elements not found.");
        return;
    }


    // Check Supabase library

    if (typeof supabase === "undefined") {

        showResult(
            "error",
            "<strong>SUPABASE LIBRARY ERROR</strong><br><br>" +
            "Supabase JavaScript library was not loaded."
        );

        return;
    }


    // Create Supabase client

    const db = supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


    console.log("Supabase client created.");


    // Form submit

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const certNo =
            certificateInput.value.trim();

        const dob =
            dobInput.value.trim();


        if (!certNo) {

            showResult(
                "error",
                "<strong>ERROR</strong><br><br>" +
                "Please enter CDC No."
            );

            return;
        }


        if (!dob) {

            showResult(
                "error",
                "<strong>ERROR</strong><br><br>" +
                "Please select Date of Birth."
            );

            return;
        }


        await verifyCertificate(
            db,
            certNo,
            dob
        );

    });

});


async function verifyCertificate(
    db,
    certNo,
    dob
) {

    showResult(
        "loading",
        "<strong>Checking...</strong><br><br>" +
        "Please wait."
    );


    console.log("CDC:", certNo);
    console.log("DOB:", dob);


    try {

        // ==========================================
        // STEP 1
        // TEST DATABASE
        // ==========================================

        const {
            data: allData,
            error: allError
        } = await db
            .from("certificates")
            .select("*")
            .limit(5);


        console.log("DATABASE DATA:", allData);
        console.log("DATABASE ERROR:", allError);


        if (allError) {

            showResult(
                "error",
                `
                <strong>DATABASE ERROR</strong>
                <br><br>

                ${escapeHTML(
                    allError.message ||
                    "Unknown database error"
                )}

                <br><br>

                Error Code:
                ${escapeHTML(
                    allError.code || "N/A"
                )}
                `
            );

            return;
        }


        // ==========================================
        // STEP 2
        // CHECK ROWS
        // ==========================================

        if (!allData || allData.length === 0) {

            showResult(
                "error",
                `
                <strong>DATABASE CONNECTED</strong>
                <br><br>

                But no records are visible.

                <br><br>

                This usually means:
                <br>
                <b>Supabase RLS / SELECT POLICY problem.</b>
                `
            );

            return;
        }


        console.log(
            "Records visible:",
            allData.length
        );


        // ==========================================
        // STEP 3
        // SEARCH CDC ONLY
        // ==========================================

        const {
            data: records,
            error: searchError
        } = await db
            .from("certificates")
            .select("*")
            .eq("certificate_no", certNo);


        console.log(
            "CDC SEARCH RESULT:",
            records
        );

        console.log(
            "CDC SEARCH ERROR:",
            searchError
        );


        if (searchError) {

            showResult(
                "error",
                `
                <strong>CDC SEARCH ERROR</strong>
                <br><br>

                ${escapeHTML(
                    searchError.message ||
                    "Search failed."
                )}
                `
            );

            return;
        }


        // ==========================================
        // STEP 4
        // CDC NOT FOUND
        // ==========================================

        if (!records || records.length === 0) {

            showResult(
                "error",
                `
                <strong>✗ CDC NOT FOUND</strong>
                <br><br>

                CDC No.
                <b>${escapeHTML(certNo)}</b>
                was not found in the database.
                `
            );

            return;
        }


        // ==========================================
        // STEP 5
        // CHECK DOB
        // ==========================================

        const record = records[0];


        const databaseDOB =
            String(record.date_of_birth || "")
            .substring(0, 10);


        console.log(
            "Database DOB:",
            databaseDOB
        );

        console.log(
            "Entered DOB:",
            dob
        );


        if (databaseDOB !== dob) {

            showResult(
                "error",
                `
                <strong>✗ NOT VERIFIED</strong>

                <br><br>

                CDC No.:
                <b>${escapeHTML(
                    record.certificate_no || ""
                )}</b>

                <br><br>

                The Date of Birth does not match.
                `
            );

            return;
        }


        // ==========================================
        // STEP 6
        // VERIFIED
        // ==========================================

        showResult(
            "success",
            `
            <strong>✓ CDC VERIFIED</strong>

            <br><br>

            <b>CDC No.:</b>
            ${escapeHTML(
                record.certificate_no || ""
            )}

            <br>

            <b>Name:</b>
            ${escapeHTML(
                record.name || ""
            )}

            <br>

            <b>Rank:</b>
            ${escapeHTML(
                record.rank || ""
            )}

            <br>

            <b>Date of Birth:</b>
            ${formatDate(
                record.date_of_birth
            )}

            <br>

            <b>Date of Issue:</b>
            ${formatDate(
                record.issue_date
            )}

            <br>

            <b>Date of Expiry:</b>
            ${formatDate(
                record.expiry_date
            )}

            <br>

            <b>Status:</b>
            ${escapeHTML(
                record.status || ""
            )}
            `
        );


    } catch (error) {

        console.error(
            "FINAL ERROR:",
            error
        );


        showResult(
            "error",
            `
            <strong>CONNECTION / JAVASCRIPT ERROR</strong>
            <br><br>

            ${escapeHTML(
                error.message ||
                String(error)
            )}
            `
        );
    }

}


function showResult(
    type,
    message
) {

    const resultBox =
        document.getElementById("resultBox");


    if (!resultBox) {
        return;
    }


    resultBox.style.display = "block";


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


    resultBox.innerHTML = message;
}


function formatDate(value) {

    if (!value) {
        return "";
    }


    const date =
        String(value).substring(0, 10);


    const parts =
        date.split("-");


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
