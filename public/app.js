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

var checkPassword = (password, confirmPassword) => password === confirmPassword ? true : false;

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
var showUser = () =>{
    document.getElementById('users-admin').style.display = 'block'
    document.getElementById('buses-admin').style.display = 'none'
    document.getElementById('news-admin').style.display = 'none'
    document.getElementById('chng-pass-admin').style.display = 'none'
}
var showBuses = () =>{
    document.getElementById('buses-admin').style.display = 'block'
    document.getElementById('users-admin').style.display = 'none'
    document.getElementById('news-admin').style.display = 'none'
    document.getElementById('chng-pass-admin').style.display = 'none'
    getBuses();
}
var showAnnouncemebnt = () =>{
    document.getElementById('users-admin').style.display = 'none'
    document.getElementById('buses-admin').style.display = 'none'
    document.getElementById('news-admin').style.display = 'block'
    document.getElementById('chng-pass-admin').style.display = 'none'
}
var showChangePass = () =>{
    document.getElementById('users-admin').style.display = 'none'
    document.getElementById('buses-admin').style.display = 'none'
    document.getElementById('news-admin').style.display = 'none'
    document.getElementById('chng-pass-admin').style.display = 'block'
}

function addBus(){
    var busName=document.getElementById("newBusName");
    var seatsAvailable=document.getElementById("newSeatsAvailable");
    var MorPoint1=document.getElementById("newMorPoint1");
    var MorPoint2=document.getElementById("newMorPoint2");
    var MorPoint3=document.getElementById("newMorPoint3");
    var MorPoint4=document.getElementById("newMorPoint4");
    var EvePoint1=document.getElementById("newEvePoint1");
    var EvePoint2=document.getElementById("newEvePoint2");
    var EvePoint3=document.getElementById("newEvePoint3");
    var EvePoint4=document.getElementById("newEvePoint4");
    var MorTime1=document.getElementById("newMorTime1");
    var MorTime2=document.getElementById("newMorTime2");
    var MorTime3=document.getElementById("newMorTime3");
    var MorTime4=document.getElementById("newMorTime4");
    var EveTime1=document.getElementById("newEveTime1");
    var EveTime2=document.getElementById("newEveTime2");
    var EveTime3=document.getElementById("newEveTime3");
    var EveTime4=document.getElementById("newEveTime4");


    // console.log(MorTime1.value)
    // console.log(onTimeChange(MorTime1.value))
    // console.log(EveTime1.value)
    // console.log(onTimeChange(EveTime1.value))
    
    var busID = firebase.database().ref(`/busses`).push().key

    var busData={
        busName:busName.value,
        seatsAvailable:seatsAvailable.value,
        MorPoint1:MorPoint1.value,
        MorPoint2:MorPoint2.value,
        MorPoint3:MorPoint3.value,
        MorPoint4:MorPoint4.value,
        EvePoint1:EvePoint1.value,
        EvePoint2:EvePoint2.value,
        EvePoint3:EvePoint3.value,
        EvePoint4:EvePoint4.value,
        MorTime1:MorTime1.value,
        MorTime2:MorTime2.value,
        MorTime3:MorTime3.value,
        MorTime4:MorTime4.value,
        EveTime1:EveTime1.value,
        EveTime2:EveTime2.value,
        EveTime3:EveTime3.value,
        EveTime4:EveTime4.value,
        key:busID
    }

    console.log(busData)
    
    firebase.database().ref(`/busses/${busID}`).set(busData)
    
    getBuses();
    
    busName.value = '';
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
        // console.log(busesArr)

        var buses = busesArr.map( key =>{
            var busKey = `${key.slice(0,8)}`
            // console.log(key)
            console.log(busesObj[key])
            
            // <button class="btn" type="button"><i class="fas fa-save"></i> Save</button>
            // var btn = document.createElement('button')
            
            return(
                `
                    <div class="accordion" id="Buses${busKey}">
                    <div class="card card-custom">
                        <div class="card-header" id="Bus${busKey}">
                            <h2 class="mb-0">
                            <button class="editBusName btn" type="button" data-toggle="collapse" data-target="#collapseBus${busKey}" aria-expanded="true" aria-controls="collapseBus${busKey}">
                                <input class="form-control enterBusName" type="text" id="newBusName${busKey}" placeholder="Enter Bus name" value='${busesObj[key].busName}'>
                            </button>
                            </h2>
                            <label for="seats-av${busKey}">Available Seats </label>(<input class="availableSeats" type="text" id="seats-av${busKey}" value='${busesObj[key].seatsAvailable}'>)
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
                                    <input class="form-control  modalInputsize" type="text" placeholder="point 1" id="${busKey}morPoint1" value='${busesObj[key].MorPoint1}'>
                                </div>
                                <div class="col">
                                    <input class="form-control  modalInputsize" type="time" id="${busKey}morTime1" value='${busesObj[key].MorTime1}'>
                                </div>
                                <div class="col">
                                    <input class="form-control modalInputsize" type="text" placeholder="point 1" id="${busKey}evePoint1" value='${busesObj[key].EvePoint1}'>
                                </div>
                                <div class="col">
                                    <input class="form-control modalInputsize" type="time" id="${busKey}eveTime1" value='${busesObj[key].EveTime1}'>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <input class="form-control modalInputsize" type="text" placeholder="point 2" id="${busKey}morPoint2" value='${busesObj[key].MorPoint2}'>
                                </div>
                                <div class="col">
                                    <input class="form-control modalInputsize" type="time" id="${busKey}morTime2" value='${busesObj[key].MorTime2}'>
                                </div>
                                <div class="col">
                                    <input class="form-control modalInputsize" type="text" placeholder="point 2" id="${busKey}evePoint2" value='${busesObj[key].EvePoint2}'>
                                </div>
                                <div class="col">
                                    <input class="form-control modalInputsize" type="time" id="${busKey}eveTime2" value='${busesObj[key].EveTime2}'>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <input class="form-control modalInputsize" type="text" placeholder="point 3" id="${busKey}morPoint3" value='${busesObj[key].MorPoint3}'>
                                </div>
                                <div class="col">
                                    <input class="form-control modalInputsize" type="time" id="${busKey}morTime3" value='${busesObj[key].MorTime3}'>
                                </div>
                                <div class="col">
                                    <input class="form-control modalInputsize" type="text" placeholder="point 3" id="${busKey}evePoint3" value='${busesObj[key].EvePoint3}'>
                                </div>
                                <div class="col">
                                    <input class="form-control modalInputsize" type="time" id="${busKey}eveTime3" value='${busesObj[key].EveTime3}'>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <input class="form-control modalInputsize" type="text" placeholder="point 4" id="${busKey}morPoint4" value='${busesObj[key].MorPoint4}'>
                                </div>
                                <div class="col">
                                    <input class="form-control modalInputsize" type="time" id="${busKey}morTime4" value='${busesObj[key].MorTime4}'>
                                </div>
                                <div class="col">
                                    <input class="form-control modalInputsize" type="text" placeholder="point 4" id="${busKey}evePoint4" value='${busesObj[key].EvePoint4}'>
                                </div>
                                <div class="col">
                                    <input class="form-control modalInputsize" type="time" id="${busKey}eveTime4" value='${busesObj[key].EveTime4}'>
                                </div>
                            </div>
                        </div>
                        <br>
                        <button class="btn" type="button"><i class="fas fa-save"></i> Save</button>
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
        
        buses = buses.join(' ')
        document.getElementById('scrolldiv').innerHTML = buses;
    }

    // var editBus = () =>{
    //     console.log("clicked")
    // }