async function indexSignup() {
    let full_name, username, email, password, confirm_password, type_of_user, terms_conditions;

    full_name = window.document.getElementById('signup-index-fullname').value
    username = window.document.getElementById('signup-index-username').value
    email = window.document.getElementById('signup-index-email').value
    password = window.document.getElementById('signup-index-password').value
    confirm_password = window.document.getElementById('signup-index-confirm-password').value
    terms_conditions = window.document.getElementById('terms').checked
    type_of_user = window.document.getElementById('type_of_user').checked

    if (full_name.length != 0 && username.length != 0 && email.length != 0 && password.length != 0 &&
        confirm_password.length != 0) {
        window.document.getElementById('error').innerHTML = "";

        if (terms_conditions == true) {
            if (password.length >= 6) {
                window.document.getElementById('error').innerHTML = "";
                if (password == confirm_password) {

                    try {
                        const response = await (
                            await fetch(
                                window.location.origin + `/register`, {
                                method: "POST",
                                redirect: 'follow',
                                body: JSON.stringify({
                                    name: full_name,
                                    username: username,
                                    email: email,
                                    password: password,
                                    type_of_user: type_of_user
                                }),
                                headers: {
                                    "Content-Type": "application/json; charset=utf-8"
                                },
                            }).then(response => {
                                if (response.redirected) {
                                    window.location.href = response.url;
                                } else {
                                    return response.json()
                                }
                            })
                        )
                        window.document.getElementById('error').innerHTML = response.message;
                        //if register was successfull, we try automatic login and go whereever it redirects us.
                        if (response.success == true) {
                            const response = await (
                                await fetch(
                                    window.location.origin + `/login`, {
                                    method: "POST",
                                    redirect: 'follow',
                                    body: JSON.stringify({
                                        email: email,
                                        password: password,
                                    }),
                                    headers: {
                                        "Content-Type": "application/json; charset=utf-8"
                                    },
                                }
                                ).then(response => {
                                    if (response.redirected) {
                                        window.location.href = response.url;
                                    }
                                })
                            )
                        }
                    } catch (e) {
                        window.document.getElementById('error').innerHTML = e;
                    }

                } else {
                    window.document.getElementById('error').innerHTML = "Password's do not match";
                }
            } else {
                window.document.getElementById('error').innerHTML =
                    "Password has to be at minimum of 6 letters.";
            }
        } else {
            window.document.getElementById('error').innerHTML = "Please Agree to Terms and Conditions";
        }
    } else {
        window.document.getElementById('error').innerHTML = "Please Fill All The Fields";
    }
}
