function loginbtn(){
    var lgnemailid=document.getElementById("lgn-email-id").value;
    var lgnpassword=document.getElementById("lgn-password").value;
    // var userid=document.getElementById("").value;
    // var useremail=document.getElementById("").value;    
    // var userpassword=document.getElementById("").value;
//     if (lgnemailid!==useremail){
//     Swal.fire({
//         icon: 'error',
//         title:'Sorry',
//         text: 'There is no account register against this email address',
//       }) 
//       return false;  
// } 
// if (lgnemailid!==userid){
//     Swal.fire({
//         icon: 'error',
//         title:'Sorry',
//         text: 'There is no account register against this passenger ID',
//       }) 
//       return false;  
// } 

// if(lgnpassword!==userpassword){
//     Swal.fire({
//         icon: 'error',
//         text: 'The password you entered is incorrect',
//       }) 
//       return false;
// }
}

function forgetpassreset() {
    var forgotemail=document.getElementById("forgetrestemail").value;
    console.log(forgotemail);
    var mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    // var useremail=document.getElementById("").innerHTML;
// if (forgotemail!==useremail) {
//     Swal.fire({
//         icon: 'error',
//         text: 'There is no account registered against this email. Kindly provide registerd e-mail or Signup',
//       }) 
//       document.getElementById("forgetrestemail").value="";
//       return false;
// }
    if (forgotemail.match(mailformat)) {
        
        return true;}
    else{
        Swal.fire({
            icon: 'error',
            text: 'Please enter a valid email address!',
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
//       }) 
//       return false;  
// } 
// if (signupemail===useremail){
//     Swal.fire({
//         icon: 'error',
//         title:'Sorry',
//         text: 'An account already exixst with this email address',
//       }) 
//       return false;  
// }
if(signuppass.length<minlength||signuppassagain.length<minlength){
    Swal.fire({
        icon: 'error',
        text: 'Password length should not be less than 8 charracter',
      })  
      return false;
} 
if(signuppass!==signuppassagain){
    Swal.fire({
        icon: 'error',
        text: 'Your new passwords does not match!',
      }) 
      return false;
}
}