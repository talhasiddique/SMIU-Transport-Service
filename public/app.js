function endLoader(){
    var loaderClass = document.getElementById("se-pre-con")
    loaderClass.style.display = 'none'
}

function setLoader(){
    var loaderClass = document.getElementById("se-pre-con")
    loaderClass.style.display =  'block';
}

function loader () {
    setLoader();
    setTimeout(function(){
        endLoader()
    }, 3000)
}

async function userAuth() {
        const directory = `${location.origin}/public`
        //          FOR FIREBASE
        // const directory = `${location.origin}/`

        // console.log(directory)
        await firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            // console.log(user.uid)
            firebase.database().ref(`/registered-users/${user.uid}`).once('value')
                .then(res=>{
                    userDetails = res.val();
                    // console.log(userDetails)
                    userRole =  userDetails.role;
                    userRole = userRole.charAt(0).toUpperCase() + userRole.slice(1)
                    // console.log(userRole)
                    // console.log(location.pathname)
                    if((userRole === 'Admin' && location.href !== `${directory}/Admin/`) ||
                        (userRole === 'User' && location.href !== `${directory}/User/`)) 
                        {
                            location.replace(`${directory}/${userRole}/`)
                        }
                })
                .catch(err=>console.log(err))
            } else {
                if(location.href !==`${directory}/`){
                    location.replace(`${directory}/`)
                }
    }
});
}



function signOut(){
    firebase.auth().signOut()
    .then(()=>{
        console.log('logout')
        location = "../index.html"
    })
    .catch(error=>console.log(error))
}

function loginbtn(){
    event.preventDefault();
    var lgnemailid=document.getElementById("lgn-email-id").value;
    var lgnpassword=document.getElementById("lgn-password").value;
    // console.log(lgnemailid,lgnpassword);

    let userKey, userData;
    firebase.auth().signInWithEmailAndPassword(lgnemailid, lgnpassword)
    .then((res) => {
        userKey = res.user.uid;
        firebase.database().ref(`/registered-users/${userKey}`).once('value')
        .then(res=>{
            userData = {...res.val()}
            userRole =  userDetails.role;
            userRole = userRole.charAt(0).toUpperCase() + userRole.slice(1)
            location.pathname.replace=`/${userRole}/index.html`
      }
    )
    .catch(err=>{
        location.pathname.replace(`/`)
    })
    document.getElementById("lgn-email-id").value  ="";
    document.getElementById("lgn-password").value="";
  })
  .catch((error) => {
      if(error.code === 'auth/user-not-found'){
        Swal.fire({
        icon: 'error',
        title:'Sorry',
        text: 'There is no account register against this email address',
        customClass: 'swal-wide',
      }) 
      return false;  
      } else if(error.code === 'auth/wrong-password'){
        Swal.fire({
            icon: 'error',
            text: 'The password you entered is incorrect',
            customClass: 'swal-wide',
        }) 
        return false;
      } else if(error.code === 'auth/invalid-email'){
        Swal.fire({
            icon: 'warning',
            text: 'Please Enter valid email & password',
            customClass: 'swal-wide',
        })  
                  return false;
      }
  });
}

function getRadioValues(names){
    let checkedValue;
    names.forEach(name=>{
        if(name.checked){
            checkedValue = name.value;
        }
    })
    return checkedValue
}

function signUp(){
    event.preventDefault();
var userId=document.getElementById('userId')
var userName=document.getElementById('userName')
var userFatherName=document.getElementById('userFatherName')
var gender = document.getElementsByName('gender')
var category=document.getElementsByName('category')
var userGender = getRadioValues(gender)
var userCategory = getRadioValues(category)
var userAddress=document.getElementById('userAddress')
var userEmail=document.getElementById('userEmail')
var userNumber=document.getElementById('userNumber')
var userPassword=document.getElementById('userPassword')
var userConfpassword=document.getElementById('userConfpassword')
var userTerms=document.getElementById('userTerms');
var numberFormat= /^((\+92)|(0)){0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;
var isNumberValid=userNumber.value.match(numberFormat)
if(userCategory && userId.value!=='' && userName.value!=='' && userFatherName.value!=='' && userGender&& userAddress.value !== '' && userEmail.value !=='' && isNumberValid && userPassword.value!== '' && userConfpassword.value!== '' && userTerms.checked){
    if(userTerms){
        let key, userData;
        if(checkPassword(userPassword.value, userConfpassword.value)){
            firebase.auth().createUserWithEmailAndPassword(userEmail.value,userPassword.value)
            .then(res=>{
                key = res.user.uid;
                userData={
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
                }
                firebase.database().ref(`/registered-users/${key}`).set(userData)
                .then(res=>{
                    Swal.fire({
                        icon: 'success',
                        title:'Your Account has been created successfully',
                        customClass: 'swal-wide'
                      }) 
                      .then(function() {
                        window.location = "../index.html";
                    });
                    userId.value="";
                    userName.value="";
                    userFatherName.value="";
                    userEmail.value="";
                    userNumber.value="";
                    userAddress.value="";
                })
                .catch(err=>console.log(err))
            })
            .catch(
                (error)=>{
                    console.log(error)
                    if(error.code==="auth/email-already-in-use"){
                        Swal.fire({
                            icon: 'error',
                            title:'The user with this email already exist',
                            customClass: 'swal-wide',
                          }) 
    
                    }
                    if (error.code==="auth/invalid-email") {
                        Swal.fire({
                            icon: 'error',
                            title:'Please enter valid email address',
                            customClass: 'swal-wide',
                          }) 
                    }
                    if (error.code==="auth/weak-password") {
                        Swal.fire({
                            icon: 'error',
                            title:'The password must be 6 characters long or more.',
                            customClass: 'swal-wide',
                          })   
                    }
                }
            )
    
        } else
        Swal.fire({
            icon: 'error',
            title:'Passwords must be same',
            customClass: 'swal-wide',
          }) 
    } 
    else if(!isNumberValid){
        Swal.fire({
            icon: 'error',
            title:"Number pattern doesn't match",
            customClass: 'swal-wide',
          }) 
    }
    else{
        Swal.fire({
            icon: 'error',
            title:'Please accept terms and condition',
            customClass: 'swal-wide',
          }) 
    }
    
    
} 

else{
    Swal.fire({
        icon: 'error',
        title:'Feilds cannot be empty, Please fill all the fields',
        customClass: 'swal-wide',
      }) 
    }
}

const checkPassword = (password, confirmPassword) => password === confirmPassword ? true : false;

function forgetpassreset() {
    var forgotemail=document.getElementById("forgetrestemail").value;
    console.log(forgotemail);
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
   
if (forgotemail===""){
    Swal.fire({
        icon: 'warning',
        text: 'Please enter email',
        customClass: 'swal-wide',
      }) 
      return false;  
}
    if (forgotemail.match(mailformat)) {
        
        return true;}
    else{
        Swal.fire({
            icon: 'warning',
            text: 'Please enter a valid email address!',
            customClass: 'swal-wide',
          }) 
          document.getElementById("forgetrestemail").value="";
          return false;  
    }
}


//search user function
function searchUser() {
    event.preventDefault()
    let searchEmail = document.getElementById('search-user-admin');
    let dataContainer = document.getElementById('user-data-container')
    let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    //HTML fields
    let userID = document.getElementById('userID')
    let name = document.getElementById('userName')
    let userFName = document.getElementById('userFName')
    let userGender = document.getElementById('userGender')
    let userEmail = document.getElementById('userEmail')
    let userCredit = document.getElementById('userCredit')
    let userPhone = document.getElementById('userPhone')
    let userAddress = document.getElementById('userAddress')
    let userKey = document.getElementById('userKey')
    let userRole = document.getElementById('userRole')
    let category = document.getElementById('category')


    let user;
    if (searchEmail.value.match(mailformat)) {
        // alert('valid email')
        firebase.database().ref(`/registered-users`).orderByChild('email').equalTo(searchEmail.value).on('value', res => {
            userData = res.val();
            if (userData) {
                dataContainer.style.display = 'grid'
                Object.keys(userData).forEach(key => {
                    user = {...userData[key]}
                })

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
            }
        })
    } else {
        alert('invalid email')
    }
}

//edit user
function editUser() {
    let userID = document.getElementById('userID')
    let name = document.getElementById('userName')
    let userFName = document.getElementById('userFName')
    let userGender = document.getElementById('userGender')
    let userEmail = document.getElementById('userEmail')
    let userCredit = document.getElementById('userCredit')
    let userPhone = document.getElementById('userPhone')
    let userAddress = document.getElementById('userAddress')
    let userKey = document.getElementById('userKey')
    let userRole = document.getElementById('userRole')
    let category = document.getElementById('category')
    let dataContainer = document.getElementById('user-data-container')
    let searchEmail = document.getElementById('search-user-admin');



    let user = {
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
    }

    firebase.database().ref(`/registered-users/${user.key}`).set(user)
        .then(res => {
            alert('user updated');
            dataContainer.style.display = 'none';
            searchEmail.value = '';
        })
        .catch(err=>console.log(err))
}

//close user div
function closeUser() {
    let dataContainer = document.getElementById('user-data-container')
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

function addBus(){
    var busName=document.getElementById("newBusName").value;
    var seatsAvailable=document.getElementById("newSeatsAvailable").value;
    var MorPoint1=document.getElementById("newMorPoint1").value;
    var MorPoint2=document.getElementById("newMorPoint2").value;
    var MorPoint3=document.getElementById("newMorPoint3").value;
    var MorPoint4=document.getElementById("newMorPoint4").value;
    var EvePoint1=document.getElementById("newEvePoint1").value;
    var EvePoint2=document.getElementById("newEvePoint2").value;
    var EvePoint3=document.getElementById("newEvePoint3").value;
    var EvePoint4=document.getElementById("newEvePoint4").value;
    var MorTime1=onTimeChange(document.getElementById("newMorTime1").value);
    var MorTime2=onTimeChange(document.getElementById("newMorTime2").value);
    var MorTime3=onTimeChange(document.getElementById("newMorTime3").value);
    var MorTime4=onTimeChange(document.getElementById("newMorTime4").value);
    var EveTime1=onTimeChange(document.getElementById("newEveTime1").value);
    var EveTime2=onTimeChange(document.getElementById("newEveTime2").value);
    var EveTime3=onTimeChange(document.getElementById("newEveTime3").value);
    var EveTime4=onTimeChange(document.getElementById("newEveTime4").value);

    
    var busID = firebase.database().ref(`/busses`).push().key

    var busData={
        busName,
        seatsAvailable,
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
        key:busID
    }

    firebase.database().ref(`/busses/${busID}`).set(busData)
    getBuses();
}

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

var getBuses = async() => {
    var busesObj, busesArr;
    await firebase.database().ref(`/busses`).once('value')
        .then( res =>{
            busesObj = {...res.val()};
        })
        .catch(err =>{
            console.log(err)
        })

        busesArr = Object.keys(busesObj)

        document.getElementById('scrolldiv').innerHTML = busesArr.map( key =>{
            console.log(key.slice(0,6))
            return(
                `
                    <div class="accordion" id="Buses${key.slice(0,6)}">
                        <div class="card card-custom">
                            <div class="card-header" id="Bus${key.slice(0,6)}">
                                <h2 class="mb-0">
                                <button class="editBusName btn" type="button" data-toggle="collapse" data-target="#collapseBus${key.slice(0,6)}" aria-expanded="true" aria-controls="collapseBus${key.slice(0,6)}">
                                    <input class="form-control enterBusName" type="text" id="newBusName${key.slice(0,6)}" placeholder="Enter Bus name">
                                </button>
                                </h2>
                                <label for="seats-av">Available Seats </label>(<input class="availableSeats" type="text" id="seats-av">)
                                <!-- Available Seats (<span id="seats-av">23</span>) -->
                            </div>
                            <div id="collapseBus${key.slice(0,6)}" class="collapse show" aria-labelledby="BusOne" data-parent="#Buses">
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
                                        <input class="form-control  modalInputsize" type="text" placeholder="point 1" id="morPoint1">
                                    </div>
                                    <div class="col">
                                        <input class="form-control  modalInputsize" type="time" id="morTime1">
                                    </div>
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="text" placeholder="point 1" id="evePoint1">
                                    </div>
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="time" id="eveTime1">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="text" placeholder="point 2" id="morPoint2">
                                    </div>
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="time" id="morTime2">
                                    </div>
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="text" placeholder="point 2" id="evePoint2">
                                    </div>
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="time" id="eveTime2">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="text" placeholder="point 3" id="morPoint3">
                                    </div>
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="time" id="morTime3">
                                    </div>
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="text" placeholder="point 3" id="evePoint3">
                                    </div>
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="time" id="eveTime3">
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="text" placeholder="point 4" id="morPoint4">
                                    </div>
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="time" id="morTime4">
                                    </div>
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="text" placeholder="point 4" id="evePoint4">
                                    </div>
                                    <div class="col">
                                        <input class="form-control modalInputsize" type="time" id="eveTime4">
                                    </div>
                                </div>
                            </div>
                            <br>
                            <button class="btn"><i class="fas fa-save"></i> Save</button>
                            <button class="btn BusDeleteBtn"><i class="fas fa-trash"></i> Delete Bus</button>
                            <br>
                            <br>
                    </div>
                    </div>
                    </div>
                    </div>
                    </div>
                `
            )
        })

        // console.log(busesObj)
        // console.log(busesArr)
    }