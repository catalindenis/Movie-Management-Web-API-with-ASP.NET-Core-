# Movie List Management API
<img width="232" height="367" alt="image" src="https://github.com/user-attachments/assets/4ecfb073-0d6b-452f-aead-72e30e62a0dd" />
<img width="201" height="234" alt="image" src="https://github.com/user-attachments/assets/dfdb61bd-c00d-42b1-8a63-597467f2b4fe" />

A complete **REST API** backend developed in **C#** and **ASP.NET Core Web API**, focused on managing users and personalized movie list.

## 🛠️ Technologies and Tools Used
* **Programming Language:** C# (.NET Core)
* **Backend Framework:** ASP.NET Core Web API
* **Data Access (ORM):** Entity Framework Core (Code-First approach)
* **Database:** MySQL / SQL Server
* **External API Integration:** OMDb API (Open Movie Database)
* **Endpoint Testing:** Postman / Swagger UI

##  Main Features
* **Clean RESTful Architecture:** Layered Structuring (Controllers, Services, Repositories) with intuitive endpoints for complete CRUD operations.
* **External API Integration:** Asynchronously consume the external OMDb API to automatically retrieve movie details (year, director, poster, rating) based on the title entered by the user.
* **Database Management with EF Core:** Use automatic migrations to generate relational schemas and write performant queries via LINQ.

##  How to run the project locally
1. Clone the repository.
2. Configure the database connection string in `appsettings.json`.
3. Run the `dotnet ef database update` command in the console to apply the migrations.
4. Open the project in Visual Studio and press **Run** (it will automatically open the Swagger interface for testing the routes).
