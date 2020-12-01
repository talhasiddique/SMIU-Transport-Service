function userAuth() {
let userKey, userData;
console.log('Auth function');
    firebase.auth().onAuthStateChanged(user=>{
        console.log(user)
        userKey = user.uid;
        if(user){
            firebase.database().ref(`/registered-users/${userKey}`).once('value')
            .then(res=>{
                userData = {...res.val()}
                if(userData.role === 'admin'){
                    location="/G:/FYP/SMIU-Transport-Service/public/Admin/index.html"
                }
                else if(userData.role === 'user'){
                    location="./User/index.html"
                }
            })
            .catch(error=>console.log(error))
        } else {
            location = "../index.html"
            return false;
        }
    })
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
                    location="./Admin/index.html"
            }
            else if(userData.role !== 'admin'){
                    location="./User/index.html"
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

function signUp(){
    if(document.getElementById('student').checked){
    var userCategory=document.getElementById('student').value
    }
    if(document.getElementById('faculty').checked){
    var userCategory=document.getElementById('faculty').value
    }
var userId=document.getElementById('userId').value
var userName=document.getElementById('userName').value
var userFatherName=document.getElementById('userFatherName').value
if(document.getElementById('female').checked){
    var userGender=document.getElementById('female').value
    }
if(document.getElementById('male').checked){
    var userGender=document.getElementById('male').value
    }
var userAddress=document.getElementById('userAddress').value
var userEmail=document.getElementById('userEmail').value
var userNumber=document.getElementById('userNumber').value
var userPassword=document.getElementById('userPassword').value
var userConfpassword=document.getElementById('userConfpassword').value
var userTerms=document.getElementById('userTerms').checked;

// let userData = {
//     category : userCategory,
//     userID
// }

if(userTerms){
    let key, userData;
    if(checkPassword(userPassword, userConfpassword)){
        firebase.auth().createUserWithEmailAndPassword(userEmail,userPassword)
        .then(res=>{
            key = res.user.uid;
            userData={
                key: key,
                category: userCategory,
                userId: userId,
                userName: userName,
                fatherName: userFatherName,
                gender: userGender,
                address: userAddress,
                email: userEmail,
                contact: userNumber,
                role: 'user'
            }
            firebase.database().ref(`/registered-users/${key}`).set(userData)
            .then(res=>{
                alert('data saved', res)
                //how to get data from DB
                // firebase.database().ref(`/registered-users`).once('value')
                // .then(res=>{
                //     console.log(res.val())
                // })
                .catch(err=>console.log(err))
            })
            .catch(err=>console.log(err))
        })
        .catch(error=>console.log(error))
    } else alert('passwords different')
} else{
    alert('terms and condition');
}


}

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
