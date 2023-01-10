const config = {
  apiKey: 'AIzaSyCIxi2eGjb3L3RYtbPlsxagGBHbyULCUAI',
  authDomain: 'filmoteka-project-c2666.firebaseapp.com',
  projectId: 'filmoteka-project-c2666',
  storageBucket: 'filmoteka-project-c2666.appspot.com',
  messagingSenderId: '181284316908',
  appId: '1:181284316908:web:bb0a127163b1f7754c67c9',
  measurementId: 'G-1RSE958RMY',
};

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error(
      'No Firebase configuration object provided.' +
        '\n' +
        "Add your web app's configuration object to firebase-config.js"
    );
  } else {
    return config;
  }
}
