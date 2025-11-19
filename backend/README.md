
### Prerequisites
- Node.js v16+ and npm v8+
- MySQL Server v8+

### Installation
```bash
# Backend
cd backend && npm install && cd ..
```

### Database Setup
```bash
mysql -u root -p
npm run init-db
```

### Configuration
**backend/.env:**
```
PORT=3001
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bmw_cars
CORS_ORIGIN=http://localhost:3000
```



## Running the App

**Terminal 1 - Backend:**
```bash
cd backend
npm run init-db
npm run dev
# http://localhost:3001
```

**Build:**
```bash

# Backend
cd backend && npm run build
```
