async function userAuth() {
        const directory = `${location.origin}/public`
        //          FOR FIREBASE
        // const directory = `${location.origin}/`

        console.log(directory)
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
                    // console.log(userRole)
                    console.log(location.pathname)
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
            location.pathname.replace=`/${userRole}/index.jt`
      }
    )
    .catch(err=>{
        location.pathname.replace(`/`)
    })
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