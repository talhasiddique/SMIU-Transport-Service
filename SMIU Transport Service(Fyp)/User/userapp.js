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
    //       })
    // return false  
    // }
    if(newpass!==confnewpass){
        Swal.fire({
            icon: 'error',
            text: 'Your new passwords does not match!',
          }) 
          return false;
    }
    if(newpass.length<minlength||confnewpass.length<minlength){
        Swal.fire({
            icon: 'error',
            text: 'Password length should not be less than 8 charracter',
          })  
          return false;
    }

    if(newpass===confnewpass){
        Swal.fire({
            icon: 'success',
            text: 'Password has been changed!',
          }) 
    }
    document.getElementById("useroldpass").value="";
    document.getElementById("usernewpass").value="";
    document.getElementById("userconfnewpass").value="";
    }
