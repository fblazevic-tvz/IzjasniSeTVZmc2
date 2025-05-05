# IzjasniSeTVZmc2

## 🚀 Technology Stack

*   **Frontend:**
    *   React (using plain JavaScript)
    *   React Router (v6+) for navigation
    *   Axios for API communication
    *   Custom CSS (no external UI libraries like MUI used)
*   **Backend:**
    *   .NET 8 - ASP.NET Core Web API
    *   Entity Framework Core 8 (or your version) - ORM
    *   SQL Server (or your chosen database)
    *   JWT Bearer Authentication
    *   PasswordHasher (from Microsoft.AspNetCore.Identity)
*   **Database:**
    *   Microsoft SQL Server

## ⚙️ Getting Started

### Prerequisites

*   .NET SDK (Version compatible with the backend project)
*   Node.js and npm (or yarn)
*   SQL Server instance (local, Docker, or cloud)
*   A code editor (like VS Code)
*   Git

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd <your-repo-name>/<backend-folder-name> # e.g., cd IzjasniSe/IzjasniSe.Api
    ```
2.  **Configure `appsettings.json` (and `appsettings.Development.json`):**
    *   Update the `ConnectionStrings` section with your SQL Server details.
    *   Update the `AppSettings` section:
        *   Set a strong, unique secret for `Token`.
        *   Configure `Issuer` and `Audience` appropriately for your environment.
3.  **Apply Database Migrations:**
    ```bash
    dotnet ef database update
    ```
    *(This will create the database and schema if they don't exist)*
4.  **(Optional) Seed Database:** If running for the first time after migrations, the application should automatically seed data on startup based on the `SeedData.cs` configuration.
5.  **Run the Backend:**
    ```bash
    dotnet run
    ```
    *(Note the port the backend is running on, e.g., `https://localhost:7003`)*

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../<frontend-folder-name> # e.g., cd ../my-react-app
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```
3.  **Configure Environment Variables:**
    *   Create a `.env` file in the root of the frontend project (`my-react-app/.env`).
    *   Add the backend API URL:
        ```env
        REACT_APP_API_BASE_URL=https://localhost:7003/api # Replace with your actual backend URL
        ```
4.  **Run the Frontend:**
    ```bash
    npm start
    # or
    # yarn start
    ```
    *(This usually opens the app in your browser at `http://localhost:3000`)*

## 🔧 Running the Application

1.  Ensure your SQL Server instance is running.
2.  Start the backend application (`dotnet run`).
3.  Start the frontend application (`npm start`).
4.  Access the application in your browser (usually `http://localhost:3000`).


