# Dashboard de Vagas – React + TypeScript + Vite

## Overview
A web application that provides a real‑time job search interface for the Gupy platform. The dashboard fetches job listings directly from the Gupy API, allows filtering by area, state and city, and tracks which listings the user has already viewed using a lightweight SQLite store on the backend.

## Key Features
- Real‑time search using the `/api/buscar` endpoint.
- Dynamic filtering by area, level, state, city and view status.
- Optimistic UI updates for marking/unmarking jobs as viewed.
- Loading and error handling with retry capability.
- Dark theme with cyan/purple palette.
- Responsive layout for desktop and mobile devices.
- Charts displaying distribution of jobs by area, level and state.

## Technology Stack
| Layer | Technology |
|-------|------------|
| Front‑end | React 18, TypeScript, Vite |
| Styling | CSS modules, custom dark theme |
| Charts | Chart.js (via react‑chartjs‑2) |
| Backend | Flask (Python) exposing REST endpoints |
| Data store | SQLite (stores viewed job IDs) |
| Linting | ESLint, Prettier, Oxlint |

## Prerequisites
- Node.js (v20 or later)
- npm (v9 or later) or yarn
- Python 3.12 (for the Flask API)
- Git

## Installation
### Front‑end
```bash
git clone https://github.com/brunofaomoura-max/dashboard-vagas-react.git
cd dashboard-vagas-react
npm ci   # installs exact dependencies
```
### Backend (API)
```bash
cd ../app-buscador-vagas   # project root containing the Flask server
python -m venv .venv
# Activate the virtual environment
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# Linux/macOS
source .venv/bin/activate
pip install -r requirements.txt
```

## Running the Application
1. Start the Flask API (runs on http://127.0.0.1:5000):
   ```bash
   python api.py
   ```
2. In a separate terminal, start the development server for the front‑end:
   ```bash
   npm run dev
   ```
   The UI will be available at http://localhost:5173.
3. For production, build the static assets and serve them through Flask:
   ```bash
   npm run build
   # the build output is placed in ./dist
   # restart the Flask API if it was already running
   python api.py
   ```

## Usage
- Select one or more job areas (e.g., Development, Internship) and a state abbreviation (e.g., `PR`).
- Optionally, provide a city name.
- Click **Buscar na Gupy (ao vivo)** to retrieve the latest listings.
- Use the eye icon to toggle the "viewed" status; the UI updates immediately.
- Switch between the **Todas**, **Não vistas**, and **Vistas** tabs to filter listings.
- Charts update automatically to reflect the current filtered set.

## Common Issues
| Issue | Cause | Resolution |
|-------|-------|------------|
| Backend not reachable | Flask server not running or using a different port | Ensure `python api.py` is running on port 5000 and that no firewall blocks the connection |
| Invalid query parameters | Missing or malformed `areas` or `estado` values | Use numeric area IDs from `/api/areas` and a two‑letter state code |
| SQLite write error | Permission issue on `vagas.db` | Verify the file is writable by the current user |

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Implement changes and run linters: `npm run lint`.
4. Commit with a clear message following the conventional commits format.
5. Open a pull request describing the changes and their rationale.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
