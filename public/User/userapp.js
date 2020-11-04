function subscribe(e) {
    var stsamount0= document.getElementById("stscrdtamnt").innerHTML;
    var stsamount=parseInt(stsamount0)
    if (stsamount >=10000) {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            showCancelButton: true,
            confirmButtonText: `Yes`,
            cancelButtonColor:'#971414',
            confirmButtonColor:'#ec7916',
            customClass: 'swal-wide',
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire('You have subscribed this Bus', '', 'success')
            } 
          })
    }

   else{
        Swal.fire({
            icon: 'error',
            title: 'Insufficient Credit',
            text: 'Sorry, you have insufficent credit,please recharge ',
            customClass: 'swal-wide',
          })  
          return false;
    }

    }
function userpgpassSave() {
    var oldpass=document.getElementById("useroldpass").value;
    var newpass=document.getElementById("usernewpass").value;
    var confnewpass=document.getElementById("userconfnewpass").value;
    // var userpass=document.getElementById("").value;
    var minlength=8;
        // if (oldpass!==userpass){
    //     Swal.fire({
    //         icon: 'error',
    //         text: 'You have entered incorrect old password! ',
    //         customClass: 'swal-wide',
    //       })
    // return false  
    // }
    if(newpass===""||confnewpass===""||oldpass===""){
      Swal.fire({
          icon: 'warning',
          text: 'Fields cannnot be empty, Please fill all the fields',
          customClass: 'swal-wide',
        })  
        return false;
  }
    if(newpass.length<minlength||confnewpass.length<minlength){
      Swal.fire({
          icon: 'error',
          text: 'Password length should not be less than 8 charracter',
          customClass: 'swal-wide',
        })  
        return false;
  }
    if(newpass.length<minlength||confnewpass.length<minlength){
      Swal.fire({
          icon: 'error',
          text: 'Password length should not be less than 8 charracter',
          customClass: 'swal-wide',
        })  
        return false;
  }
    if(newpass!==confnewpass){
        Swal.fire({
            icon: 'error',
            text: 'Your new passwords does not match!',
            customClass: 'swal-wide',
          }) 
          return false;
    }

    if(newpass===confnewpass){
        Swal.fire({
            icon: 'success',
            text: 'Password has been changed!',
            customClass: 'swal-wide',
          }) 
    }
    document.getElementById("useroldpass").value="";
    document.getElementById("usernewpass").value="";
    document.getElementById("userconfnewpass").value="";
    }
