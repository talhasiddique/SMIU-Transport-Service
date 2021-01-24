// function authUser() {
//     let userKey, userData;
//     firebase.auth().onAuthStateChanged(user=>{
//         userKey = user.uid;
//         if(user){
//             firebase.database().ref(`/registered-users/${userKey}`).once('value')
//             .then(res=>{
//                 userData = {...res.val()}
//                 if(userData.role === 'admin'){
//                     console.log(userData.role)
//                 }
//                 // else if(userData.role !== 'admin'){
//                 //     // windown.location.assign('../index.html')
//                 // }
//             })
//             .catch(error=>console.log(error))
//         } else {
//             window.location.assign('../index.html')
//         }
//     })  
// }