#Aideea

=>A creative space for storing, organizing and visualizing ideas.

#What is Aideea?

Aideea is a website that creates a space to store and organize your ideas, interests and thoughts for different hobbies. Instead of keeping ideas in random notes, Aideea groups ideas according to hobbies and creates a separate space for each of your thoughts/ideas.

#Why did i build it?

I always had a problem with storing my random thoughts and idea on different hobbies. I would either forget about it or write it in my notes app which would eventually go unseen and get lost in other notes too.

So I thought why not build a website that is only used to store my thoughts, ideas and plans and each hobby or interested topic would get a separate place to organize and store ideas.

#Features of Aideea

- has secure firebase authentication
- Home page gives the bigger picture of all hobbies listed with preview of its own ideas
- consists pin idea feature
- constellation view gives a visual view of your ideas twinkling. The more the ideas, the more the stars. The more the hobbies, the more the constellations
- Bubble view and List view are two types of organized representation of your hobbies to read, edit, delete and save ideas.


# Technology used
- React
- Vite
- Firebase Authentication
- Firebase Firestore
- Matter.js
- React Router
- CSS


#Playable URL
https://aideea.netlify.app/

#Installation

Required : Node.js (includes npm)

- clone this repository 
- install dependencies: npm install
- start development server: npm run dev
- open the url (given in terminal) in browser

#Firebase Setup

- Create a Firebase project.

- Enable:
1) Authentication (Email/Password)
2) Firestore Database

=>[not necessary but if you want to] you will need to create .env file and add the values given below.
VITE_FIREBASE_API_KEY=your_api_key 
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id 
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
[make sure .env is included in .gitignore]


#Website Previews

1)SignUP/Login page

<img width="1366" height="768" alt="Screenshot (3078)" src="https://github.com/user-attachments/assets/6dac72a8-0f90-499e-99f0-f4b9e00fd1c5" />
<img width="1366" height="768" alt="Screenshot (3079)" src="https://github.com/user-attachments/assets/aea1c4a5-0392-4a1a-a50d-9eb33d033459" />

2)Home page

<img width="1366" height="768" alt="Screenshot (3080)" src="https://github.com/user-attachments/assets/9346377e-a185-41f8-b281-26052583d34d" />

3)User Profile

<img width="1366" height="768" alt="Screenshot (3081)" src="https://github.com/user-attachments/assets/2c070f0a-ca2d-4fb5-8387-9195a7b442a4" />

4) Constellation view

<img width="1366" height="768" alt="Screenshot (3082)" src="https://github.com/user-attachments/assets/4a9eb177-b5f8-41a2-a0b9-9721bb9c5b21" />

   
5) Ideacards

<img width="1366" height="768" alt="Screenshot (3084)" src="https://github.com/user-attachments/assets/2015d2b3-07ed-4eaf-b3c2-3f776b3c4785" />
   
6) List view

<img width="1366" height="768" alt="Screenshot (3085)" src="https://github.com/user-attachments/assets/f939df8d-e18c-4edc-8c1e-7b1248a7739d" />
