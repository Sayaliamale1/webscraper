# Web Scraper with Google OAuth

## Features
- Google Login/Logout (OAuth 2.0)
- Live scraping from Hacker News & Books
- Displays data in a card layout (responsive)
- Clears data after logout

## Folder Structure
```
/client1         # React frontend
/server         # Express backend 
/scraper        # Python scraping script
```

##  How to Run

### 1. Install all dependencies
```bash
cd server
npm install
cd ../client1
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running locally.

### 3. Start Backend
```bash
cd server
node index.js
```

### 4. Start Frontend
```bash
cd ../client1
npm start
```

### 5. Update Google OAuth
Edit `client1/src/index.js`:
```js
<GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
```


