function endLoader() {
    var loaderClass = document.getElementById("se-pre-con");
    loaderClass.style.display = 'none';
}

function setLoader() {
    var loaderClass = document.getElementById("se-pre-con");
    loaderClass.style.display = 'block';
}

function loader() {
    setLoader();
    setTimeout(function () {
        endLoader();
    }, 3000);
}


const directory = `${location.origin}/SMIU-Transport-Service`;

async function userAuth() {
    // const directory = `${location.origin}/public`;
    //          FOR FIREBASE
//     const directory = `${location.origin}/SMIU-Transport-Service`
//     const directory = `https://talhasiddique.github.io/SMIU-Transport-Service/`

    // console.log(directory)
    await firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            firebase.database().ref(`/registered-users/${user.uid}`).once('value')
                .then(res => {
                    userDetails = res.val();
                    if ((userDetails.role === 'user' && user.emailVerified) || (userDetails.role !== 'user' && !user.emailVerified)) {
                        // console.log(userDetails)
                        userRole = userDetails.role;
                        userRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);
                        // console.log(userRole)
                        // console.log(location.pathname)
                        if ((userRole === 'Admin' && location.href !== `${directory}/Admin/`) ||
                            (userRole === 'User' && location.href !== `${directory}/User/`)) {
                            location.replace(`${directory}/${userRole}/`);
                        }
                    } else {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Warning',
                            text: 'Your Account is not Verified. Please verify your account via email sent',
                            customClass: 'swal-wide',
                        });
                        setTimeout(() => {
                            firebase.auth().signOut();
                        }, 2000);
                    }
                })
                .catch(err => console.log(err));
            // console.log(user.uid)
        } else {
            if (location.href !== `${directory}/`) {
                location.replace(`${directory}/`);
            }
        }
    });
}



function signOut() {
    firebase.auth().signOut()
        .then(() => {
            console.log('logout');
            location.replace(`${directory}/`);
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Sorry',
                text: 'Something went wrong. Please check your connection and try again.',
                customClass: 'swal-wide',
            });
        });
}

function loginbtn() {
    event.preventDefault();
    var lgnemailid = document.getElementById("lgn-email-id").value;
    var lgnpassword = document.getElementById("lgn-password").value;
    // console.log(lgnemailid,lgnpassword);

    let userKey, userData;
    firebase.auth().signInWithEmailAndPassword(lgnemailid, lgnpassword)
        .then((res) => {
            userKey = res.user.uid;
            firebase.database().ref(`/registered-users/${userKey}`).once('value')
                .then(res => {
                    userData = { ...res.val() };
                    userRole = userDetails.role;
                    userRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);
                    location.pathname.replace = `/${userRole}/index.html`;
                }
                )
                .catch(err => {
                    location.pathname.replace(`/`);
                });
            document.getElementById("lgn-email-id").value = "";
            document.getElementById("lgn-password").value = "";
        })
        .catch((error) => {
            if (error.code === 'auth/user-not-found') {
                Swal.fire({
                    icon: 'error',
                    text: 'There is no account register against this email address',
                    customClass: 'swal-wide',
                });
                return false;
            } else if (error.code === 'auth/wrong-password') {
                Swal.fire({
                    icon: 'error',
                    text: 'The password you entered is incorrect',
                    customClass: 'swal-wide',
                });
                return false;
            } else if (error.code === 'auth/invalid-email') {
                Swal.fire({
                    icon: 'warning',
                    text: 'Please Enter valid email & password',
                    customClass: 'swal-wide',
                });
                return false;
            }
        });
}

function getRadioValues(names) {
    let checkedValue;
    names.forEach(name => {
        if (name.checked) {
            checkedValue = name.value;
        }
    });
    return checkedValue;
}

function signUp() {
    event.preventDefault();
    var userId = document.getElementById('userId');
    var userName = document.getElementById('userName');
    var userFatherName = document.getElementById('userFatherName');
    var gender = document.getElementsByName('gender');
    var category = document.getElementsByName('category');
    var userGender = getRadioValues(gender);
    var userCategory = getRadioValues(category);
    var userAddress = document.getElementById('userAddress');
    var userEmail = document.getElementById('userEmail');
    var userNumber = document.getElementById('userNumber');
    var userPassword = document.getElementById('userPassword');
    var userConfpassword = document.getElementById('userConfpassword');
    var userTerms = document.getElementById('userTerms');
    var numberFormat = /^((\+92)|(0)){0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
    var isNumberValid = userNumber.value.match(numberFormat);
    if (userCategory && userId.value !== '' && userName.value !== '' && userFatherName.value !== '' && userGender && userAddress.value !== '' && userEmail.value !== '' && userPassword.value !== '' && userConfpassword.value !== '') {
        if (userTerms.checked) {
            let key, userData;
            if (checkPassword(userPassword.value, userConfpassword.value)) {

                if (isNumberValid) {
                    if (userAddress.value.length >= 20) {
                        firebase.auth().createUserWithEmailAndPassword(userEmail.value, userPassword.value)
                            .then(res => {
                                console.log(res.user);
                                res.user.sendEmailVerification().then(function () {
                                }).catch(function (error) {
                                    console.log(error);
                                });
                                key = res.user.uid;
                                userData = {
                                    key: key,
                                    category: userCategory,
                                    userId: userId.value,
                                    userName: userName.value,
                                    fatherName: userFatherName.value,
                                    gender: userGender,
                                    address: userAddress.value,
                                    email: userEmail.value,
                                    contact: userNumber.value,
                                    credit: 0,
                                    role: 'user'
                                };

                                firebase.database().ref(`/registered-users/${key}`).set(userData)
                                    .then(res => {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Your Account has been created successfully. Please check your inbox to verify your account',
                                            customClass: 'swal-wide'
                                        })
                                            .then(function () {
                                                window.location = "../index.html";
                                            });
                                        userId.value = "";
                                        userName.value = "";
                                        userFatherName.value = "";
                                        userEmail.value = "";
                                        userNumber.value = "";
                                        userAddress.value = "";
                                    })
                                    .catch(err => {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Sorry',
                                            text: 'An Exceptional error occured. Please try again',
                                            customClass: 'swal-wide',
                                        });
                                    });

                            })
                            .catch(
                                (error) => {
                                    console.log(error);
                                    if (error.code === "auth/email-already-in-use") {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'The user with this email already exist',
                                            customClass: 'swal-wide',
                                        });

                                    }
                                    if (error.code === "auth/invalid-email") {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Please enter valid email address',
                                            customClass: 'swal-wide',
                                        });
                                    }
                                    if (error.code === "auth/weak-password") {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'The password must be 6 characters long or more.',
                                            customClass: 'swal-wide',
                                        });
                                    }
                                }
                            );
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: "Minimum 20 charracters allowed for address",
                            customClass: 'swal-wide',
                        });
                    }

                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: "Number pattern doesn't match",
                        customClass: 'swal-wide',
                    });
                }

            } else
                Swal.fire({
                    icon: 'error',
                    title: 'Passwords must be same',
                    customClass: 'swal-wide',
                });
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Please accept terms and condition',
                customClass: 'swal-wide',
            });
        }
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Feilds cannot be empty, Please fill all the fields',
            customClass: 'swal-wide',
        });
    }
}

var checkPassword = (password, confirmPassword) => password === confirmPassword ? true : false;

function passwordReset() {
    // event.preventDefault();
    var email = document.getElementById("forgetrestemail").value;
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (email.match(mailformat)) {
        console.log(email);
        firebase.database().ref(`/registered-users`).orderByChild('email').equalTo(email).once('value', function (res) {
            if (res.val()) {
                console.log(email);
                firebase.auth().sendPasswordResetEmail(email).then(function (res) {
                    // console.log(res)
                    Swal.fire({
                        icon: 'success',
                        text: 'Reset Email has been sent to entered email',
                        customClass: 'swal-wide',
                    });
                    // location.replace(`${directory}/`)
                }).catch(function (error) {
                    console.log(error);
                });
            } else {
                Swal.fire({
                    icon: 'warning',
                    text: 'Email does not exist',
                    customClass: 'swal-wide',
                });
            }
        });
    }
    else {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter a valid email address!',
            customClass: 'swal-wide',
        });
        document.getElementById("forgetrestemail").value = "";
        return false;
    }
    email.value = '';
    // }

    if (forgotemail === "") {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter email',
            customClass: 'swal-wide',
        });
        return false;
    }
    if (forgotemail.match(mailformat)) {

        return true;
    }
    else {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter a valid email address!',
            customClass: 'swal-wide',
        });
        document.getElementById("forgetrestemail").value = "";
        return false;
    }
}


//search user function
function searchUser(event) {
    event.preventDefault();
    let searchEmail = document.getElementById('search-user-admin');
    let dataContainer = document.getElementById('user-data-container');
    let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    //HTML fields
    let userID = document.getElementById('userID');
    let name = document.getElementById('userName');
    let userFName = document.getElementById('userFName');
    let userGender = document.getElementById('userGender');
    let userEmail = document.getElementById('userEmail');
    let userCredit = document.getElementById('userCredit');
    let userPhone = document.getElementById('userPhone');
    let userAddress = document.getElementById('userAddress');
    let userKey = document.getElementById('userKey');
    let userRole = document.getElementById('userRole');
    let category = document.getElementById('category');
    let busName = document.getElementById('userSubBusVal');
    let unsubscribeButton = document.getElementById('indivUnsubscribeBtn');


    let user;
    if (searchEmail.value.match(mailformat)) {
        // alert('valid email')
        firebase.database().ref(`/registered-users`).orderByChild('email').equalTo(searchEmail.value).on('value', res => {
            userData = res.val();
            if (userData) {
                Object.keys(userData).forEach(key => {
                    user = { ...userData[key] };
                });
                if (user.role === "user") {
                    dataContainer.style.display = 'grid';
                    let {
                        address,
                        category,
                        role,
                        contact,
                        email,
                        fatherName,
                        gender,
                        key,
                        credit,
                        userId,
                        userName
                    } = user;
                    // let subscribeBusKey = user.subscribeBus.key;
                    let subscribeBusName = user.subscribeBus ? user.subscribeBus.bus : 'no bus subscribed';
                    userID.value = userId;
                    name.value = userName;
                    userFName.value = fatherName;
                    userEmail.value = email;
                    userCredit.value = credit;
                    userPhone.value = contact;
                    userAddress.value = address;
                    userGender.value = gender;
                    userKey.value = key;
                    userRole.value = role;
                    category.value = category;
                    busName.value = subscribeBusName;
                    unsubscribeButton.disabled = user.subscribeBus ? false : true;

                }
                else {
                    Swal.fire({
                        icon: 'warning',
                        text: 'Cannot access admin account',
                        customClass: 'swal-wide',
                    });
                }
            }
            else {
                Swal.fire({
                    icon: 'warning',
                    text: 'There is no account registered against this email address',
                    customClass: 'swal-wide',
                });
            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            text: 'Please enter a valid email address',
            customClass: 'swal-wide',
        });
    }
}

function unsubscribeUser() {
    let userKey = document.getElementById('userKey').value;
    let busKey = null;
    firebase.database().ref(`/registered-users/${userKey}`).once('value')
        .then(res => {
            data = res.val();
            firebase.database().ref(`/registered-users/${userKey}/subscribeBus`).remove()
                .then(() => {
                    let busKey = data.subscribeBus.key;
                    firebase.database().ref(`/subscriptions/${busKey}/${userKey}`).remove()
                        .then(() => {
                            firebase.database().ref(`/registered-users/${userKey}`).once('value')
                                .then(res => {
                                    updatedData = { ...res.val() };

                                    firebase.database().ref(`/subscriptionFee`).once('value')
                                        .then(res => {
                                            fee = parseInt(res.val());
                                            updatedData = {
                                                ...updatedData,
                                                credit: updatedData.credit + fee,
                                            };

                                            firebase.database().ref(`/registered-users/${userKey}`).set({ ...updatedData });
                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });

                                    firebase.database().ref(`/busses/${busKey}`).once('value')
                                        .then(res => {
                                            bus = { ...res.val() };
                                            bus = {
                                                ...bus,
                                                seatsAvailable: bus.seatsAvailable + 1
                                            };
                                            // console.log(bus);

                                            firebase.database().ref(`/busses/${busKey}`).set({ ...bus });

                                        })
                                        .catch(err => {
                                            console.log(err);
                                        });
                                    closeUser();
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                            Swal.fire({
                                icon: 'success',
                                text: 'unnscribed successfully',
                                customClass: 'swal-wide',
                            });
                        }).catch(err => console.log(err));
                }).catch(err => {
                    console.log(err);
                });
        }).catch(
            error => {
                console.log(error);
            }
        );


}
//edit user
async function editUser() {
    let userID = document.getElementById('userID');
    let name = document.getElementById('userName');
    let userFName = document.getElementById('userFName');
    let userGender = document.getElementById('userGender');
    let userEmail = document.getElementById('userEmail');
    let userCredit = document.getElementById('userCredit');
    let userPhone = document.getElementById('userPhone');
    let userAddress = document.getElementById('userAddress');
    let userKey = document.getElementById('userKey');
    let userRole = document.getElementById('userRole');
    let category = document.getElementById('category');
    let dataContainer = document.getElementById('user-data-container');
    let searchEmail = document.getElementById('search-user-admin');
    let validCredit = /^[0-9/.]*$/;

    let userData;

    await firebase.database().ref(`/registered-users/${userKey.value}`).once('value')
        .then(res => {
            userData = { ...res.val() };
        }).catch(err => {
            console.log(err);
        });

    // console.log(userData)

    let user = {
        ...userData,
        userId: userID.value,
        userName: name.value,
        role: userRole.value,
        key: userKey.value,
        gender: userGender.value,
        fatherName: userFName.value,
        email: userEmail.value,
        credit: userCredit.value,
        contact: userPhone.value,
        category: category.value,
        address: userAddress.value
    };

    if (name.value !== '' && userFName.value !== '' && userCredit.value !== '') {
        if (userAddress.value.length >= 20) {
            if (userCredit.value.match(validCredit)) {
                firebase.database().ref(`/registered-users/${user.key}`).set(user)
                    .then(res => {
                        Swal.fire({
                            icon: 'success',
                            text: 'User data has been updated',
                            customClass: 'swal-wide',
                        });
                        dataContainer.style.display = 'none';
                        searchEmail.value = '';
                    })
                    .catch(err => {
                        Swal.fire({
                            icon: 'error',
                            text: 'Something went wrong.Please check your connection and try again.',
                            customClass: 'swal-wide',
                        });
                    });
            }
            else {
                Swal.fire({
                    icon: 'error',
                    text: 'Only numbers alowed for credit',
                    customClass: 'swal-wide',
                });
            }
        }
        else {
            Swal.fire({
                icon: 'warning',
                text: 'Minimum 20 charracters allowed for address',
                customClass: 'swal-wide',
            });
        }
    }
    else {
        Swal.fire({
            icon: 'warning',
            text: 'Fields cannot be empty',
            customClass: 'swal-wide',
        });
    }
}

//close user div
function closeUser() {
    let dataContainer = document.getElementById('user-data-container');
    let searchEmail = document.getElementById('search-user-admin');
    dataContainer.style.display = 'none';
    searchEmail.value = '';
}

//delete selected user
// function deleteUser() {
//     let userKey = document.getElementById('userKey').value;
//     let dataContainer = document.getElementById('user-data-container');
//     let searchEmail = document.getElementById('search-user-admin');
//     let user = firebase.auth().currentUser;
//     console.log(user)
// firebase.auth().deleteUser(userKey).then(() => {
//     firebase.database().ref(`/registered-users/${userKey}`).remove().then(() => {
//         alert('user deleted successfully');
//         dataContainer.style.display = 'none';
//         searchEmail.value = '';

//     })
// })
// }

//set annoucements

function setAnnouncement() {
    let annoucement = document.getElementById('news-text');
    firebase.database().ref(`/annoucements`).set(annoucement.value).then(() => {
        Swal.fire({
            icon: 'success',
            text: 'Announcement updated successfully',
            customClass: 'swal-wide',
        });
    }).catch(err => {
        Swal.fire({
            icon: 'error',
            title: 'Sorry',
            text: 'Something went wrong.Please check your connection and try again.',
            customClass: 'swal-wide',
        });
        console.log(err);
    });
}

function getAnnoucementEdit() {
    let annoucement = document.getElementById('news-text');
    firebase.database().ref(`/annoucements`).once('value', res => {
        annoucement.value = res.val();
    });
}

function getAnnoucement() {
    let userAnnoucement = document.getElementById('announcement');
    firebase.database().ref(`/annoucements`).once('value', res => {
        userAnnoucement.innerHTML = res.val();
    });
}

// async function loadAnnoucement() {
//     await getUserAnnouncement();
// }

// loadAnnoucement();

//change password
function changePassword() {
    let oldPassword = document.getElementById('useroldpass');
    let newPassword = document.getElementById('usernewpass');
    let confirmPassword = document.getElementById('userconfnewpass');
    // console.log(oldPassword +'\n'+newPassword + '\n' + confirmPassword)
    if (newPassword.value !== '' && confirmPassword.value !== '' && oldPassword.value !== '') {
        if (newPassword.value === confirmPassword.value) {
            if (newPassword.value !== oldPassword.value) {
                let user = firebase.auth().currentUser;
                // console.log(user);
                let credentials = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword.value);
                user.reauthenticateWithCredential(credentials).then(() => {
                    user.updatePassword(newPassword.value).then(function () {
                        Swal.fire({
                            icon: 'success',
                            text: 'Your Password has been changed successfully',
                            customClass: 'swal-wide'
                        });
                        oldPassword.value = null;
                        newPassword.value = null;
                        confirmPassword.value = null;

                        // console.log(oldPassword.value,newPassword.value,confirmPassword.value)
                        // alert('successful');
                    }).catch(function (error) {
                        // The password is invalid or the user does not have a password.
                        // console.log(error);
                        Swal.fire({
                            icon: 'error',
                            text: 'New password must be 6 characters long or more',
                            customClass: 'swal-wide'
                        });
                    });
                }).catch(error => {
                    // console.log(error.message);
                    Swal.fire({
                        icon: 'error',
                        text: 'You have entered wrong old password, Please enter a valid old password',
                        customClass: 'swal-wide'
                    });
                });
            }
            else
                Swal.fire({
                    icon: 'error',
                    text: 'Old Password and new password can not be same',
                    customClass: 'swal-wide'
                });

            // console.log(user)
        } else
            Swal.fire({
                icon: 'error',
                text: 'Please enter same new password and confirm new password',
                customClass: 'swal-wide'
            });
    }
    else {
        Swal.fire({
            icon: 'warning',
            text: 'Fields cannot be empty',
            customClass: 'swal-wide'
        });
    }
}

var showUser = () => {
    document.getElementById('users-admin').style.display = 'block';
    document.getElementById('buses-admin').style.display = 'none';
    document.getElementById('news-admin').style.display = 'none';
    document.getElementById('chng-pass-admin').style.display = 'none';
    document.getElementById('subscription-menu').style.display = 'none';
};
var showBuses = () => {
    document.getElementById('buses-admin').style.display = 'block';
    document.getElementById('users-admin').style.display = 'none';
    document.getElementById('news-admin').style.display = 'none';
    document.getElementById('chng-pass-admin').style.display = 'none';
    document.getElementById('subscription-menu').style.display = 'none';
    getBuses();
};
var showAnnouncemebnt = () => {
    document.getElementById('users-admin').style.display = 'none';
    document.getElementById('buses-admin').style.display = 'none';
    document.getElementById('news-admin').style.display = 'block';
    document.getElementById('chng-pass-admin').style.display = 'none';
    document.getElementById('subscription-menu').style.display = 'none';
    getAnnoucementEdit();
};
async function SubscriptionMenu() {
    document.getElementById('users-admin').style.display = 'none';
    document.getElementById('buses-admin').style.display = 'none';
    document.getElementById('news-admin').style.display = 'none';
    document.getElementById('chng-pass-admin').style.display = 'none';
    document.getElementById('subscription-menu').style.display = 'block';
    await getCreditData();
}

var showChangePass = () => {
    document.getElementById('users-admin').style.display = 'none';
    document.getElementById('buses-admin').style.display = 'none';
    document.getElementById('news-admin').style.display = 'none';
    document.getElementById('chng-pass-admin').style.display = 'block';
    document.getElementById('subscription-menu').style.display = 'none';
};

function addBus() {
    var busName = document.getElementById("newBusName");
    var regNo = document.getElementById('newBusRegNumber');
    var seatsAvailable = document.getElementById("newSeatsAvailable");
    var seatsTotal = document.getElementById("newSeatsAvailable");
    var MorPoint1 = document.getElementById("newMorPoint1");
    var MorPoint2 = document.getElementById("newMorPoint2");
    var MorPoint3 = document.getElementById("newMorPoint3");
    var MorPoint4 = document.getElementById("newMorPoint4");
    var EvePoint1 = document.getElementById("newEvePoint1");
    var EvePoint2 = document.getElementById("newEvePoint2");
    var EvePoint3 = document.getElementById("newEvePoint3");
    var EvePoint4 = document.getElementById("newEvePoint4");
    var MorTime1 = document.getElementById("newMorTime1");
    var MorTime2 = document.getElementById("newMorTime2");
    var MorTime3 = document.getElementById("newMorTime3");
    var MorTime4 = document.getElementById("newMorTime4");
    var EveTime1 = document.getElementById("newEveTime1");
    var EveTime2 = document.getElementById("newEveTime2");
    var EveTime3 = document.getElementById("newEveTime3");
    var EveTime4 = document.getElementById("newEveTime4");
    var alphanumericOnly = /^[a-zA-Z0-9]{4,15}$/;
    var onlyNumber = /^[0-9]+$/;


    if (busName.value !== '' && regNo.value !== '' && seatsAvailable.value !== '' && MorPoint1.value !== '' && MorPoint2.value !== '' && MorPoint3.value !== '' && MorPoint4.value !== '' && EvePoint1.value !== '' && EvePoint2.value !== '' && EvePoint3.value !== '' && EvePoint4.value !== '' && MorTime1.value !== '' && MorTime2.value !== '' && MorTime3.value !== '' && MorTime4.value !== '' && EveTime1.value !== '' && EveTime2.value !== '' && EveTime3.value !== '' && EveTime4.value !== '') {
        if (busName.value.match(alphanumericOnly) && regNo.value.match(alphanumericOnly) && MorPoint1.value.match(alphanumericOnly) && MorPoint2.value.match(alphanumericOnly) && MorPoint3.value.match(alphanumericOnly) && MorPoint4.value.match(alphanumericOnly) && EvePoint1.value.match(alphanumericOnly) && EvePoint2.value.match(alphanumericOnly) && EvePoint3.value.match(alphanumericOnly) && EvePoint4.value.match(alphanumericOnly)) {
            if (seatsAvailable.value.match(onlyNumber)) {
                var busID = firebase.database().ref(`/busses`).push().key;
                var busData = {
                    busName: busName.value,
                    regNo: regNo.value,
                    seatsTotal: seatsTotal.value,
                    seatsAvailable: seatsAvailable.value,
                    MorPoint1: MorPoint1.value,
                    MorPoint2: MorPoint2.value,
                    MorPoint3: MorPoint3.value,
                    MorPoint4: MorPoint4.value,
                    EvePoint1: EvePoint1.value,
                    EvePoint2: EvePoint2.value,
                    EvePoint3: EvePoint3.value,
                    EvePoint4: EvePoint4.value,
                    MorTime1: MorTime1.value,
                    MorTime2: MorTime2.value,
                    MorTime3: MorTime3.value,
                    MorTime4: MorTime4.value,
                    EveTime1: EveTime1.value,
                    EveTime2: EveTime2.value,
                    EveTime3: EveTime3.value,
                    EveTime4: EveTime4.value,
                    key: busID
                };

                firebase.database().ref(`/busses/${busID}`).set(busData);

                getBuses();

                busName.value = '';
                regNo.value = '';
                seatsAvailable.value = '';
                MorPoint1.value = '';
                MorPoint2.value = '';
                MorPoint3.value = '';
                MorPoint4.value = '';
                EvePoint1.value = '';
                EvePoint2.value = '';
                EvePoint3.value = '';
                EvePoint4.value = '';
                MorTime1.value = '';
                MorTime2.value = '';
                MorTime3.value = '';
                MorTime4.value = '';
                EveTime1.value = '';
                EveTime2.value = '';
                EveTime3.value = '';
                EveTime4.value = '';
                Swal.fire({
                    icon: 'success',
                    text: 'Bus has been added successfully',
                    customClass: 'swal-wide',
                });

            }
            else {
                Swal.fire({
                    icon: 'warning',
                    text: 'only number allowed for total seats',
                    customClass: 'swal-wide',
                });
            }
        }
        else {
            Swal.fire({
                icon: 'warning',
                text: 'Only Alphanumeric charracters having length between 4-15 charracters allowed',
                customClass: 'swal-wide',
            });
        }
    }
    else {
        Swal.fire({
            icon: 'warning',
            text: 'fields cannot be empty',
            customClass: 'swal-wide',
        });
    }
}

// this function uesr when data show to the user
function onTimeChange(time) {
    var timeSplit = time.split(':'),
        hours,
        minutes,
        meridian;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
        meridian = 'PM';
        hours -= 12;
    } else if (hours < 12) {
        meridian = 'AM';
        if (hours == 0) {
            hours = 12;
        }
    } else {
        meridian = 'PM';
    }

    return hours + ':' + minutes + ' ' + meridian;
}

var getBuses = async () => {
    var busesObj, busesArr;
    await firebase.database().ref(`/busses`).once('value')
        .then(res => {
            busesObj = { ...res.val() };
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Sorry',
                text: 'Something went wrong.Please check your connection and try again.',
                customClass: 'swal-wide',
            });
        });

    busesArr = Object.keys(busesObj);

    var buses = busesArr.map(key => {
        var busKey = `${key.slice(0, 8)}`;

        return (
            `
                    <div class="accordion" id="Buses${busKey}">
                        <div class="card card-custom">
                            <div class="card-header" id="Bus${busKey}">
                            <h2 class="mb-0">
                                <button class="busnameadmin btn btn-link bus-btn-custom" type="button" data-toggle="collapse" data-target="#collapseBus${busKey}" aria-expanded="true" aria-controls="collapseBus${busKey}">
                                    ${busesObj[key].busName}
                                </button>
                            </h2>
                            Registration Number (<span class="boldRed" id="busRegNo${busKey}">${busesObj[key].regNo}</span>)
                            <br>
                            Available Seats (<span class="boldRed" id="seats-av${busKey}">${busesObj[key].seatsAvailable}</span>)
                            </div>
                        
                            <div id="collapseBus${busKey}" class="collapse show" aria-labelledby="Bus${busKey}" data-parent="#Buses${busKey}">
                            <div class="card-body">
                                <div class="container">
                                <div class="row">
                                    <div class="col">
                                    <span class="mor-eve-hd">Morning</span>
                                    </div>
                                    <div class="col">
                                    <span class="mor-eve-hd">Evening</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                    <span class="pnts-time-hd"><i class="fas fa-map-marker-alt mr-2"></i><b>Points</b></span>
                                    </div>
                                    <div class="col">
                                    <span class="pnts-time-hd"><i class="fas fa-clock mr-2"></i><b>Time</b></span>
                                    </div>
                                    <div class="col">
                                    <span class="pnts-time-hd"><i class="fas fa-map-marker-alt mr-2"></i><b>Points</b></span>
                                    </div>
                                    <div class="col">
                                    <span class="pnts-time-hd"><i class="fas fa-clock mr-2"></i><b>Time</b></span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                    <span>${busesObj[key].MorPoint1}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].MorTime1)}</span>
                                    </div>
                                    <div class="col">
                                    <span>${busesObj[key].EvePoint1}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].EveTime1)}</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                    <span>${busesObj[key].MorPoint2}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].MorTime2)}</span>
                                    </div>
                                    <div class="col">
                                    <span>${busesObj[key].EvePoint2}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].EveTime2)}</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                    <span>${busesObj[key].MorPoint3}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].MorTime3)}</span>
                                    </div>
                                    <div class="col">
                                    <span>${busesObj[key].EvePoint3}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].EveTime3)}</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                    <span>${busesObj[key].MorPoint4}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].MorTime4)}</span>
                                    </div>
                                    <div class="col">
                                    <span>${busesObj[key].EvePoint4}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].EveTime4)}</span>
                                    </div>
                                </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `
        );
    });

    buses = buses.join(' ');
    document.getElementById('scrolldiv').innerHTML = buses;
};

function searchBus(event) {
    event.preventDefault();
    let searchRegNo = document.getElementById('search-bus-admin');
    // let dataContainer = document.getElementById('user-data-container');
    // let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    //HTML fields
    var busKey = document.getElementById("fullKey");
    var name = document.getElementById("editBusName");
    var registration = document.getElementById('editBusRegNumber');
    var seats = document.getElementById("editSeatsAvailable");
    var MorningPoint1 = document.getElementById("editMorPoint1");
    var MorningPoint2 = document.getElementById("editMorPoint2");
    var MorningPoint3 = document.getElementById("editMorPoint3");
    var MorningPoint4 = document.getElementById("editMorPoint4");
    var EveningPoint1 = document.getElementById("editEvePoint1");
    var EveningPoint2 = document.getElementById("editEvePoint2");
    var EveningPoint3 = document.getElementById("editEvePoint3");
    var EveningPoint4 = document.getElementById("editEvePoint4");
    var MorningTime1 = document.getElementById("editMorTime1");
    var MorningTime2 = document.getElementById("editMorTime2");
    var MorningTime3 = document.getElementById("editMorTime3");
    var MorningTime4 = document.getElementById("editMorTime4");
    var EveningTime1 = document.getElementById("editEveTime1");
    var EveningTime2 = document.getElementById("editEveTime2");
    var EveningTime3 = document.getElementById("editEveTime3");
    var EveningTime4 = document.getElementById("editEveTime4");

    if (searchRegNo.value !== '') {

        let bus;
        // alert('valid email')
        firebase.database().ref(`/busses`).orderByChild('regNo').equalTo(searchRegNo.value).on('value', res => {
            busData = res.val();
            // console.log(busData);

            if (busData) {
                // dataContainer.style.display = 'grid';
                Object.keys(busData).forEach(key => {
                    // console.log(key);
                    bus = { ...busData[key] };
                });

                // if (searchRegNo.value == bus.regNo) {
                let {
                    busName,
                    regNo,
                    seatsTotal,
                    MorPoint1,
                    MorPoint2,
                    MorPoint3,
                    MorPoint4,
                    EvePoint1,
                    EvePoint2,
                    EvePoint3,
                    EvePoint4,
                    MorTime1,
                    MorTime2,
                    MorTime3,
                    MorTime4,
                    EveTime1,
                    EveTime2,
                    EveTime3,
                    EveTime4,
                    key
                } = bus;

                //enable button here
                document.getElementById('updateDeleteButton').disabled = false;
                document.getElementById('updateEditButton').disabled = false;

                searchRegNo.value = '';

                busKey.value = key;
                name.value = busName;
                registration.value = regNo;
                seats.value = seatsTotal;
                MorningPoint1.value = MorPoint1;
                MorningPoint2.value = MorPoint2;
                MorningPoint3.value = MorPoint3;
                MorningPoint4.value = MorPoint4;
                EveningPoint1.value = EvePoint1;
                EveningPoint2.value = EvePoint2;
                EveningPoint3.value = EvePoint3;
                EveningPoint4.value = EvePoint4;
                MorningTime1.value = MorTime1;
                MorningTime2.value = MorTime2;
                MorningTime3.value = MorTime3;
                MorningTime4.value = MorTime4;
                EveningTime1.value = EveTime1;
                EveningTime2.value = EveTime2;
                EveningTime3.value = EveTime3;
                EveningTime4.value = EveTime4;
            }
            else {
                Swal.fire({
                    icon: 'warning',
                    text: 'There is no bus registered against this registration number',
                    customClass: 'swal-wide',
                });
            }
            // }
        });

    }
    else {
        Swal.fire({
            icon: 'warning',
            text: 'Please enter bus registration number',
            customClass: 'swal-wide',
        });
    }

}

function deleteBus() {
    var busKey = document.getElementById("fullKey");
    // console.log(`${ busKey.value }`)

    firebase.database().ref(`/busses/${busKey.value}`).remove()
        .then(res => {
            Swal.fire({
                icon: 'success',
                text: 'Bus has been deleted successfuly',
                customClass: 'swal-wide',
            });
            // console.log(res)
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Sorry',
                text: 'Something went wrong.Please check your connection and try again.',
                customClass: 'swal-wide',
            });
        });

    getBuses();

    document.getElementById('search-bus-admin').value = '';
    document.getElementById("fullKey").value = '';
    document.getElementById("editBusName").value = '';
    document.getElementById('editBusRegNumber').value = '';
    document.getElementById("editSeatsAvailable").value = '';
    document.getElementById("editMorPoint1").value = '';
    document.getElementById("editMorPoint2").value = '';
    document.getElementById("editMorPoint3").value = '';
    document.getElementById("editMorPoint4").value = '';
    document.getElementById("editEvePoint1").value = '';
    document.getElementById("editEvePoint2").value = '';
    document.getElementById("editEvePoint3").value = '';
    document.getElementById("editEvePoint4").value = '';
    document.getElementById("editMorTime1").value = '';
    document.getElementById("editMorTime2").value = '';
    document.getElementById("editMorTime3").value = '';
    document.getElementById("editMorTime4").value = '';
    document.getElementById("editEveTime1").value = '';
    document.getElementById("editEveTime2").value = '';
    document.getElementById("editEveTime3").value = '';
    document.getElementById("editEveTime4").value = '';

    document.getElementById('updateDeleteButton').disabled = true;
    document.getElementById('updateEditButton').disabled = true;
}


var editBus = async () => {

    var busKey = document.getElementById("fullKey");
    var name = document.getElementById("editBusName");
    var registration = document.getElementById('editBusRegNumber');
    var seats = document.getElementById("editSeatsAvailable");
    var MorningPoint1 = document.getElementById("editMorPoint1");
    var MorningPoint2 = document.getElementById("editMorPoint2");
    var MorningPoint3 = document.getElementById("editMorPoint3");
    var MorningPoint4 = document.getElementById("editMorPoint4");
    var EveningPoint1 = document.getElementById("editEvePoint1");
    var EveningPoint2 = document.getElementById("editEvePoint2");
    var EveningPoint3 = document.getElementById("editEvePoint3");
    var EveningPoint4 = document.getElementById("editEvePoint4");
    var MorningTime1 = document.getElementById("editMorTime1");
    var MorningTime2 = document.getElementById("editMorTime2");
    var MorningTime3 = document.getElementById("editMorTime3");
    var MorningTime4 = document.getElementById("editMorTime4");
    var EveningTime1 = document.getElementById("editEveTime1");
    var EveningTime2 = document.getElementById("editEveTime2");
    var EveningTime3 = document.getElementById("editEveTime3");
    var EveningTime4 = document.getElementById("editEveTime4");
    var alphanumericOnly = /^[a-zA-Z0-9]{4,15}$/;
    var onlyNumber = /^[0-9]+$/;

    if (name.value !== '' && registration.value !== '' && seats.value !== '' && MorningPoint1.value !== '' && MorningPoint2.value !== '' && MorningPoint3.value !== '' && MorningPoint4.value !== '' && EveningPoint1.value !== '' && EveningPoint2.value !== '' && EveningPoint3.value !== '' && EveningPoint4.value !== '' && MorningTime1.value !== '' && MorningTime2.value !== '' && MorningTime3.value !== '' && MorningTime4.value !== '' && EveningTime1.value !== '' && EveningTime2.value !== '' && EveningTime3.value !== '' && EveningTime4.value !== '') {
        if (name.value.match(alphanumericOnly) && registration.value.match(alphanumericOnly) && MorningPoint1.value.match(alphanumericOnly) && MorningPoint2.value.match(alphanumericOnly) && MorningPoint3.value.match(alphanumericOnly) && MorningPoint4.value.match(alphanumericOnly) && EveningPoint1.value.match(alphanumericOnly) && EveningPoint2.value.match(alphanumericOnly) && EveningPoint3.value.match(alphanumericOnly) && EveningPoint4.value.match(alphanumericOnly)) {
            if (seats.value.match(onlyNumber)) {
                await firebase.database().ref(`/busses/${busKey.value}`).once('value')
                    .then(res => {
                        busData = { ...res.val() };
                        var editBusData = {
                            ...busData,
                            busName: name.value,
                            regNo: registration.value,
                            seatsTotal: seats.value,
                            MorPoint1: MorningPoint1.value,
                            MorPoint2: MorningPoint2.value,
                            MorPoint3: MorningPoint3.value,
                            MorPoint4: MorningPoint4.value,
                            EvePoint1: EveningPoint1.value,
                            EvePoint2: EveningPoint2.value,
                            EvePoint3: EveningPoint3.value,
                            EvePoint4: EveningPoint4.value,
                            MorTime1: MorningTime1.value,
                            MorTime2: MorningTime2.value,
                            MorTime3: MorningTime3.value,
                            MorTime4: MorningTime4.value,
                            EveTime1: EveningTime1.value,
                            EveTime2: EveningTime2.value,
                            EveTime3: EveningTime3.value,
                            EveTime4: EveningTime4.value,
                            key: busKey.value
                        };

                        firebase.database().ref(`/busses/${busKey.value}`).set({ ...editBusData });

                    }).catch(err => {
                        console.log(err);
                    });

                getBuses();

                document.getElementById('search-bus-admin').value = '';
                document.getElementById("fullKey").value = '';
                document.getElementById("editBusName").value = '';
                document.getElementById('editBusRegNumber').value = '';
                document.getElementById("editSeatsAvailable").value = '';
                document.getElementById("editMorPoint1").value = '';
                document.getElementById("editMorPoint2").value = '';
                document.getElementById("editMorPoint3").value = '';
                document.getElementById("editMorPoint4").value = '';
                document.getElementById("editEvePoint1").value = '';
                document.getElementById("editEvePoint2").value = '';
                document.getElementById("editEvePoint3").value = '';
                document.getElementById("editEvePoint4").value = '';
                document.getElementById("editMorTime1").value = '';
                document.getElementById("editMorTime2").value = '';
                document.getElementById("editMorTime3").value = '';
                document.getElementById("editMorTime4").value = '';
                document.getElementById("editEveTime1").value = '';
                document.getElementById("editEveTime2").value = '';
                document.getElementById("editEveTime3").value = '';
                document.getElementById("editEveTime4").value = '';

                document.getElementById('updateDeleteButton').disabled = true;
                document.getElementById('updateEditButton').disabled = true;

                Swal.fire({
                    icon: 'success',
                    text: 'Data Updated',
                    customClass: 'swal-wide',
                });
            }
            else {
                Swal.fire({
                    icon: 'warning',
                    text: 'only number allowed for total seats',
                    customClass: 'swal-wide',
                });
            }
        }
        else {
            Swal.fire({
                icon: 'warning',
                text: 'Only Alphanumeric charracters having length between 4-15 charracters allowed',
                customClass: 'swal-wide',
            });
        }
    }
    else {
        Swal.fire({
            icon: 'warning',
            text: 'fields cannot be empty',
            customClass: 'swal-wide',
        });

    }
};

function updateCredit() {
    let credit = document.getElementById('subscriptionFeeVal').value;
    var creditFormat = /^[0-9\.]+$/;
    if (credit.match(creditFormat)) {
        firebase.database().ref(`/subscriptionFee`).set(credit)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    text: 'STS credit has been added',
                    customClass: 'swal-wide',
                });
            }).catch(err => console.log(err));
    } else {
        Swal.fire({
            icon: 'error',
            text: 'Something went wrong.Please check your connection and try again.',
            customClass: 'swal-wide',
        });
    }
}

async function getCreditData() {
    let inputfield = document.getElementById('subscriptionFeeVal');
    await firebase.database().ref(`/subscriptionFee`).on('value', res => {
        if (res.val()) {
            inputfield.value = res.val();
        } else {
            inputfield.value = 0;
        }
    });
}

function cancelAllSubscriptions() {
    firebase.database().ref(`/registered-users`).once('value')
        .then(res => {
            users = { ...res.val() };
            userKey = Object.keys(users)

            userKey.map(key => {
                if (users[key].role !== 'admin') {
                    firebase.database().ref(`/registered-users/${key}/subscribeBus`).remove()
                }
            })

        }).catch(err => {
            console.log(err);
        });

    firebase.database().ref(`/busses`).once('value')
        .then(res => {
            buses = { ...res.val() };
            busKey = Object.keys(buses);

            busKey.map(key => {
                bus = {...buses[key]};
                bus = {
                    ...bus,
                    seatsAvailable: bus.seatsTotal 
                }

                firebase.database().ref(`/busses/${key}`).set({...bus})
            });

        }).catch(err => {
            console.log(err);
        });
    
    firebase.database().ref(`/subscriptions`).remove()
        .then(() => {
            Swal.fire({
                icon: 'success',
                text: 'All susbcriptions are removed successfully',
                customClass: 'swal-wide',
            });
        })
        .catch(err => console.log(err));
}

var getUserBuses = async () => {
    var uid = document.getElementById('userID');
    var busesObj, busesArr, subscribeBus, buses, checkSubscriptions;

    await firebase.database().ref(`/busses`).once('value')
        .then(res => {
            busesObj = { ...res.val() };
        })
        .catch(err => {
            Swal.fire({
                icon: 'error',
                title: 'Sorry',
                text: 'Something went wrong.Please check your connection and try again.',
                customClass: 'swal-wide',
            });
        });

    await firebase.database().ref(`/registered-users/${uid.value}/subscribeBus/key`).once('value')
        .then(res => {
            // console.log(res.val());
            subscribeBus = res.val();
        })
        .catch(err => {
            console.log(err);
        });

    await firebase.database().ref(`/subscriptions`).once('value')
        .then(res => {
            // console.log(res.val());
            checkSubscriptions = Object.keys({ ...res.val() });
        })
        .catch(err => {
            console.log(err);
        });

    if (checkSubscriptions.find(key => key === subscribeBus)) {
        busesArr = Object.keys({ [subscribeBus]: busesObj[subscribeBus] });
    } else {
        busesArr = Object.keys(busesObj);
    }

    buses = busesArr.map((key) => {
        var busKey = `${key.slice(0, 8)}`;

        return (
            `
                    <div class="accordion" id="Buses${busKey}">
                        <div class="card card-custom">
                            <div class="card-header" id="Bus${busKey}">
                            <h2 class="mb-0">
                                <button class="btn btn-link bus-btn-custom" type="button" data-toggle="collapse" data-target="#collapseBus${busKey}" aria-expanded="true" aria-controls="collapseBus${busKey}">
                                    ${busesObj[key].busName}
                                </button>
                            </h2>
                            Registration Number (<span class="boldRed" id="busRegNo${busKey}">${busesObj[key].regNo}</span>)
                            <br>
                            Available Seats (<span class="boldRed" id="seats-av${busKey}">${busesObj[key].seatsAvailable}</span>)
                            </div>
                        
                            <div id="collapseBus${busKey}" class="collapse show" aria-labelledby="Bus${busKey}" data-parent="#Buses${busKey}">
                            <div class="card-body">
                                <div class="container">
                                <div class="row">
                                    <div class="col">
                                    <span class="mor-eve-hd">Morning</span>
                                    </div>
                                    <div class="col">
                                    <span class="mor-eve-hd">Evening</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                    <span class="pnts-time-hd"><i class="fas fa-map-marker-alt mr-2"></i><b>Points</b></span>
                                    </div>
                                    <div class="col">
                                    <span class="pnts-time-hd"><i class="fas fa-clock mr-2"></i><b>Time</b></span>
                                    </div>
                                    <div class="col">
                                    <span class="pnts-time-hd"><i class="fas fa-map-marker-alt mr-2"></i><b>Points</b></span>
                                    </div>
                                    <div class="col">
                                    <span class="pnts-time-hd"><i class="fas fa-clock mr-2"></i><b>Time</b></span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                    <span>${busesObj[key].MorPoint1}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].MorTime1)}</span>
                                    </div>
                                    <div class="col">
                                    <span>${busesObj[key].EvePoint1}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].EveTime1)}</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                    <span>${busesObj[key].MorPoint2}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].MorTime2)}</span>
                                    </div>
                                    <div class="col">
                                    <span>${busesObj[key].EvePoint2}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].EveTime2)}</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                    <span>${busesObj[key].MorPoint3}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].MorTime3)}</span>
                                    </div>
                                    <div class="col">
                                    <span>${busesObj[key].EvePoint3}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].EveTime3)}</span>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                    <span>${busesObj[key].MorPoint4}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].MorTime4)}</span>
                                    </div>
                                    <div class="col">
                                    <span>${busesObj[key].EvePoint4}</span>
                                    </div>
                                    <div class="col">
                                    <span>${onTimeChange(busesObj[key].EveTime4)}</span>
                                    </div>
                                </div>
                                </div>
                                    <button type="button" name="subscribe" ${busesObj[key].seatsAvailable > 0 ? '' : 'disabled=true'} ${checkSubscriptions.find(key => key === subscribeBus) ? `style="display: none"` : `null`} id="subscribe" value="${key}" class="btn-subs" onclick="subscribe(this.value);">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `
        );
    });

    buses = buses.join(' ');
    document.getElementById('scrolldiv').innerHTML = buses;

};

async function subscribe(busKey) {
    var stsamount = parseInt(document.getElementById("stscrdtamnt").innerHTML);
    var userId = document.getElementById('userID').value;
    var StsCredit = document.getElementById('stscrdtamnt');
    var userName = document.getElementById('userpgName');
    var email = document.getElementById('userpgEmail');

    var subscribeUsers, userData, busData;
    // console.log(stsamount, userId);

    await firebase.database().ref(`/registered-users/${userId}`).once('value')
        .then(res => {
            userData = { ...res.val() };
            // console.log(userData);
        })
        .catch(err => {
            console.log(err);
        });

    await firebase.database().ref(`/busses/${busKey}`).once('value')
        .then(res => {
            busData = { ...res.val() };
            // console.log(busData);
        })
        .catch(err => {
            console.log(err);
        });

    await firebase.database().ref(`/subscriptions/${busKey}`).once('value')
        .then(res => {
            subscribeUsers = { ...res.val() };
            // console.log(subscribeUsers);
        })
        .catch(err => {
            console.log(err);
        });

    subscribeUsers = {
        ...subscribeUsers,
        [userId]: {
            userId: userId,
            credit: StsCredit.innerHTML,
            Name: userName.innerHTML,
            email: email.innerHTML,
        }
    };

    firebase.database().ref('/subscriptionFee/').once('value')
        .then(res => {
            if (stsamount >= res.val()) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Are you sure?',
                    showCancelButton: true,
                    confirmButtonText: `Yes`,
                    cancelButtonColor: '#971414',
                    confirmButtonColor: '#ec7916',
                    customClass: 'swal-wide',
                }).then((result) => {
                    if (result.isConfirmed) {

                        var remainCredit = stsamount - res.val();

                        userData = {
                            ...userData,
                            credit: remainCredit,
                            subscribeBus: {
                                key: busData.key,
                                bus: busData.busName,
                            }
                        };

                        busData = {
                            ...busData,
                            seatsAvailable: busData.seatsAvailable - 1
                        };

                        firebase.database().ref(`/subscriptions/${busKey}`).set(subscribeUsers)
                            .then(res => {
                                firebase.database().ref(`/registered-users/${userId}`).set(userData);
                                firebase.database().ref(`/busses/${busData.key}`).set({ ...busData });
                                Swal.fire('You have subscribed this Bus', '', 'success');
                                getUserBuses();
                            }).catch(err => {
                                console.log(err);
                                Swal.fire(err.message, '', 'error');
                            });
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Insufficient Credit',
                    text: 'Sorry, you have insufficent credit,please recharge ',
                    customClass: 'swal-wide',
                });
                return false;
            }
        })
        .catch(err => {
            console.log(ree);
        });

}

