package main

import (
	"database/sql"
	"log"
	"net/http"

	"forum/server/GlobVar"
	"forum/server/Handlers"
	middleware "forum/server/Middleware"
	"forum/server/Migrations"

	_ "modernc.org/sqlite"
)

func init() {
	var err error
	GlobVar.DB, err = sql.Open("sqlite", "./server/Database/database.db")
	if err != nil {
		log.Fatal(err)
	}
	Migrations.Migrate()
}
// Upload

func main() {
	defer GlobVar.DB.Close()

	// Public routes
	http.HandleFunc("/static/" , Handlers.HandleStatic)// needs error page
	http.HandleFunc("/", middleware.RateLimiter(Handlers.HandleIndex))
	http.HandleFunc("/post/", middleware.RateLimiter(Handlers.HandlePostPage))
	http.HandleFunc("/Sign_In", middleware.RateLimiter(Handlers.HandleSignIn))
	http.HandleFunc("/Sign_Up", middleware.RateLimiter(Handlers.HandleSignUp))
	http.HandleFunc("/api/auth/status", Handlers.HandleAuthStatus)
	http.HandleFunc("/api/checkEmail", Handlers.HandleIdentifierDisponibility)
	http.HandleFunc("/api/isValidAuth", Handlers.HandleIsValidCredentials)

	// For SSL Cerificate verification
	// http.Handle("/.well-known/", http.StripPrefix("/.well-known", http.FileServer(http.Dir("./.well-known"))))

	

	// Protected routes
	http.HandleFunc("/Comment", middleware.RateLimiter(middleware.ValidateSession(Handlers.HandleComment)))
	http.HandleFunc("/IsLike", middleware.RateLimiter(middleware.ValidateSession(Handlers.HandleLikeDislike)))
	http.HandleFunc("/Log_Out", middleware.RateLimiter(middleware.ValidateSession(Handlers.HandleLogOut)))
	http.HandleFunc("/Profile_Account", middleware.RateLimiter(middleware.ValidateSession(Handlers.HandleProfileAccount)))
	http.HandleFunc("/Update_Profile", middleware.RateLimiter(middleware.ValidateSession(Handlers.HandleProfileUpdate)))
	http.HandleFunc("/New_Post", middleware.RateLimiter(middleware.ValidateSession(Handlers.HandleNewPost)))

	log.Println("server start: http://localhost:8080/")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Printf("There was an error serving the port: %v", err)
		// log.Printf("server not listener: %v", err)
	}
}