const axios = require('axios').default;

 async function getimages() {
    try {
      const response = await axios.get('https://api.unsplash.com/photos/random',{
        params:{
            client_id:"OL1x8N07y77flhztN-wPcmvKhw0VZSJaiW6vpeRV6ms",
            collections:"483251"
        }
      });
      console.log(response.data.urls.regular);
    } catch (error) {
      console.error(error);
    }
  }

  getimages();

// const data = getimages();
// console.log(data.urls); 
// axios.get('https://api.unsplash.com/photos/?client_id=OL1x8N07y77flhztN-wPcmvKhw0VZSJaiW6vpeRV6ms')
//   .then(function (response) {
//       console.log(response);
//     })
//     .catch(function (error) {
//         console.log(error);
//     })
//     .then(function () {
//         // always executed
//     });  
    
// // console.log(getImages());

// axios.get('https://api.unsplash.com/photos/', {
//     params:{
//         client_id:"OL1x8N07y77flhztN-wPcmvKhw0VZSJaiW6vpeRV6ms",
//         collections:"483251"
//     }
//   })
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   })
//   .then(function () {
//     // always executed
//   });