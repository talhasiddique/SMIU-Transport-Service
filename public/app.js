async function userAuth() {
let userKey, userData;
// var user = firebase.auth().currentUser;

// if (user) {
//   console.log(user)
// } else {
    //   console.log('not logged in')
    // }
    
    await firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            console.log(user.uid)
            firebase.database().ref(`/registered-users/${user.uid}`).once('value')
                .then(res=>{
                    userDetails = res.val();
                    console.log(userDetails)
                    userRole =  userDetails.role;
                    userRole = userRole.charAt(0).toUpperCase() + userRole.slice(1)
                    console.log(userRole)
                    location.replace=`/FYP/SMIU-Transport-Service/public/${userRole}/index.html`
                })
                .catch(err=>console.log(err))
            } else {
                // No user is signed in.
                location=`/FYP/SMIU-Transport-Service/public/index.html`
                console.log('not logged in')
    }
  });
        // firebase.database().ref(`/registered-users/${userKey}`).once('value')
        // if(userData.role === 'admin'){
        //     location.replace="/FYP/SMIU-Transport-Service/public/Admin/index.html"
        // } else if(userData.role === 'user'){
        //     location.replace="/FYP/SMIU-Transport-Service/public/User/index.html"
        //     // location="./User/index.html"
        // } else{
        //     location.replace('/FYP/SMIU-Transport-Service/public/index.html')
        // }
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
            if(userData.role === 'admin'){
                console.log(userData)
                    // location="./Admin/index.html"
                    location.replace('/FYP/SMIU-Transport-Service/public/Admin/index.html')
                }
                else if(userData.role !== 'admin'){
                    // location="./User/index.html"
                    location.replace('/FYP/SMIU-Transport-Service/public/User/index.html')
       }
      }
    )
    .catch(error=>console.log(error))
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
    // let names = document.getElementsByName(name);
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
                    role: 'user'
                }
                firebase.database().ref(`/registered-users/${key}`).set(userData)
                .then(res=>{
                    // alert('data saved', res)
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


                    //how to get data from DB
                    // firebase.database().ref(`/registered-users`).once('value')
                    // .then(res=>{
                    //     console.log(res.val())
                    // })
                    // .catch(err=>console.log(err))
                })
                .catch(err=>console.log(err))
                    //unheld
            })
            .catch(
                // error=>console.log(error)
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
    
        } else          //same password error
        // alert('passwords different')
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
    else{             //if terms ad condition not checked
        // alert('terms and condition');
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
// let userData = {
//     category : userCategory,
//     userID
// }




const checkPassword = (password, confirmPassword) => password === confirmPassword ? true : false;

function forgetpassreset() {
    var forgotemail=document.getElementById("forgetrestemail").value;
    console.log(forgotemail);
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    // var useremail=document.getElementById("").innerHTML;
// if (forgotemail!==useremail) {
//     Swal.fire({
//         icon: 'error',
//         text: 'There is no account registered against this email. Kindly provide registerd e-mail or Signup',
//          customClass: 'swal-wide',
//       }) 
//       document.getElementById("forgetrestemail").value="";
//       return false;
// }
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

function signupsubmit() {
var signupid=document.getElementById("signuppassengerID").value;
var signuemail=document.getElementById("signupemail").value;
// var userid=document.getElementById("").value;
// var userpemail=document.getElementById("").value;

var signuppass=document.getElementById("signupconfpass").value;
var signuppassagain=document.getElementById("signuppass").value;
var minlength=8;
// if (signupid===userid){
//     Swal.fire({
//         icon: 'error',
//         title:'Sorry',
//         text: 'An account already exixst with this passaengert ID',
//          customClass: 'swal-wide',
//       }) 
//       return false;  
// } 
// if (signupemail===useremail){
//     Swal.fire({
//         icon: 'error',
//         title:'Sorry',
//         text: 'An account already exixst with this email address',
//          customClass: 'swal-wide',
//       }) 
//       return false;  
// }
if(signuppass.length<minlength||signuppassagain.length<minlength){
    Swal.fire({
        icon: 'error',
        text: 'Password length should not be less than 8 charracter',
        customClass: 'swal-wide',
      })  
      return false;
} 
if(signuppass!==signuppassagain){
    Swal.fire({
        icon: 'error',
        text: 'Your passwords does not match!',
        customClass: 'swal-wide',
      }) 
      return false;
}
}
