package Migrations

import (
	"forum/server/GlobVar"
	"log"
	"os"
)

func Migrate() {
	// Get the file path from an environment variable (fallback to default path)
	filePath := os.Getenv("MODULES_SQL_PATH")
	if filePath == "" {
		filePath = "./Database/modules.sql" // Default path if environment variable is not set
	}

	query, err := os.ReadFile(filePath)
	if err != nil {
		log.Fatal(err)
	}

	_, err = GlobVar.DB.Exec(string(query))
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Database migrated successfully!")
}
