# BMW Electric Car DataGrid

A production-ready full-stack DataGrid application built with **React**, **AG Grid**, **Express.js**, and **MySQL** for managing 103 electric car records.

## Quick Start

### Prerequisites
- Node.js v16+ and npm v8+
- MySQL Server v8+

### Installation
```bash
# Clone and install
git clone https://github.com/sanathkumar06/BMW_internship_datagrid.git
cd BMW_internship_datagrid

# Frontend
cd frontend && npm install && cd ..

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

**frontend/.env:**
```
REACT_APP_API_URL=http://localhost:3001/api
```

## Running the App

**Terminal 1 - Backend:**
```bash
cd backend
npm run init-db
npm run dev
# http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
# http://localhost:3000
```

## Features

### DataGrid
- Generic component for N-column data
- Client-side pagination (all 103 records loaded once)
- Page size selector: 10, 20, 50, 100 rows
- View/Delete actions for each row

### Search & Filtering
- Backend search by Brand, Model, Price
- 9 filter operators: contains, equals, startsWith, endsWith, isEmpty, >, <, >=, <=
- Multi-filter support with AND logic
- Real-time results

### Detail Page
- 📄 Beautiful car information display
- 📄 Header with price and segment badge
- 📄 Performance & Specifications sections
- 📄 Back navigation to DataGrid

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/cars/all` | Get all 103 cars |
| GET | `/api/cars/search?query=Tesla` | Search cars |
| POST | `/api/cars/filter` | Advanced filtering |
| DELETE | `/api/cars/:id` | Delete car |

**Filter example:**
```bash
POST /api/cars/filter
{
  "filters": [
    { "field": "Brand", "operator": "equals", "value": "Tesla" },
    { "field": "PriceEuro", "operator": "greaterThan", "value": 50000 }
  ]
}
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, AG Grid, Material-UI |
| Backend | Express.js, TypeScript |
| Database | MySQL |
| State | React Hooks |
| Styling | MUI sx prop, Theme system |

## Usage

1. **Load Grid** - All 103 cars display with key columns
2. **Search** - Type brand/model name, results filter in real-time
3. **Filter** - Click "Advanced Filters", add multiple criteria
4. **View** - Click "View" button to see full car details
5. **Delete** - Click "Delete" to remove car from database
6. **Paginate** - Navigate pages or change row count (10/20/50/100)

## Key Decisions

- **Client-side pagination** - All data loaded once for instant navigation
- **6 key columns in grid** - Only essentials shown; full details on detail page
- **Backend filtering** - SQL queries for powerful filtering capabilities
- **MUI theme system** - Centralized color management
- **TypeScript everywhere** - Type safety across frontend and backend

## Deployment

**Build:**
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
```
